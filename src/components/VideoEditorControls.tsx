import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Scissors, Trash2, Save, Loader2 } from "lucide-react";
import { TimeRange } from "@/hooks/useVideoEditor";
import { Progress } from "./ui/progress";

interface VideoEditorControlsProps {
  currentTime: number;
  duration: number;
  cutRanges: TimeRange[];
  isProcessing: boolean;
  progress: number;
  isEditorLoaded: boolean;
  onLoadEditor: () => void;
  onAddCutRange: (start: number, end: number) => void;
  onRemoveCutRange: (id: string) => void;
  onClearRanges: () => void;
  onProcessVideo: () => void;
}

const VideoEditorControls = ({
  currentTime,
  duration,
  cutRanges,
  isProcessing,
  progress,
  isEditorLoaded,
  onLoadEditor,
  onAddCutRange,
  onRemoveCutRange,
  onClearRanges,
  onProcessVideo,
}: VideoEditorControlsProps) => {
  const [cutStart, setCutStart] = useState<number | null>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleMarkCutPoint = () => {
    if (cutStart === null) {
      setCutStart(currentTime);
    } else {
      onAddCutRange(cutStart, currentTime);
      setCutStart(null);
    }
  };

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Editor Video</h3>
          {!isEditorLoaded && (
            <Button onClick={onLoadEditor} size="sm" variant="outline">
              Carica Editor
            </Button>
          )}
        </div>

        {isEditorLoaded && (
          <>
            {/* Controlli di taglio */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleMarkCutPoint}
                  className="flex-1"
                  variant={cutStart !== null ? "destructive" : "default"}
                  disabled={isProcessing}
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  {cutStart !== null
                    ? `Fine taglio (${formatTime(cutStart)})`
                    : "Inizio taglio"}
                </Button>
                
                {cutRanges.length > 0 && (
                  <Button
                    onClick={onClearRanges}
                    variant="outline"
                    size="icon"
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                {cutStart !== null
                  ? "Clicca di nuovo per marcare la fine della sezione da rimuovere"
                  : "Clicca per marcare l'inizio di una sezione da rimuovere"}
              </p>
            </div>

            {/* Lista sezioni da rimuovere */}
            {cutRanges.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Sezioni da rimuovere:
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cutRanges.map((range) => (
                    <div
                      key={range.id}
                      className="flex items-center justify-between p-2 bg-destructive/10 rounded-md"
                    >
                      <span className="text-sm text-foreground">
                        {formatTime(range.start)} - {formatTime(range.end)}
                        <span className="text-muted-foreground ml-2">
                          ({formatTime(range.end - range.start)})
                        </span>
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onRemoveCutRange(range.id)}
                        disabled={isProcessing}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Elaborazione */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Elaborazione video...</span>
                  <span className="text-foreground font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Pulsante salva */}
            {cutRanges.length > 0 && !isProcessing && (
              <Button
                onClick={onProcessVideo}
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Elaborazione...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salva Video Modificato
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VideoEditorControls;
