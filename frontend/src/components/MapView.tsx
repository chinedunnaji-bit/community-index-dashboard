'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

type Region = {
  id: string
  name: string
  lat: number
  lon: number
  index: number
  indices: {
    overview: number
    community: number
    economics: number
    education: number
    family: number
    health: number
  }
  signals: string[]
}

const indexOptions = [
  {
    key: 'overview',
    label: 'Overall CRI',
    description:
      'Composite resource abundance index built from community, economics, education, family, and health.',
  },
  {
    key: 'community',
    label: 'Community',
    description: 'Community context of a campus neighborhood.',
  },
  {
    key: 'economics',
    label: 'Economics',
    description: 'Economic stability and opportunity around each campus.',
  },
  {
    key: 'education',
    label: 'Education',
    description: 'Education environment and related supports.',
  },
  {
    key: 'family',
    label: 'Family',
    description: 'Family stability and household conditions.',
  },
  {
    key: 'health',
    label: 'Health',
    description: 'Health access and outcomes in the campus buffer.',
  },
] as const

type IndexKey = (typeof indexOptions)[number]['key']

const indexStops = [
  { limit: 35, color: '#f97316' },
  { limit: 55, color: '#facc15' },
  { limit: 75, color: '#38bdf8' },
  { limit: 100, color: '#22c55e' },
]

function getIndexColor(value: number) {
  return indexStops.find((stop) => value <= stop.limit)?.color ?? '#22c55e'
}

export default function MapView() {
  const [regions, setRegions] = useState<Region[]>([])
  const [error, setError] = useState<string | null>(null)
  const [indexKey, setIndexKey] = useState<IndexKey>('overview')

  useEffect(() => {
    let isMounted = true
    fetch('/api/regions')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load regions')
        }
        return res.json()
      })
      .then((data) => {
        if (isMounted) {
          setRegions(data)
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setError(err.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const center = useMemo(() => {
    if (!regions.length) {
      return [32.7767, -96.797] as [number, number]
    }
    const lat = regions.reduce((sum, r) => sum + r.lat, 0) / regions.length
    const lon = regions.reduce((sum, r) => sum + r.lon, 0) / regions.length
    return [lat, lon] as [number, number]
  }, [regions])

  const currentIndex = indexOptions.find((option) => option.key === indexKey)

  if (error) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-xl border border-stone-800 bg-stone-950 text-sm text-rose-200">
        {error}
      </div>
    )
  }

  return (
    <div className="relative h-[420px] overflow-hidden rounded-xl border border-stone-800 md:h-[520px]">
      <div className="absolute left-4 top-4 z-[400] flex flex-col gap-3 rounded-2xl border border-stone-700/70 bg-stone-950/80 px-4 py-3 text-xs text-stone-200 backdrop-blur">
        <div>
          <div className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-400">Map view</div>
          <div className="text-sm text-stone-100">Dallas school-centered resource index</div>
        </div>
        <div className="text-[0.7rem] text-stone-300">
          Points represent Dallas ISD campuses. Higher scores = more resource abundance.
        </div>
        <label className="flex flex-col gap-1 text-[0.7rem] text-stone-300">
          Index to display
          <select
            className="rounded-lg border border-stone-700 bg-stone-950/90 px-2 py-1 text-xs text-stone-100"
            value={indexKey}
            onChange={(event) => setIndexKey(event.target.value as IndexKey)}
          >
            {indexOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="text-[0.7rem] text-stone-400">{currentIndex?.description}</div>
      </div>
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {regions.map((region) => {
          const value = region.indices[indexKey]
          return (
            <CircleMarker
              key={region.id}
              center={[region.lat, region.lon]}
              radius={16}
              pathOptions={{
                color: getIndexColor(value),
                fillOpacity: 0.75,
              }}
            >
            <Popup>
              <div className="space-y-2 text-sm">
                <div className="text-base font-semibold text-stone-900">{region.name}</div>
                <div>
                  {currentIndex?.label} score: {Math.round(value)}
                </div>
                <ul className="list-disc space-y-1 pl-4">
                  {region.signals.map((signal) => (
                    <li key={signal}>{signal}</li>
                  ))}
                </ul>
              </div>
            </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[400] rounded-2xl border border-stone-700/80 bg-stone-950/80 px-4 py-3 text-xs text-stone-200 backdrop-blur">
        <div className="text-[0.65rem] uppercase tracking-[0.28em] text-stone-400">
          Index legend
        </div>
        <div className="text-[0.7rem] text-stone-300">
          {regions.length} campuses loaded
        </div>
        <div className="mt-2 flex items-center gap-3">
          {indexStops.map((stop) => (
            <div key={stop.color} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: stop.color }}
              />
              <span>≤ {stop.limit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
