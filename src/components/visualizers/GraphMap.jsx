import React, { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Network, Play, Pause, RotateCcw, Square } from "lucide-react";

export function GraphMap({
  graph,
  isExecuted,
}) {
  /* ================= STATIC LAYOUT ================= */
  const layout = [
    { id: 1, x: 200, y: 150 },
    { id: 2, x: 300, y: 150 },
    { id: 3, x: 400, y: 100 },
    { id: 4, x: 400, y: 200 },
    { id: 5, x: 500, y: 150 },
    { id: 6, x: 600, y: 150 },
  ];

  /* ================= CONTROLS ================= */
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const totalSteps = graph?.steps?.length || 0;

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    if (!isExecuted || !isPlaying || !graph?.steps?.length) return;

    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= graph.steps.length - 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, speed, isExecuted, graph]);

  /* ================= RESET ON NEW EXECUTION ================= */
  useEffect(() => {
    if (isExecuted) {
      setStep(0);
      setIsPlaying(false);
    }
  }, [isExecuted]);

  /* ================= BUILD STATE FROM STEPS ================= */
  const { visited, edges, queue } = useMemo(() => {
    if (!graph?.steps || !isExecuted) {
      return { visited: [], edges: [], queue: [] };
    }

    const steps = graph.steps.slice(0, step + 1);

    let visitedSet = new Set();
    let edgeList = [];
    let queueState = [];

    for (const s of steps) {
      if (Array.isArray(s.visited)) visitedSet = new Set(s.visited);
      if (Array.isArray(s.queue)) queueState = s.queue;

      if (s.type === "edge") {
        edgeList.push({ from: s.from, to: s.to });
      }
    }

    return {
      visited: [...visitedSet],
      edges: edgeList,
      queue: queueState,
    };
  }, [graph, step, isExecuted]);

  /* ================= NOT EXECUTED ================= */
  if (!isExecuted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Network className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Click <b>Debug</b> to visualize graph traversal
          </p>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <ScrollArea className="h-full p-6">
      <div className="flex flex-col gap-6">

        {/* ================= CONTROLS ================= */}
        <div className="flex flex-wrap items-center gap-3">

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="px-3 py-1 rounded-md border border-border flex items-center gap-2"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="px-3 py-1 rounded-md border border-border flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Restart
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setStep(0);
            }}
            className="px-3 py-1 rounded-md border border-border flex items-center gap-2"
          >
            <Square size={16} />
            Stop
          </button>

          {/* SPEED */}
          <div className="flex items-center gap-2 text-sm">
            Speed
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Step {step + 1}/{totalSteps}
          </span>
          <input
            type="range"
            min="0"
            max={Math.max(totalSteps - 1, 0)}
            value={step}
            onChange={(e) => {
              setIsPlaying(false);
              setStep(Number(e.target.value));
            }}
            className="flex-1"
          />
        </div>

        {/* ================= GRAPH ================= */}
        <svg
          viewBox="0 0 800 400"
          className="w-full h-auto border border-border rounded-lg bg-background"
        >
          {/* -------- EDGES -------- */}
          <g stroke="hsl(308,75%,60%)" strokeWidth="2">
            {edges.map((e, i) => {
              const A = layout.find((n) => n.id === e.from);
              const B = layout.find((n) => n.id === e.to);
              if (!A || !B) return null;

              return (
                <line
                  key={i}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                />
              );
            })}
          </g>

          {/* -------- NODES -------- */}
          <g>
            {layout.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="26"
                  fill={
                    visited.includes(node.id)
                      ? "hsl(308,75%,60%)"
                      : "hsl(220,10%,25%)"
                  }
                />
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  fill="white"
                  fontFamily="monospace"
                  fontSize="16"
                >
                  {node.id}
                </text>
              </g>
            ))}
          </g>
        </svg>

        {/* ================= INFO ================= */}
        <div className="p-4 rounded-md border border-border bg-card">
          <p className="text-sm">
            <b>Visited:</b> [{visited.join(", ")}]
          </p>
          <p className="text-sm">
            <b>Queue:</b> [{queue.join(", ")}]
          </p>
        </div>

      </div>
    </ScrollArea>
  );
}
