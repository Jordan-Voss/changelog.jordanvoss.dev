import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "roadmap-progress-v1";

/** Progress state is a set of completed URLs or Item IDs (prefer URL if present). */
type ProgressIndex = Record<string, true>;

function coerceToProgressIndex(obj: unknown): ProgressIndex {
  // Whatever is in storage, normalize all values to literal `true`
  if (!obj || typeof obj !== "object") return {};
  const keys = Object.keys(obj as Record<string, unknown>);
  return Object.fromEntries(keys.map((k) => [k, true as const])) as ProgressIndex;
}

function load(): ProgressIndex {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    // Ensure values are literal `true` (not boolean)
    return coerceToProgressIndex(JSON.parse(raw));
  } catch {
    return {};
  }
}

function save(idx: ProgressIndex) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idx));
  } catch {
    // ignore quota/SSO private mode errors
  }
}

export function useRoadmapProgress() {
  const [index, setIndex] = useState<ProgressIndex>(() =>
    typeof window === "undefined" ? {} : load()
  );

  useEffect(() => {
    // Keep in sync across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIndex(load());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isComplete = useCallback(
    (key: string | undefined | null) => !!(key && index[key]),
    [index]
  );

  const markComplete = useCallback((key: string | undefined | null) => {
    if (!key) return;
    setIndex((prev) => {
      if (prev[key]) return prev;
      const next = { ...prev, [key]: true as const } as ProgressIndex;
      save(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    const empty = {} as ProgressIndex;
    setIndex(empty);
    save(empty);
  }, []);

  return useMemo(
    () => ({ isComplete, markComplete, clearAll, raw: index }),
    [isComplete, markComplete, clearAll, index]
  );
}
