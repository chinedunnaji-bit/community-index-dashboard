export async function fetchRegions() {
  const res = await fetch('/api/regions')
  if (!res.ok) throw new Error('Failed to fetch regions')
  return res.json()
}

export async function fetchTrends() {
  const res = await fetch('/api/trends')
  if (!res.ok) throw new Error('Failed to fetch trends')
  return res.json()
}
