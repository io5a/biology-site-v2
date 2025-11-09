import fs from "fs"
import path from "path"
// @ts-ignore - gray-matter types may not be available
import matter from "gray-matter"

export interface Announcement {
  slug: string
  title: string
  date: string
  type: string
  content: string
}

const announcementsDirectory = path.join(process.cwd(), "content", "announcements")

function getAnnouncementSlugsFromFilesystem(): string[] {
  if (!fs.existsSync(announcementsDirectory)) {
    return []
  }

  const files = fs.readdirSync(announcementsDirectory)
  return files
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.replace(/\.md$/, ""))
}

function getAnnouncementBySlugFromFilesystem(slug: string): Announcement | null {
  try {
    const fullPath = path.join(announcementsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Validate required fields
    if (!data.title || !data.date || !data.type) {
      console.warn(`Announcement ${slug} is missing required frontmatter fields`)
      return null
    }

    return {
      slug,
      title: data.title,
      date: data.date,
      type: data.type,
      content: content.trim(),
    }
  } catch (error) {
    console.error(`Error reading announcement ${slug}:`, error)
    return null
  }
}

export function getAnnouncementSlugs() {
  return getAnnouncementSlugsFromFilesystem()
}

export function getAnnouncementBySlug(slug: string): Announcement | null {
  return getAnnouncementBySlugFromFilesystem(slug)
}

export function getAllAnnouncements(): Announcement[] {
  const slugs = getAnnouncementSlugsFromFilesystem()
  const announcements = slugs
    .map((slug) => getAnnouncementBySlugFromFilesystem(slug))
    .filter((announcement): announcement is Announcement => announcement !== null)

  // Sort by date (newest first)
  // Handle different date formats
  return announcements.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    // If dates are invalid, put them at the end
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
    if (isNaN(dateA.getTime())) return 1
    if (isNaN(dateB.getTime())) return -1
    
    return dateB.getTime() - dateA.getTime()
  })
}
