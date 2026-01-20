'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

type TrendPoint = {
  label: string
  value: number
}

export default function TimelineChart() {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [data, setData] = useState<TrendPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    fetch('/api/trends')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load trend data')
        }
        return res.json()
      })
      .then((payload) => {
        if (isMounted) {
          setData(payload)
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

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    const width = 520
    const height = 360
    const margin = { top: 20, right: 32, bottom: 30, left: 110 }

    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    const y = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.label))
      .range([margin.top, height - margin.bottom])
      .padding(0.3)

    const x = d3.scaleLinear().domain([0, 100]).nice().range([margin.left, width - margin.right])

    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', x(0))
      .attr('y', (d) => y(d.label) ?? 0)
      .attr('height', y.bandwidth())
      .attr('width', (d) => x(d.value) - x(0))
      .attr('fill', '#38bdf8')
      .attr('rx', 6)

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .attr('fill', '#cbd5f5')

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('fill', '#cbd5f5')

    svg.selectAll('.domain, .tick line').attr('stroke', '#334155')

    svg
      .append('g')
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('x', (d) => x(d.value) + 6)
      .attr('y', (d) => (y(d.label) ?? 0) + y.bandwidth() / 2 + 4)
      .attr('fill', '#f8fafc')
      .attr('font-size', 11)
      .text((d) => Math.round(d.value))
  }, [data])

  if (error) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-xl border border-stone-800 bg-stone-950 text-sm text-rose-200">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-50">Index Profile</h2>
        <p className="text-xs text-stone-400">
          Average index values for Dallas school communities.
        </p>
      </div>
      <svg
        ref={svgRef}
        className="h-[280px] w-full md:h-[360px]"
        role="img"
        aria-label="Index trends"
      />
      <div className="flex flex-wrap gap-4 text-xs text-stone-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          Composite profile
        </span>
      </div>
    </div>
  )
}
