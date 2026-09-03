import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const articlesDirectory = path.join(process.cwd(), "content", "articles")
const outputPath = path.resolve(process.cwd(), process.argv[2] || "articles.csv")
const columns = ["slug", "created_at", "title", "excerpt", "category", "content", "draft"]

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

function toCreatedAt(date) {
  const match = String(date)
    .trim()
    .toLowerCase()
    .match(/^(\d{1,2})\s+([a-zăâîșț]+)\s+(\d{4})$/)

  if (!match || !romanianMonths[match[2]]) {
    throw new Error(`Invalid article date: ${date}`)
  }

  const [, day, monthName, year] = match
  const month = romanianMonths[monthName]
  return `${year}-${month}-${day.padStart(2, "0")}T00:00:00.000Z`
}

function csvValue(value) {
  const text = value == null ? "" : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function readArticles() {
  const filenames = fs
    .readdirSync(articlesDirectory)
    .filter((filename) => filename.endsWith(".md") && filename !== "README.md")
    .sort()

  return filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "")
    const source = fs.readFileSync(path.join(articlesDirectory, filename), "utf8")
    const { data, content } = matter(source)

    for (const field of ["title", "excerpt", "category"]) {
      if (!data[field]) {
        throw new Error(`${filename} is missing required frontmatter field: ${field}`)
      }
    }

    return {
      slug,
      created_at: toCreatedAt(data.date),
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      content: content.trim(),
      draft: data.draft ?? "",
    }
  })
}

const rows = readArticles()
const csv = [
  columns.join(","),
  ...rows.map((article) => columns.map((column) => csvValue(article[column])).join(",")),
].join("\r\n") + "\r\n"

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, csv, "utf8")
console.log(`Exported ${rows.length} articles to ${path.relative(process.cwd(), outputPath)}`)