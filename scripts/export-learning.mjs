import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const repoRoot = process.cwd()
const learningDirectory = path.join(repoRoot, "content", "learning")
const outputPath = path.resolve(repoRoot, process.argv[2] || "learning.csv")
const columns = ["slug", "group_slug", "title", "description", "pdf", "date", "content", "tags"]

const romanianMonths = {
  ianuarie: "01",
  februarie: "02",
  martie: "03",
  aprilie: "04",
  mai: "05",
  iunie: "06",
  iulie: "07",
  august: "08",
  septembrie: "09",
  octombrie: "10",
  noiembrie: "11",
  decembrie: "12",
}

const englishMonths = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  sep: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
}

function parseDateToIso(dateValue) {
  if (dateValue == null || String(dateValue).trim() === "") return ""

  const raw = String(dateValue).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return `${raw}T00:00:00.000Z`
  }

  const match = raw.replace(/,/g, "").match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i)
  if (match) {
    const [, day, monthName, year] = match
    const month = romanianMonths[monthName.toLowerCase()] ?? englishMonths[monthName.toLowerCase()]
    if (month) {
      return `${year}-${month}-${day.padStart(2, "0")}T00:00:00.000Z`
    }
  }

  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()

  throw new Error(`Unsupported learning material date: "${dateValue}"`)
}

function csvValue(value) {
  const text = value == null ? "" : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function mergeTags(groupTags, materialTags) {
  const merged = { ...groupTags }

  for (const [key, value] of Object.entries(materialTags || {})) {
    const existing = merged[key]
    if (existing == null) {
      merged[key] = value
    } else if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...new Set([...existing, ...value])]
    } else if (Array.isArray(existing)) {
      merged[key] = existing.includes(value) ? existing : [...existing, value]
    } else if (Array.isArray(value)) {
      merged[key] = value.includes(existing) ? value : [existing, ...value]
    } else {
      merged[key] = value
    }
  }

  return merged
}

function readGroupTags(groupPath) {
  const tagsPath = path.join(groupPath, "tags.md")
  if (!fs.existsSync(tagsPath)) return {}

  const { data } = matter(fs.readFileSync(tagsPath, "utf8"))
  if (!data.title || !data.tags) {
    throw new Error(`${path.relative(repoRoot, tagsPath)} is missing title or tags frontmatter`)
  }

  return data.tags
}

function readLearningMaterials() {
  if (!fs.existsSync(learningDirectory)) {
    throw new Error(`Learning directory not found: ${learningDirectory}`)
  }

  const rows = []
  const entries = fs.readdirSync(learningDirectory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const groupSlug = entry.name
      const groupPath = path.join(learningDirectory, groupSlug)
      const groupTags = readGroupTags(groupPath)
      const files = fs
        .readdirSync(groupPath)
        .filter((file) => file.endsWith(".md") && file !== "tags.md")
        .sort()

      for (const file of files) {
        rows.push(readMaterial(path.join(groupPath, file), groupSlug, groupTags))
      }
    } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") {
      rows.push(readMaterial(path.join(learningDirectory, entry.name), "", {}))
    }
  }

  return rows
}

function readMaterial(filePath, groupSlug, groupTags) {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"))

  for (const field of ["title", "description", "pdf"]) {
    if (!data[field]) {
      throw new Error(`${path.relative(repoRoot, filePath)} is missing required frontmatter field: ${field}`)
    }
  }

  return {
    slug: path.posix.basename(String(data.pdf).split("?")[0]),
    group_slug: groupSlug,
    title: data.title,
    description: data.description,
    pdf: data.pdf,
    date: parseDateToIso(data.date),
    content: content.trim(),
    tags: JSON.stringify(mergeTags(groupTags, data.tags)),
  }
}

const rows = readLearningMaterials()
const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvValue(row[column])).join(",")),
].join("\r\n") + "\r\n"

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, csv, "utf8")
console.log(`Exported ${rows.length} learning materials to ${path.relative(repoRoot, outputPath)}`)