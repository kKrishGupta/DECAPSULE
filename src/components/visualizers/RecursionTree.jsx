import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";

/*
===============================================================================
RecursionTree (MERGED & FIXED)
✔ Backend recursionTree → REAL TREE
✔ No recursionTree → OLD STATIC UI (unchanged)
✔ Backend logic = ❌ NO
===============================================================================
*/

export function RecursionTree({
  recursionTree,   // 👈 normalized tree from VisualizerPane
  currentStep,
  isExecuted,
}) {
  const [tree, setTree] = useState(null);

  /* ---------------- LOAD TREE ---------------- */
  useEffect(() => {
    if (!recursionTree) {
      setTree(null);
    } else {
      setTree(recursionTree);
    }
  }, [recursionTree]);

  /* ============================================================================
      CASE 1 — NO DEBUG / NO TREE → OLD UI (SAFE)
  ============================================================================ */
  if (!isExecuted || !tree) {
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

            {/* -------- OLD STATIC SVG (UNCHANGED) -------- */}
            <div className="w-full max-w-2xl">
              <svg
                viewBox="0 0 800 300"
                className="w-full h-auto border border-border rounded-lg bg-background"
              >
                <g>
                  <circle
                    cx="400"
                    cy="60"
                    r="25"
                    fill="hsl(188,90%,60%)"
                    opacity={maxVisibleNodes >= 1 ? 1 : 0.3}
                  />
                  <text
                    x="400"
                    y="65"
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontFamily="monospace"
                  >
                    f(n)
                  </text>
                </g>
              </svg>
            </div>

            {/* -------- OLD CALL STACK -------- */}
            <div className="w-full max-w-2xl space-y-2">
              {Array.from({ length: maxVisibleNodes }).map((_, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-md border ${
                    i === maxVisibleNodes - 1
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="font-mono text-sm">
                    recursive_call({i})
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}
      </ScrollArea>
    );
  }

  /* ============================================================================
      CASE 2 — BACKEND TREE → REAL TREE (FIXED)
  ============================================================================ */

  const renderNode = (node) => {
    if (!node) return null;

    return (
      <li className="ml-4">
        <div className="border rounded px-3 py-1 mb-2 bg-muted font-mono text-sm">
          <strong>{node.func}</strong>(
          {Object.entries(node.args || {})
            .map(([k, v]) => `${k}=${v}`)
            .join(", ")}
          )
          {node.return !== null && node.return !== undefined && (
            <span className="ml-2 text-green-500">
              → {node.return}
            </span>
          )}
        </div>

        {node.children?.length > 0 && (
          <ul className="ml-4 border-l border-border pl-4">
            {node.children.map((child, i) => (
              <React.Fragment key={i}>
                {renderNode(child)}
              </React.Fragment>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-6">

        <h2 className="text-lg font-semibold text-center">
          Recursion Tree
        </h2>

        <div className="border border-border rounded-lg p-4 bg-background overflow-auto">
          <ul>{renderNode(tree)}</ul>
        </div>

      </div>
    </ScrollArea>
  );
}
