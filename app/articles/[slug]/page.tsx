import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles"
import { MarkdownRenderer } from "@/components/markdown-renderer"

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return slugs.map((slug) => ({
    slug: slug.replace(/\.md$/, ""),
  }))
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-8 gap-2">
          <Link href="/articles">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>
        </Button>

        <header className="mb-8 border-b border-border pb-8">
          <Badge className="mb-4">{article.category}</Badge>
          <h1 className="mb-4 text-balance text-4xl font-bold text-foreground sm:text-5xl">{article.title}</h1>
          <p className="mb-4 text-pretty text-xl text-muted-foreground">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {article.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </div>
          </div>
        </header>

        <div className="mb-12">
          <MarkdownRenderer content={article.content} />
        </div>

        <footer className="border-t border-border pt-8">
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/articles">
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
          </Button>
        </footer>
      </article>
    </main>
  )
}
