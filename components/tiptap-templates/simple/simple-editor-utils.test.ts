import { describe, expect, it } from "vitest";
import { getPastedImageFiles } from "./simple-editor-utils";

function createClipboardEvent(
  items: Array<{
    type: string;
    getAsFile: () => File | null;
  }>,
  files: File[] = [],
): ClipboardEvent {
  return {
    clipboardData: {
      items,
      files,
    },
  } as unknown as ClipboardEvent;
}

describe("getPastedImageFiles", () => {
  it("returns image files from clipboard items and files without duplicates", () => {
    const pastedImage = new File(["image"], "cell.png", { type: "image/png" });
    const fileListImage = new File(["image"], "leaf.jpg", { type: "image/jpeg" });
    const textFile = new File(["text"], "notes.txt", { type: "text/plain" });
    const event = createClipboardEvent(
      [
        { type: "image/png", getAsFile: () => pastedImage },
        { type: "text/plain", getAsFile: () => textFile },
      ],
      [pastedImage, fileListImage, textFile],
    );

    expect(getPastedImageFiles(event)).toEqual([pastedImage, fileListImage]);
  });

  it("ignores text-only clipboard data and missing clipboard data", () => {
    const textFile = new File(["text"], "notes.txt", { type: "text/plain" });
    const textEvent = createClipboardEvent(
      [{ type: "text/plain", getAsFile: () => textFile }],
      [textFile],
    );

    expect(getPastedImageFiles(textEvent)).toEqual([]);
    expect(getPastedImageFiles({ clipboardData: null } as ClipboardEvent)).toEqual(
      [],
    );
  });
});