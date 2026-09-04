import { Link } from "react-router-dom";
import { Pencil, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleDeleteDialog } from "@/components/ui/article-delete-dialog";
import { ArticlePublishDialog } from "@/components/ui/article-publish-dialog";

type AccountArticleProps = {
  id: string;
  name: string;
  shortDesc: string;
  slug: string;
  draft: boolean;
  onPublish: () => Promise<string | null>;
  onDelete: () => Promise<string | null>;
};

function ArticleDetails({
  name,
  shortDesc,
}: Pick<AccountArticleProps, "name" | "shortDesc">) {
  return (
    <>
      <div className="pb-1.25 font-bold">
        <span className="font-bold text-[rgb(180,180,180)]">Titlu: </span>
        {name || "Fara titlu"}
      </div>
      <hr className="mb-2 border border-[rgb(180,180,180)]" />
      <div className="article-desc">
        <span className="font-bold text-[rgb(180,180,180)]">Descriere: </span>
        {shortDesc || "Fara descriere"}
      </div>
    </>
  );
}

export function AccountArticle({
  id,
  name,
  shortDesc,
  slug,
  draft,
  onPublish,
  onDelete,
}: AccountArticleProps) {
  if (!draft) {
    return (
      <Link to={`/articles/${slug}`}>
        <div className="mt-5 cursor-pointer rounded-[13px] border bg-[#1a331e] p-2.5 hover:border-[#3c9b64]">
          <ArticleDetails name={name} shortDesc={shortDesc} />
        </div>
      </Link>
    );
  }

  return (
    <div className="mt-5 rounded-[13px] border border-amber-500/60 bg-[#1a331e] p-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge variant="outline" className="border-amber-500 text-amber-500">
          Draft
        </Badge>
        <span className="text-xs text-muted-foreground">Nu este public</span>
      </div>
      <ArticleDetails name={name} shortDesc={shortDesc} />
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/editor/${id}`}>
            <Pencil className="h-4 w-4" />
            Editeaza
          </Link>
        </Button>
        <ArticlePublishDialog
          onConfirm={onPublish}
          trigger={
            <Button size="sm">
              <Send className="h-4 w-4" />
              Publica
            </Button>
          }
        />
        <ArticleDeleteDialog
          onConfirm={onDelete}
          trigger={
            <Button type="button" variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Sterge
            </Button>
          }
        />
      </div>
    </div>
  );
}