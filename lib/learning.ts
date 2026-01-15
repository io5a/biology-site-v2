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
  groupSlug?: string
  tags?: Record<string, string | string[]>
}

export interface LearningGroup {
  slug: string
  title: string
  description?: string
  tags: Record<string, string | string[]>
  materials: LearningMaterial[]
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

function mergeTags(
  groupTags: Record<string, string | string[]>,
  materialTags?: Record<string, string | string[]>,
): Record<string, string | string[]> {
  if (!materialTags) {
    return { ...groupTags }
  }

  const merged: Record<string, string | string[]> = { ...groupTags }

  for (const [key, value] of Object.entries(materialTags)) {
    if (merged[key]) {
      // If both exist, merge arrays or combine
      const existing = merged[key]
      const newValue = value

      if (Array.isArray(existing) && Array.isArray(newValue)) {
        // Merge arrays and remove duplicates
        merged[key] = [...new Set([...existing, ...newValue])]
      } else if (Array.isArray(existing)) {
        // Add string to array if not already present
        if (!existing.includes(newValue as string)) {
          merged[key] = [...existing, newValue as string]
        }
      } else if (Array.isArray(newValue)) {
        // Convert existing to array and merge
        if (!newValue.includes(existing as string)) {
          merged[key] = [existing as string, ...newValue]
        } else {
          merged[key] = newValue
        }
      } else {
        // Both are strings, keep the material tag (more specific)
        merged[key] = newValue
      }
    } else {
      // New tag from material
      merged[key] = value
    }
  }

  return merged
}

function getLearningMaterialBySlugFromFilesystem(slug: string, groupSlug?: string): LearningMaterial | null {
  try {
    const fullPath = groupSlug
      ? path.join(learningDirectory, groupSlug, `${slug}.md`)
      : path.join(learningDirectory, `${slug}.md`)
    
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
      groupSlug,
      tags: data.tags,
    }
  } catch (error) {
    console.error(`Error reading learning material ${slug}:`, error)
    return null
  }
}

function getLearningGroupsFromFilesystem(): LearningGroup[] {
  if (!fs.existsSync(learningDirectory)) {
    return []
  }

  const entries = fs.readdirSync(learningDirectory, { withFileTypes: true })
  const groups: LearningGroup[] = []

  for (const entry of entries) {
    // Only process directories
    if (!entry.isDirectory()) {
      continue
    }

    const groupSlug = entry.name
    const groupPath = path.join(learningDirectory, groupSlug)
    const tagsPath = path.join(groupPath, "tags.md")

    // Check if tags.md exists
    if (!fs.existsSync(tagsPath)) {
      continue
    }

    try {
      const tagsContent = fs.readFileSync(tagsPath, "utf8")
      const { data } = matter(tagsContent)

      // Validate required fields
      if (!data.title || !data.tags) {
        console.warn(`Group ${groupSlug} is missing required fields (title or tags)`)
        continue
      }

      // Get all materials in this group
      const groupFiles = fs.readdirSync(groupPath)
      const materials = groupFiles
        .filter((file) => file.endsWith(".md") && file !== "tags.md")
        .map((file) => {
          const slug = file.replace(/\.md$/, "")
          return getLearningMaterialBySlugFromFilesystem(slug, groupSlug)
        })
        .filter((material): material is LearningMaterial => material !== null)
        .map((material) => ({
          ...material,
          tags: mergeTags(data.tags, material.tags),
        }))

      // Sort materials by date if available, otherwise by title
      materials.sort((a, b) => {
        if (a.date && b.date) {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          
          if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
            return dateB.getTime() - dateA.getTime()
          }
        }
        
        return a.title.localeCompare(b.title)
      })

      groups.push({
        slug: groupSlug,
        title: data.title,
        description: data.description,
        tags: data.tags,
        materials,
      })
    } catch (error) {
      console.error(`Error reading group ${groupSlug}:`, error)
      continue
    }
  }

  return groups
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

export function getAllLearningGroups(): LearningGroup[] {
  return getLearningGroupsFromFilesystem()
}

export function getAllLearningMaterialsWithGroups(): {
  groups: LearningGroup[]
  ungroupedMaterials: LearningMaterial[]
} {
  const groups = getAllLearningGroups()
  const allMaterials = getAllLearningMaterials()
  
  // Get materials that are in groups
  const groupedMaterialSlugs = new Set<string>()
  groups.forEach((group) => {
    group.materials.forEach((material) => {
      groupedMaterialSlugs.add(material.slug)
    })
  })

  // Filter out materials that are in groups
  const ungroupedMaterials = allMaterials.filter(
    (material) => !groupedMaterialSlugs.has(material.slug)
  )

  return {
    groups,
    ungroupedMaterials,
  }
}
