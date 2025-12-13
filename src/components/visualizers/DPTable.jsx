import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "lucide-react";

/*
===============================================================================
DPTable
- Supports BOTH:
  1) Backend DP tables (simulation / table)
  2) Original Fibonacci static visualization (fallback)
- No assumptions about backend shape
- Safe guards for missing / skipped DP
===============================================================================
*/

export function DPTable({
  dpTable,        // ✅ normalized DP table from VisualizerPane
  currentStep,
  isExecuted,
}) {
  const [backendTable, setBackendTable] = useState(null);

  /* ============================================================================
      STEP 1 — LOAD BACKEND DP TABLE (IF PRESENT)
  ============================================================================ */
  useEffect(() => {
    if (!dpTable || !Array.isArray(dpTable) || !Array.isArray(dpTable[0])) {
      setBackendTable(null);
      return;
    }

    setBackendTable(dpTable);
  }, [dpTable]);

  /* ============================================================================
      CASE 1 — NOT EXECUTED
  ============================================================================ */
  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Table className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Click <b>Debug</b> to visualize DP Table
          </p>
        </div>
      </div>
    );
  }

  /* ============================================================================
      CASE 2 — BACKEND DP TABLE AVAILABLE
  ============================================================================ */
  if (backendTable) {
    return (
      <ScrollArea className="h-full p-6">
        <div className="flex flex-col gap-8">

          {/* ================= HEADER ================= */}
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
                fill="hsl(188,90%,60%)"
                fillOpacity="0.2"
                stroke="hsl(188,90%,60%)"
                strokeWidth="2"
              />
              <text
                x="400"
                y="75"
                textAnchor="middle"
                fill="hsl(188,90%,60%)"
                fontSize="16"
                fontWeight="bold"
              >
                Dynamic Programming Table (Backend)
              </text>
            </svg>
          </div>

          {/* ================= BACKEND TABLE ================= */}
          <div className="inline-block border border-border rounded-md overflow-hidden">
            <table className="table-auto border-collapse text-sm font-mono">
              <tbody>
                {backendTable.map((row, r) => (
                  <tr key={r} className="border-b border-border">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className="px-4 py-2 border-r border-border bg-muted/20"
                      >
                        {cell === null || cell === undefined
                          ? "-"
                          : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MEMO GRID (OPTIONAL) ================= */}
          {backendTable.length >= 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Memoization Table</h3>

              <div className="grid grid-cols-11 gap-2">
                {backendTable[0].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
                      backendTable[1][i] !== null
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-mono">{i}</span>
                    {backendTable[1][i] !== null && (
                      <span className="text-sm font-semibold text-primary">
                        {backendTable[1][i]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </ScrollArea>
    );
  }

  /* ============================================================================
      CASE 3 — NO BACKEND DP → ORIGINAL FIBONACCI UI (UNCHANGED)
  ============================================================================ */

  const fib = (n) => {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
  };

  const cells = Array.from({ length: 11 }, (_, i) => ({
    index: i,
    value: fib(i),
    computed: i <= Math.min(currentStep, 10),
  }));

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8">

        {/* ================= ORIGINAL SVG ================= */}
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
              fill="hsl(188,90%,60%)"
              fillOpacity="0.2"
              stroke="hsl(188,90%,60%)"
              strokeWidth="2"
            />
            <text
              x="400"
              y="75"
              textAnchor="middle"
              fill="hsl(188,90%,60%)"
              fontSize="16"
              fontWeight="bold"
            >
              Dynamic Programming Table – Fibonacci
            </text>

            {/* Index Row */}
            {cells.map((_, i) => (
              <g key={i}>
                <rect
                  x={50 + i * 60}
                  y={120}
                  width={60}
                  height={40}
                  fill="hsl(220,16%,15%)"
                />
                <text
                  x={80 + i * 60}
                  y={145}
                  textAnchor="middle"
                  fill="white"
                  fontFamily="monospace"
                >
                  {i}
                </text>
              </g>
            ))}

            {/* Value Row */}
            {cells.map((cell, i) => (
              <g key={i}>
                <rect
                  x={50 + i * 60}
                  y={160}
                  width={60}
                  height={40}
                  fill={
                    cell.computed
                      ? "hsl(163,70%,45%)"
                      : "hsl(220,10%,25%)"
                  }
                  fillOpacity={cell.computed ? 0.3 : 0.1}
                />
                {cell.computed && (
                  <text
                    x={80 + i * 60}
                    y={185}
                    textAnchor="middle"
                    fill="hsl(163,70%,45%)"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {cell.value}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-11 gap-2">
          {cells.map((cell) => (
            <div
              key={cell.index}
              className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
                cell.computed
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              <span className="text-xs font-mono">{cell.index}</span>
              {cell.computed && (
                <span className="text-sm font-semibold text-primary">
                  {cell.value}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </ScrollArea>
  );
}
