import fs from "fs"
import path from "path"

export interface GalleryImage {
  filename: string
  url: string
}

const galleryDirectory = path.join(process.cwd(), "public", "gallery")

// Supported image extensions
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]

function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase()
  return imageExtensions.includes(ext)
}

function getAllImagesRecursively(dir: string, baseDir: string = dir): GalleryImage[] {
  const images: GalleryImage[] = []
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.relative(baseDir, fullPath)
      
      if (entry.isDirectory()) {
        // Recursively search subdirectories
        images.push(...getAllImagesRecursively(fullPath, baseDir))
      } else if (entry.isFile()) {
        // Check if it's an image file and not README.md
        if (isImageFile(entry.name) && entry.name !== "README.md") {
          // Use forward slashes for URLs (works on all platforms)
          const urlPath = relativePath.replace(/\\/g, "/")
          images.push({
            filename: entry.name,
            url: `/gallery/${urlPath}`,
          })
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }
  
  return images
}

export function getGalleryImages(): GalleryImage[] {
  if (!fs.existsSync(galleryDirectory)) {
    return []
  }

  try {
    const images = getAllImagesRecursively(galleryDirectory)
    // Sort alphabetically by URL path
    return images.sort((a, b) => a.url.localeCompare(b.url))
  } catch (error) {
    console.error("Error reading gallery directory:", error)
    return []
  }
}