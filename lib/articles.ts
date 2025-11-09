import fs from "fs"
import path from "path"
// @ts-ignore - gray-matter types may not be available
import matter from "gray-matter"

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  content: string
}

const articlesDirectory = path.join(process.cwd(), "content", "articles")

// Average reading speed: 200 words per minute
const WORDS_PER_MINUTE = 200

function calculateReadTime(content: string): string {
  // Remove markdown syntax and count words
  // Remove code blocks, links, images, headers, etc.
  const text = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Convert links to text
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // Remove images
    .replace(/[#*_~`]/g, "") // Remove markdown formatting
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim()

  // Count words (split by whitespace and filter empty strings)
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  const wordCount = words.length

  // Calculate minutes (minimum 1 minute)
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))

  return `${minutes} min read`
}

function getArticleSlugsFromFilesystem(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return []
  }

  const files = fs.readdirSync(articlesDirectory)
  return files
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.replace(/\.md$/, ""))
}

function getArticleBySlugFromFilesystem(slug: string): Article | null {
  try {
    const fullPath = path.join(articlesDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Validate required fields (readTime is now optional)
    if (!data.title || !data.excerpt || !data.category || !data.date) {
      console.warn(`Article ${slug} is missing required frontmatter fields`)
      return null
    }

    // Calculate read time if not provided
    const readTime = data.readTime || calculateReadTime(content.trim())

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      date: data.date,
      readTime,
      content: content.trim(),
    }
  } catch (error) {
    console.error(`Error reading article ${slug}:`, error)
    return null
  }
}

export function getArticleSlugs() {
  return getArticleSlugsFromFilesystem()
}

export function getArticleBySlug(slug: string): Article | null {
  return getArticleBySlugFromFilesystem(slug)
}

export function getAllArticles(): Article[] {
  const slugs = getArticleSlugsFromFilesystem()
  const articles = slugs
    .map((slug) => getArticleBySlugFromFilesystem(slug))
    .filter((article): article is Article => article !== null)

  // Sort by date (newest first)
  // Handle different date formats
  return articles.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    // If dates are invalid, put them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
    if (isNaN(dateA.getTime())) return 1
    if (isNaN(dateB.getTime())) return -1
    
    return dateB.getTime() - dateA.getTime()
  })
}

export function searchArticles(query: string): Article[] {
  const lowerQuery = query.toLowerCase()
  const articles = getAllArticles()

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery),
  )
}