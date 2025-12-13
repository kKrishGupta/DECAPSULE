import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table } from "lucide-react";

/*
===============================================================================
DPTable (FIXED)
- Supports:
  1) Backend DP (index/value objects)
  2) Backend 2D array (legacy)
  3) Original Fibonacci fallback (UNCHANGED)
- UI SAME, only mapping fixed
===============================================================================
*/

export function DPTable({
  dpTable,        // can be: [{index, value}] OR [[...]]
  currentStep,
  isExecuted,
}) {
  const [backendRows, setBackendRows] = useState(null);

  /* ------------------------------------------------------------------------
     NORMALIZE BACKEND DP TABLE
  ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!dpTable) {
      setBackendRows(null);
      return;
    }

    // ✅ Case 1: [{ index, value }]
    if (
      Array.isArray(dpTable) &&
      dpTable.length &&
      typeof dpTable[0] === "object" &&
      "index" in dpTable[0]
    ) {
      setBackendRows(dpTable);
      return;
    }

    // ✅ Case 2: legacy 2D array [[i, v]]
    if (Array.isArray(dpTable) && Array.isArray(dpTable[0])) {
      const rows = dpTable.map((row, i) => ({
        index: i,
        value: row[1] ?? row[0],
      }));
      setBackendRows(rows);
      return;
    }

    setBackendRows(null);
  }, [dpTable]);

  /* ------------------------------------------------------------------------
     CASE 1 — NOT EXECUTED
  ------------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------------
     CASE 2 — BACKEND DP TABLE (FIXED)
  ------------------------------------------------------------------------ */
  if (backendRows && backendRows.length) {
    return (
      <ScrollArea className="h-full p-6">
        <div className="flex flex-col gap-8">

          {/* HEADER (UNCHANGED) */}
          <div className="w-full">
            <svg
              viewBox="0 0 800 200"
              className="w-full h-auto border border-border rounded-lg bg-background"
            >
              <rect
                x="50"
                y="40"
                width="700"
                height="40"
                fill="hsl(188,90%,60%)"
                fillOpacity="0.2"
                stroke="hsl(188,90%,60%)"
                strokeWidth="2"
              />
              <text
                x="400"
                y="65"
                textAnchor="middle"
                fill="hsl(188,90%,60%)"
                fontSize="16"
                fontWeight="bold"
              >
                Dynamic Programming Table
              </text>
            </svg>
          </div>

          {/* DP GRID */}
          <div className="grid grid-cols-10 gap-2">
            {backendRows.map((cell) => (
              <div
                key={cell.index}
                className="aspect-square rounded-md border border-primary bg-primary/10 flex flex-col items-center justify-center"
              >
                <span className="text-xs font-mono">{cell.index}</span>
                <span className="text-sm font-semibold text-primary">
                  {cell.value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </ScrollArea>
    );
  }

  /* ------------------------------------------------------------------------
     CASE 3 — FALLBACK FIBONACCI (UNCHANGED)
  ------------------------------------------------------------------------ */

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

        {/* ORIGINAL SVG (UNCHANGED) */}
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

      </div>
    </ScrollArea>
  );
}
