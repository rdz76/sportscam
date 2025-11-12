import { Star, Link as LinkIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Highlight } from "./HighlightsList";

interface CompactHighlightsProps {
  highlights: Highlight[];
  recordingTime: number;
}

const CompactHighlights = ({ highlights, recordingTime }: CompactHighlightsProps) => {
  const latestHighlight = highlights[highlights.length - 1];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-4 z-20">
      <Card className="bg-black/80 backdrop-blur-sm border-white/20 p-4 min-w-[200px]">
        <div className="text-white space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium opacity-70">REC</span>
          </div>
          
          {latestHighlight && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="font-medium">Highlight - {latestHighlight.formattedTime}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-white/10 h-auto py-2"
              >
                <LinkIcon className="w-4 h-4 mr-2 text-primary" />
                <span className="text-xs truncate">{latestHighlight.note || "Nessuna nota"}</span>
              </Button>
            </div>
          )}
          
          {!latestHighlight && (
            <div className="text-center py-2 opacity-50">
              <Star className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs">Nessun highlight</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const Button = ({ children, className, ...props }: any) => (
  <button className={className} {...props}>
    {children}
  </button>
);

export default CompactHighlights;
