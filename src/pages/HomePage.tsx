import { Link } from 'react-router-dom'
import { ArrowRight, Bell, BookOpen, Dna } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/supabase-client'
import { useEffect, useState } from 'react'

const mapArticle = (article: any) => ({
  slug: article.slug ?? '',
  title: article.title ?? '',
  excerpt: article.excerpt ?? '',
  category: article.category ?? '',
  content: article.content ?? '',
  date: article.created_at ? new Date(article.created_at).toDateString() : '',
  readTime: '',
})

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [{ data: articleData }, { data: announcementData }] = await Promise.all([
        supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
      ])

      setArticles((articleData ?? []).map(mapArticle))
      setAnnouncements(announcementData ?? [])
    }

    void loadData()
  }, [])

  const featuredArticles = articles.slice(0, 3)
  const recentAnnouncements = announcements.slice(0, 3)

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-secondary/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <Badge variant="secondary" className="mb-4 gap-1">
              <Dna className="h-3 w-3" />
              Platformă de educație în biologie
            </Badge>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Bine ai venit la <span className="text-primary">BioART</span>
            </h1>
            <p className="mb-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Explorează lumea fascinantă a biologiei prin articole interesante, materiale de studiu complete și concursuri captivante.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/articles">
                  Citește articole
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
                <Link to="/learning">
                  <BookOpen className="h-4 w-4" />
                  Materiale de studiu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/30 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Anunțuri recente</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link to="/announcements">
                Vezi toate anunțurile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentAnnouncements.map((announcement) => (
              <Card key={announcement.slug} className="transition-colors hover:bg-card/80">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{announcement.type}</Badge>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold text-foreground">Articole recente</h2>
            <p className="text-muted-foreground">Cele mai recente articole despre biologie</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Card key={article.slug} className="flex flex-col transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge>{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <CardTitle className="text-balance text-xl">{article.title}</CardTitle>
                  <CardDescription className="text-pretty">{article.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{article.date}</span>
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
          <div className="mt-8 text-center">
            <Button asChild size="lg" variant="outline" className="gap-2 bg-transparent">
              <Link to="/articles">
                Vezi toate articolele
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
