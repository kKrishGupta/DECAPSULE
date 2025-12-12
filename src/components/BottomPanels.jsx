import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BottomPanels({
  selectedLine,
  outputText,
  isExecuted,

  // Debug information
  debugData,
  isDebugging
}) {
  /* --------------------------------------------------------
      OUTPUT (RUN MODE)
  -------------------------------------------------------- */
  const safeLines =
    outputText && typeof outputText === "string"
      ? outputText.replace(/\r\n/g, "\n").trim().split("\n")
      : [];

  /* --------------------------------------------------------
      DEBUG (BACKEND) DATA – NORMALIZED
  -------------------------------------------------------- */
  const isDebugDone = !!debugData;

  const callStack = Array.isArray(debugData?.stack) ? debugData.stack : [];
  const logs = Array.isArray(debugData?.logs) ? debugData.logs : [];
  const watch = Array.isArray(debugData?.watch) ? debugData.watch : [];
  const snapshots = Array.isArray(debugData?.snapshots)
    ? debugData.snapshots
    : [];

  const answer = debugData?.answer;
  const displayAnswer =
    answer !== undefined ? JSON.stringify(answer, null, 2) : "No answer";

  /* --------------------------------------------------------
      RENDER UI
  -------------------------------------------------------- */
  return (
    <div className="h-[380px] bg-card flex flex-col border-t border-border">
      <Tabs defaultValue="output" className="flex-1 flex flex-col overflow-hidden">
        
        {/* ---------------- TAB HEADER ---------------- */}
        <div className="px-6 py-2 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="stack">Call Stack</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="watch">Watch</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">

          {/* ==================== OUTPUT TAB ==================== */}
          <TabsContent value="output" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!isExecuted ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Run code to view output</p>
                </div>
              ) : (
                <div className="bg-black rounded-md p-4 border border-border min-h-[260px]">
                  <p className="text-cyan-400 font-bold mb-1">Output:</p>
                  <p className="text-muted-foreground mb-3">----------------</p>

                  <div className="font-mono text-sm text-green-300 leading-relaxed whitespace-pre-wrap">
                    {safeLines.length === 0 ? (
                      <p className="text-muted-foreground">No output</p>
                    ) : (
                      safeLines.map((line, i) => (
                        <div
                          key={i}
                          className={
                            line.startsWith(">")
                              ? "text-cyan-400 font-bold"
                              : line.startsWith("✓")
                              ? "text-green-400"
                              : "text-green-300"
                          }
                        >
                          {line.trim() === "" ? "\u00A0" : line}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ==================== CALL STACK TAB ==================== */}
          <TabsContent value="stack" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!isDebugDone ? (
                <p className="text-muted-foreground">Debug to see call stack</p>
              ) : callStack.length === 0 ? (
                <p className="text-muted-foreground">No call stack</p>
              ) : (
                <div className="space-y-2">
                  {callStack.map((frame, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm">
                          {frame.function || frame.fn || "unknown"}
                        </span>

                        {frame.line && (
                          <span className="text-xs text-muted-foreground">
                            Line {frame.line}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ==================== LOGS TAB ==================== */}
          <TabsContent value="logs" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!isDebugDone ? (
                <p className="text-muted-foreground">Debug to see logs</p>
              ) : logs.length === 0 ? (
                <p className="text-muted-foreground">No logs</p>
              ) : (
                <div className="space-y-2 font-mono text-xs">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 text-foreground">
                      <span className="text-muted-foreground">{log.time || ""}</span>
                      <span className="text-primary">[{log.level || "log"}]</span>
                      <span>{log.message || JSON.stringify(log)}</span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ==================== WATCH TAB ==================== */}
          <TabsContent value="watch" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!isDebugDone ? (
                <p className="text-muted-foreground">Debug to view variables</p>
              ) : watch.length === 0 ? (
                <p className="text-muted-foreground">No watched variables</p>
              ) : (
                <div className="space-y-2">
                  {watch.map((variable, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-mono text-sm text-primary">
                        {variable.name}
                      </span>
                      <span className="font-mono text-sm text-foreground">
                        {JSON.stringify(variable.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ==================== EXPLANATION TAB ==================== */}
          <TabsContent value="explanation" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full p-6">
              {!isDebugDone ? (
                <p className="text-muted-foreground">Debug to see explanation</p>
              ) : (
                <>
                  <h3 className="text-sm font-semibold mb-2">Final Answer</h3>
                  <pre className="font-mono text-primary mb-3">{displayAnswer}</pre>

                  <h3 className="text-sm font-semibold mb-2">Snapshots</h3>
                  {snapshots.length === 0 ? (
                    <p className="text-muted-foreground">No snapshots</p>
                  ) : (
                    snapshots.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 my-2 rounded-md border border-border bg-muted/40"
                      >
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(s, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </>
              )}
            </ScrollArea>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}