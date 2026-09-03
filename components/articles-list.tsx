"use client"

import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search } from "lucide-react"
import type { Article } from "@/lib/articles"

interface ArticlesListProps {
  articles: Article[]
}

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc"

// Romanian month names mapping
const romanianMonths: { [key: string]: number } = {
  ianuarie: 0,
  februarie: 1,
  martie: 2,
  aprilie: 3,
  mai: 4,
  iunie: 5,
  iulie: 6,
  august: 7,
  septembrie: 8,
  octombrie: 9,
  noiembrie: 10,
  decembrie: 11,
}

// English month abbreviations mapping
const englishMonths: { [key: string]: number } = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

function parseDate(dateString: string): Date {
  // Try standard Date parsing first
  const standardDate = new Date(dateString)
  if (!isNaN(standardDate.getTime())) {
    return standardDate
  }

  // Handle formats like "9 Apr, 2025" or "9 Ianuarie, 2025"
  const cleaned = dateString.trim().replace(/,/g, "")
  const parts = cleaned.split(/\s+/)
  
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10)
    const monthStr = parts[1].toLowerCase()
    const year = parseInt(parts[2], 10)

    if (!isNaN(day) && !isNaN(year)) {
      // Check Romanian months
      if (romanianMonths[monthStr] !== undefined) {
        return new Date(year, romanianMonths[monthStr], day)
      }
      
      // Check English month abbreviations
      if (englishMonths[monthStr] !== undefined) {
        return new Date(year, englishMonths[monthStr], day)
      }
    }
  }

  // Fallback: return invalid date
  return new Date(NaN)
}

export function ArticlesList({ articles }: ArticlesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc") // Default: most recent

  const sortedAndFilteredArticles = useMemo(() => {
    // First, filter articles
    let filtered = articles
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.category.toLowerCase().includes(lowerQuery),
      )
    }

    // Then, sort articles
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          // Most recent first (default)
          const dateA = parseDate(a.date)
          const dateB = parseDate(b.date)
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
          if (isNaN(dateA.getTime())) return 1
          if (isNaN(dateB.getTime())) return -1
          return dateB.getTime() - dateA.getTime()
        
        case "date-asc":
          // Oldest first
          const dateA2 = parseDate(a.date)
          const dateB2 = parseDate(b.date)
          if (isNaN(dateA2.getTime()) && isNaN(dateB2.getTime())) return 0
          if (isNaN(dateA2.getTime())) return 1
          if (isNaN(dateB2.getTime())) return -1
          return dateA2.getTime() - dateB2.getTime()
        
        case "title-asc":
          // Alphabetical A-Z
          return a.title.localeCompare(b.title)
        
        case "title-desc":
          // Alphabetical Z-A
          return b.title.localeCompare(a.title)
        
        default:
          return 0
      }
    })

    return sorted
  }, [articles, searchQuery, sortBy])

  return (
    <>
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Toate articolele</h1>
        <p className="mb-6 text-lg text-muted-foreground">
          Navighează printre toate articolele ({sortedAndFilteredArticles.length} articole)
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
            <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
              Sortează:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30"
            >
              <option value="date-desc">Cel mai recent</option>
              <option value="date-asc">Cel mai vechi</option>
              <option value="title-asc">Alfabetic A-Z</option>
              <option value="title-desc">Alfabetic Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {sortedAndFilteredArticles.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">Nu s-au găsit articole care să corespundă căutării.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredArticles.map((article) => (
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
      )}
    </>
  )
}
