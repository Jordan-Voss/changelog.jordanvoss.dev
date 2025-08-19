import React from "react";
import Link from "@docusaurus/Link";
import { useRoadmapProgress } from "@site/src/components/useRoadmapProgress";

export type TimelineItem = {
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  meta?: { tags?: string[]; note?: string };
};

export type TimelineSection = {
  id: string;
  title: string;     // e.g., "Foundations", "Projects", "Advanced"
  items: TimelineItem[];
};

type Props = {
  sections: TimelineSection[];
  /** If true, shows a slim bar under completed items */
  showProgressBar?: boolean;
};

export default function CareerTimeline({ sections, showProgressBar = true }: Props) {
  const { isComplete, markComplete } = useRoadmapProgress();

  return (
    <div style={{ width: "100%" }}>
      {sections.map((section) => (
        <div key={section.id} style={{ marginBottom: 28 }}>
          <h3 style={{ marginBottom: 12 }}>{section.title}</h3>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridAutoColumns: "minmax(240px, 320px)",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              scrollSnapType: "x mandatory",
            }}
          >
            {section.items.map((it, idx) => {
              const done = isComplete(it.url ?? it.id);
              return (
                <article
                  key={it.id}
                  style={{
                    scrollSnapAlign: "start",
                    border: "1px solid var(--ifm-color-emphasis-300)",
                    borderRadius: 12,
                    padding: 16,
                    background: done
                      ? "var(--ifm-color-success-contrast-background)"
                      : "var(--ifm-background-surface-color)",
                    boxShadow: "var(--ifm-global-shadow-lw)",
                    position: "relative",
                  }}
                >
                  {/* milestone dot + connector */}
                  <div style={{ position: "absolute", top: -10, left: 16, display: "flex", alignItems: "center" }}>
                    <span
                      aria-hidden
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: done ? "var(--ifm-color-success)" : "var(--ifm-color-emphasis-700)",
                        display: "inline-block",
                        marginRight: 8,
                      }}
                    />
                    <span style={{ fontSize: 12, opacity: 0.7 }}>Step {idx + 1}</span>
                  </div>

                  <h4 style={{ marginTop: 8, marginBottom: 6 }}>{it.title}</h4>
                  {it.subtitle && <div style={{ fontSize: 13, opacity: 0.8 }}>{it.subtitle}</div>}

                  {it.meta?.tags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {it.meta.tags.map((t) => (
                        <span key={t} style={{ fontSize: 11, padding: "2px 6px", borderRadius: 6, border: "1px solid var(--ifm-color-emphasis-300)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {it.url ? (
                      <Link
                        to={it.url}
                        className="button button--sm button--primary"
                        onClick={() => markComplete(it.url ?? it.id)}
                      >
                        Open
                      </Link>
                    ) : null}

                    {!done && (
                      <button
                        className="button button--sm button--secondary"
                        onClick={() => markComplete(it.url ?? it.id)}
                      >
                        Mark done
                      </button>
                    )}
                    {done && <span style={{ fontSize: 12, alignSelf: "center" }}>✓ Completed</span>}
                  </div>

                  {showProgressBar && (
                    <div style={{ marginTop: 12, height: 3, width: "100%", background: "var(--ifm-color-emphasis-200)", borderRadius: 999 }}>
                      <div
                        style={{
                          height: "100%",
                          width: done ? "100%" : "0%",
                          background: "var(--ifm-color-success)",
                          borderRadius: 999,
                          transition: "width .3s ease",
                        }}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
