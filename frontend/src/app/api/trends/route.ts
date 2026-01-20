import { NextResponse } from 'next/server'
import { csvParse } from 'd3-dsv'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

type RawRow = {
  CITY?: string
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

function average(rows: RawRow[], key: keyof RawRow) {
  const values = rows
    .map((row) => (row[key] ? Number(row[key]) : null))
    .filter((value): value is number => Number.isFinite(value))
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export async function GET() {
  const rows = await loadRows()
  const dallasRows = rows.filter((row) => row.CITY?.toLowerCase() === 'dallas')

  const metrics = [
    { label: 'Community', value: average(dallasRows, 'ci_index') },
    { label: 'Economics', value: average(dallasRows, 'eci_index') },
    { label: 'Education', value: average(dallasRows, 'edi_index') },
    { label: 'Family', value: average(dallasRows, 'fi_index') },
    { label: 'Health', value: average(dallasRows, 'hi_index') },
  ]

  return NextResponse.json(metrics)
}
