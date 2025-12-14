import React, { useMemo, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

/*
===============================================================================
BottomPanels — FULLY FIXED
✔ Call stack auto-scroll
✔ call = 🟢 green
✔ return = 🔴 red
✔ active step highlight
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

  const recursionEvents = debugData?.recursion?.events || [];

  /* ================= CALL STACK ================= */
  const callStack = recursionEvents.filter(
    (e) => e.event === "call" || e.event === "return"
  );

  const activeEvent =
    recursionEvents && recursionEvents[currentStep]
      ? recursionEvents[currentStep]
      : null;

  /* ================= AUTO SCROLL ================= */
  const stackRefs = useRef({});

  useEffect(() => {
    const el = stackRefs.current[currentStep];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  /* ================= WATCH ================= */
  const watchVars = useMemo(() => {
    if (!callStack.length) return null;
    const last = callStack[callStack.length - 1];
    return last.locals || null;
  }, [callStack]);

  /* ================= UI ================= */
  return (
    <div className="h-[380px] bg-card flex flex-col border-t border-border">
      <Tabs defaultValue="output" className="flex-1 flex flex-col overflow-hidden">

        {/* ---------- HEADER ---------- */}
        <div className="px-6 py-2 border-b border-border">
          <TabsList className="bg-muted">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="stack">Call Stack</TabsTrigger>
            <TabsTrigger value="watch">Watch</TabsTrigger>
          </TabsList>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div className="flex-1 overflow-hidden">

          {/* ===== OUTPUT ===== */}
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

          {/* ===== CALL STACK (AUTO SCROLL + COLOR) ===== */}
          <TabsContent value="stack" className="h-full">
            <ScrollArea className="h-full p-6">
              {callStack.length === 0 ? (
                <p className="text-muted-foreground">
                  No recursion detected
                </p>
              ) : (
                <div className="space-y-2 font-mono text-sm">
                  {callStack.map((f, i) => {
                    const isActive =
                      activeEvent &&
                      f.event === activeEvent.event &&
                      f.func_name === activeEvent.func_name &&
                      i === currentStep;

                    const isCall = f.event === "call";
                    const isReturn = f.event === "return";

                    return (
                      <div
                        key={i}
                        ref={(el) => {
                          if (el && isActive) {
                            stackRefs.current[currentStep] = el;
                          }
                        }}
                        className={`p-3 rounded border transition-all ${
                          isActive
                            ? "border-yellow-400 bg-yellow-400/20 scale-[1.03]"
                            : isCall
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10 opacity-80"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span
                            className={
                              isCall
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {isCall ? "CALL" : "RETURN"} {f.func_name}()
                          </span>

                          {isActive && (
                            <span className="text-yellow-400 text-xs font-bold">
                              ▶ ACTIVE
                            </span>
                          )}
                        </div>

                        {f.return_value !== undefined && isReturn && (
                          <div className="text-red-400 text-xs mt-1">
                            return → {String(f.return_value)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* ===== WATCH ===== */}
          <TabsContent value="watch" className="h-full">
            <ScrollArea className="h-full p-6">
              {!watchVars ? (
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

        </div>
      </Tabs>
    </div>
  );
}
