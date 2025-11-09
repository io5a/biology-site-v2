import fs from "fs"
import path from "path"
// @ts-ignore - gray-matter types may not be available
import matter from "gray-matter"

export interface Competition {
  slug: string
  title: string
  year: string
  date: string
  status: "Upcoming" | "Past"
  description: string
  pastQuestions?: string
  answerKey?: string
  hasPastQuestions: boolean
  hasAnswerKey: boolean
  content: string
}

const competitionsDirectory = path.join(process.cwd(), "content", "competitions")
const publicDirectory = path.join(process.cwd(), "public")

function checkPdfExists(pdfPath: string | undefined): boolean {
  if (!pdfPath) return false
  
  // Remove leading slash if present
  const cleanPath = pdfPath.startsWith("/") ? pdfPath.slice(1) : pdfPath
  const fullPath = path.join(publicDirectory, cleanPath)
  
  return fs.existsSync(fullPath)
}

function determineStatus(date: string, manualStatus?: string): "Upcoming" | "Past" {
  // If status is manually provided and valid, use it
  if (manualStatus === "Upcoming" || manualStatus === "Past") {
    return manualStatus
  }
  
  // Otherwise, determine from date
  const competitionDate = new Date(date)
  const today = new Date()
  
  // Reset time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0)
  competitionDate.setHours(0, 0, 0, 0)
  
  // If date is invalid, default to Past
  if (isNaN(competitionDate.getTime())) {
    return "Past"
  }
  
  // If competition date is today or in the future, it's Upcoming
  return competitionDate >= today ? "Upcoming" : "Past"
}

function getCompetitionSlugsFromFilesystem(): string[] {
  if (!fs.existsSync(competitionsDirectory)) {
    return []
  }

  const files = fs.readdirSync(competitionsDirectory)
  return files
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.replace(/\.md$/, ""))
}

function getCompetitionBySlugFromFilesystem(slug: string): Competition | null {
  try {
    const fullPath = path.join(competitionsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Validate required fields (status is now optional)
    if (!data.title || !data.year || !data.date || !data.description) {
      console.warn(`Competition ${slug} is missing required frontmatter fields`)
      return null
    }

    const pastQuestions = data.pastQuestions || undefined
    const answerKey = data.answerKey || undefined
    const status = determineStatus(data.date, data.status)

    return {
      slug,
      title: data.title,
      year: data.year,
      date: data.date,
      status,
      description: data.description,
      pastQuestions,
      answerKey,
      hasPastQuestions: checkPdfExists(pastQuestions),
      hasAnswerKey: checkPdfExists(answerKey),
      content: content.trim(),
    }
  } catch (error) {
    console.error(`Error reading competition ${slug}:`, error)
    return null
  }
}

export function getCompetitionSlugs() {
  return getCompetitionSlugsFromFilesystem()
}

export function getCompetitionBySlug(slug: string): Competition | null {
  return getCompetitionBySlugFromFilesystem(slug)
}

export function getAllCompetitions(): Competition[] {
  const slugs = getCompetitionSlugsFromFilesystem()
  const competitions = slugs
    .map((slug) => getCompetitionBySlugFromFilesystem(slug))
    .filter((competition): competition is Competition => competition !== null)

  // Sort by date (newest first), then by status (Upcoming first)
  return competitions.sort((a, b) => {
    // Upcoming competitions first
    if (a.status === "Upcoming" && b.status !== "Upcoming") return -1
    if (a.status !== "Upcoming" && b.status === "Upcoming") return 1
    
    // Then sort by date
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
    if (isNaN(dateA.getTime())) return 1
    if (isNaN(dateB.getTime())) return -1
    
    return dateB.getTime() - dateA.getTime()
  })
}
