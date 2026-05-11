"use client"

import type { AxisChartData } from "@/lib/types"

interface RadarChartProps {
  readonly data: readonly AxisChartData[]
  readonly size?: number
}

export function RadarChart({ data, size = 280 }: RadarChartProps) {
  const center = size / 2
  const maxRadius = (size / 2) * 0.72
  const numAxes = data.length

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2
    const r = (value / 100) * maxRadius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2
    const r = maxRadius + 22
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  const points = data.map((d, i) => getPoint(i, d.value))
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ")

  // Background grid (3 levels)
  const gridLevels = [0.33, 0.66, 1.0]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a5b8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#b8a8d4" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a5b8" />
          <stop offset="100%" stopColor="#b8a8d4" />
        </linearGradient>
      </defs>

      {/* Grid polygons */}
      {gridLevels.map((level, idx) => {
        const gridPoints = data
          .map((_, i) => {
            const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2
            const r = level * maxRadius
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`
          })
          .join(" ")
        return (
          <polygon
            key={idx}
            points={gridPoints}
            fill="none"
            stroke="rgba(245, 240, 247, 0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* Axis lines */}
      {data.map((_, i) => {
        const end = getPoint(i, 100)
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(245, 240, 247, 0.05)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="1"
        style={{ filter: "drop-shadow(0 0 6px rgba(212, 165, 184, 0.25))" }}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2"
          fill="#d4a5b8"
        />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const lp = getLabelPoint(i)
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="300"
            fill="rgba(245, 237, 229, 0.55)"
            letterSpacing="0.1em"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}
