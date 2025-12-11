import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle } from 'lucide-react';

const codeBeforeExamples = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
  cpp: `int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  java: `public static int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
};

const codeAfterExamples = {
  javascript: `function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`,
  python: `def fibonacci(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]`,
  cpp: `int fibonacci(int n, unordered_map<int, int>& memo) {
    if (n <= 1) return n;
    if (memo.find(n) != memo.end()) {
        return memo[n];
    }
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    return memo[n];
}`,
  java: `public static int fibonacci(int n, Map<Integer, Integer> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) {
        return memo.get(n);
    }
    int result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
    memo.put(n, result);
    return result;
}`,
};

export function AutoFixModal({ open, onOpenChange, language, onApplyFix }) {
  const handleApplyFix = () => {
    if (onApplyFix) {
      onApplyFix(codeAfterExamples[language]);
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

          <div className="flex-1 overflow-hidden mt-4">
            <TabsContent value="patch" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="bg-error/10 border-b border-border p-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-error" strokeWidth={2} />
                      <span className="text-sm font-mono text-foreground">Before (Original)</span>
                    </div>
                    <pre className="p-4 text-sm font-mono text-foreground bg-background">
                      <code>{codeBeforeExamples[language]}</code>
                    </pre>
                  </div>

                  <div className="rounded-md border border-border overflow-hidden">
                    <div className="bg-success/10 border-b border-border p-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" strokeWidth={2} />
                      <span className="text-sm font-mono text-foreground">After (Optimized)</span>
                    </div>
                    <pre className="p-4 text-sm font-mono text-foreground bg-background">
                      <code>{codeAfterExamples[language]}</code>
                    </pre>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="explanation" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="space-y-6 pr-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Problem Identified</h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      The original implementation uses naive recursion, which results in exponential
                      time complexity O(2^n). This causes significant performance issues for larger
                      input values due to redundant calculations.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Solution Applied</h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      Added memoization to cache previously computed values. This optimization
                      reduces the time complexity to O(n) by storing results in a memo object and
                      checking it before performing recursive calls.
                    </p>
                  </div>

                  <div className="p-4 rounded-md bg-primary/10 border border-primary">
                    <h4 className="text-sm font-semibold text-primary mb-2">Performance Impact</h4>
                    <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
                      <li>Time complexity: O(2^n) → O(n)</li>
                      <li>Space complexity: O(n) for memoization storage</li>
                      <li>Execution time for n=40: ~30s → ~0.001s</li>
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>

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
            >
              Apply Fix
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}