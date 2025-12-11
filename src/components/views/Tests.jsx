import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, CheckCircle2, XCircle, Clock, Plus } from 'lucide-react';

export function Tests({ onRun, isRunning }) {
  const testCases = [
    { name: 'Test Case 1', input: 'n = 5', expected: '5', actual: '5', status: 'passed', time: '0.002s' },
    { name: 'Test Case 2', input: 'n = 10', expected: '55', actual: '55', status: 'passed', time: '0.003s' },
    { name: 'Test Case 3', input: 'n = 15', expected: '610', actual: '610', status: 'passed', time: '0.004s' },
    { name: 'Test Case 4', input: 'n = 0', expected: '0', actual: '0', status: 'passed', time: '0.001s' },
    { name: 'Test Case 5', input: 'n = 1', expected: '1', actual: '1', status: 'passed', time: '0.001s' },
  ];

  const testSuites = [
    { name: 'Fibonacci Tests', total: 5, passed: 5, failed: 0, time: '0.011s' },
    { name: 'Sorting Tests', total: 8, passed: 7, failed: 1, time: '0.045s' },
    { name: 'Graph Tests', total: 6, passed: 6, failed: 0, time: '0.028s' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Test Cases</h1>
            <p className="text-muted-foreground">Run and manage your algorithm test cases</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent border-border text-foreground hover:bg-muted">
              <Plus className="w-4 h-4 mr-2" />
              Add Test
            </Button>

            <Button onClick={onRun} disabled={isRunning} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run All Tests'}
            </Button>
          </div>
        </div>

        {/* Test Suites */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testSuites.map((suite, i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{suite.name}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {suite.total} test cases
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Passed</span>
                    <span className="text-sm font-semibold text-success">{suite.passed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Failed</span>
                    <span className="text-sm font-semibold text-error">{suite.failed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="text-sm font-mono">{suite.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Test Case Results */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Test Results</CardTitle>
            <CardDescription className="text-muted-foreground">
              Detailed test execution results
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {testCases.map((test, i) => (
                <div key={i} className="p-4 rounded-md bg-background border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {test.status === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-error" />
                      )}
                      <span className="font-medium text-foreground">{test.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-mono">{test.time}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Input</p>
                      <p className="font-mono text-foreground">{test.input}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground mb-1">Expected</p>
                      <p className="font-mono text-foreground">{test.expected}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground mb-1">Actual</p>
                      <p className="font-mono text-foreground">{test.actual}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
