import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import type { Database } from "@/src/supabase.types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type AuthorRow = Database["public"]["Tables"]["users"]["Row"];
type ArticleQueryRow = ArticleRow & {
  author?: Pick<AuthorRow, "name"> | Pick<AuthorRow, "name">[] | null;
};

function parseDate(dateString: string): Date {
  const standardDate = new Date(dateString);
  if (!Number.isNaN(standardDate.getTime())) return standardDate;
  return new Date(NaN);
}

const fetchArticles = async () => {
  const { data, error } = await supabase
    .from("articles")
    .select(
      "id, slug, title, excerpt, category, content, created_at, draft, author_id, author:users(name)",
    )
    .or("draft.eq.false,draft.is.null")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((article: ArticleQueryRow) => {
      const authorRelation = Array.isArray(article.author)
        ? article.author[0]
        : article.author;

      return {
        slug: article.slug ?? "",
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        category: article.category ?? "",
        content: article.content ?? "",
        date: article.created_at
          ? new Date(article.created_at).toDateString()
          : "",
        readTime: "",
        authorId: article.author_id,
        authorName: authorRelation?.name ?? null,
      };
    });
};

export default function ArticlesPage() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    queryFn: fetchArticles,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "title-asc" | "title-desc"
  >("date-desc");

  const sortedAndFilteredArticles = useMemo(() => {
    let filtered = articles;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.category.toLowerCase().includes(lowerQuery),
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return parseDate(b.date).getTime() - parseDate(a.date).getTime();
        case "date-asc":
          return parseDate(a.date).getTime() - parseDate(b.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [articles, searchQuery, sortBy]);

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground">
            Toate articolele
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Navighează printre toate articolele (
            {sortedAndFilteredArticles.length} articole)
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Caută articole..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort"
                className="text-sm text-muted-foreground whitespace-nowrap"
              >
                Sortează:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "date-desc"
                      | "date-asc"
                      | "title-asc"
                      | "title-desc",
                  )
                }
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] dark:bg-input/30"
              >
                <option value="date-desc">Cel mai recent</option>
                <option value="date-asc">Cel mai vechi</option>
                <option value="title-asc">Alfabetic A-Z</option>
                <option value="title-desc">Alfabetic Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <ArticleListSkeleton />
        ) : sortedAndFilteredArticles.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              Nu s-au găsit articole care să corespundă căutării.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAndFilteredArticles.map((article) => (
              <Card
                key={article.slug}
                className="flex flex-col transition-all hover:border-primary/50"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      Autor: {article.authorName ?? "anonim"}
                    </span>
                  </div>
                  <CardTitle className="text-balance text-xl">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-pretty">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {article.date}
                    </span>
                    <Button asChild variant="ghost" size="sm" className="gap-1">
                      <Link to={`/articles/${article.slug}`}>
                        Citește mai mult
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="mb-2 flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-14" />
            </div>
            <Skeleton className="h-7 w-4/5" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="mt-auto">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}