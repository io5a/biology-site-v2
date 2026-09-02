import { getAllArticles } from "@/lib/articles"
import { ArticlesList } from "@/components/articles-list"
import type { Article } from "@/lib/articles"
import { supabase } from "@/supabase-client";
import { parseDate } from "@/lib/articles";

export default async function ArticlesPage() {
  const { data, error } = await supabase.from('articles').select('*');
  console.log(data,error)

  const articles: Article[] = (data ?? []).map((article) => {
      const toConvert=article.created_at
      const date= new Date(Date.parse(toConvert))
      return {
        slug: article.slug ?? "",
        title: article.title ?? "",
        excerpt: article.excerpt ?? "",
        category: article.category ?? "",
        content: article.content ?? "",
        date: date.toDateString(),
        readTime: "",
      }
  })
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ArticlesList articles={articles} />
      </div>
    </main>
  )
}
