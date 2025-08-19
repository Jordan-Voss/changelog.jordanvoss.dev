import React, { useEffect } from 'react';

export default function MarkRead({ url }: { url: string }) {
  useEffect(() => {
    try {
      const key = 'roadmap-progress-v1';
      const raw = localStorage.getItem(key);
      const idx = raw ? JSON.parse(raw) : {};
      idx[url] = true;
      localStorage.setItem(key, JSON.stringify(idx));
    } catch {}
  }, [url]);

  return null;
}

// Usage in a lesson MDX page:
// <MarkRead url="/roadmap/java/basics/variables#types" />
