import { Link } from 'react-router-dom'
import { ArrowRight, Bell, BookOpen, Dna } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/src/components/ui/skeleton'
import { supabase } from '@/supabase-client'
import type { Database } from '@/src/supabase.types'

type ArticleRow = Database['public']['Tables']['articles']['Row']

const mapArticle = (article: ArticleRow) => ({
  slug: article.slug ?? '',
  title: article.title ?? '',
  excerpt: article.excerpt ?? '',
  category: article.category ?? '',
  content: article.content ?? '',
  date: article.created_at ? new Date(article.created_at).toDateString() : '',
  readTime: '',
})

const fetchFeaturedArticles = async () => {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw error

  return (data ?? []).map(mapArticle)
}

const fetchRecentAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw error

  return data ?? []
}

function AnnouncementSkeleton() {
  return (
    <Card className="transition-colors hover:bg-card/80">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-7 w-3/4" />
      </CardHeader>
    </Card>
  )
}

function ArticleSkeleton() {
  return (
    <Card className="flex flex-col">
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
  )
}

export default function HomePage() {
  const { data: articles = [], isLoading: areArticlesLoading } = useQuery({
    queryKey: ['home-articles'],
    queryFn: fetchFeaturedArticles,
  })

  const { data: announcements = [], isLoading: areAnnouncementsLoading } = useQuery({
    queryKey: ['home-announcements'],
    queryFn: fetchRecentAnnouncements,
  })

  const featuredArticles = articles.slice(0, 3)
  const recentAnnouncements = announcements.slice(0, 3)
  const isLoading = areArticlesLoading || areAnnouncementsLoading

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-linear-to-b from-background to-secondary/20 px-4 py-20 sm:px-6 lg:px-8">
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <AnnouncementSkeleton key={index} />)
              : recentAnnouncements.map((announcement) => (
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
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => <ArticleSkeleton key={index} />)
              : featuredArticles.map((article) => (
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
