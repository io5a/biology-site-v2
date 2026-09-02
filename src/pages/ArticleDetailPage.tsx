import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/supabase-client'
import { MarkdownRenderer } from '@/components/markdown-renderer'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    if (!slug) return

    const loadArticle = async () => {
      const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).maybeSingle()
      if (error) {
        console.error(error)
        return
      }

      setArticle(data)
    }

    void loadArticle()
  }, [slug])

  if (!article) {
    return <main className="min-h-screen px-4 py-16 text-center">Se încarcă articolul...</main>
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
