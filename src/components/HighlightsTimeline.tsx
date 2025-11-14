import { Star } from "lucide-react";
import { Highlight } from "./HighlightsList";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

interface HighlightsTimelineProps {
  highlights: Highlight[];
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const HighlightsTimeline = ({ highlights, currentTime, duration, onSeek }: HighlightsTimelineProps) => {
  const getProgressPercentage = (timestamp: number) => {
    return duration > 0 ? (timestamp / duration) * 100 : 0;
  };

  const isActive = (timestamp: number) => {
    return Math.abs(currentTime - timestamp) < 3; // Active if within 3 seconds
  };

  return (
    <div className="space-y-4">
      {/* Visual Timeline */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        {/* Progress bar */}
        <div 
          className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${getProgressPercentage(currentTime)}%` }}
        />
        
        {/* Highlight markers */}
        {highlights.map((highlight) => (
          <button
            key={highlight.id}
            onClick={() => onSeek(highlight.timestamp)}
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-200 ${
              isActive(highlight.timestamp) 
                ? 'w-4 h-4 scale-125' 
                : 'w-3 h-3 hover:scale-110'
            }`}
            style={{ left: `${getProgressPercentage(highlight.timestamp)}%` }}
            title={`${highlight.formattedTime} - ${highlight.note || 'Highlight'}`}
          >
            <Star 
              className={`w-full h-full ${
                isActive(highlight.timestamp)
                  ? 'text-primary fill-primary'
                  : 'text-accent fill-accent'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Highlights List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Star className="w-4 h-4 text-accent" />
            Highlights ({highlights.length})
          </h4>
        </div>
        
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {highlights.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nessun highlight registrato</p>
              </div>
            ) : (
              highlights.map((highlight) => (
                <Button
                  key={highlight.id}
                  variant={isActive(highlight.timestamp) ? "default" : "ghost"}
                  className="w-full justify-start h-auto py-3 px-3"
                  onClick={() => onSeek(highlight.timestamp)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Star className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isActive(highlight.timestamp) ? 'fill-primary-foreground' : 'fill-accent text-accent'
                    }`} />
                    <div className="flex-1 text-left">
                      <div className="font-mono text-sm font-semibold">
                        {highlight.formattedTime}
                      </div>
                      {highlight.note && (
                        <div className="text-xs opacity-80 mt-1">
                          {highlight.note}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default HighlightsTimeline;
