import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const repoRoot = process.cwd()
const competitionsDirectory = path.join(repoRoot, "content", "competitions")
const outputPath = path.resolve(repoRoot, process.argv[2] || "competitions.csv")
const columns = ["slug", "title", "date", "description", "stage", "location", "official_url"]

const months = {
  ianuarie: 1,
  februarie: 2,
  martie: 3,
  aprilie: 4,
  mai: 5,
  iunie: 6,
  iulie: 7,
  august: 8,
  septembrie: 9,
  octombrie: 10,
  noiembrie: 11,
  decembrie: 12,
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}

function parseDate(dateValue, filename) {
  const raw = String(dateValue ?? "").trim().replace(/,/g, "")
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const dateMatch = raw.match(/^(\w+)\s+(\d{1,2})\s+(\d{4})$/i)
  const monthMatch = raw.match(/^(\w+)\s+(\d{4})$/i)

  let year
  let month
  let day = 1

  if (isoMatch) {
    [, year, month, day] = isoMatch
  } else if (dateMatch && months[dateMatch[1].toLowerCase()]) {
    month = months[dateMatch[1].toLowerCase()]
    day = dateMatch[2]
    year = dateMatch[3]
  } else if (monthMatch && months[monthMatch[1].toLowerCase()]) {
    month = months[monthMatch[1].toLowerCase()]
    year = monthMatch[2]
  } else {
    throw new Error(`${filename} has an unsupported date: ${dateValue}`)
  }

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`${filename} has an invalid date: ${dateValue}`)
  }

  return date.toISOString()
}

function csvValue(value) {
  const text = value == null ? "" : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

const filenames = fs
  .readdirSync(competitionsDirectory)
  .filter((filename) => filename.endsWith(".md") && filename !== "README.md")
  .sort()

const rows = filenames.map((filename) => {
  const source = fs.readFileSync(path.join(competitionsDirectory, filename), "utf8")
  const { data } = matter(source)

  for (const field of ["title", "date"]) {
    if (!data[field]) {
      throw new Error(`${filename} is missing required frontmatter field: ${field}`)
    }
  }

  return {
    slug: filename.replace(/\.md$/, ""),
    title: data.title,
    date: parseDate(data.date, filename),
    description: data.description ?? "",
    stage: data.stage ?? "",
    location: data.location ?? "",
    official_url: data.officialUrl ?? "",
  }
})

const csv = [
  columns.join(","),
  ...rows.map((row) => columns.map((column) => csvValue(row[column])).join(",")),
].join("\r\n") + "\r\n"

fs.writeFileSync(outputPath, csv, "utf8")
console.log(`Exported ${rows.length} competitions to ${path.relative(repoRoot, outputPath)}`)