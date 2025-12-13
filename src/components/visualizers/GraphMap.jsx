// import React, { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Network } from "lucide-react";

// export function GraphMap({ debugData, currentStep, isExecuted }) {
//   const [graphData, setGraphData] = useState(null);
//   const [visited, setVisited] = useState([]);

//   useEffect(() => {
//     if (debugData?.graph) {
//       setGraphData(debugData.graph.adjacency || debugData.graph);
//       setVisited(debugData.graph.visited || []);
//     }
//   }, [debugData]);

//   /* --------------------------- NO EXECUTION --------------------------- */
//   if (!isExecuted || !graphData) {
//     return (
//       <div className="h-full flex items-center justify-center p-6">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
//             <Network className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <p className="text-muted-foreground">Debug code to visualize graph traversal</p>
//         </div>
//       </div>
//     );
//   }

//   /* ---------------------- STATIC UI NODE POSITIONS ---------------------- */
//   const layout = [
//     { id: 0, x: 200, y: 150 },
//     { id: 1, x: 300, y: 150 },
//     { id: 2, x: 400, y: 100 },
//     { id: 3, x: 400, y: 200 },
//     { id: 4, x: 500, y: 150 },
//     { id: 5, x: 600, y: 100 },
//     { id: 6, x: 600, y: 200 },
//     { id: 7, x: 700, y: 150 },
//   ];

//   const isVisited = (id) => visited.includes(id);

//   /* ----------------------- EDGE LIST FROM BACKEND ----------------------- */
//   const edges = [];
//   for (let from in graphData) {
//     graphData[from].forEach((to) => {
//       edges.push({ from: Number(from), to: Number(to) });
//     });
//   }

//   /* ------------------------------ RENDER UI ------------------------------ */
//   return (
//     <ScrollArea className="h-full p-6">
//       <div className="flex flex-col gap-8 w-full">

//         {/* ======================= SVG GRAPH ======================= */}
//         <div className="w-full">
//           <svg
//             viewBox="0 0 800 500"
//             className="w-full h-auto border border-border rounded-lg bg-background"
//           >
//             {/* ---------------- EDGES ---------------- */}
//             <g stroke="hsl(220, 12%, 18%)" strokeWidth="2">
//               {edges.map((e, i) => {
//                 const A = layout.find((n) => n.id === e.from);
//                 const B = layout.find((n) => n.id === e.to);

//                 if (!A || !B) return null;

//                 const visible = isVisited(e.from) && isVisited(e.to);

//                 return (
//                   <line
//                     key={i}
//                     x1={A.x}
//                     y1={A.y}
//                     x2={B.x}
//                     y2={B.y}
//                     opacity={visible ? 1 : 0.3}
//                   />
//                 );
//               })}
//             </g>

//             {/* ---------------- NODES ---------------- */}
//             <g>
//               {layout.map((node) => (
//                 <g key={node.id}>
//                   <circle
//                     cx={node.x}
//                     cy={node.y}
//                     r="25"
//                     fill={
//                       isVisited(node.id)
//                         ? "hsl(308, 75%, 60%)"
//                         : "hsl(220, 10%, 25%)"
//                     }
//                     stroke={
//                       isVisited(node.id)
//                         ? "hsl(308, 75%, 60%)"
//                         : "hsl(220, 12%, 18%)"
//                     }
//                     strokeWidth="3"
//                   />
//                   <text
//                     x={node.x}
//                     y={node.y + 5}
//                     textAnchor="middle"
//                     fill={
//                       isVisited(node.id)
//                         ? "white"
//                         : "hsl(220, 10%, 60%)"
//                     }
//                     fontSize="16"
//                     fontFamily="monospace"
//                   >
//                     {node.id}
//                   </text>
//                 </g>
//               ))}
//             </g>

//             {/* ---------------- BFS INFO BOX ---------------- */}
//             <g>
//               <rect
//                 x="50"
//                 y="350"
//                 width="700"
//                 height="80"
//                 fill="hsl(188, 90%, 60%)"
//                 fillOpacity="0.1"
//                 stroke="hsl(188, 90%, 60%)"
//                 strokeWidth="2"
//                 rx="8"
//               />

//               <text
//                 x="400"
//                 y="375"
//                 textAnchor="middle"
//                 fill="hsl(188, 90%, 60%)"
//                 fontSize="14"
//                 fontWeight="bold"
//               >
//                 Graph Traversal (BFS / DFS)
//               </text>

//               <text
//                 x="400"
//                 y="395"
//                 textAnchor="middle"
//                 fill="white"
//                 fontSize="12"
//                 fontFamily="monospace"
//               >
//                 Visited: [{visited.join(", ")}]
//               </text>

//               <text
//                 x="400"
//                 y="415"
//                 textAnchor="middle"
//                 fill="white"
//                 fontSize="12"
//                 fontFamily="monospace"
//               >
//                 Traversal in progress...
//               </text>
//             </g>
//           </svg>
//         </div>

//         {/* ======================= GRID VISUAL ======================= */}
//         <div>
//           <h3 className="text-lg font-semibold text-foreground">Graph Traversal</h3>
//           <div className="grid grid-cols-4 gap-4">
//             {layout.map((node) => (
//               <div
//                 key={node.id}
//                 className={`aspect-square rounded-full border-2 flex items-center justify-center text-lg font-semibold ${
//                   isVisited(node.id)
//                     ? "border-tertiary bg-tertiary/20 text-tertiary"
//                     : "border-border bg-card text-muted-foreground"
//                 }`}
//               >
//                 {node.id}
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </ScrollArea>
//   );
// }


import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Network } from "lucide-react";

export function GraphMap({ debugData, currentStep, isExecuted }) {
  const [graphData, setGraphData] = useState(null);
  const [visited, setVisited] = useState([]);

  /* ---------------------------------------------------------
      MAP BACKEND → GRAPH FORMAT
      Backend currently sends only:
      stage = "graph_detected"
      payload = { reason: "..." }
      (NO real adjacency / visited implemented yet)
  --------------------------------------------------------- */
  useEffect(() => {
    if (!debugData) return;

    // If backend someday adds debugData.graph:
    if (debugData.graph) {
      setGraphData(debugData.graph.adjacency || null);
      setVisited(debugData.graph.visited || []);
      return;
    }

    // If backend only sends notification (current behavior)
    if (debugData.graph_detected) {
      // No graph available → do NOT crash
      setGraphData(null);
      setVisited([]);
    }
  }, [debugData]);

  /* --------------------------- NO EXECUTION --------------------------- */
  if (!isExecuted || !graphData) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>

          <p className="text-muted-foreground">
            {debugData?.graph_detected
              ? "Graph detected — visualization not available (engine not implemented)"
              : "Debug code to visualize graph traversal"}
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------- STATIC UI NODE POSITIONS ---------------------- */
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

  const isVisited = (id) => visited.includes(id);

  /* ----------------------- EDGE LIST FROM BACKEND ----------------------- */
  const edges = [];

  if (graphData) {
    for (let from in graphData) {
      graphData[from].forEach((to) => {
        edges.push({ from: Number(from), to: Number(to) });
      });
    }
  }

  /* ------------------------------ RENDER UI ------------------------------ */
  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8 w-full">

        {/* ======================= SVG GRAPH ======================= */}
        <div className="w-full">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto border border-border rounded-lg bg-background"
          >
            {/* ---------------- EDGES ---------------- */}
            <g stroke="hsl(220, 12%, 18%)" strokeWidth="2">
              {edges.map((e, i) => {
                const A = layout.find((n) => n.id === e.from);
                const B = layout.find((n) => n.id === e.to);

                if (!A || !B) return null;

                const visible = isVisited(e.from) && isVisited(e.to);

                return (
                  <line
                    key={i}
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    opacity={visible ? 1 : 0.3}
                  />
                );
              })}
            </g>

            {/* ---------------- NODES ---------------- */}
            <g>
              {layout.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={
                      isVisited(node.id)
                        ? "hsl(308, 75%, 60%)"
                        : "hsl(220, 10%, 25%)"
                    }
                    stroke={
                      isVisited(node.id)
                        ? "hsl(308, 75%, 60%)"
                        : "hsl(220, 12%, 18%)"
                    }
                    strokeWidth="3"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={
                      isVisited(node.id)
                        ? "white"
                        : "hsl(220, 10%, 60%)"
                    }
                    fontSize="16"
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </g>

            {/* ---------------- BFS INFO BOX ---------------- */}
            <g>
              <rect
                x="50"
                y="350"
                width="700"
                height="80"
                fill="hsl(188, 90%, 60%)"
                fillOpacity="0.1"
                stroke="hsl(188, 90%, 60%)"
                strokeWidth="2"
                rx="8"
              />

              <text
                x="400"
                y="375"
                textAnchor="middle"
                fill="hsl(188, 90%, 60%)"
                fontSize="14"
                fontWeight="bold"
              >
                Graph Traversal (BFS / DFS)
              </text>

              <text
                x="400"
                y="395"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontFamily="monospace"
              >
                Visited: [{visited.join(", ")}]
              </text>

              <text
                x="400"
                y="415"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontFamily="monospace"
              >
                Traversal in progress...
              </text>
            </g>
          </svg>
        </div>

        {/* ======================= GRID VISUAL ======================= */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">Graph Traversal</h3>
          <div className="grid grid-cols-4 gap-4">
            {layout.map((node) => (
              <div
                key={node.id}
                className={`aspect-square rounded-full border-2 flex items-center justify-center text-lg font-semibold ${
                  isVisited(node.id)
                    ? "border-tertiary bg-tertiary/20 text-tertiary"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {node.id}
              </div>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  );
}
