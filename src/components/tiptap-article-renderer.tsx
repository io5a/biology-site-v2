import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { ResizableImage } from "@/components/tiptap-node/image-node/resizable-image-node";
import { getArticleBody } from "@/src/lib/article-content";
import type { ArticleDocument } from "@/src/lib/article-content";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

type TiptapArticleRendererProps = {
  document: ArticleDocument;
};

export function TiptapArticleRenderer({
  document,
}: TiptapArticleRendererProps) {
  const body = getArticleBody(document);
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      ResizableImage,
      Typography,
      Superscript,
      Subscript,
      HorizontalRule,
    ],
    content: {
      type: "doc",
      content: body.content?.length ? body.content : [{ type: "paragraph" }],
    },
  });

  return (
    <div className="prose prose-invert prose-green max-w-none">
      <EditorContent editor={editor} className="article-tiptap-content" />
    </div>
  );
}