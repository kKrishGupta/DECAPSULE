import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

/*
===============================================================================
BottomPanels — Structured Debugger (Readable + Professional)
===============================================================================
*/

export function BottomPanels({
  outputText,
  isExecuted,
  debugData,
  isDebugging,
  currentStep,
}) {

  /* ================= SAFE OUTPUT ================= */
  const outputLines =
    typeof outputText === "string"
      ? outputText.replace(/\r\n/g, "\n").split("\n")
      : [];

  const hasDebug = Boolean(debugData);

  /* ================= BACKEND DATA ================= */
  const classification = debugData?.classification || null;
  const analysis = debugData?.analysis || null;
  const issues = debugData?.issues || [];
  const explanation = debugData?.explanation || "";

  const runtime = debugData?.runtime || {};
  const recursionEvents = debugData?.recursion?.events || [];

  /* ================= LOGS ================= */
  const logs = [];
  if (runtime.stdout)
    logs.push({ level: "STDOUT", message: runtime.stdout });
  if (runtime.stderr)
    logs.push({ level: "STDERR", message: runtime.stderr });

  /* ================= CALL STACK ================= */
  const callStack = useMemo(() => {
    const stack = [];
    recursionEvents.forEach((e, idx) => {
      if (idx > currentStep) return;
      if (e.event === "call") stack.push(e);
      if (e.event === "return") stack.pop();
    });
    return stack;
  }, [recursionEvents, currentStep]);

  /* ================= WATCH ================= */
  const watchVars = useMemo(() => {
    if (!callStack.length) return null;
    return callStack[callStack.length - 1]?.locals || null;
  }, [callStack]);

  return (
    <div className="h-[380px] bg-card flex flex-col border-t border-border">
      <Tabs defaultValue="output" className="flex-1 flex flex-col overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="px-6 py-2 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="stack">Call Stack</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="watch">Watch</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
          </TabsList>
        </div>

        {/* ================= CONTENT ================= */}
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
                  <p className="text-cyan-400 font-bold mb-2">
                    Program Output
                  </p>
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
                <p className="text-muted-foreground">
                  Debug to view call stack
                </p>
              ) : recursionEvents.length === 0 ? (
                <p className="text-muted-foreground">
                  No recursion detected
                </p>
              ) : (
                <div className="space-y-2 font-mono text-sm">
                  {recursionEvents.map((e, i) => {
                    if (i > currentStep) return null;

                    const isActive = i === currentStep;
                    const isCall = e.event === "call";

                    return (
                      <div
                        key={i}
                        className={`p-3 rounded border
                          ${
                            isActive
                              ? "border-yellow-400 bg-yellow-400/20"
                              : isCall
                              ? "border-green-500 bg-green-500/15"
                              : "border-red-500 bg-red-500/15"
                          }
                        `}
                      >
                        <div className="flex justify-between">
                          <span
                            className={
                              isCall
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {isCall ? "CALL" : "RETURN"} {e.func_name}()
                          </span>
                          {isActive && (
                            <span className="text-yellow-400 text-xs font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {e.return_value !== undefined && !isCall && (
                          <div className="text-red-300 text-xs mt-1">
                            return → {e.return_value}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= LOGS ================= */}
          <TabsContent value="logs" className="h-full">
            <ScrollArea className="h-full p-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">
                  Debug to view logs
                </p>
              ) : logs.length === 0 ? (
                <p className="text-muted-foreground">
                  No logs available
                </p>
              ) : (
                <div className="space-y-3 font-mono text-sm">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded border ${
                        log.level === "STDERR"
                          ? "border-red-500 bg-red-500/10"
                          : "border-blue-500 bg-blue-500/10"
                      }`}
                    >
                      <div className="font-bold text-xs mb-1">
                        {log.level}
                      </div>
                      <div className="whitespace-pre-wrap">
                        {log.message}
                      </div>
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
                <p className="text-muted-foreground">
                  Debug to view variables
                </p>
              ) : !watchVars ? (
                <p className="text-muted-foreground">
                  No active variables
                </p>
              ) : (
                <table className="w-full text-sm border border-border rounded overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">Variable</th>
                      <th className="px-3 py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(watchVars).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-t border-border"
                      >
                        <td className="px-3 py-2 font-mono text-primary">
                          {key}
                        </td>
                        <td className="px-3 py-2 font-mono">
                          {JSON.stringify(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ================= EXPLANATION ================= */}
          <TabsContent value="explanation" className="h-full">
            <ScrollArea className="h-full p-6 space-y-6">
              {!hasDebug ? (
                <p className="text-muted-foreground">
                  Debug to view explanation
                </p>
              ) : (
                <>
                  {/* CLASSIFICATION */}
                  <section className="border rounded-lg p-4 bg-muted/40">
                    <h3 className="font-semibold text-primary mb-2">
                      📌 Classification
                    </h3>
                    <p><b>Topic:</b> {classification?.topic}</p>
                    <p>
                      <b>Confidence:</b>{" "}
                      {(classification?.confidence * 100).toFixed(0)}%
                    </p>
                    <ul className="list-disc ml-6 text-muted-foreground">
                      {classification?.reasons?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </section>

                  {/* ANALYSIS */}
                  <section className="border rounded-lg p-4 bg-muted/40">
                    <h3 className="font-semibold text-primary mb-2">
                      📊 Analysis
                    </h3>
                    {analysis ? (
                      <pre className="font-mono text-sm">
                        {JSON.stringify(analysis, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-muted-foreground">
                        No analysis data
                      </p>
                    )}
                  </section>

                  {/* ISSUES */}
                  <section className="border rounded-lg p-4 bg-muted/40">
                    <h3 className="font-semibold text-primary mb-2">
                      ⚠️ Issues & Warnings
                    </h3>
                    {issues.length ? (
                      <ul className="space-y-2">
                        {issues.map((i, idx) => (
                          <li
                            key={idx}
                            className="border rounded p-3 bg-background"
                          >
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {i.type}
                              </span>
                              <span className="text-xs text-yellow-400">
                                {i.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {i.detail}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-green-400">
                        No issues detected 🎉
                      </p>
                    )}
                  </section>

                  {/* AI EXPLANATION */}
                  <section className="border rounded-lg p-4 bg-muted/40">
                    <h3 className="font-semibold text-primary mb-2">
                      🤖 AI Explanation
                    </h3>
                    <div className="space-y-2 text-sm leading-relaxed">
                      {explanation.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </ScrollArea>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
