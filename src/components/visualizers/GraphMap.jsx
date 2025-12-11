import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network } from 'lucide-react';

export function GraphMap({ currentStep, isExecuted }) {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    visited: isExecuted && i < Math.min(currentStep, 8),
  }));

  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Click Run to visualize graph traversal</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-8">

        <div className="w-full">
          <svg viewBox="0 0 800 500" className="w-full h-auto border border-border rounded-lg bg-background">
            
            {/* Edges */}
            <g stroke="hsl(220, 12%, 18%)" strokeWidth="2">
              <line x1="200" y1="150" x2="300" y2="150" opacity={nodes[0].visited && nodes[1].visited ? 1 : 0.3} />
              <line x1="300" y1="150" x2="400" y2="100" opacity={nodes[1].visited && nodes[2].visited ? 1 : 0.3} />
              <line x1="300" y1="150" x2="400" y2="200" opacity={nodes[1].visited && nodes[3].visited ? 1 : 0.3} />
              <line x1="400" y1="100" x2="500" y2="150" opacity={nodes[2].visited && nodes[4].visited ? 1 : 0.3} />
              <line x1="400" y1="200" x2="500" y2="150" opacity={nodes[3].visited && nodes[4].visited ? 1 : 0.3} />
              <line x1="500" y1="150" x2="600" y2="100" opacity={nodes[4].visited && nodes[5].visited ? 1 : 0.3} />
              <line x1="500" y1="150" x2="600" y2="200" opacity={nodes[4].visited && nodes[6].visited ? 1 : 0.3} />
              <line x1="600" y1="100" x2="600" y2="200" opacity={nodes[5].visited && nodes[6].visited ? 1 : 0.3} />
            </g>

            {/* Nodes */}
            <g>
              {[
                { id: 0, x: 200, y: 150 },
                { id: 1, x: 300, y: 150 },
                { id: 2, x: 400, y: 100 },
                { id: 3, x: 400, y: 200 },
                { id: 4, x: 500, y: 150 },
                { id: 5, x: 600, y: 100 },
                { id: 6, x: 600, y: 200 },
                { id: 7, x: 700, y: 150 },
              ].map((node, i) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={nodes[i].visited ? "hsl(308, 75%, 60%)" : "hsl(220, 10%, 25%)"}
                    stroke={nodes[i].visited ? "hsl(308, 75%, 60%)" : "hsl(220, 12%, 18%)"}
                    strokeWidth="3"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fill={nodes[i].visited ? "white" : "hsl(220, 10%, 60%)"}
                    fontSize="16"
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                </g>
              ))}
            </g>

            {/* BFS Info */}
            <g>
              <rect x="50" y="350" width="700" height="80" fill="hsl(188, 90%, 60%)" fillOpacity="0.1" stroke="hsl(188, 90%, 60%)" strokeWidth="2" rx="8" />
              <text x="400" y="375" textAnchor="middle" fill="hsl(188, 90%, 60%)" fontSize="14" fontWeight="bold">
                BFS Traversal Queue
              </text>
              <text x="400" y="395" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
                Visited: [{nodes.filter(n => n.visited).map(n => n.id).join(', ')}]
              </text>
              <text x="400" y="415" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
                Level-order traversal in progress...
              </text>
            </g>

          </svg>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">Graph Traversal</h3>
          <div className="grid grid-cols-4 gap-4">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`aspect-square rounded-full border-2 flex items-center justify-center text-lg font-semibold ${
                  node.visited
                    ? 'border-tertiary bg-tertiary/20 text-tertiary'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {node.id}
              </div>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  );
}
