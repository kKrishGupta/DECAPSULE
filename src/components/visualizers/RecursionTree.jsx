import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";

/*
===============================================================================
RecursionTree
- Uses ONLY normalized props from VisualizerPane
- Supports:
  1) Dynamic backend recursion tree
  2) Static SVG fallback (original UI preserved)
===============================================================================
*/

export function RecursionTree({
  recursionTree,   // ✅ normalized backend tree
  currentStep,
  isExecuted,
}) {
  const [tree, setTree] = useState(null);
  const [callStack, setCallStack] = useState([]);

  /* ============================================================================
      LOAD BACKEND RECURSION TREE
  ============================================================================ */
  useEffect(() => {
    if (!recursionTree) {
      setTree(null);
      return;
    }

    setTree(recursionTree);

    /*
      Build call stack from tree (DFS traversal)
      Backend tree structure:
      {
        func,
        args,
        children: [],
        return
      }
    */
    const stack = [];

    const walk = (node) => {
      if (!node) return;

      stack.push({
        func_name: node.func,
        locals: node.args,
        return_value: node.return,
      });

      node.children?.forEach(walk);
    };

    walk(recursionTree);
    setCallStack(stack);
  }, [recursionTree]);

  /* ============================================================================
      CASE 1 — NO EXECUTION OR NO BACKEND TREE
      → SHOW ORIGINAL STATIC SVG UI (UNCHANGED)
  ============================================================================ */
  const useStaticFallback = !tree;

  if (!isExecuted || useStaticFallback) {
    const maxVisibleNodes = isExecuted ? Math.min(currentStep + 1, 10) : 0;

    return (
      <ScrollArea className="h-full p-6">
        {!isExecuted ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Click <b>Debug</b> to visualize recursion tree
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            {/* ================= STATIC SVG (ORIGINAL UI) ================= */}
            <div className="w-full max-w-2xl">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-auto border border-border rounded-lg bg-background"
              >
                <g>
                  <circle cx="400" cy="50" r="25" fill="hsl(188,90%,60%)" opacity={maxVisibleNodes >= 1 ? 1 : 0.3} />
                  <text x="400" y="55" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
                    f(10)
                  </text>
                </g>
              </svg>
            </div>

            {/* ================= STATIC CALL STACK ================= */}
            <div className="w-full max-w-2xl space-y-2">
              {Array.from({ length: maxVisibleNodes }).map((_, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-md border ${
                    i === maxVisibleNodes - 1
                      ? "border-primary bg-primary/10 animate-pulse-glow"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-mono text-sm">
                      fibonacci({10 - i})
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {i === maxVisibleNodes - 1 ? "Computing..." : "Completed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    );
  }

  /* ============================================================================
      CASE 2 — BACKEND RECURSION TREE AVAILABLE
      → FULL DYNAMIC TREE + LIVE CALL STACK
  ============================================================================ */

  const renderNode = (node) => {
    if (!node) return null;

    return (
      <div className="flex flex-col items-center mx-4 my-4">
        <div className="rounded-full px-4 py-2 bg-primary text-white font-mono text-sm shadow">
          {node.func}({Object.values(node.args || {}).join(", ")})
        </div>

        {node.return !== undefined && (
          <div className="text-xs text-muted-foreground mt-1">
            return {node.return}
          </div>
        )}

        {node.children?.length > 0 && (
          <div className="flex mt-4 gap-6">
            {node.children.map((child, i) => (
              <div key={i}>{renderNode(child)}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col items-center gap-8">

        {/* ================= DYNAMIC TREE ================= */}
        <div className="w-full max-w-3xl border border-border rounded-lg bg-background p-4">
          <h2 className="text-center text-lg font-semibold mb-4">
            Recursion Tree (Live from Backend)
          </h2>
          <div className="flex justify-center overflow-auto">
            {renderNode(tree)}
          </div>
        </div>

        {/* ================= LIVE CALL STACK ================= */}
        <div className="w-full max-w-2xl">
          <h3 className="text-lg font-semibold mb-3">
            Recursion Call Stack
          </h3>

          <div className="space-y-2">
            {callStack.map((frame, i) => (
              <div
                key={i}
                className="p-3 rounded-md border border-border bg-card"
              >
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-primary">
                    {frame.func_name}
                  </span>
                  {frame.return_value && (
                    <span className="text-xs text-muted-foreground">
                      return {frame.return_value}
                    </span>
                  )}
                </div>

                <pre className="text-xs mt-1 text-muted-foreground">
                  {JSON.stringify(frame.locals, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  );
}
