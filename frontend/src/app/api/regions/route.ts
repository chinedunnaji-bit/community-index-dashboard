import { NextResponse } from 'next/server'
import { csvParse } from 'd3-dsv'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

type RawRow = {
  SCHOOLNAME?: string
  CITY?: string
  POINT_X?: string
  POINT_Y?: string
  cri_index?: string
  ci_index?: string
  eci_index?: string
  edi_index?: string
  fi_index?: string
  hi_index?: string
}

let cachedRows: RawRow[] | null = null

async function loadRows() {
  if (cachedRows) return cachedRows
  const dataPath = path.join(
    process.cwd(),
    '..',
    'data',
    'Community Resource Explorer',
    'CRI_IndexValues_FullFinal.csv'
  )
  const csv = await readFile(dataPath, 'utf-8')
  const rows = csvParse(csv) as RawRow[]
  cachedRows = rows
  return rows
}

function formatSignal(label: string, value: number | null) {
  if (value === null) return `${label}: N/A`
  return `${label}: ${Math.round(value)}`
}

export async function GET() {
  const rows = await loadRows()
  const regions = rows
    .filter((row) => row.CITY?.toLowerCase() === 'dallas')
    .map((row) => {
      const index = row.cri_index ? Number(row.cri_index) : null
      const community = row.ci_index ? Number(row.ci_index) : null
      const economics = row.eci_index ? Number(row.eci_index) : null
      const education = row.edi_index ? Number(row.edi_index) : null
      const family = row.fi_index ? Number(row.fi_index) : null
      const health = row.hi_index ? Number(row.hi_index) : null

      return {
        id: row.SCHOOLNAME?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? 'unknown',
        name: row.SCHOOLNAME ?? 'Unknown campus',
        lat: row.POINT_Y ? Number(row.POINT_Y) : null,
        lon: row.POINT_X ? Number(row.POINT_X) : null,
        index: index ?? 0,
        indices: {
          overview: index ?? 0,
          community: community ?? 0,
          economics: economics ?? 0,
          education: education ?? 0,
          family: family ?? 0,
          health: health ?? 0,
        },
        signals: [
          formatSignal('Community', community),
          formatSignal('Economics', economics),
          formatSignal('Education', education),
          formatSignal('Family', family),
          formatSignal('Health', health),
        ],
      }
    })
    .filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lon))

  return NextResponse.json(regions)
}
