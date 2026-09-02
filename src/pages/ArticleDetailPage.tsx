import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/supabase-client'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { Skeleton } from '@/src/components/ui/skeleton'

function ArticleDetailSkeleton() {
  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="mt-3 h-5 w-36" />
        </header>
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
      </article>
    </main>
  )
}

export default function ArticleDetailPage() {
  const { slug } = useParams()

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle()

      if (error) throw error

      return data
    },
  })

  if (isLoading) {
    return <ArticleDetailSkeleton />
  }

  if (!article) {
    return (
      <main className="min-h-screen px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Articolul nu a fost găsit.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{article.category}</p>
          <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
          <p className="mt-3 text-muted-foreground">{new Date(article.created_at).toDateString()}</p>
        </header>
        <MarkdownRenderer content={article.content ?? ''} />
      </article>
    </main>
  )
}
