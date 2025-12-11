import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function BottomPanels({ selectedLine, currentStep, language, isExecuted }) {
  const variables = [
    { name: 'n', value: '10', type: 'number' },
    { name: 'memo', value: '{ 0: 0, 1: 1, 2: 1, 3: 2 }', type: 'object' },
    { name: 'result', value: '55', type: 'number' },
  ];

  const callStack = [
    { function: 'fibonacci(10)', line: 7 },
    { function: 'fibonacci(9)', line: 7 },
    { function: 'fibonacci(8)', line: 7 },
  ];

  const logs = [
    { time: '0.001s', level: 'info', message: 'Starting fibonacci(10)' },
    { time: '0.002s', level: 'debug', message: 'Checking memo for n=10' },
    { time: '0.003s', level: 'debug', message: 'Computing fibonacci(9)' },
    { time: '0.004s', level: 'info', message: 'Result: 55' },
  ];

  return (
    <div className="h-64 bg-card">
      <Tabs defaultValue="watch" className="h-full flex flex-col">
        <div className="px-6 py-2 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger
              value="watch"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-foreground"
            >
              Watch
            </TabsTrigger>
            <TabsTrigger
              value="stack"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-foreground"
            >
              Call Stack
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-foreground"
            >
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="explanation"
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-foreground"
            >
              Explanation
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="watch" className="h-full m-0">
            <ScrollArea className="h-full p-6">
              {!isExecuted ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Run code to watch variables</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {variables.map((variable, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-primary">{variable.name}</span>
                        <span className="text-xs text-muted-foreground">{variable.type}</span>
                      </div>
                      <span className="font-mono text-sm text-foreground">{variable.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stack" className="h-full m-0">
            <ScrollArea className="h-full p-6">
              {!isExecuted ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Run code to view call stack</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {callStack.map((frame, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-md border transition-colors ${
                        i === 0
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-foreground">{frame.function}</span>
                        <span className="text-xs text-muted-foreground">Line {frame.line}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs" className="h-full m-0">
            <ScrollArea className="h-full p-6">
              {!isExecuted ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Run code to view execution logs</p>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-foreground">
                      <span className="text-muted-foreground">{log.time}</span>
                      <span
                        className={
                          log.level === 'info'
                            ? 'text-success'
                            : log.level === 'debug'
                            ? 'text-primary'
                            : 'text-foreground'
                        }
                      >
                        [{log.level}]
                      </span>
                      <span className="text-foreground">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="explanation" className="h-full m-0">
            <ScrollArea className="h-full p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Line {selectedLine || 'N/A'} Explanation
                  </h3>
                  <p className="text-sm text-foreground leading-relaxed">
                    This line implements the memoization check. Before computing the Fibonacci
                    value recursively, we check if it's already been calculated and stored in the
                    memo object. This optimization reduces time complexity from O(2^n) to O(n).
                  </p>
                </div>
                <div className="p-4 rounded-md bg-primary/10 border border-primary">
                  <p className="text-sm text-foreground">
                    <strong className="text-primary">Tip:</strong> Dynamic programming combines
                    recursion with memoization to avoid redundant calculations.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
