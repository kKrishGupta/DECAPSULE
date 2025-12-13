import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecursionTree } from './visualizers/RecursionTree';
import { DPTable } from './visualizers/DPTable';
import { GraphMap } from './visualizers/GraphMap';

export function VisualizerPane({
  activeTab,
  onTabChange,
  currentStep,
  isExecuted,
  debugData
}) {

  // ============================================================
  // NORMALIZE BACKEND DATA → VISUALIZER FRIENDLY FORMAT
  // ============================================================

  const normalized = useMemo(() => {
    if (!debugData) return {};

    return {
      // Recursion Tree (backend sends: stage = "recursion" OR "recursion_tree")
      recursion_tree:
        debugData.recursion_tree ||
        debugData.recursion || 
        null,

      // DP Table (backend sends: dp_analysis, dp_simulation, dp_skipped)
      dp:
        debugData.dp_analysis?.table ||
        debugData.dp_simulation?.table ||
        debugData.dp ||
        null,

      // Graph (backend sends only graph_detected notification → no graph data yet)
      graph:
        debugData.graph ||
        (debugData.graph_detected ? { detected: true } : null)
    };
  }, [debugData]);


  // ============================================================
  // UI (UNCHANGED)
  // ============================================================
  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col h-full"
      >

        {/* -------- TAB HEADER -------- */}
        <div className="px-6 py-3 border-b border-border">
          <TabsList className="bg-muted">

            <TabsTrigger
              value="recursion"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Recursion Tree
            </TabsTrigger>

            <TabsTrigger
              value="dp"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              DP Table
            </TabsTrigger>

            <TabsTrigger
              value="graph"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Graph Map
            </TabsTrigger>
          </TabsList>
        </div>

        {/* -------- TAB CONTENT -------- */}
        <div className="flex-1 overflow-hidden">

          {/* Recursion Tree */}
          <TabsContent value="recursion" className="h-full m-0">
            <RecursionTree
              debugData={normalized}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* DP Table */}
          <TabsContent value="dp" className="h-full m-0">
            <DPTable
              debugData={normalized}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* Graph Map */}
          <TabsContent value="graph" className="h-full m-0">
            <GraphMap
              debugData={normalized}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
