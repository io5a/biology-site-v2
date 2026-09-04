import { getSchema } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { describe, expect, it } from "vitest";
import { ResizableImage } from "./resizable-image-node";

describe("ResizableImage", () => {
  it("preserves width and alignment in the Tiptap schema", () => {
    const schema = getSchema([Document, Text, ResizableImage]);
    const image = schema.nodeFromJSON({
      type: "image",
      attrs: {
        src: "https://example.com/image.jpg",
        alt: "Example",
        width: 420,
        align: "left",
      },
    });

    expect(image.attrs.width).toBe(420);
    expect(image.attrs.align).toBe("left");
  });

  it("uses safe defaults for legacy image nodes", () => {
    const schema = getSchema([Document, Text, ResizableImage]);
    const image = schema.nodeFromJSON({
      type: "image",
      attrs: {
        src: "https://example.com/image.jpg",
      },
    });

    expect(image.attrs.width).toBeNull();
    expect(image.attrs.align).toBe("center");
  });
});
