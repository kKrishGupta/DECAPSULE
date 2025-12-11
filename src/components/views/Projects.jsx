import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FolderOpen, Clock, FileCode } from 'lucide-react';

export function Projects() {
  const projects = [
    {
      name: 'DSA Practice',
      description: 'Collection of data structure implementations',
      files: 24,
      lastModified: '2 hours ago',
      language: 'JavaScript',
    },
    {
      name: 'Algorithm Challenges',
      description: 'LeetCode and competitive programming solutions',
      files: 56,
      lastModified: '1 day ago',
      language: 'Python',
    },
    {
      name: 'Graph Algorithms',
      description: 'BFS, DFS, Dijkstra, and more',
      files: 18,
      lastModified: '3 days ago',
      language: 'C++',
    },
    {
      name: 'Dynamic Programming',
      description: 'DP problems and optimizations',
      files: 32,
      lastModified: '1 week ago',
      language: 'Java',
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
            <p className="text-muted-foreground">Manage your algorithm projects and files</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <Card
              key={i}
              className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary" strokeWidth={2} />
                    </div>
                    <div>
                      <CardTitle className="text-foreground">{project.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {project.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileCode className="w-4 h-4" strokeWidth={2} />
                      <span>{project.files} files</span>
                    </div>

                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                      {project.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" strokeWidth={2} />
                    <span>{project.lastModified}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
