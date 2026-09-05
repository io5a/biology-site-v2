import { getSchema } from "@tiptap/core";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorState, NodeSelection } from "@tiptap/pm/state";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ArticleExtensions } from "@/components/tiptap-templates/simple/article-schema";
import { ResizableImage } from "@/components/tiptap-node/image-node/resizable-image-node";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  upload: vi.fn(),
  getPublicUrl: vi.fn(),
}));

vi.mock("@/supabase-client", () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    storage: {
      from: () => ({
        upload: mocks.upload,
        getPublicUrl: mocks.getPublicUrl,
      }),
    },
  },
}));

import {
  focusNextNode,
  handleImageUpload,
  MAX_FILE_SIZE,
} from "@/lib/tiptap-utils";

describe("handleImageUpload", () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.upload.mockReset();
    mocks.getPublicUrl.mockReset();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.getPublicUrl.mockReturnValue({
      data: { publicUrl: "https://example.supabase.co/article-image.png" },
    });
  });

  it("uploads article images to the authenticated user's gallery path", async () => {
    const progress: number[] = [];
    const file = new File(["image"], "cell.png", { type: "image/png" });

    const url = await handleImageUpload(file, ({ progress: value }) => {
      progress.push(value);
    });

    expect(url).toBe("https://example.supabase.co/article-image.png");
    expect(progress).toEqual([10, 100]);
    expect(mocks.upload).toHaveBeenCalledWith(
      expect.stringMatching(/^articles\/user-123\/[0-9a-f-]+\.png$/),
      file,
      expect.objectContaining({
        cacheControl: "31536000",
        contentType: "image/png",
        upsert: false,
      }),
    );
  });

  it("rejects uploads without an authenticated user", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const file = new File(["image"], "cell.png", { type: "image/png" });

    await expect(handleImageUpload(file)).rejects.toThrow(
      "Trebuie sa fii autentificat pentru a incarca imagini",
    );
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("rejects oversized and non-image files before contacting Supabase", async () => {
    const oversizedFile = new File(
      [new Uint8Array(MAX_FILE_SIZE + 1)],
      "large.png",
      { type: "image/png" },
    );
    const textFile = new File(["text"], "notes.txt", { type: "text/plain" });

    await expect(handleImageUpload(oversizedFile)).rejects.toThrow(
      "File size exceeds maximum allowed (5MB)",
    );
    await expect(handleImageUpload(textFile)).rejects.toThrow(
      "Fisierul selectat nu este o imagine",
    );
    expect(mocks.getUser).not.toHaveBeenCalled();
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});

describe("focusNextNode", () => {
  it("keeps fallback paragraphs inside articleBody", () => {
    const schema = getSchema([
      ...ArticleExtensions,
      Paragraph,
      Text,
      ResizableImage,
    ]);
    const doc = schema.nodeFromJSON({
      type: "doc",
      content: [
        {
          type: "articleHeader",
          content: [
            { type: "articleTitle" },
            { type: "articleExcerpt" },
            { type: "articleCategory", attrs: { value: "Informational" } },
          ],
        },
        {
          type: "articleBody",
          content: [
            {
              type: "image",
              attrs: {
                src: "https://example.com/cell.png",
                alt: "cell.png",
              },
            },
          ],
        },
      ],
    });
    let imagePosition = -1;
    doc.descendants((node, position) => {
      if (node.type.name === "image") {
        imagePosition = position;
        return false;
      }
      return true;
    });
    if (imagePosition < 0) throw new Error("Image fixture was not created");

    let state = EditorState.create({
      schema,
      doc,
      selection: NodeSelection.create(doc, imagePosition),
    });
    const editor = {
      get state() {
        return state;
      },
      view: {
        dispatch(transaction: Parameters<typeof state.apply>[0]) {
          state = state.apply(transaction);
        },
      },
    } as unknown as Parameters<typeof focusNextNode>[0];

    expect(focusNextNode(editor)).toBe(true);
    expect(state.doc.childCount).toBe(2);
    expect(state.doc.child(1).type.name).toBe("articleBody");
    expect(state.doc.child(1).childCount).toBe(2);
    expect(state.doc.child(1).firstChild?.type.name).toBe("image");
    expect(state.doc.child(1).lastChild?.type.name).toBe("paragraph");
  });
});