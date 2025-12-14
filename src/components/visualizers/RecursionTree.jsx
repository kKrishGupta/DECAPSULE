import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play } from "lucide-react";

/*
===============================================================================
RecursionTree (LIVE SYNC VERSION)
✔ TimelineSlider → currentStep sync
✔ Active node highlight
✔ Auto scroll into view
✔ Old fallback UI untouched
===============================================================================
*/

export function RecursionTree({
  recursionTree,   // normalized tree
  currentStep,
  isExecuted,
}) {
  const [tree, setTree] = useState(null);

  // 🔥 refs for auto-scroll
  const nodeRefs = useRef({});

  /* ---------------- LOAD TREE ---------------- */
  useEffect(() => {
    if (!recursionTree) {
      setTree(null);
      nodeRefs.current = {};
    } else {
      setTree(recursionTree);
    }
  }, [recursionTree]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (currentStep == null) return;

    const el = nodeRefs.current[currentStep];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  /* ============================================================================
      CASE 1 — NO DEBUG / NO TREE → OLD UI (UNCHANGED)
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
          </div>
        )}
      </ScrollArea>
    );
  }

  /* ============================================================================
      CASE 2 — REAL BACKEND TREE (LIVE SYNC)
  ============================================================================ */

  const renderNode = (node) => {
    if (!node) return null;

    const isActive = node.stepIndex === currentStep;

    return (
      <li key={node.stepIndex} className="ml-4">
        <div
          ref={(el) => {
            if (el) nodeRefs.current[node.stepIndex] = el;
          }}
          className={`
            border rounded px-3 py-1 mb-2 font-mono text-sm transition
            ${isActive
              ? "border-primary bg-primary/20"
              : "border-border bg-muted"}
          `}
        >
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
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">
          Recursion Tree
        </h2>

        <div className="border border-border rounded-lg p-4 bg-background">
          <ul>{renderNode(tree)}</ul>
        </div>
      </div>
    </ScrollArea>
  );
}
