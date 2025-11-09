import { getAllArticles } from "@/lib/articles"
import { ArticlesList } from "@/components/articles-list"

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ArticlesList articles={articles} />
      </div>
    </main>
  )
}
