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

  /* ---------------- Mount ---------------- */
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

    // Line click
    editor.onMouseDown((e) => {
      if (e.target.position) {
        onLineClick?.(e.target.position.lineNumber);
      }
    });

    // Layout once (fix blinking)
    setTimeout(() => editor.layout(), 0);
  };

  /* ---------------- Update Code ONLY on file change ---------------- */
  useEffect(() => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    if (model.getValue() !== codeContent) {
      model.setValue(codeContent || "");
    }
  }, [activeFile]); // 🔥 ONLY file change

  /* ---------------- Debug Line Highlight ---------------- */
  const decorations = useMemo(() => {
    const evt = timeline?.[currentStep];
    if (!evt?.lineno) return [];

    return [
      {
        range: {
          startLineNumber: evt.lineno,
          endLineNumber: evt.lineno,
          startColumn: 1,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "bg-primary/20",
        },
      },
    ];
  }, [timeline, currentStep]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current.deltaDecorations([], decorations);
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
            tabSize: 4,
            insertSpaces: true,
            autoIndent: "full",
            formatOnType: true,
            wordBasedSuggestions: true,
            quickSuggestions: true,
            readOnly: isExecuted,
            smoothScrolling: true,
            renderWhitespace: "none",
          }}
        />
      </ScrollArea>
    </div>
  );
}
