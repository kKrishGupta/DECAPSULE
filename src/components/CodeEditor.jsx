import React, { useEffect, useMemo, useRef } from "react";
import Editor from "@monaco-editor/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CodeEditor({
  onLineClick,
  currentStep,
  isExecuted,
  codeContent,
  onCodeChange,
  activeFile,
  timeline,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIds = useRef([]);

  /* ---------------- Editor Mount ---------------- */
  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Python indentation rules
    monaco.languages.setLanguageConfiguration("python", {
      indentationRules: {
        increaseIndentPattern: /:\s*$/,
        decreaseIndentPattern: /^\s*(return|pass|break|continue)/,
      },
    });

    // Line click support
    editor.onMouseDown((e) => {
      if (e.target.position) {
        onLineClick?.(e.target.position.lineNumber);
      }
    });

    // Force layout once (prevents blinking)
    setTimeout(() => editor.layout(), 0);
  };

  /* ---------------- Load Code ONLY on File Change ---------------- */
  useEffect(() => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    if (model.getValue() !== codeContent) {
      model.setValue(codeContent || "");
    }
  }, [activeFile]);

  /* ---------------- Debug Line Highlight (SAFE) ---------------- */
  const decorations = useMemo(() => {
    if (!editorRef.current) return [];

    const evt = timeline?.[currentStep];
    if (!evt?.lineno) return [];

    const model = editorRef.current.getModel();
    if (!model) return [];

    const totalLines = model.getLineCount();
    const safeLine = Math.min(evt.lineno, totalLines);

    // ❌ Do not highlight empty or whitespace-only lines
    const content = model.getLineContent(safeLine).trim();
    if (!content) return [];

    return [
      {
        range: {
          startLineNumber: safeLine,
          endLineNumber: safeLine,
          startColumn: 1,
          endColumn: model.getLineMaxColumn(safeLine),
        },
        options: {
          isWholeLine: true,
          className: "debug-active-line",
        },
      },
    ];
  }, [timeline, currentStep]);

  /* ---------------- Apply Decorations ---------------- */
  useEffect(() => {
    if (!editorRef.current) return;

    decorationIds.current = editorRef.current.deltaDecorations(
      decorationIds.current,
      decorations
    );
  }, [decorations]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="px-6 py-3 border-b border-border">
        <h2 className="text-sm font-medium">Code Editor</h2>
      </div>

      <ScrollArea className="flex-1">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          defaultValue={codeContent || ""}
          onChange={(value) => onCodeChange(value ?? "")}
          onMount={handleMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "JetBrains Mono, monospace",
            tabSize: 4,
            insertSpaces: true,
            autoIndent: "full",
            formatOnType: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: true,
            readOnly: isExecuted,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: true,
            scrollBeyondLastLine: false,
          }}
        />
      </ScrollArea>
    </div>
  );
}
