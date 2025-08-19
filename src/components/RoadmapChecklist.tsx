import React, { useMemo, useState, useCallback } from 'react';
import roadmapData from '@site/src/data/roadmapData.json';
import ReactFlow, {
  Background,
  MiniMap,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
  Handle,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

type RoadmapNodeJson = {
  id: string;
  label: string;
  url?: string;
  position: { x: number; y: number };
  group?: string;     // visual grouping section (e.g., "Java Basics", "Spring & Microservices")
  isGroup?: boolean;  // true for header/group nodes (no checkbox)
};

type RoadmapEdgeJson = {
  id?: string;
  source: string;
  target: string;
};

type TaskData = {
  id: string;
  label: string;
  url?: string;
  done?: boolean;
};

type GroupData = {
  label: string;
};

const DATA: any = roadmapData ?? {};
const VERSION = String(DATA.version ?? 'v0');
const STORAGE_KEY = `roadmap-checklist:${VERSION}`;

/* ---------------------------
   Completion state (persisted)
---------------------------- */
function useCompletion(ids: string[]) {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const isDone = useCallback((id: string) => !!completed[id], [completed]);

  const toggle = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { isDone, toggle };
}

/* ---------------------------
   Custom Node Components
---------------------------- */
function TaskNode({ data }: { data: TaskData }) {
  const { id, label, url, done } = data;

  return (
    <div
      style={{
        border: `2px solid ${done ? 'var(--ifm-color-success)' : '#c9ced6'}`,
        background: done ? 'rgba(34,197,94,0.08)' : '#fff',
        padding: 10,
        borderRadius: 12,
        width: 230,
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 14,
      }}
    >
      <input
        type="checkbox"
        checked={!!done}
        // onChange handled in parent via node internals updater
        readOnly
      />
      {url ? (
        <a
          href={url}
          style={{ textDecoration: 'none', fontWeight: 600, color: 'inherit', opacity: done ? 0.75 : 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {label}
        </a>
      ) : (
        <span style={{ fontWeight: 600, opacity: done ? 0.75 : 1 }}>{label}</span>
      )}
      {/* Handles (optional, keep for nicer edge anchors) */}
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  );
}

function GroupNode({ data }: { data: GroupData }) {
  return (
    <div
      style={{
        border: '2px dashed #c9ced6',
        background: '#fafafa',
        padding: '12px 14px',
        borderRadius: 14,
        width: 240,
        boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
        fontWeight: 700,
        textAlign: 'center',
      }}
    >
      {data.label}
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  );
}

const nodeTypes = {
  task: TaskNode,
  group: GroupNode,
};

/* ---------------------------
   Main Component
---------------------------- */
export default function RoadmapFlow() {
  const nodesJson = (Array.isArray(DATA.nodes) ? DATA.nodes : []) as RoadmapNodeJson[];
  const edgesJson = (Array.isArray(DATA.edges) ? DATA.edges : []) as RoadmapEdgeJson[];

  const allIds = useMemo(() => nodesJson.map((n) => n.id), [nodesJson]);
  const { isDone, toggle } = useCompletion(allIds);

  // Build initial ReactFlow nodes
  const rfNodes: Node[] = useMemo(
    () =>
      nodesJson.map((n) => {
        const type = n.isGroup ? 'group' : 'task';
        return {
          id: n.id,
          type,
          position: n.position ?? { x: 0, y: 0 },
          draggable: false, // keep layout fixed
          selectable: false,
          data: n.isGroup
            ? ({ label: n.label } as GroupData)
            : ({ id: n.id, label: n.label, url: n.url, done: isDone(n.id) } as TaskData),
        };
      }),
    [nodesJson, isDone]
  );

  const rfEdges: Edge[] = useMemo(
    () =>
      edgesJson.map((e, idx) => ({
        id: e.id ?? `e-${idx}`,
        source: e.source,
        target: e.target,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      })),
    [edgesJson]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, , onEdgesChange] = useEdgesState(rfEdges);

  // Wiring checkbox clicks: capture clicks on the TaskNode checkbox by using node internals updater
  // We’ll intercept clicks on the node itself and toggle if click was on the checkbox.
  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      if (node.type !== 'task') return;

      // Find the real checkbox inside the rendered node (not ideal, but simple and reliable)
      // Instead of querying DOM, we can toggle on click anywhere on the left side where checkbox sits.
      // Safer: toggle only if metaKey/shiftKey not pressed.
      toggle(node.id);

      // Update that single node's data.done to re-render visual state
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? {
                ...n,
                data: { ...(n.data as TaskData), done: !((n.data as TaskData).done) },
                style: n.style, // unchanged
              }
            : n
        )
      );
    },
    [setNodes, toggle]
  );

  return (
    <div style={{ height: '85vh', backgroundColor: '#fdfdfd', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '10px 12px', fontWeight: 700, fontSize: 14 }}>
        Drag to pan • Scroll to zoom • Click a node to toggle completion
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll
        zoomOnPinch
        panOnScroll
        panOnDrag
      >
        <Background color="#e5e7eb" gap={20} />
        <MiniMap nodeColor={(n) => (n.type === 'group' ? '#9ca3af' : (n.data as any)?.done ? '#22c55e' : '#94a3b8')} />
      </ReactFlow>
    </div>
  );
}
