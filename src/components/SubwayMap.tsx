import React, { useMemo } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useRoadmapProgress } from "@site/src/components/useRoadmapProgress";

/**
 * Data model
 */
export type SubwayStop = {
  id: string;
  title: string;
  url?: string;           // if absent, stop is a label-only marker
  x: number;              // grid column
  y: number;              // grid row
  meta?: { note?: string };
};

export type SubwayLine = {
  id: string;
  name: string;
  color?: string;         // optional accent line color; default from CSS var
  stops: string[];        // array of stop ids in order
};

export type SubwayMapData = {
  stops: SubwayStop[];
  lines: SubwayLine[];
  /** Grid size; adapt for density. */
  grid?: { cols: number; rows: number; cell: number }; // default in component
};

type Props = {
  data: SubwayMapData;
  height?: number | string;
  legend?: boolean;
  showGrid?: boolean;
  /** If true, shows a small checkbox to toggle completion manually */
  allowManualToggle?: boolean;
};

/**
 * SVG-based subway map:
 * - Each line is drawn by connecting its stops in order
 * - Each stop renders a station dot + label
 * - Completed stops are filled
 * - Keyboard/ARIA friendly: station is a focusable button if it has a URL
 */
export default function SubwayMap({
  data,
  height = 520,
  legend = true,
  showGrid = false,
  allowManualToggle = true,
}: Props) {
  const { isComplete, markComplete } = useRoadmapProgress();

  const grid = {
    cols: data.grid?.cols ?? 12,
    rows: data.grid?.rows ?? 8,
    cell: data.grid?.cell ?? 72, // px
  };

  const stopMap = useMemo(() => {
    const m = new Map<string, SubwayStop>();
    data.stops.forEach((s) => m.set(s.id, s));
    return m;
  }, [data.stops]);

  const width = grid.cols * grid.cell;
  const heightPx = typeof height === "number" ? height : undefined;
  const svgHeight = heightPx ?? grid.rows * grid.cell;

  // Helpers
  const coord = (s: SubwayStop) => ({
    cx: s.x * grid.cell,
    cy: s.y * grid.cell,
  });

  // Optional dotted grid (debug)
  const Grid = () => (
    <g opacity={0.15}>
      {Array.from({ length: grid.cols + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * grid.cell}
          y1={0}
          x2={i * grid.cell}
          y2={svgHeight}
          stroke="var(--ifm-color-emphasis-200)"
          strokeDasharray="4 6"
        />
      ))}
      {Array.from({ length: grid.rows + 1 }).map((_, j) => (
        <line
          key={`h-${j}`}
          x1={0}
          y1={j * grid.cell}
          x2={width}
          y2={j * grid.cell}
          stroke="var(--ifm-color-emphasis-200)"
          strokeDasharray="4 6"
        />
      ))}
    </g>
  );

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {legend && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          {data.lines.map((ln) => (
            <span key={ln.id} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 4,
                  borderRadius: 2,
                  background: ln.color ?? "var(--ifm-color-primary)",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 12, opacity: 0.8 }}>{ln.name}</span>
            </span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.75 }}>
            • Click a station to open. Filled = completed.
          </span>
        </div>
      )}

      <svg width={width} height={svgHeight} role="img" aria-label="Subway-style learning map">
        {showGrid && <Grid />}

        {/* Lines */}
        {data.lines.map((ln) => {
          const pts = ln.stops
            .map((id) => stopMap.get(id))
            .filter(Boolean) as SubwayStop[];
          if (pts.length < 2) return null;

          const pathD = pts
            .map((s, i) => {
              const p = coord(s);
              return `${i === 0 ? "M" : "L"} ${p.cx} ${p.cy}`;
            })
            .join(" ");

          return (
            <g key={ln.id}>
              <path
                d={pathD}
                fill="none"
                stroke={ln.color ?? "var(--ifm-color-primary)"}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Stations */}
        {data.stops.map((s) => {
          const p = coord(s);
          const url = s.url ? useBaseUrl(s.url) : undefined;
          const done = isComplete(s.url ?? s.id);

          const station = (
            <>
              {/* outer ring for contrast */}
              <circle cx={p.cx} cy={p.cy} r={9} fill="var(--ifm-background-surface-color)" stroke="var(--ifm-color-emphasis-300)" strokeWidth={1} />
              {/* inner dot indicates completion */}
              <circle
                cx={p.cx}
                cy={p.cy}
                r={5}
                fill={done ? "var(--ifm-color-success)" : "var(--ifm-color-emphasis-700)"}
              />
            </>
          );

          // Accessible clickable station
          const labelOffset = 12;
          const label = (
            <text
              x={p.cx + labelOffset}
              y={p.cy - 10}
              style={{ fontSize: 12 }}
              fill="var(--ifm-font-color-base)"
            >
              {s.title}
            </text>
          );

          return (
            <g key={s.id} tabIndex={0}>
              {url ? (
                <a href={url} onClick={() => markComplete(s.url ?? s.id)}>
                  {station}
                </a>
              ) : (
                station
              )}

              {label}

              {/* optional manual toggle */}
              {allowManualToggle && (
                <foreignObject x={p.cx + labelOffset} y={p.cy - 4} width={180} height={28}>
                  <div style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                    {url ? (
                      <Link to={url} style={{ fontSize: 12 }}>
                        Open
                      </Link>
                    ) : null}
                    <button
                      className="button button--xs button--secondary"
                      style={{ padding: "2px 6px", fontSize: 11 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markComplete(s.url ?? s.id);
                      }}
                    >
                      Mark done
                    </button>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
