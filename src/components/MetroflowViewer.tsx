import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import { useRoadmapProgress } from "@site/src/components/useRoadmapProgress";

/** Types that match Metroflow JSON shape (minimal) */
type MFPoint = { position: { x: number; y: number }; id: string; name: string; offsetFactor: number | null };
type MFSegment = {
  stationA: MFPoint;
  stationB: MFPoint;
  stationsUser: MFPoint[];
  stationsAuto: MFPoint[];
  id: string;
};
type MFStyle = {
  strokeColor: string;
  strokeWidth: number;
  selectionColor?: string;
  fullySelected?: boolean;
  stationRadius?: number;
  fillColor?: string;
};
type MFTrack = {
  id: string;
  segmentStyle: MFStyle;
  stationStyle: MFStyle;
  segments: MFSegment[];
  stationsMinor: any[];
};
type MFConnection = { stationA: string; stationB: string; id?: string };
export type MetroflowJSON = { tracks: MFTrack[]; connections?: MFConnection[] };

/** Optional metadata to enrich Metroflow stations with labels/urls/overrides */
export type StationMeta = {
  /** Human label (defaults to the Metroflow point's `name` or empty) */
  title?: string;
  /** Docusaurus doc URL to open when clicked */
  url?: string;
  /** Optional override for ring size (px) */
  radius?: number;
  /** Optional explicit color for station ring */
  color?: string;
};
export type MetaMap = Record<string, StationMeta>;

type Props = {
  data: MetroflowJSON;
  meta?: MetaMap;
  title?: string;
  height?: number;         // default: auto based on content bbox
  showLegend?: boolean;    // legend uses track colors (no names in Metroflow export)
  showConnections?: boolean; // draw connections[] as light links
};

/** A simple Metroflow JSON renderer with zoom/pan, progress, and labels */
export default function MetroflowViewer({
  data,
  meta = {},
  title = "Metroflow Map",
  height,
  showLegend = true,
  showConnections = true,
}: Props) {
  const { withBaseUrl } = useBaseUrlUtils();             // safe function (not a hook)
  const { isComplete, markComplete } = useRoadmapProgress();
  const ref = useRef<HTMLDivElement | null>(null);

  /** Flatten all points & figure out bounds */
  const { stationsIndex, bbox } = useMemo(() => {
    type NodeRef = { id: string; x: number; y: number; user: boolean; trackId: string };
    const idx = new Map<string, { x: number; y: number; user: boolean; refs: NodeRef[] }>();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    function touch(p: MFPoint, user: boolean, trackId: string) {
      const x = p.position.x;
      const y = p.position.y;
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      const prev = idx.get(p.id);
      const ref: NodeRef = { id: p.id, x, y, user, trackId };
      if (!prev) {
        idx.set(p.id, { x, y, user, refs: [ref] });
      } else {
        // Prefer user=true if any reference is a user station
        prev.user = prev.user || user;
        prev.refs.
