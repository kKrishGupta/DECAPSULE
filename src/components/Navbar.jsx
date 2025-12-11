import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Play, Zap, Moon, Sun, FileCode, User, Loader2, ChevronDown, Bug } from 'lucide-react';

const languageConfig = {
  javascript: { label: 'JavaScript', extension: '.js', icon: '🟨' },
  python: { label: 'Python', extension: '.py', icon: '🐍' },
  cpp: { label: 'C++', extension: '.cpp', icon: '⚙️' },
  java: { label: 'Java', extension: '.java', icon: '☕' },
};

export function Navbar({ onAutoFixClick, onRun, onDebugClick, isRunning, language, onLanguageChange, theme, onThemeToggle, onProfileClick, isLoggedIn, currentUser }) {
  const currentLang = languageConfig[language];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!');
      // Add actual logout logic here
    }
  };

  return (
    <nav className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-1 flex items-center justify-center">
            <FileCode className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-tech font-semibold text-foreground">DECAPSULE</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="bg-transparent text-foreground hover:bg-muted hover:text-foreground">
              <span className="mr-2">{currentLang.icon}</span>
              fibonacci{currentLang.extension}
              <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover text-popover-foreground border-border">
            <DropdownMenuItem className="text-popover-foreground hover:bg-muted hover:text-foreground">fibonacci{currentLang.extension}</DropdownMenuItem>
            <DropdownMenuItem className="text-popover-foreground hover:bg-muted hover:text-foreground">quicksort{currentLang.extension}</DropdownMenuItem>
            <DropdownMenuItem className="text-popover-foreground hover:bg-muted hover:text-foreground">graph-bfs{currentLang.extension}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="bg-muted text-foreground hover:bg-muted/80 hover:text-foreground">
              <span className="mr-2">{currentLang.icon}</span>
              {currentLang.label}
              <ChevronDown className="w-3 h-3 ml-2" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover text-popover-foreground border-border">
            {Object.entries(languageConfig).map(([key, config]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onLanguageChange(key)}
                className="text-popover-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onRun} disabled={isRunning} className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={2} />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" strokeWidth={2} />
              Run
            </>
          )}
        </Button>

        <Button onClick={onDebugClick} className="bg-amber-600 text-white hover:bg-amber-700">
          <Bug className="w-4 h-4 mr-2" strokeWidth={2} />
          Debug
        </Button>

        <Button onClick={onAutoFixClick} className="bg-tertiary text-tertiary-foreground hover:bg-tertiary/90">
          <Zap className="w-4 h-4 mr-2" strokeWidth={2} />
          Auto-Fix
        </Button>

        <Button variant="ghost" size="icon" onClick={onThemeToggle} className="bg-transparent text-foreground hover:bg-muted hover:text-foreground">
          {theme === 'dark' ? <Moon className="w-5 h-5" strokeWidth={2} /> : <Sun className="w-5 h-5" strokeWidth={2} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-transparent text-foreground hover:bg-muted hover:text-foreground rounded-full">
              <User className="w-5 h-5" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover text-popover-foreground border-border">
            {isLoggedIn ? (
              <>
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-semibold text-popover-foreground">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
                <DropdownMenuItem onClick={onProfileClick} className="text-popover-foreground hover:bg-muted hover:text-foreground cursor-pointer">Profile</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={onProfileClick} className="text-popover-foreground hover:bg-muted hover:text-foreground cursor-pointer">Logout</DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={onProfileClick} className="text-popover-foreground hover:bg-muted hover:text-foreground cursor-pointer">Login</DropdownMenuItem>
                <DropdownMenuItem onClick={onProfileClick} className="text-popover-foreground hover:bg-muted hover:text-foreground cursor-pointer">Sign Up</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
