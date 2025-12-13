import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

/*
===============================================================================
BottomPanels — Fully Backend Integrated
Supports:
- Output
- Call Stack (recursion events)
- Logs (runtime)
- Watch (locals snapshot)
- Explanation (AI)
===============================================================================
*/

export function BottomPanels({
  outputText,
  isExecuted,
  debugData,
  isDebugging,
}) {

  /* ============================================================================
      SAFE OUTPUT
  ============================================================================ */
  const outputLines =
    typeof outputText === "string"
      ? outputText.replace(/\r\n/g, "\n").split("\n")
      : [];

  const hasDebug = Boolean(debugData);

  /* ============================================================================
      BACKEND NORMALIZATION
  ============================================================================ */
  const classification = debugData?.classification || null;
  const analysis = debugData?.analysis || null;
  const issues = debugData?.issues || [];
  const explanation = debugData?.explanation || "";

  const runtime = debugData?.runtime || {};
  const recursionEvents = debugData?.recursion?.events || [];

  /* ============================================================================
      LOGS
  ============================================================================ */
  const logs = [];
  if (runtime.stdout) logs.push({ level: "stdout", message: runtime.stdout });
  if (runtime.stderr) logs.push({ level: "stderr", message: runtime.stderr });

  /* ============================================================================
      CALL STACK (FROM RECURSION EVENTS)
  ============================================================================ */
  const callStack = recursionEvents.filter(
    (e) => e.event === "call" || e.event === "return"
  );

  /* ============================================================================
      WATCH VARIABLES (LATEST LOCALS SNAPSHOT)
  ============================================================================ */
  const watchVars = useMemo(() => {
    if (!callStack.length) return null;
    const last = callStack[callStack.length - 1];
    return last.locals || null;
  }, [callStack]);

  /* ============================================================================
      EXPLANATION TEXT (CLEAN)
  ============================================================================ */
  const explanationText = `
=== CLASSIFICATION ===
${classification ? JSON.stringify(classification, null, 2) : "N/A"}

=== ANALYSIS ===
${analysis ? JSON.stringify(analysis, null, 2) : "N/A"}

=== ISSUES ===
${
  issues.length
    ? issues.map((i) => `- ${i.type}: ${i.detail} (${i.severity})`).join("\n")
    : "No issues detected"
}

=== AI EXPLANATION ===
${explanation || "No explanation generated"}
`;

  /* ============================================================================
      UI
  ============================================================================ */
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
                  Run or Debug code to view output
                </p>
              ) : (
                <div className="bg-black p-4 rounded border border-border">
                  <p className="text-cyan-400 font-bold mb-2">Program Output</p>
                  <div className="font-mono text-green-300 whitespace-pre-wrap text-sm">
                    {outputLines.map((line, i) => (
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
                <p className="text-muted-foreground">Debug to view call stack</p>
              ) : callStack.length === 0 ? (
                <p className="text-muted-foreground">No recursion detected</p>
              ) : (
                <div className="space-y-2 font-mono text-sm">
                  {callStack.map((f, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded border ${
                        f.event === "call"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="text-primary">
                          {f.event.toUpperCase()} {f.func_name}()
                        </span>
                        <span className="text-muted-foreground">
                          line {f.lineno}
                        </span>
                      </div>
                      {f.return_value && (
                        <div className="text-green-400">
                          return → {f.return_value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= LOGS ================= */}
          <TabsContent value="logs" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug to view logs</p>
              ) : logs.length === 0 ? (
                <p className="text-muted-foreground">No logs available</p>
              ) : (
                <div className="font-mono text-sm space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-primary">[{log.level}]</span>
                      <span className="whitespace-pre-wrap">
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
              ) : !watchVars ? (
                <p className="text-muted-foreground">
                  No variables available
                </p>
              ) : (
                <pre className="font-mono text-sm bg-muted p-4 rounded border border-border">
                  {JSON.stringify(watchVars, null, 2)}
                </pre>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= EXPLANATION ================= */}
          <TabsContent value="explanation" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">Debug to view explanation</p>
              ) : (
                <pre className="font-mono text-sm whitespace-pre-wrap bg-muted p-4 rounded border border-border">
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
