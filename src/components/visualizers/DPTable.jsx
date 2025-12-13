// // ================= ORIGINAL UI (KEPT EXACTLY SAME) =================
// import React, { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Table } from "lucide-react";

// export function DPTable({ debugData, currentStep, isExecuted }) {
//   const [table, setTable] = useState(null);

//   // Load backend DP table if present
//   useEffect(() => {
//     if (debugData?.dp) {
//       setTable(debugData.dp.table || debugData.dp || null);
//     }
//   }, [debugData]);

//   // =============== When backend DP not available, show placeholder ===============
//   if (!isExecuted || !table) {
//     return (
//       <div className="h-full flex items-center justify-center p-6">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
//             <Table className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <p className="text-muted-foreground">
//             Debug code to visualize DP Table
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // =============================================================
//   //   DYNAMIC DP TABLE RENDERING FROM BACKEND (debugData.dp_table)
//   // =============================================================
//   const backendRows = table; // array of rows

//   return (
//     <ScrollArea className="h-full p-6">
//       <div className="flex flex-col gap-8">
        
//         {/* ===================== SVG HEADER (Original UI) ===================== */}
//         <div className="w-full">
//           <svg
//             viewBox="0 0 800 400"
//             className="w-full h-auto border border-border rounded-lg bg-background"
//           >
//             <rect
//               x="50"
//               y="50"
//               width="700"
//               height="40"
//               fill="hsl(188, 90%, 60%)"
//               fillOpacity="0.2"
//               stroke="hsl(188, 90%, 60%)"
//               strokeWidth="2"
//             />
//             <text
//               x="400"
//               y="75"
//               textAnchor="middle"
//               fill="hsl(188, 90%, 60%)"
//               fontSize="16"
//               fontWeight="bold"
//             >
//               Dynamic Programming Table (Backend)
//             </text>
//           </svg>
//         </div>

//         {/* ===================== BACKEND DP TABLE RENDER ===================== */}
//         <div className="inline-block border border-border rounded-md overflow-hidden">
//           <table className="table-auto border-collapse text-sm font-mono">
//             <tbody>
//               {backendRows.map((row, rIdx) => (
//                 <tr key={rIdx} className="border-b border-border">
//                   {row.map((cell, cIdx) => (
//                     <td
//                       key={cIdx}
//                       className="px-4 py-2 border-r border-border bg-muted/20 text-foreground"
//                     >
//                       {cell === null || cell === undefined
//                         ? "-"
//                         : JSON.stringify(cell)}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ===================== ORIGINAL SECOND GRID UI (KEPT SAME) ===================== */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-foreground">
//             Memoization Table
//           </h3>

//           <div className="grid grid-cols-11 gap-2">
//             {backendRows[0].map((_, i) => (
//               <div
//                 key={i}
//                 className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
//                   backendRows[1][i] !== null
//                     ? "border-primary bg-primary/10 text-foreground"
//                     : "border-border bg-card text-muted-foreground"
//                 }`}
//               >
//                 <span className="text-xs font-mono">{i}</span>
//                 {backendRows[1][i] !== null && (
//                   <span className="text-sm font-semibold text-primary">
//                     {backendRows[1][i]}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </ScrollArea>
//   );
// }

// ================= ORIGINAL UI (KEPT EXACTLY SAME) =================
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "lucide-react";

export function DPTable({ debugData, currentStep, isExecuted }) {
  const [table, setTable] = useState(null);

  // Load backend DP table correctly
  useEffect(() => {
    if (!debugData?.dp) return;

    // Backend mapping FIXED ✔
    const dpSim = debugData.dp.simulation;

    if (Array.isArray(dpSim) && Array.isArray(dpSim[0])) {
      setTable(dpSim); // 2D table
    } else {
      setTable(null);
    }
  }, [debugData]);

  // =============== When backend DP not available, show placeholder ===============
  if (!isExecuted || !table) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Table className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Debug code to visualize DP Table
          </p>
        </div>
      </div>
    );
  }

  // =============================================================
  //   DYNAMIC DP TABLE RENDERING FROM BACKEND (debugData.dp.simulation)
  // =============================================================
  const backendRows = table; // always 2D array

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8">
        
        {/* ===================== SVG HEADER (Original UI) ===================== */}
        <div className="w-full">
          <svg
            viewBox="0 0 800 400"
            className="w-full h-auto border border-border rounded-lg bg-background"
          >
            <rect
              x="50"
              y="50"
              width="700"
              height="40"
              fill="hsl(188, 90%, 60%)"
              fillOpacity="0.2"
              stroke="hsl(188, 90%, 60%)"
              strokeWidth="2"
            />
            <text
              x="400"
              y="75"
              textAnchor="middle"
              fill="hsl(188, 90%, 60%)"
              fontSize="16"
              fontWeight="bold"
            >
              Dynamic Programming Table (Backend)
            </text>
          </svg>
        </div>

        {/* ===================== BACKEND DP TABLE RENDER ===================== */}
        <div className="inline-block border border-border rounded-md overflow-hidden">
          <table className="table-auto border-collapse text-sm font-mono">
            <tbody>
              {backendRows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-border">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-2 border-r border-border bg-muted/20 text-foreground"
                    >
                      {cell === null || cell === undefined
                        ? "-"
                        : JSON.stringify(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== ORIGINAL SECOND GRID UI (KEPT SAME) ===================== */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Memoization Table
          </h3>

          <div className="grid grid-cols-11 gap-2">
            {backendRows[0].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
                  backendRows[1][i] !== null
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <span className="text-xs font-mono">{i}</span>
                {backendRows[1][i] !== null && (
                  <span className="text-sm font-semibold text-primary">
                    {backendRows[1][i]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
