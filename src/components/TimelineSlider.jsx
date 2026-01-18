import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  Square,
  Lock,
} from "lucide-react";

/*
====================================================
TimelineSlider = CONTROL PANEL (UI ONLY)
====================================================
*/

export function TimelineSlider({
  currentStep,
  totalSteps,

  isExecuted,
  isPlaying,
  speed,

  onPlay,
  onPause,
  onRestart,
  onStop,

  onStepChange,
  onSpeedChange,
}) {
  return (
    <div className="px-4 py-2 bg-card border-t border-border">
      <div className="flex flex-col gap-2">

        {/* ================= RUNNING WARNING ================= */}
        {isPlaying && (
          <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded px-3 py-1">
            <Lock className="w-3 h-3" />
            <span>
              Code is running. <b>Pause</b> or <b>Stop</b> to edit.
            </span>
          </div>
        )}

        {/* ================= CONTROLS ================= */}
        <div className="flex flex-wrap items-center gap-2">

          {/* RESTART */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onRestart}
            disabled={!isExecuted || currentStep === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          {/* PLAY / PAUSE */}
          <Button
            size="icon"
            className={`h-8 w-8 transition-colors ${
              isPlaying
                ? "bg-red-500 text-white hover:bg-red-600" // 🔴 RUNNING
                : "bg-primary text-primary-foreground hover:bg-primary/90" // 🔵 NORMAL
            }`}
            onClick={isPlaying ? onPause : onPlay}
            disabled={!isExecuted && !isPlaying}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          {/* STOP */}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onStop}
            disabled={!isExecuted && !isPlaying}
          >
            <Square className="w-4 h-4" />
          </Button>

          {/* SPEED */}
          <div className="flex items-center gap-2 text-xs ml-3">
            <span className="text-muted-foreground">Speed</span>
            <input
              type="range"
              min={200}
              max={1500}
              step={100}
              value={speed}
              onChange={(e) =>
                onSpeedChange(Number(e.target.value))
              }
              className="h-1"
              disabled={!isExecuted}
            />
          </div>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground min-w-[70px] text-right">
            {isExecuted ? currentStep + 1 : 0} / {totalSteps}
          </span>

          <Slider
            value={[currentStep]}
            onValueChange={([v]) => onStepChange(v)}
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            step={1}
            disabled={!isExecuted}
            className="flex-1 h-2"
          />
        </div>
      </div>
    </div>
  );
}
