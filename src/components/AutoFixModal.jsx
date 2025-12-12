import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle } from "lucide-react";

/* ---------------------------------------------------------
   NORMALIZER — Converts backend FIX + EXPLANATION into
   clean structured format for the Auto-Fix UI.
--------------------------------------------------------- */
function normalizeExplanation(raw) {
  if (!raw) {
    return {
      problem: "No problem explanation available.",
      solution: "No solution description provided.",
      impact: {
        time: "N/A",
        space: "N/A",
        execution: "N/A",
      },
      full_text: "",
    };
  }

  // If backend already sends structured object:
  if (typeof raw === "object") {
    return {
      problem: raw.problem || "No problem explanation available.",
      solution: raw.solution || "No solution description provided.",
      impact: raw.impact || {
        time: "N/A",
        space: "N/A",
        execution: "N/A",
      },
      full_text: raw.full_text || "",
    };
  }

  // If explanation is a RAW LONG STRING → cleanly extract first part as summary.
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

  return {
    problem: lines[0] || "No problem explanation available.",
    solution: "AI applied automated debugging and code improvement.",
    impact: {
      time: "N/A",
      space: "N/A",
      execution: "Execution unchanged",
    },
    full_text: raw, // Full raw text shown in "Detailed Explanation"
  };
}

export function AutoFixModal({
  open,
  onOpenChange,
  result,
  language,
  onApplyFix,
}) {
  const beforeCode = result?.before || "";
  const afterCode = result?.after || "";

  // Clean explanation always
  const explanation = normalizeExplanation(result?.explanation);

  const handleApplyFix = () => {
    if (onApplyFix && afterCode) {
      onApplyFix(afterCode);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            AI Auto-Fix Suggestion
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Review the proposed changes and explanation before applying
          </DialogDescription>
        </DialogHeader>

        {/* ================= TABS ================= */}
        <Tabs defaultValue="patch" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="bg-muted">
            <TabsTrigger
              value="patch"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Patch Preview
            </TabsTrigger>

            <TabsTrigger
              value="explanation"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-foreground"
            >
              Explanation
            </TabsTrigger>
          </TabsList>

          {/* ================= PATCH PREVIEW ================= */}
          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="patch" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">

                  {/* BEFORE ORIGINAL */}
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="bg-error/10 border-b border-border p-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-error" strokeWidth={2} />
                      <span className="text-sm font-mono text-foreground">
                        Before (Original)
                      </span>
                    </div>

                    <pre className="p-4 text-sm font-mono text-foreground bg-background whitespace-pre-wrap">
                      <code>{beforeCode}</code>
                    </pre>
                  </div>

                  {/* AFTER FIXED */}
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="bg-success/10 border-b border-border p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={2} />
                      <span className="text-sm font-mono text-foreground">
                        After (Optimized)
                      </span>
                    </div>

                    <pre className="p-4 text-sm font-mono text-foreground bg-background whitespace-pre-wrap">
                      <code>{afterCode}</code>
                    </pre>
                  </div>

                </div>
              </ScrollArea>
            </TabsContent>

            {/* ================= EXPLANATION TAB ================= */}
            <TabsContent value="explanation" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">

                  {/* PROBLEM IDENTIFIED */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Problem Identified
                    </h3>

                    <p className="text-sm text-foreground leading-relaxed">
                      {explanation.problem}
                    </p>
                  </div>

                  {/* SOLUTION APPLIED */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Solution Applied
                    </h3>

                    <p className="text-sm text-foreground leading-relaxed">
                      {explanation.solution}
                    </p>
                  </div>

                  {/* PERFORMANCE IMPACT */}
                  <div className="p-4 rounded-md bg-primary/10 border border-primary">
                    <h4 className="text-sm font-semibold text-primary mb-2">
                      Performance Impact
                    </h4>

                    <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                      <li>Time complexity: {explanation.impact.time}</li>
                      <li>Space complexity: {explanation.impact.space}</li>
                      <li>Execution impact: {explanation.impact.execution}</li>
                    </ul>
                  </div>

                  {/* DETAILED EXPLANATION */}
                  {explanation.full_text ? (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Detailed Explanation
                      </h3>

                      <pre className="text-sm whitespace-pre-wrap text-foreground bg-muted p-3 rounded-md border">
                        {explanation.full_text}
                      </pre>
                    </div>
                  ) : null}

                </div>
              </ScrollArea>
            </TabsContent>
          </div>

          {/* ================= FOOTER BUTTONS ================= */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="bg-transparent text-foreground hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>

            <Button
              onClick={handleApplyFix}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!afterCode}
            >
              Apply Fix
            </Button>
          </div>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
