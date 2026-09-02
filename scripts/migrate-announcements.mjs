import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const repoRoot = process.cwd()
const announcementsDir = path.join(repoRoot, 'content', 'announcements')
const outputCsvPath = path.join(repoRoot, 'announcements.csv')

const columns = ['slug', 'title', 'date', 'type', 'content']

function parseDateToIso(dateValue) {
  const raw = String(dateValue ?? '').trim()
  if (!raw) return null

  const isoMatch = raw.match(/^\d{4}-\d{2}-\d{2}$/)
  if (isoMatch) return `${raw}T00:00:00.000Z`

  const standard = new Date(raw)
  if (!Number.isNaN(standard.getTime())) {
    return standard.toISOString()
  }

  const cleaned = raw.replace(/,/g, '').trim()
  const parts = cleaned.split(/\s+/)

  if (parts.length >= 3) {
    const day = Number.parseInt(parts[0], 10)
    const year = Number.parseInt(parts[2], 10)
    const monthName = parts[1].toLowerCase()
    const romanian = {
      ianuarie: '01',
      februarie: '02',
      martie: '03',
      aprilie: '04',
      mai: '05',
      iunie: '06',
      iulie: '07',
      august: '08',
      septembrie: '09',
      octombrie: '10',
      noiembrie: '11',
      decembrie: '12',
    }
    const english = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
    }

    const month = romanian[monthName] ?? english[monthName]
    if (month && Number.isFinite(day) && Number.isFinite(year)) {
      return new Date(`${year}-${month}-${String(day).padStart(2, '0')}T00:00:00.000Z`).toISOString()
    }
  }

  throw new Error(`Unsupported date format: "${dateValue}"`)
}

function csvEscape(value) {
  const text = value == null ? '' : String(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function readAnnouncementsFromMarkdown() {
  if (!fs.existsSync(announcementsDir)) {
    throw new Error(`Announcements directory not found: ${announcementsDir}`)
  }

  const files = fs
    .readdirSync(announcementsDir)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .sort()

  return files.map((file) => {
    const slug = file.replace(/\.md$/, '')
    const source = fs.readFileSync(path.join(announcementsDir, file), 'utf8')
    const { data, content } = matter(source)

    if (!data.title || !data.date || !data.type) {
      throw new Error(`Announcement ${file} is missing required frontmatter: title/date/type`)
    }

    return {
      slug,
      title: String(data.title),
      date: parseDateToIso(data.date),
      type: String(data.type),
      content: (content || '').trim(),
    }
  })
}

function writeCsv(rows) {
  const csv = [
    columns.join(','),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')),
  ].join('\r\n') + '\r\n'

  fs.writeFileSync(outputCsvPath, csv, 'utf8')
  console.log(`Wrote ${rows.length} announcement rows to ${path.relative(repoRoot, outputCsvPath)}`)
}

function parseCsvRows(csvFilePath) {
  const csv = fs.readFileSync(csvFilePath, 'utf8')
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []

  const header = lines[0].split(',').map((value) => value.trim())
  const rows = lines.slice(1).map((line) => {
    const values = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i += 1
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }

    values.push(current)

    const row = {}
    header.forEach((key, index) => {
      row[key] = values[index] ?? ''
    })
    return row
  })

  return rows
}

function createSupabaseClient() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or the matching NEXT_PUBLIC_* values).',
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

async function importRowsFromCsv(csvFilePath) {
  const rows = parseCsvRows(csvFilePath)
  if (!rows.length) {
    console.log('No rows found in CSV.')
    return
  }

  const client = createSupabaseClient()
  const payload = rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    date: row.date,
    type: row.type,
    content: row.content ?? '',
  }))

  for (const item of payload) {
    const { error: deleteError } = await client.from('announcements').delete().eq('slug', item.slug)
    if (deleteError) {
      throw deleteError
    }

    const { error: insertError } = await client.from('announcements').insert(item)
    if (insertError) {
      throw insertError
    }
  }

  console.log(`Imported ${payload.length} announcements into Supabase.`)
}

async function main() {
  const args = new Set(process.argv.slice(2))
  const csvPath = process.argv.find((arg) => arg.startsWith('--csv='))?.split('=')[1] ?? outputCsvPath
  const dryRun = args.has('--dry-run')
  const importMode = args.has('--import') || args.has('-i')

  const rows = readAnnouncementsFromMarkdown()
  writeCsv(rows)

  if (dryRun) {
    console.log('Dry run enabled. No Supabase write performed.')
    return
  }

  if (importMode) {
    await importRowsFromCsv(csvPath)
  } else {
    console.log(`CSV ready at ${path.relative(repoRoot, csvPath)}. Run with --import to push it to Supabase.`)
  }
}

main().catch((error) => {
  console.error('Announcement migration failed:', error)
  process.exit(1)
})
