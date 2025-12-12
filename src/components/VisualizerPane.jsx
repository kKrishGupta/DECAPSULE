
import React from 'react';
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
              debugData={debugData}     // <-- backend tree
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* DP Table */}
          <TabsContent value="dp" className="h-full m-0">
            <DPTable
              debugData={debugData}     // <-- backend dp
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

          {/* Graph Map */}
          <TabsContent value="graph" className="h-full m-0">
            <GraphMap
              debugData={debugData}     // <-- backend graph
              currentStep={currentStep}
              isExecuted={isExecuted}
            />
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
