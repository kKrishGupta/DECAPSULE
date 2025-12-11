import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function TimelineSlider({ currentStep, totalSteps, onStepChange, isExecuted }) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying || !isExecuted) return;

    const interval = setInterval(() => {
      onStepChange((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, onStepChange, isExecuted]);

  return (
    <div className="px-6 py-4 bg-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStepChange(0)}
            disabled={currentStep === 0 || !isExecuted}
            className="bg-transparent text-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <SkipBack className="w-4 h-4" strokeWidth={2} />
          </Button>

          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!isExecuted}
            className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-4 h-4" strokeWidth={2} /> : <Play className="w-4 h-4" strokeWidth={2} />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStepChange(totalSteps - 1)}
            disabled={currentStep === totalSteps - 1 || !isExecuted}
            className="bg-transparent text-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            <SkipForward className="w-4 h-4" strokeWidth={2} />
          </Button>
        </div>

        <div className="flex-1 flex items-center gap-4">
          <Slider value={[currentStep]} onValueChange={([value]) => onStepChange(value)} max={totalSteps - 1} step={1} disabled={!isExecuted} className="flex-1" />
          <span className="text-sm font-mono text-foreground min-w-20 text-right">
            {isExecuted ? `${currentStep + 1} / ${totalSteps}` : '0 / 0'}
          </span>
        </div>
      </div>
    </div>
  );
}
