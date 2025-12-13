// // ================= ORIGINAL UI (KEEPING FULL DESIGN) =================
// import React, { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Play } from "lucide-react";

// export function RecursionTree({ debugData, currentStep, isExecuted }) {
//   const [tree, setTree] = useState(null);

//   // Load backend recursion tree
//   useEffect(() => {
//     if (debugData?.recursion_tree) {
//       setTree(debugData.recursion_tree);
//     }
//   }, [debugData]);

//   // Backend not ready yet → show original placeholder UI
//   if (!isExecuted || !tree) {
//     return (
//       <div className="h-full flex items-center justify-center p-6">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
//             <Play className="w-8 h-8 text-muted-foreground" />
//           </div>
//           <p className="text-muted-foreground">
//             Click **Debug** to visualize recursion tree
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ====== Recursive Renderer for NEW backend tree format ======
//   const renderDynamicNode = (node) => {
//     if (!node) return null;

//     return (
//       <div className="flex flex-col items-center mx-6 my-4">
//         {/* Node bubble */}
//         <div className="rounded-full px-4 py-2 bg-primary text-white font-mono text-sm shadow">
//           {node.label || node.name || node.value}
//         </div>

//         {/* Children */}
//         {node.children && node.children.length > 0 && (
//           <div className="flex mt-4">
//             {node.children.map((child, idx) => (
//               <div key={idx}>{renderDynamicNode(child)}</div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // ====================== FULL ORIGINAL UI WITH DYNAMIC TREE ======================
//   return (
//     <ScrollArea className="h-full p-6">
//       <div className="flex flex-col items-center gap-8">

//         {/* ------------------------ SVG TREE DISPLAY ------------------------ */}
//         <div className="w-full max-w-3xl border border-border rounded-lg bg-background p-4">
//           <h2 className="text-center text-lg font-semibold text-foreground mb-4">
//             Recursion Tree (Dynamic from Backend)
//           </h2>

//           <div className="flex items-center justify-center overflow-auto">
//             {renderDynamicNode(tree)}
//           </div>
//         </div>

//         {/* ------------------------ CALL STACK UI (ORIGINAL) ------------------------ */}
//         <div className="w-full max-w-2xl space-y-4">
//           <h3 className="text-lg font-semibold text-foreground">Recursion Call Stack</h3>

//           <div className="space-y-2">
//             {(debugData?.analysis?.timeline || []).map((frame, i) => (
//               <div
//                 key={i}
//                 className={`p-4 rounded-md border ${
//                   i === (debugData.analysis.timeline.length - 1)
//                     ? "border-primary bg-primary/10 animate-pulse-glow"
//                     : "border-border bg-card"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="font-mono text-sm text-foreground">
//                     {frame.note || "call"}
//                   </span>
//                   <span className="text-xs text-muted-foreground">
//                     {frame.index_expr ? `Index: ${frame.index_expr}` : ""}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>
//     </ScrollArea>
//   );
// }

// ================= ORIGINAL UI (KEEPING FULL DESIGN) =================
import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";

export function RecursionTree({ debugData, currentStep, isExecuted }) {
  const [tree, setTree] = useState(null);

  // Load backend recursion tree
  useEffect(() => {
    // FIXED MAPPING ✔
    if (debugData?.recursion?.tree) {
      setTree(debugData.recursion.tree);
    }
  }, [debugData]);

  // Backend not ready yet → show original placeholder UI
  if (!isExecuted || !tree) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Click <b>Debug</b> to visualize recursion tree
          </p>
        </div>
      </div>
    );
  }

  // ====== Recursive Renderer for NEW backend tree format ======
  const renderDynamicNode = (node) => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center mx-6 my-4">
        {/* Node bubble */}
        <div className="rounded-full px-4 py-2 bg-primary text-white font-mono text-sm shadow">
          {node.label || node.name || node.value}
        </div>

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <div className="flex mt-4">
            {node.children.map((child, idx) => (
              <div key={idx}>{renderDynamicNode(child)}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ====================== FULL ORIGINAL UI WITH DYNAMIC TREE ======================
  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col items-center gap-8">

        {/* ------------------------ SVG TREE DISPLAY ------------------------ */}
        <div className="w-full max-w-3xl border border-border rounded-lg bg-background p-4">
          <h2 className="text-center text-lg font-semibold text-foreground mb-4">
            Recursion Tree (Dynamic from Backend)
          </h2>

          <div className="flex items-center justify-center overflow-auto">
            {renderDynamicNode(tree)}
          </div>
        </div>

        {/* ------------------------ CALL STACK UI (ORIGINAL) ------------------------ */}
        <div className="w-full max-w-2xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recursion Call Stack</h3>

          <div className="space-y-2">
            {(debugData?.analysis?.timeline || []).map((frame, i) => (
              <div
                key={i}
                className={`p-4 rounded-md border ${
                  i === (debugData.analysis.timeline.length - 1)
                    ? "border-primary bg-primary/10 animate-pulse-glow"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">
                    {frame.note || "call"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {frame.index_expr ? `Index: ${frame.index_expr}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  );
}
