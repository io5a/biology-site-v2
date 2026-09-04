import { describe, expect, it } from "vitest";
import type { JSONContent } from "@tiptap/core";
import {
  createArticleSlug,
  createEmptyArticleDocument,
  extractArticleMetadata,
  getArticleBody,
  parseArticleDocument,
  serializeArticleContent,
  validateArticleForPublishing,
} from "@/src/lib/article-content";

function createArticleDocument(): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "articleHeader",
        content: [
          {
            type: "articleTitle",
            content: [{ type: "text", text: "Celula" }],
          },
          {
            type: "articleExcerpt",
            content: [{ type: "text", text: "O introducere" }],
          },
          {
            type: "articleCategory",
            attrs: { value: "Stiinta" },
          },
        ],
      },
      {
        type: "articleBody",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Continutul articolului." }],
          },
        ],
      },
    ],
  };
}

describe("article content workflow helpers", () => {
  it("creates the editor document with the default category", () => {
    const document = createEmptyArticleDocument();

    expect(extractArticleMetadata(document)).toEqual({
      title: "",
      excerpt: "",
      category: "Informational",
    });
    expect(getArticleBody(document).content).toHaveLength(1);
  });

  it("extracts metadata and round-trips serialized Tiptap JSON", () => {
    const document = createArticleDocument();
    const serialized = serializeArticleContent(document);
    const parsed = parseArticleDocument(serialized);

    expect(parsed).toEqual(document);
    expect(extractArticleMetadata(parsed ?? {})).toEqual({
      title: "Celula",
      excerpt: "O introducere",
      category: "Stiinta",
    });
  });

  it("rejects legacy Markdown as a Tiptap document", () => {
    expect(parseArticleDocument("# Articol vechi")).toBeNull();
    expect(parseArticleDocument(null)).toBeNull();
  });

  it("requires metadata and body content before publishing", () => {
    const emptyDocument = createEmptyArticleDocument();
    const validDocument = createArticleDocument();

    expect(validateArticleForPublishing(emptyDocument)).toBe(
      "Adauga un titlu articolului.",
    );
    expect(validateArticleForPublishing(validDocument)).toBeNull();
  });

  it("creates readable, collision-resistant slugs", () => {
    expect(createArticleSlug("Biologie: celula si ADN-ul", "12345678-abcd")).toBe(
      "biologie-celula-si-adn-ul-12345678",
    );
    expect(createArticleSlug("", "12345678-abcd")).toBe("articol-12345678");
  });
});