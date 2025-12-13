import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RecursionTree } from "./visualizers/RecursionTree";
import { DPTable } from "./visualizers/DPTable";
import { GraphMap } from "./visualizers/GraphMap";

/*
===============================================================================
VisualizerPane
- Backend SSE data comes in multiple stage-based formats
- This file NORMALIZES everything into ONE clean structure
- Visualizer components ONLY read normalized keys (no backend confusion)
===============================================================================
*/

export function VisualizerPane({
  activeTab,
  onTabChange,
  currentStep,
  isExecuted,
  debugData,
}) {
  /* ============================================================================
      NORMALIZE BACKEND DATA → VISUALIZER-FRIENDLY FORMAT
      FINAL CANONICAL SHAPE:
      {
        recursionTree,
        dpTable,
        graphData
      }
  ============================================================================ */
  const normalizedData = useMemo(() => {
    if (!debugData) {
      return {
        recursionTree: null,
        dpTable: null,
        graphData: null,
      };
    }

    return {
      /* ------------------------------------------------------------------------
          1️⃣ RECURSION TREE
          Backend may send recursion tree in MANY places:
          - stage: "recursion"        → payload.tree
          - stage: "done"             → payload.recursion_tree
          - analysis.recursion_tree
      ------------------------------------------------------------------------ */
      recursionTree:
        debugData.recursion_tree ??
        debugData.recursion?.tree ??
        debugData.analysis?.recursion_tree ??
        null,

      /* ------------------------------------------------------------------------
          2️⃣ DP TABLE
          Backend may send:
          - dp.simulation        (2D array)
          - dp.table
          - dp_analysis.table
          - dp_simulation.table
      ------------------------------------------------------------------------ */
      dpTable:
        debugData.dp?.simulation ??
        debugData.dp?.table ??
        debugData.dp_analysis?.table ??
        debugData.dp_simulation?.table ??
        null,

      /* ------------------------------------------------------------------------
          3️⃣ GRAPH DATA
          Backend may send:
          - graph: { adjacency, visited }
          - OR only graph_detected flag
      ------------------------------------------------------------------------ */
      graphData:
        debugData.graph ??
        (debugData.graph_detected ? { detected: true } : null),
    };
  }, [debugData]);

  /* ============================================================================
      UI — SAME AS BEFORE (ONLY DATA SOURCE IS CLEAN NOW)
  ============================================================================ */
  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col h-full"
      >
        {/* ================= TAB HEADER ================= */}
        <div className="px-6 py-3 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger
              value="recursion"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recursion Tree
            </TabsTrigger>

            <TabsTrigger
              value="dp"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              DP Table
            </TabsTrigger>

            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Graph Map
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB CONTENT ================= */}
        <div className="flex-1 overflow-hidden">
          {/* -------- Recursion Tree -------- */}
          <TabsContent value="recursion" className="h-full m-0">
            <RecursionTree
              recursionTree={normalizedData.recursionTree}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* -------- DP Table -------- */}
          <TabsContent value="dp" className="h-full m-0">
            <DPTable
              dpTable={normalizedData.dpTable}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* -------- Graph Map -------- */}
          <TabsContent value="graph" className="h-full m-0">
            <GraphMap
              graphData={normalizedData.graphData}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
