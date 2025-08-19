import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";
import { useRoadmapProgress } from "./useRoadmapProgress";

/**
 * Mount this inside your Doc layout to auto-mark completion when a doc is viewed.
 * It uses the current pathname as the progress key.
 */
export default function DocReadTracker() {
  const { pathname } = useLocation();
  const { markComplete } = useRoadmapProgress();

  useEffect(() => {
    // Only mark docs (adjust prefix if your docs basePath differs)
    // e.g. if your docs live at /docs, check pathname.startsWith('/docs')
    markComplete(pathname);
  }, [pathname, markComplete]);

  return null;
}
