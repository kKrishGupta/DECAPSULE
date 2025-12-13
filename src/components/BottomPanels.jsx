import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BottomPanels({
  outputText,
  isExecuted,
  debugData,
  isDebugging
}) {

  /* ---------------- SAFE OUTPUT ---------------- */
  const safeLines =
    typeof outputText === "string"
      ? outputText.replace(/\r\n/g, "\n").split("\n")
      : [];

  const hasDebug = !!debugData;

  /* ---------------- NORMALIZED BACKEND FIELDS ---------------- */
  const classification = debugData?.classification;
  const analysis = debugData?.analysis;
  const issues = debugData?.issues || [];
  const explanation = debugData?.explanation;

  const runtime = debugData?.runtime || {};
  const logs = [];

  if (runtime.stdout) logs.push({ level: "stdout", message: runtime.stdout });
  if (runtime.stderr) logs.push({ level: "stderr", message: runtime.stderr });

  /* ---------------- NO TRUE CALLSTACK / WATCH FROM BACKEND ---------------- */
  const callStack = null; // backend doesn’t send stack
  const watch = null;     // backend doesn’t send watch

  /* ---------------- BUILD EXPLANATION BLOCK ---------------- */
  const explanationText = `
=== Classification ===
${classification ? JSON.stringify(classification, null, 2) : "N/A"}

=== Analysis ===
${analysis ? JSON.stringify(analysis, null, 2) : "N/A"}

=== Issues Found ===
${issues.length ? issues.join("\n") : "No issues detected"}

=== AI Explanation ===
${explanation || "No explanation generated yet"}
`;

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

        {/* ---------------- TAB CONTENT ---------------- */}
        <div className="flex-1 overflow-hidden">

          {/* ================= OUTPUT ================= */}
          <TabsContent value="output" className="h-full">
            <ScrollArea className="h-full p-6">
              {!isExecuted ? (
                <p className="text-muted-foreground text-center mt-12">
                  Run the code to view output
                </p>
              ) : (
                <div className="bg-black p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold mb-2">Output:</p>
                  <div className="font-mono text-green-300 whitespace-pre-wrap text-sm">
                    {safeLines.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= CALL STACK ================= */}
          <TabsContent value="stack" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug code to view call stack</p>
              ) : (
                <p className="text-muted-foreground">
                  Backend does not provide call stack information.
                </p>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= LOGS ================= */}
          <TabsContent value="logs" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug to see logs</p>
              ) : logs.length === 0 ? (
                <p className="text-muted-foreground">No logs</p>
              ) : (
                <div className="font-mono text-sm space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-primary">[{log.level}]</span>
                      <span className="text-foreground whitespace-pre-wrap">
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= WATCH ================= */}
          <TabsContent value="watch" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug to view variables</p>
              ) : (
                <p className="text-muted-foreground">
                  Backend does not send watch variables.
                </p>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= EXPLANATION ================= */}
          <TabsContent value="explanation" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug to view explanation</p>
              ) : (
                <pre className="font-mono text-sm whitespace-pre-wrap text-foreground bg-muted p-4 rounded border border-border">
                  {explanationText}
                </pre>
              )}
            </ScrollArea>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
