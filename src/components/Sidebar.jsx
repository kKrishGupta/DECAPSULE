import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { LayoutDashboard, FolderOpen, TestTube, Bug, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx';

export function Sidebar({ collapsed, onToggle, activeView, onViewChange }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'tests', icon: TestTube, label: 'Tests' },
    { id: 'debug', icon: Bug, label: 'Debug' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && <span className="text-sm font-medium text-foreground">Navigation</span>}
        <Button variant="ghost" size="icon" onClick={onToggle} className="bg-transparent text-foreground hover:bg-muted hover:text-foreground">
          {collapsed ? <ChevronRight className="w-4 h-4" strokeWidth={2} /> : <ChevronLeft className="w-4 h-4" strokeWidth={2} />}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <TooltipProvider>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => onViewChange(item.id)}
                    className={`w-full mb-1 ${collapsed ? 'justify-center px-0' : 'justify-start'} ${
                      isActive
                        ? item.id === 'debug'
                          ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 hover:text-cyan-300'
                          : 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary'
                        : 'bg-transparent text-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} strokeWidth={2} />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                    <p className="text-sm">{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
