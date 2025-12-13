import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RecursionTree } from "./visualizers/RecursionTree";
import { DPTable } from "./visualizers/DPTable";
import { GraphMap } from "./visualizers/GraphMap";

/*
VisualizerPane
→ backend ke sab formats ko normalize karta hai
→ visualizers ko sirf clean data deta hai
*/

export function VisualizerPane({
  activeTab,
  onTabChange,
  currentStep,
  isExecuted,
  debugData,
}) {
  const normalizedData = useMemo(() => {
    if (!debugData) {
      return {
        recursionTree: null,
        dpTable: null,
        graphData: null,
      };
    }

    // ✅ SINGLE SOURCE OF TRUTH
    const recursionTree =
      debugData?.recursion?.tree ||
      debugData?.analysis?.recursion_tree ||
      debugData?.recursion_tree ||
      null;

    return {
      recursionTree,

      dpTable:
        debugData?.dp?.simulation ||
        debugData?.dp?.table ||
        debugData?.dp_analysis?.table ||
        null,

      graphData:
        debugData?.graph ||
        (debugData?.graph_detected ? { detected: true } : null),
    };
  }, [debugData]);

  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col h-full"
      >
        <div className="px-6 py-3 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="recursion">Recursion Tree</TabsTrigger>
            <TabsTrigger value="dp">DP Table</TabsTrigger>
            <TabsTrigger value="graph">Graph Map</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="recursion" className="h-full m-0">
            <RecursionTree
              recursionTree={normalizedData.recursionTree}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          <TabsContent value="dp" className="h-full m-0">
            <DPTable
              dpTable={normalizedData.dpTable}
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

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
