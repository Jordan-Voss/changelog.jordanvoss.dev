import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "@docusaurus/Link";

/* -------------------- Types -------------------- */

export type RoadmapItem = {
  id: string;
  title: string;
  url?: string;          // doc link
  description?: string;  // small helper text
};

export type RoadmapSection = {
  id: string;
  title: string;
  side: "left" | "right";  // which column
  items: RoadmapItem[];
};

export type CardMapData = {
  title: string;             // center title, e.g., "Java"
  ctaLeft?: { label: string; url: string };
  ctaRight?: { label: string; url: string };
  centerAction?: { label: string; url: string }; // e.g., "Learn the Basics"
  sections: RoadmapSection[];                    // split by side
};

/* -------------------- tiny progress hook -------------------- */

const STORAGE_KEY = "cardmap-progress-v1";
type ProgressIndex = Record<string, true>;

function loadProgress(): ProgressIndex {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? (JSON.parse(r) as ProgressIndex) : {};
  } catch {
    return {};
  }
}
function saveProgress(p: ProgressIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}
function useProgress() {
  const [idx, setIdx] = useState<ProgressIndex>(() =>
    typeof window === "undefined" ? {} : loadProgress()
  );
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIdx(loadProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const isDone = (id?: string) => !!(id && idx[id]);
  const toggle = (id?: string) => {
    if (!id) return;
    setIdx((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      saveProgress(next);
      return next;
    });
  };
  return { isDone, toggle, raw: idx };
}

/* -------------------- Component -------------------- */

export default function JavaSubwayMap({
  data,
  heightVh = 70,
}: {
  data: CardMapData;
  heightVh?: number;
}) {
  const { isDone, toggle } = useProgress();

  const left = useMemo(
    () => data.sections.filter((s) => s.side === "left"),
    [data.sections]
  );
  const right = useMemo(
    () => data.sections.filter((s) => s.side === "right"),
    [data.sections]
  );

  // layout constants
  const gutter = 28;                 // gap inside columns
  const cardH = 44;                  // approx row height per item
  const headerH = 40;
  const boxPad = 12;
  const columnWidth = 320;

  // compute column heights to size connector SVG
  function colHeight(sections: RoadmapSection[]) {
    return sections.reduce(
      (acc, s) => acc + headerH + s.items.length * (cardH + 10) + boxPad * 2 + 18,
      0
    );
  }

  const leftH = Math.max(160, colHeight(left));
  const rightH = Math.max(160, colHeight(right));
  const svgH = Math.max(leftH, rightH) + 60;

  // positions used for connectors
  const centerY = Math.round(svgH / 2);
  const centerXLeft = 380;                  // from left edge of the SVG
  const centerXRight = columnWidth + 380;   // visually balanced
  const railInset = 24;

  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: `1fr minmax(${columnWidth}px, ${columnWidth}px) minmax(260px, 360px) minmax(${columnWidth}px, ${columnWidth}px) 1fr`,
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* Left CTA */}
      <div style={{ gridColumn: "1 / 2", justifySelf: "end" }}>
        {data.ctaLeft && (
          <CardPanel title="" tone="muted">
            <CTAButton label={data.ctaLeft.label} url={data.ctaLeft.url} />
          </CardPanel>
        )}
      </div>

      {/* Left Column */}
      <div style={{ gridColumn: "2 / 3" }}>
        <ColumnBox title=" " heightPx={leftH}>
          {left.map((sec) => (
            <Section key={sec.id} title={sec.title}>
              {sec.items.map((it) => (
                <RoadmapCard
                  key={it.id}
                  item={it}
                  done={isDone(it.id)}
                  onToggle={() => toggle(it.id)}
                />
              ))}
            </Section>
          ))}
        </ColumnBox>
      </div>

      {/* Center rail + title */}
      <div style={{ gridColumn: "3 / 4", alignSelf: "stretch" }}>
        <div
          style={{
            display: "grid",
            gridTemplateRows: `auto 1fr`,
            alignItems: "start",
            justifyItems: "center",
            height: `min(${heightVh}vh, ${svgH + 160}px)`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{data.title}</div>
          </div>

          <div style={{ position: "relative", width: "100%", height: `${svgH}px` }}>
            {/* vertical center rail */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: 0,
                bottom: 0,
                width: 6,
                borderRadius: 3,
                background: "var(--ifm-color-primary)",
              }}
            />
            {/* center button */}
            {data.centerAction && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: centerY - 20,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
                <Link
                  to={data.centerAction.url}
                  className="button button--sm button--warning"
                  style={{ borderRadius: 6, fontWeight: 700 }}
                >
                  {data.centerAction.label}
                </Link>
              </div>
            )}

            {/* dotted connectors to left */}
            <svg
              width="100%"
              height={svgH}
              viewBox={`0 0 ${centerXLeft + columnWidth + 40} ${svgH}`}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              {connectorsFor(left, {
                startX: centerXLeft,
                startY: centerY,
                dir: "left",
                cardH,
                headerH,
                boxPad,
                gutter,
                columnWidth,
                railInset,
              })}
            </svg>

            {/* dotted connectors to right */}
            <svg
              width="100%"
              height={svgH}
              viewBox={`0 0 ${centerXRight + columnWidth + 40} ${svgH}`}
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              {connectorsFor(right, {
                startX: centerXRight,
                startY: centerY,
                dir: "right",
                cardH,
                headerH,
                boxPad,
                gutter,
                columnWidth,
                railInset,
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ gridColumn: "4 / 5" }}>
        <ColumnBox title=" " heightPx={rightH}>
          {right.map((sec) => (
            <Section key={sec.id} title={sec.title}>
              {sec.items.map((it) => (
                <RoadmapCard
                  key={it.id}
                  item={it}
                  done={isDone(it.id)}
                  onToggle={() => toggle(it.id)}
                />
              ))}
            </Section>
          ))}
        </ColumnBox>
      </div>

      {/* Right CTA */}
      <div style={{ gridColumn: "5 / 6" }}>
        {data.ctaRight && (
          <CardPanel title="" tone="primary">
            <CTAButton label={data.ctaRight.label} url={data.ctaRight.url} />
          </CardPanel>
        )}
      </div>
    </div>
  );
}

/* -------------------- Pieces -------------------- */

function ColumnBox({
  title,
  heightPx,
  children,
}: {
  title: string;
  heightPx: number;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-label={title}
      style={{
        border: "2.7px solid #000",
        borderRadius: 8,
        padding: 12,
        background: "var(--ifm-background-surface-color)",
        height: heightPx,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gap: 18 }}>{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </div>
  );
}

function RoadmapCard({
  item,
  done,
  onToggle,
}: {
  item: RoadmapItem;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="group"
      aria-label={item.title}
      style={{
        border: "2.7px solid #000",
        borderRadius: 8,
        padding: "10px 12px",
        background: "rgb(255,229,153)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div>
        {item.url ? (
          <Link to={item.url} style={{ fontWeight: 700 }}>
            {item.title}
          </Link>
        ) : (
          <span style={{ fontWeight: 700 }}>{item.title}</span>
        )}
        {item.description && (
          <div style={{ fontSize: 12, opacity: 0.75 }}>{item.description}</div>
        )}
      </div>
      <label style={{ fontSize: 12, userSelect: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <input type="checkbox" checked={done} onChange={onToggle} />
        Done
      </label>
    </div>
  );
}

function CardPanel({
  title,
  tone = "muted",
  children,
}: {
  title: string;
  tone?: "muted" | "primary";
  children: React.ReactNode;
}) {
  const bg =
    tone === "primary" ? "var(--ifm-color-primary)" : "var(--ifm-color-emphasis-200)";
  const fg = tone === "primary" ? "#fff" : "var(--ifm-font-color-base)";
  return (
    <div
      style={{
        border: "2.7px solid #000",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
        width: 360,
      }}
    >
      {title && <div style={{ marginBottom: 8, fontWeight: 700 }}>{title}</div>}
      <div
        style={{
          background: bg,
          color: fg,
          borderRadius: 8,
          padding: 12,
          textAlign: "center",
          fontWeight: 700,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function CTAButton({ label, url }: { label: string; url: string }) {
  return (
    <Link className="button button--secondary button--sm" to={url} style={{ fontWeight: 700 }}>
      {label}
    </Link>
  );
}

/* -------------------- Connectors -------------------- */

function connectorsFor(
  sections: RoadmapSection[],
  opts: {
    startX: number;
    startY: number;
    dir: "left" | "right";
    cardH: number;
    headerH: number;
    boxPad: number;
    gutter: number;
    columnWidth: number;
    railInset: number;
  }
) {
  const {
    startX,
    startY,
    dir,
    cardH,
    headerH,
    boxPad,
    gutter,
    columnWidth,
    railInset,
  } = opts;

  const paths: JSX.Element[] = [];

  // where the first section box starts vertically
  let y = 20;

  sections.forEach((sec, si) => {
    const secHeight =
      headerH + sec.items.length * (cardH + 10) + boxPad * 2 + 18;

    // Connector target: approximate center of section header edge nearest to center
    const targetY = y + 10 + headerH / 2;
    const targetX =
      dir === "left" ? startX - (railInset + columnWidth) : startX + (railInset + columnWidth);

    const ctrl1X = dir === "left" ? startX - 40 : startX + 40;
    const ctrl2X = dir === "left" ? targetX + 40 : targetX - 40;

    const d = `M ${startX} ${startY}
               C ${ctrl1X} ${startY}, ${ctrl2X} ${targetY}, ${targetX} ${targetY}`;

    paths.push(
      <path
        key={`${sec.id}-${si}`}
        d={d}
        fill="none"
        stroke="#2b78e4"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
    );

    y += secHeight + gutter;
  });

  return <>{paths}</>;
}
