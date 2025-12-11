import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RecursionTree } from './visualizers/RecursionTree';
import { DPTable } from './visualizers/DPTable';
import { GraphMap } from './visualizers/GraphMap';

export function VisualizerPane({ activeTab, onTabChange, currentStep, isExecuted }) {
  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-col h-full">
        <div className="px-6 py-3 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="recursion" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
              Recursion Tree
            </TabsTrigger>
            <TabsTrigger value="dp" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
              DP Table
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground">
              Graph Map
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="recursion" className="h-full m-0">
            <RecursionTree currentStep={currentStep} isExecuted={isExecuted} />
          </TabsContent>
          <TabsContent value="dp" className="h-full m-0">
            <DPTable currentStep={currentStep} isExecuted={isExecuted} />
          </TabsContent>
          <TabsContent value="graph" className="h-full m-0">
            <GraphMap currentStep={currentStep} isExecuted={isExecuted} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
