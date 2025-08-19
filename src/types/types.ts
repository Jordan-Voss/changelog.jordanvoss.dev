export type RoadmapJson = {
    version: "1.0";
    items: RoadmapItem[];
    edges?: EdgeSpec[];
  };
  
  export type RoadmapItem = {
    id: string;
    title: string;
    kind: "topic" | "page" | "group";
    parentId?: string;
    url?: string;
    order?: number;
    groupId?: string;
    collapsed?: boolean;
    meta?: {
      status?: "todo" | "in-progress" | "done";
      difficulty?: "beginner" | "intermediate" | "advanced";
      tags?: string[];
      icon?: string;
    };
    /** New: persisted layout */
    layout?: { x: number; y: number };
  };
  
  
  export type EdgeSpec = {
    id?: string;
    source: string;
    target: string;
    kind?: "prereq" | "related";
    label?: string;
  };
  