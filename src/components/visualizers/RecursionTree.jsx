import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play } from 'lucide-react';

export function RecursionTree({ currentStep, isExecuted }) {
  const maxVisibleNodes = isExecuted ? Math.min(currentStep + 1, 10) : 0;

  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Click Run to visualize recursion tree</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col items-center gap-8">

        <div className="w-full max-w-2xl">
          <svg viewBox="0 0 800 500" className="w-full h-auto border border-border rounded-lg bg-background">

            <g>
              {/* Root */}
              <circle cx="400" cy="50" r="25" fill="hsl(188, 90%, 60%)" opacity={maxVisibleNodes >= 1 ? 1 : 0.3} />
              <text x="400" y="55" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">f(10)</text>

              {/* Level 1 */}
              <line x1="400" y1="75" x2="300" y2="125" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 2 ? 1 : 0.3} />
              <line x1="400" y1="75" x2="500" y2="125" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 3 ? 1 : 0.3} />

              <circle cx="300" cy="150" r="25" fill="hsl(188, 90%, 60%)" opacity={maxVisibleNodes >= 2 ? 1 : 0.3} />
              <text x="300" y="155" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">f(9)</text>

              <circle cx="500" cy="150" r="25" fill="hsl(188, 90%, 60%)" opacity={maxVisibleNodes >= 3 ? 1 : 0.3} />
              <text x="500" y="155" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">f(8)</text>

              {/* Level 2 */}
              <line x1="300" y1="175" x2="250" y2="225" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 4 ? 1 : 0.3} />
              <line x1="300" y1="175" x2="350" y2="225" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 5 ? 1 : 0.3} />
              <line x1="500" y1="175" x2="450" y2="225" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 6 ? 1 : 0.3} />
              <line x1="500" y1="175" x2="550" y2="225" stroke="hsl(220,12%,18%)" opacity={maxVisibleNodes >= 7 ? 1 : 0.3} />

              <circle cx="250" cy="250" r="20" fill="hsl(163,70%,45%)" opacity={maxVisibleNodes >= 4 ? 1 : 0.3} />
              <text x="250" y="255" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">f(8)</text>

              <circle cx="350" cy="250" r="20" fill="hsl(163,70%,45%)" opacity={maxVisibleNodes >= 5 ? 1 : 0.3} />
              <text x="350" y="255" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">f(7)</text>

              <circle cx="450" cy="250" r="20" fill="hsl(163,70%,45%)" opacity={maxVisibleNodes >= 6 ? 1 : 0.3} />
              <text x="450" y="255" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">f(7)</text>

              <circle cx="550" cy="250" r="20" fill="hsl(163,70%,45%)" opacity={maxVisibleNodes >= 7 ? 1 : 0.3} />
              <text x="550" y="255" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace">f(6)</text>

              {/* Memo Cache */}
              {maxVisibleNodes >= 8 && (
                <g>
                  <rect x="200" y="350" width="400" height="80" fill="hsl(308,75%,60%)" fillOpacity="0.1" stroke="hsl(308,75%,60%)" strokeWidth="2" rx="8" />
                  <text x="400" y="375" textAnchor="middle" fill="hsl(308,75%,60%)" fontSize="14" fontWeight="bold">Memoization Cache</text>
                  <text x="400" y="395" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
                    memo[8] = 21, memo[7] = 13, memo[6] = 8
                  </text>
                  <text x="400" y="415" textAnchor="middle" fill="white" fontSize="12" fontFamily="monospace">
                    Avoiding redundant calculations
                  </text>
                </g>
              )}
            </g>
          </svg>
        </div>

        <div className="w-full max-w-2xl space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recursion Call Stack</h3>
          <div className="space-y-2">
            {Array.from({ length: maxVisibleNodes }).map((_, i) => (
              <div
                key={i}
                className={`p-4 rounded-md border ${
                  i === maxVisibleNodes - 1
                    ? 'border-primary bg-primary/10 animate-pulse-glow'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-foreground">
                    fibonacci({10 - i})
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {i === maxVisibleNodes - 1 ? 'Computing...' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  );
}
