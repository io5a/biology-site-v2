import type { JSONContent } from "@tiptap/core";

export type ArticleMetadata = {
  title: string;
  excerpt: string;
  category: string;
};

export type ArticleDocument = JSONContent & {
  type: "doc";
};

export function createEmptyArticleDocument(): ArticleDocument {
  return {
    type: "doc",
    content: [
      {
        type: "articleHeader",
        content: [
          { type: "articleTitle" },
          { type: "articleExcerpt" },
          {
            type: "articleCategory",
            attrs: { value: "Informational" },
          },
        ],
      },
      {
        type: "articleBody",
        content: [{ type: "paragraph" }],
      },
    ],
  };
}

export function getNodeText(node: JSONContent | undefined): string {
  if (!node) return "";
  if (typeof node.text === "string") return node.text;
  return (node.content ?? []).map((child) => getNodeText(child)).join("");
}

function findChild(node: JSONContent, type: string): JSONContent | undefined {
  return node.content?.find((child) => child.type === type);
}

export function extractArticleMetadata(
  document: JSONContent,
): ArticleMetadata {
  const header = findChild(document, "articleHeader");
  const title = findChild(header ?? {}, "articleTitle");
  const excerpt = findChild(header ?? {}, "articleExcerpt");
  const category = findChild(header ?? {}, "articleCategory");

  return {
    title: getNodeText(title).trim(),
    excerpt: getNodeText(excerpt).trim(),
    category: String(category?.attrs?.value ?? "").trim(),
  };
}

export function getArticleBody(document: JSONContent): JSONContent {
  return (
    findChild(document, "articleBody") ?? {
      type: "articleBody",
      content: [],
    }
  );
}

export function serializeArticleContent(document: JSONContent): string {
  return JSON.stringify(document);
}

export function parseArticleDocument(content: string | null): ArticleDocument | null {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as JSONContent;
    if (parsed?.type !== "doc" || !Array.isArray(parsed.content)) return null;
    return parsed as ArticleDocument;
  } catch {
    return null;
  }
}

export function validateArticleForPublishing(
  document: JSONContent,
): string | null {
  const metadata = extractArticleMetadata(document);
  const body = getArticleBody(document);

  if (!metadata.title) return "Adauga un titlu articolului.";
  if (!metadata.excerpt) return "Adauga o descriere scurta articolului.";
  if (!metadata.category) return "Alege o categorie pentru articol.";
  if (!body.content?.length) return "Adauga continut articolului.";

  return null;
}

export function createArticleSlug(title: string, id: string): string {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedTitle || "articol"}-${id.slice(0, 8)}`;
}