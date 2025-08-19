import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useRoadmapProgress } from "@site/src/components/useRoadmapProgress";

/** Data types */
type Station = {
  id: string;
  title: string;
  url?: string;
  col: number;
  row: number;
  lines?: string[];
  note?: string;
};
type Line = {
  id: string;
  name: string;
  color?: string;
  segments: [string, string][];
};
export type SEMetroData = {
  grid?: { cols?: number; rows?: number; cell?: number };
  stations: Station[];
  lines: Line[];
  spineId?: string;
};

type Props = {
  data: SEMetroData;
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  height?: number;
};

export default function SEMetroSpineD3({
  data,
  title = "Java Metro — Spine & Branches",
  showLegend = true,
  showGrid = false,
  height,
}: Props) {
  const { isComplete, markComplete } = useRoadmapProgress();

  // ✅ Get a non-hook function we can use anywhere
  const { withBaseUrl } = useBaseUrlUtils();

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Grid / sizing
  const grid = {
    cols: data.grid?.cols ?? 14,
    rows: data.grid?.rows ?? 8,
    cell: data.grid?.cell ?? 72,
  };
  const width = grid.cols * grid.cell;
  const baseHeight = grid.rows * grid.cell;
  const svgHeight = height ?? baseHeight;

  // Visual constants
  const RING = 10;
  const LINE_CASING = 8;
  const LINE_STROKE = 6;
  const TRACK_GAP = 5;
  const CLEAR = RING + LINE_STROKE / 2 + 2;

  // Lookup
  const stationMap = useMemo(() => {
    const m = new Map<string, Station>();
    data.stations.forEach((s) => m.set(s.id, s));
    return m;
  }, [data.stations]);

  const P = (s: Station) => ({ x: s.col * grid.cell, y: s.row * grid.cell });

  // Stable per-station, per-line track offset
  const stationLineIndex = useMemo(() => {
    const idx = new Map<string, Map<string, number>>();
    for (const s of data.stations) {
      const list = (s.lines ?? []).slice().sort();
      const mid = (list.length - 1) / 2;
      const map = new Map<string, number>();
      list.forEach((lid, i) => map.set(lid, i - mid));
      idx.set(s.id, map);
    }
    return idx;
  }, [data.stations]);

  const offsetFor = (lineId: string, stationId: string) =>
    (stationLineIndex.get(stationId)?.get(lineId) ?? 0) * TRACK_GAP;

  // Routing rules: spine horizontal-first, branches vertical-first
  const spineId = data.spineId ?? "java";

  function segmentPath(lineId: string, s: Station, t: Station): string {
    const a = P(s), b = P(t);
    const isSpine = lineId === spineId;

    // Start just outside S ring with per-line offset
    let x1 = a.x, y1 = a.y;
    if (isSpine) {
      const dirH = Math.sign(b.x - a.x) || 1;
      y1 += offsetFor(lineId, s.id);
      x1 += dirH * CLEAR;
    } else {
      const dirV = Math.sign(b.y - a.y) || 1;
      x1 += offsetFor(lineId, s.id);
      y1 += dirV * CLEAR;
    }

    // Elbow to align with target axis
    let x2: number, y2: number;
    if (isSpine) {
      x2 = b.x; y2 = y1;  // horizontal-first
    } else {
      x2 = x1; y2 = b.y;  // vertical-first
    }

    // Approach T just outside its ring (with offset)
    let x3 = b.x, y3 = b.y;
    if (isSpine) {
      const dirH = Math.sign(b.x - a.x) || 1;
      y3 += offsetFor(lineId, t.id);
      x3 -= dirH * CLEAR;
    } else {
      const dirV = Math.sign(b.y - a.y) || 1;
      x3 += offsetFor(lineId, t.id);
      y3 -= dirV * CLEAR;
    }

    return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`;
  }

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${width} ${svgHeight}`)
      .style("touch-action", "none");

    const g = svg.append("g");

    // Zoom/pan
    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.6, 2.5])
        .on("zoom", (ev) => {
          g.attr("transform", ev.transform.toString());
        }) as any
    );

    // Grid (optional)
    if (showGrid) {
      const gridG = g.append("g").attr("opacity", 0.15);
      for (let i = 0; i <= grid.cols; i++) {
        gridG.append("line")
          .attr("x1", i * grid.cell).attr("y1", 0)
          .attr("x2", i * grid.cell).attr("y2", baseHeight)
          .attr("stroke", "var(--ifm-color-emphasis-200)").attr("stroke-dasharray", "4 6");
      }
      for (let j = 0; j <= grid.rows; j++) {
        gridG.append("line")
          .attr("x1", 0).attr("y1", j * grid.cell)
          .attr("x2", width).attr("y2", j * grid.cell)
          .attr("stroke", "var(--ifm-color-emphasis-200)").attr("stroke-dasharray", "4 6");
      }
    }

    // Build segments
    const segments: { color: string; d: string }[] = [];
    data.lines.forEach((ln) => {
      const color = ln.color ?? "var(--ifm-color-primary)";
      ln.segments.forEach(([aId, bId]) => {
        const s = stationMap.get(aId);
        const t = stationMap.get(bId);
        if (!s || !t) return;
        segments.push({ color, d: segmentPath(ln.id, s, t) });
      });
    });

    // Draw casing then color
    g.selectAll("path.casing")
      .data(segments)
      .enter()
      .append("path")
      .attr("class", "casing")
      .attr("d", (d) => d.d)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-width", LINE_CASING)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");

    g.selectAll("path.stroke")
      .data(segments)
      .enter()
      .append("path")
      .attr("class", "stroke")
      .attr("d", (d) => d.d)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", LINE_STROKE)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round");

    // Stations group
    const stationG = g.selectAll("g.station")
      .data(data.stations)
      .enter()
      .append("g")
      .attr("class", "station");

    // Station ring
    stationG.append("circle")
      .attr("r", RING)
      .attr("cx", (s) => P(s).x)
      .attr("cy", (s) => P(s).y)
      .attr("fill", "var(--ifm-background-surface-color)")
      .attr("stroke", "var(--ifm-color-emphasis-300)")
      .attr("stroke-width", 1);

    // Clickable progress dot (✅ no hook calls here—using withBaseUrl())
    stationG
      .append("a")
      .attr("href", (s) => (s.url ? withBaseUrl(s.url) : null))
      .on("click", (_, s: Station) => markComplete(s.url ?? s.id))
      .append("circle")
      .attr("r", 5)
      .attr("cx", (s) => P(s).x)
      .attr("cy", (s) => P(s).y)
      .attr("fill", (s) =>
        isComplete(s.url ?? s.id) ? "var(--ifm-color-success)" : "var(--ifm-color-emphasis-800)"
      );

    // Labels
    stationG
      .append("text")
      .text((s) => s.title)
      .attr("x", (s) => {
        const { x } = P(s);
        return x + (x < width - 80 ? 14 : -14);
      })
      .attr("y", (s) => {
        const { y } = P(s);
        return y + (y > 80 ? -10 : 22);
      })
      .attr("text-anchor", (s) => (P(s).x < width - 80 ? "start" : "end"))
      .attr("font-size", 12)
      .attr("fill", "var(--ifm-font-color-base)");

    return () => {
      containerRef.current && (containerRef.current.innerHTML = "");
    };
  }, [data, svgHeight, width, baseHeight, stationMap, isComplete, markComplete, withBaseUrl]);

  return (
    <div>
      {showLegend && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
          <strong>{title}</strong>
          {data.lines.map((ln) => (
            <span key={ln.id} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 24, height: 6, borderRadius: 3, background: ln.color ?? "var(--ifm-color-primary)" }} />
              <span style={{ fontSize: 12, opacity: 0.8 }}>{ln.name}</span>
            </span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.75 }}>
            • Click a station to open. Filled = completed. Zoom & pan with mouse or touch.
          </span>
        </div>
      )}
      <div ref={containerRef} />
    </div>
  );
}
