"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"
import type { Article } from "@/lib/articles"

interface ArticlesListProps {
  articles: Article[]
}

export function ArticlesList({ articles }: ArticlesListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles

    const lowerQuery = searchQuery.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.category.toLowerCase().includes(lowerQuery),
    )
  }, [articles, searchQuery])

  return (
    <>
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Toate articolele</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Navighează printre toate articolele  ({filteredArticles.length} articole)
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Caută articole..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No articles found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
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
                    <Link href={`/articles/${article.slug}`}>
                      Read More
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
