import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, CheckCircle2, AlertCircle, TrendingUp, Code2 } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Total Runs', value: '127', icon: Activity, color: 'text-primary' },
    { label: 'Avg. Time', value: '2.3s', icon: Clock, color: 'text-secondary' },
    { label: 'Fixed Bugs', value: '43', icon: CheckCircle2, color: 'text-success' },
    { label: 'Active Issues', value: '8', icon: AlertCircle, color: 'text-warning' },
  ];

  const recentActivity = [
    { file: 'fibonacci.js', action: 'Debugged', time: '2 mins ago', status: 'success' },
    { file: 'quicksort.py', action: 'Auto-fixed', time: '15 mins ago', status: 'success' },
    { file: 'graph-bfs.cpp', action: 'Running', time: '1 hour ago', status: 'running' },
    { file: 'binary-tree.java', action: 'Failed', time: '2 hours ago', status: 'error' },
  ];

  const performanceData = [
    { algorithm: 'Fibonacci (DP)', complexity: 'O(n)', runs: 45, avgTime: '0.002s' },
    { algorithm: 'Quick Sort', complexity: 'O(n log n)', runs: 32, avgTime: '0.015s' },
    { algorithm: 'BFS Traversal', complexity: 'O(V + E)', runs: 28, avgTime: '0.008s' },
    { algorithm: 'Binary Search', complexity: 'O(log n)', runs: 22, avgTime: '0.001s' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your debugging activity and performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} strokeWidth={2} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Your latest debugging sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-md bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-primary" strokeWidth={2} />
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.file}</p>
                        <p className="text-xs text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'success'
                            ? 'bg-success/10 text-success'
                            : activity.status === 'running'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-error/10 text-error'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" strokeWidth={2} />
                Performance Metrics
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Algorithm execution statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, i) => (
                  <div key={i} className="p-3 rounded-md bg-background border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">{data.algorithm}</p>
                      <span className="text-xs font-mono text-primary">{data.complexity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{data.runs} runs</span>
                      <span>Avg: {data.avgTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
