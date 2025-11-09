import fs from "fs"
import path from "path"
// @ts-ignore - gray-matter types may not be available
import matter from "gray-matter"

export interface LearningMaterial {
  slug: string
  title: string
  description: string
  pdf: string
  date?: string
  content: string
}

const learningDirectory = path.join(process.cwd(), "content", "learning")

function getLearningMaterialSlugsFromFilesystem(): string[] {
  if (!fs.existsSync(learningDirectory)) {
    return []
  }

  const files = fs.readdirSync(learningDirectory)
  return files
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => file.replace(/\.md$/, ""))
}

function getLearningMaterialBySlugFromFilesystem(slug: string): LearningMaterial | null {
  try {
    const fullPath = path.join(learningDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Validate required fields
    if (!data.title || !data.description || !data.pdf) {
      console.warn(`Learning material ${slug} is missing required frontmatter fields`)
      return null
    }

    return {
      slug,
      title: data.title,
      description: data.description,
      pdf: data.pdf,
      date: data.date,
      content: content.trim(),
    }
  } catch (error) {
    console.error(`Error reading learning material ${slug}:`, error)
    return null
  }
}

export function getLearningMaterialSlugs() {
  return getLearningMaterialSlugsFromFilesystem()
}

export function getLearningMaterialBySlug(slug: string): LearningMaterial | null {
  return getLearningMaterialBySlugFromFilesystem(slug)
}

export function getAllLearningMaterials(): LearningMaterial[] {
  const slugs = getLearningMaterialSlugsFromFilesystem()
  const materials = slugs
    .map((slug) => getLearningMaterialBySlugFromFilesystem(slug))
    .filter((material): material is LearningMaterial => material !== null)

  // Sort by date if available, otherwise by title
  return materials.sort((a, b) => {
    if (a.date && b.date) {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime()
      }
    }
    
    // Fallback to alphabetical by title
    return a.title.localeCompare(b.title)
  })
}
