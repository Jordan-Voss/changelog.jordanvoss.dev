import React from 'react';
import roadmapData from '../data/roadmapData.json';
import ReactFlow, {
  Background,
  MiniMap,
  Controls,
  MarkerType,
  Position,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

function mapNodes(nodes: any[]): Node[] {
  return nodes.map((node) => ({
    ...node,
    data: {
      label: <a href={node.data.url}>{node.data.label}</a>,
    },
    sourcePosition: node.sourcePosition || Position.Right,
    targetPosition: node.targetPosition || Position.Left,
  }));
}

function mapEdges(edges: any[]): Edge[] {
  return edges.map((edge) => ({
    ...edge,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));
}

export default function RoadmapFlow() {
  const [nodes, , onNodesChange] = useNodesState(mapNodes(roadmapData.nodes));
  const [edges, , onEdgesChange] = useEdgesState(mapEdges(roadmapData.edges));

  return (
    <div style={{ height: '85vh', backgroundColor: '#fdfdfd' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#ccc" gap={20} />
        <MiniMap nodeColor={() => '#888'} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
