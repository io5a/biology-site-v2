import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import { ArticleCategoryNodeView } from "./article-category-node-view";

const ArticleTitle = Node.create({
  name: "articleTitle",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "h1[data-article-title]" }];
  },

  renderHTML() {
    return ["h1", { "data-article-title": "" }, 0];
  },
});

const ArticleExcerpt = Node.create({
  name: "articleExcerpt",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "p[data-article-excerpt]" }];
  },

  renderHTML() {
    return ["p", { "data-article-excerpt": "" }, 0];
  },
});

const ArticleCategory = Node.create({
  name: "articleCategory",
  group: "block",
  atom: true,
  defining: true,

  addAttributes() {
    return {
      value: {
        default: "Informational",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-article-category]",
        getAttrs: (element) => ({
          value: (element as HTMLElement).getAttribute("data-value"),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { value, ...serializedAttributes } = HTMLAttributes;
    return [
      "div",
      {
        ...serializedAttributes,
        "data-article-category": "",
        "data-value": value,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ArticleCategoryNodeView);
  },
});

const ArticleHeader = Node.create({
  name: "articleHeader",
  group: "block",
  content: "articleTitle articleExcerpt articleCategory",
  defining: true,

  parseHTML() {
    return [{ tag: "header[data-article-header]" }];
  },

  renderHTML() {
    return ["header", { "data-article-header": "" }, 0];
  },
});

const ArticleBody = Node.create({
  name: "articleBody",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "main[data-article-body]" }];
  },

  renderHTML() {
    return ["main", { "data-article-body": "" }, 0];
  },
});

export const ArticleDocument = Document.extend({
  content: "articleHeader articleBody",
});

export const ArticleExtensions = [
  ArticleDocument,
  ArticleHeader,
  ArticleTitle,
  ArticleExcerpt,
  ArticleCategory,
  ArticleBody,
];