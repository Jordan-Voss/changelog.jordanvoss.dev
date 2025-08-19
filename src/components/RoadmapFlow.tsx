import React, { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  Handle,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

type NodeKind = 'main' | 'basic' | 'advanced' | 'concept' | 'skill' | 'milestone';
type Side = 'top' | 'right' | 'bottom' | 'left';

export interface LinkData { title: string; url: string; }
export interface HomeLink { title: string; url: string; }

export interface NodeDataIn {
  id: string;
  label: string;
  kind: NodeKind;
  position: { x: number; y: number };
  links?: LinkData[];     // sub-lesson links
  blurb?: string;         // short description for the modal
  home?: HomeLink;        // section homepage link (overview)
  ports?: Side[];         // optional: limit which ports are active
}

export interface EdgeDataIn {
  id: string;
  source: string;
  target: string;
  type?: string;          // we default to 'step'
  sourceSide?: Side;
  targetSide?: Side;
}

export interface FlowData {
  nodes: NodeDataIn[];
  edges: EdgeDataIn[];
}

interface DynamicFlowProps {
  data?: FlowData;        // <-- make optional for SSR safety
  className?: string;
}

/* ===== Vibrant palette ===== */
const fills: Record<NodeKind, string> = {
  main: '#FFE16A',      // yellow
  basic: '#B9FBC0',     // mint
  advanced: '#FFADAD',  // coral
  concept: '#FFD6A5',   // apricot
  skill: '#CDB4DB',     // lilac
  milestone: '#9BF6FF', // cyan
};
const textColor = '#111';
const borderColor = '#111';

/* ===== Card style ===== */
const getNodeStyle = (kind: NodeKind): React.CSSProperties => ({
  background: fills[kind] || '#e5e7eb',
  color: textColor,
  border: `3px solid ${borderColor}`,
  borderRadius: 12,
  padding: '6px 14px',
  width: 280,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 16,
  lineHeight: 1,
  boxShadow: '0 2px 0 rgba(0,0,0,0.12)',
  position: 'relative',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

/* ===== Custom node with invisible handles ===== */
const hiddenHandle: React.CSSProperties = { width: 10, height: 10, background: 'transparent', border: 'none' };

function PortNode({ data }: { data: NodeDataIn }) {
  const ports = (data.ports?.length ? data.ports : ['top', 'right', 'bottom', 'left']) as Side[];

  const onClick = () => {
    // Dispatch only in browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('roadmap:nodeClick', { detail: data }));
    }
  };

  return (
    <div style={getNodeStyle(data.kind)} onClick={onClick} title={data.label}>
      {data.label}

      {ports.includes('top')    && <Handle id="top"    type="source" position={Position.Top}    style={hiddenHandle} />}
      {ports.includes('right')  && <Handle id="right"  type="source" position={Position.Right}  style={hiddenHandle} />}
      {ports.includes('bottom') && <Handle id="bottom" type="source" position={Position.Bottom} style={hiddenHandle} />}
      {ports.includes('left')   && <Handle id="left"   type="source" position={Position.Left}   style={hiddenHandle} />}

      {ports.includes('top')    && <Handle id="top"    type="target" position={Position.Top}    style={hiddenHandle} />}
      {ports.includes('right')  && <Handle id="right"  type="target" position={Position.Right}  style={hiddenHandle} />}
      {ports.includes('bottom') && <Handle id="bottom" type="target" position={Position.Bottom} style={hiddenHandle} />}
      {ports.includes('left')   && <Handle id="left"   type="target" position={Position.Left}   style={hiddenHandle} />}
    </div>
  );
}

const nodeTypes = { port: PortNode };
const EMPTY: FlowData = { nodes: [], edges: [] };

const toHandleId = (side?: Side): string | undefined =>
  side && ['top', 'right', 'bottom', 'left'].includes(side) ? side : undefined;

/** Client-only inner canvas (actual React Flow) */
function FlowCanvas({ data = EMPTY, className = '' }: DynamicFlowProps) {
  const safeNodes = Array.isArray(data.nodes) ? data.nodes : [];
  const safeEdges = Array.isArray(data.edges) ? data.edges : [];

  const initialNodes: Node<NodeDataIn>[] = useMemo(
    () => safeNodes.map((n) => ({ id: n.id, type: 'port', position: n.position, data: n })),
    [safeNodes],
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      safeEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: e.type || 'step',                      // right-angled
        animated: false,
        style: { stroke: '#111', strokeWidth: 3 },   // bold black
        sourceHandle: toHandleId(e.sourceSide),
        targetHandle: toHandleId(e.targetSide),
      })),
    [safeEdges],
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: 'step', style: { stroke: '#111', strokeWidth: 3 } }, eds)),
    [setEdges],
  );

  /* Modal state + event wiring (browser only) */
  const [modalNode, setModalNode] = useState<NodeDataIn | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: Event) => setModalNode((e as CustomEvent<NodeDataIn>).detail || null);
    document.addEventListener('roadmap:nodeClick', handler);
    return () => document.removeEventListener('roadmap:nodeClick', handler);
  }, []);

  /* Copy JSON (browser only) */
  const copyJson = useCallback(() => {
    const byId = Object.fromEntries(safeNodes.map((n) => [n.id, n]));
    const exportNodes = nodes.map((n) => {
      const orig = byId[n.id];
      return {
        id: n.id,
        label: orig?.label ?? '',
        kind: orig?.kind ?? 'basic',
        position: n.position,
        links: orig?.links,
        blurb: orig?.blurb,
        home: orig?.home,
        ports: orig?.ports,
      };
    });
    const exportEdges = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: (e.type as string) || 'step',
      sourceSide: (e as any).sourceHandle,
      targetSide: (e as any).targetHandle,
    }));
    const json = JSON.stringify({ nodes: exportNodes, edges: exportEdges }, null, 2);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(json);
        // eslint-disable-next-line no-alert
        alert('Roadmap JSON copied to clipboard!');
      } else {
        // Fallback: temporary textarea
        const ta = document.createElement('textarea');
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        // eslint-disable-next-line no-alert
        alert('Roadmap JSON copied to clipboard!');
      }
    } catch {
      // eslint-disable-next-line no-alert
      alert('Could not copy to clipboard in this environment.');
    }
  }, [nodes, edges, safeNodes]);

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <button
        onClick={copyJson}
        style={{
          position: 'absolute', top: 10, right: 10, zIndex: 10,
          background: '#111', color: 'white', padding: '6px 12px',
          borderRadius: 8, fontWeight: 700, border: '2px solid #111', cursor: 'pointer',
        }}
      >
        Copy JSON
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onInit={(instance) => {
          // run once on mount to mimic "fitViewOnInit"
          instance.fitView({ padding: 0.2 });
        }}
      >
        <Controls style={{ background: 'white', border: '2px solid #111', borderRadius: 8 }} />
        <MiniMap
          style={{ background: 'white', border: '2px solid #111', borderRadius: 8 }}
          nodeColor={(n) => fills[(n.data as NodeDataIn).kind] || '#e5e7eb'}
          maskColor="rgba(0,0,0,0.05)"
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
      </ReactFlow>

      {/* Modal */}
      {modalNode && (
        <div
          onClick={() => setModalNode(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white', border: '3px solid #111', borderRadius: 12,
              padding: 18, minWidth: 340, maxWidth: 520, boxShadow: '0 10px 0 rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            {/* Header row: title + home button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{modalNode.label}</h2>

              {modalNode.home && (
                <a
                  href={modalNode.home.url}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 9999,
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    color: '#111',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {modalNode.home.title}
                </a>
              )}
            </div>

            {/* Blurb */}
            {modalNode.blurb && (
              <p style={{ marginTop: 12, marginBottom: 16, color: '#374151' }}>{modalNode.blurb}</p>
            )}

            {/* Sub-lessons */}
            <div>
              {modalNode.links?.length ? (
                modalNode.links.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    style={{
                      display: 'block',
                      padding: '8px 10px',
                      marginBottom: 8,
                      border: '2px solid #111',
                      borderRadius: 8,
                      textDecoration: 'none',
                      color: '#111',
                      background: '#FFF',
                      fontWeight: 700,
                    }}
                  >
                    {l.title}
                  </a>
                ))
              ) : (
                <div style={{ color: '#6b7280' }}>No lessons linked yet.</div>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <button
                onClick={() => setModalNode(null)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '2px solid #111',
                  background: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Exported component: SSR-safe wrapper */
export default function DynamicFlow(props: DynamicFlowProps) {
  const isClient = typeof window !== 'undefined';
  if (!isClient) {
    // SSR: render a non-crashing placeholder (no ReactFlow, no window usage)
    return <div style={{ width: '100%', height: '100%' }} />;
  }
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}