import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Network } from "lucide-react";

/*
===============================================================================
GraphMap
- Works with NORMALIZED data from VisualizerPane
- Supports:
  1) Real backend graph (adjacency + visited)
  2) graph_detected only → fallback
  3) No graph → fallback animation
===============================================================================
*/

export function GraphMap({
  graph,        // ✅ normalized.graph
  currentStep,
  isExecuted,
}) {
  const [adjacency, setAdjacency] = useState(null);
  const [visited, setVisited] = useState([]);
  const [useBackend, setUseBackend] = useState(false);

  /* ============================================================================
      STEP 1 — LOAD BACKEND GRAPH DATA (SAFE)
  ============================================================================ */
  useEffect(() => {
    if (!graph) {
      setUseBackend(false);
      setAdjacency(null);
      setVisited([]);
      return;
    }

    // Full backend graph
    if (graph.adjacency && Array.isArray(graph.visited)) {
      setAdjacency(graph.adjacency);
      setVisited(graph.visited);
      setUseBackend(true);
      return;
    }

    // Graph detected but not implemented
    if (graph.detected) {
      setUseBackend(false);
      setAdjacency(null);
      setVisited([]);
      return;
    }
  }, [graph]);

  /* ============================================================================
      CASE 1 — NOT EXECUTED
  ============================================================================ */
  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Click <b>Debug</b> to visualize graph traversal
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================================
      STATIC NODE LAYOUT (UNCHANGED UI)
  ============================================================================ */
  const layout = [
    { id: 0, x: 200, y: 150 },
    { id: 1, x: 300, y: 150 },
    { id: 2, x: 400, y: 100 },
    { id: 3, x: 400, y: 200 },
    { id: 4, x: 500, y: 150 },
    { id: 5, x: 600, y: 100 },
    { id: 6, x: 600, y: 200 },
    { id: 7, x: 700, y: 150 },
  ];

  /* ============================================================================
      CASE 2 — BACKEND GRAPH MODE
  ============================================================================ */
  if (useBackend && adjacency) {
    const edges = [];

    Object.keys(adjacency).forEach((from) => {
      adjacency[from].forEach((to) => {
        edges.push({ from: Number(from), to: Number(to) });
      });
    });

    return (
      <ScrollArea className="h-full p-6">
        <div className="flex flex-col gap-8">

          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto border border-border rounded-lg bg-background"
          >
            {/* ---------------- EDGES ---------------- */}
            <g stroke="hsl(220,12%,18%)" strokeWidth="2">
              {edges.map((e, i) => {
                const A = layout.find(n => n.id === e.from);
                const B = layout.find(n => n.id === e.to);
                if (!A || !B) return null;

                return (
                  <line
                    key={i}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    opacity={
                      visited.includes(e.from) &&
                      visited.includes(e.to)
                        ? 1
                        : 0.3
                    }
                  />
                );
              })}
            </g>

            {/* ---------------- NODES ---------------- */}
            <g>
              {layout.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={
                      visited.includes(node.id)
                        ? "hsl(308,75%,60%)"
                        : "hsl(220,10%,25%)"
                    }
                    stroke={
                      visited.includes(node.id)
                        ? "hsl(308,75%,60%)"
                        : "hsl(220,12%,18%)"
                    }
                    strokeWidth="3"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={visited.includes(node.id) ? "white" : "hsl(220,10%,60%)"}
                    fontFamily="monospace"
                    fontSize="16"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </g>

            {/* ---------------- INFO ---------------- */}
            <g>
              <rect
                x="50"
                y="350"
                width="700"
                height="80"
                rx="8"
                fill="hsl(188,90%,60%)"
                fillOpacity="0.1"
                stroke="hsl(188,90%,60%)"
                strokeWidth="2"
              />
              <text x="400" y="375" textAnchor="middle"
                    fill="hsl(188,90%,60%)" fontWeight="bold">
                Graph Traversal (Backend)
              </text>
              <text x="400" y="395" textAnchor="middle" fill="white">
                Visited: [{visited.join(", ")}]
              </text>
              <text x="400" y="415" textAnchor="middle" fill="white">
                Traversal in progress...
              </text>
            </g>
          </svg>

          {/* GRID */}
          <div className="grid grid-cols-4 gap-4">
            {layout.map(n => (
              <div
                key={n.id}
                className={`aspect-square rounded-full border-2 flex items-center justify-center text-lg font-semibold ${
                  visited.includes(n.id)
                    ? "border-tertiary bg-tertiary/20 text-tertiary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {n.id}
              </div>
            ))}
          </div>

        </div>
      </ScrollArea>
    );
  }

  /* ============================================================================
      CASE 3 — FALLBACK MODE (YOUR ORIGINAL ANIMATION)
  ============================================================================ */
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    visited: i < Math.min(currentStep, 8),
  }));

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto border border-border rounded-lg bg-background"
        >
          <g>
            {layout.map((n, i) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="25"
                  fill={nodes[i].visited ? "hsl(308,75%,60%)" : "hsl(220,10%,25%)"}
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fill="white"
                >
                  {n.id}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </ScrollArea>
  );
}
