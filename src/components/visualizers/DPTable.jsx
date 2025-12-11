import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table } from 'lucide-react';

export function DPTable({ currentStep, isExecuted }) {
  const cells = Array.from({ length: 11 }, (_, i) => ({
    index: i,
    value: i <= 1 ? i : getFibonacci(i),
    computed: isExecuted && i <= Math.min(currentStep, 10),
  }));

  function getFibonacci(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Table className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Click Run to visualize DP table</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8">
        
        <div className="w-full">
          <svg viewBox="0 0 800 400" className="w-full h-auto border border-border rounded-lg bg-background">
            <rect x="50" y="50" width="700" height="40" fill="hsl(188, 90%, 60%)" fillOpacity="0.2" stroke="hsl(188, 90%, 60%)" strokeWidth="2" />
            <text x="400" y="75" textAnchor="middle" fill="hsl(188, 90%, 60%)" fontSize="16" fontWeight="bold">
              Dynamic Programming Table - Fibonacci Sequence
            </text>

            {/* Index Row */}
            <g>
              {Array.from({ length: 11 }).map((_, i) => (
                <g key={i}>
                  <rect 
                    x={50 + i * 60} 
                    y={120} 
                    width={60} 
                    height={40} 
                    fill="hsl(220, 16%, 15%)"
                    stroke="hsl(220, 12%, 18%)"
                  />
                  <text 
                    x={80 + i * 60} 
                    y={145} 
                    textAnchor="middle" 
                    fill="hsl(0, 0%, 95%)"
                    fontSize="14"
                    fontFamily="monospace"
                  >
                    {i}
                  </text>
                </g>
              ))}
            </g>

            {/* Value Row */}
            <g>
              {cells.map((cell, i) => (
                <g key={i}>
                  <rect
                    x={50 + i * 60}
                    y={160}
                    width={60}
                    height={40}
                    fill={cell.computed ? "hsl(163, 70%, 45%)" : "hsl(220, 10%, 25%)"}
                    fillOpacity={cell.computed ? 0.3 : 0.1}
                    stroke={cell.computed ? "hsl(163, 70%, 45%)" : "hsl(220, 12%, 18%)"}
                    strokeWidth="2"
                  />
                  {cell.computed && (
                    <text
                      x={80 + i * 60}
                      y={185}
                      textAnchor="middle"
                      fill="hsl(163, 70%, 45%)"
                      fontSize="14"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {cell.value}
                    </text>
                  )}
                </g>
              ))}
            </g>

            <text x={25} y={145} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">n</text>
            <text x={25} y={185} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">f(n)</text>

            {/* Progress */}
            <g>
              <rect x="50" y="250" width="700" height="60" fill="hsl(308, 75%, 60%)" fillOpacity="0.1" stroke="hsl(308, 75%, 60%)" strokeWidth="2" rx="8" />
              <text x="400" y="275" textAnchor="middle" fill="hsl(308, 75%, 60%)" fontSize="14" fontWeight="bold">
                Memoization Progress
              </text>
              <text x="400" y="295" textAnchor="middle" fill="white" fontSize="12">
                Computed values: {Math.min(currentStep + 1, 11)} / 11
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Memoization Table</h3>
          <div className="grid grid-cols-11 gap-2">
            {cells.map((cell) => (
              <div
                key={cell.index}
                className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
                  cell.computed
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                <span className="text-xs font-mono">{cell.index}</span>
                {cell.computed && (
                  <span className="text-sm font-semibold text-primary">{cell.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
