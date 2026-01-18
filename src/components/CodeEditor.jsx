import React, { useMemo, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const LINE_HEIGHT = 24;

export function CodeEditor({
  selectedLine,
  onLineClick,
  currentStep,
  language,
  isExecuted,
  codeContent,
  onCodeChange,
  activeFile,
  timeline,
}) {
  const editorRef = useRef(null);
  const lineRef = useRef(null);
  const viewportRef = useRef(null);

  /* ---------------- Load File (ONLY ON FILE CHANGE) ---------------- */
  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.innerText = codeContent || "";
    updateLineNumbers(codeContent || "");
  }, [activeFile]);

  /* ---------------- Line Numbers ---------------- */
  const updateLineNumbers = (text) => {
    if (!lineRef.current) return;
    const count = (text || "").split("\n").length;
    lineRef.current.textContent = Array.from(
      { length: count },
      (_, i) => i + 1
    ).join("\n");
  };

  /* ---------------- TAB + ENTER FIX ---------------- */
  const handleKeyDown = (e) => {
    // TAB → 4 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "    ");
      return;
    }

    // ENTER → real newline + auto-indent
    if (e.key === "Enter") {
      e.preventDefault();

      const sel = window.getSelection();
      if (!sel || !editorRef.current) return;

      const text = editorRef.current.innerText || "";
      const cursorPos = sel.anchorOffset;

      const beforeCursor = text.slice(0, cursorPos);
      const lastLine = beforeCursor.split("\n").pop() || "";

      const indentMatch = lastLine.match(/^\s+/);
      const indent = indentMatch ? indentMatch[0] : "";

      document.execCommand("insertText", false, "\n" + indent);
    }
  };

  /* ================= ACTIVE DEBUG LINE ================= */
  const activeLine = useMemo(() => {
    const evt = timeline?.[currentStep];
    if (!evt || typeof evt.lineno !== "number" || evt.lineno <= 0) {
      return null;
    }
    return evt.lineno;
  }, [timeline, currentStep]);

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    if (!activeLine || !viewportRef.current) return;

    viewportRef.current.scrollTop = Math.max(
      (activeLine - 3) * LINE_HEIGHT,
      0
    );
  }, [activeLine]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border">
        <h2 className="text-sm font-medium">Code Editor</h2>
      </div>

      <ScrollArea className="flex-1">
        <div
          ref={viewportRef}
          className="relative w-full h-full font-mono text-sm"
        >
          {/* Line Numbers */}
          <pre
            ref={lineRef}
            className="
              absolute top-0 left-0
              w-12
              bg-background
              border-r border-border
              text-right pr-2 pt-2
              text-muted-foreground
              select-none
              whitespace-pre
              leading-6
              z-20
            "
          />

          {/* 🔥 Active Debug Line */}
          {activeLine && (
            <div
              className="absolute left-0 right-0 bg-primary/15 z-10"
              style={{
                top: (activeLine - 1) * LINE_HEIGHT,
                height: LINE_HEIGHT,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Editable Code */}
          <div
            ref={editorRef}
            contentEditable={!isExecuted}
            suppressContentEditableWarning
            spellCheck={false}
            onKeyDown={handleKeyDown}
            onInput={() => {
              const text = editorRef.current.innerText || "";
              onCodeChange(text);
              updateLineNumbers(text);
            }}
            onClick={() => {
              const sel = window.getSelection();
              if (!sel || !editorRef.current) return;

              const pos = sel.anchorOffset;
              const txt = editorRef.current.innerText || "";
              const line = txt.substring(0, pos).split("\n").length;
              onLineClick?.(line);
            }}
            className="
              relative z-20
              pl-14
              pr-4
              py-2
              whitespace-pre
              break-words
              outline-none
              min-h-full
              text-foreground
              leading-6
            "
          />
        </div>
      </ScrollArea>
    </div>
  );
}
