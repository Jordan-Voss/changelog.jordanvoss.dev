import type { RoadmapItem } from "../types/types";

type Point = { x: number; y: number };
type Positioned = { id: string; position: Point; parentNode?: string };

export function simpleTreeLayout(
  items: RoadmapItem[],
  { levelGap = 200, nodeGap = 140, startX = 0, startY = 0 } = {},
): Record<string, Positioned> {
  // Build adjacency (by parentId) and depth
  const children = new Map<string | undefined, RoadmapItem[]>();
  for (const it of items) {
    const key = it.parentId;
    if (!children.has(key)) children.set(key, []);
    children.get(key)!.push(it);
  }
  for (const list of children.values()) {
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  const pos: Record<string, Positioned> = {};
  let cursorX = startX;

  function placeLevel(levelItems: RoadmapItem[], depth: number) {
    let localX = cursorX;
    const y = startY + depth * levelGap;

    for (const it of levelItems) {
      pos[it.id] = { id: it.id, position: { x: localX, y }, parentNode: it.parentId };
      localX += nodeGap;
      const kids = children.get(it.id) ?? [];
      if (kids.length) {
        placeLevel(kids, depth + 1);
      }
    }
    // Advance global cursor so next root-level branch doesn't overlap
    if (depth === 0) cursorX = Math.max(cursorX, localX + nodeGap);
  }

  const roots = children.get(undefined) ?? children.get(null as any) ?? children.get("") ?? [];
  placeLevel(roots, 0);
  return pos;
}
