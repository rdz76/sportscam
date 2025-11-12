import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Circle, Square, Star, Play, Pause, Volume2, VolumeX, ZoomIn, ZoomOut, Plus, Minus, Clock } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";
import { Highlight } from "@/components/HighlightsList";
import { useToast } from "@/hooks/use-toast";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import MobileSidebar from "@/components/MobileSidebar";
import CompactHighlights from "@/components/CompactHighlights";

const Record = () => {
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [showHighlights, setShowHighlights] = useState(true);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [gameTime, setGameTime] = useState(2635); // 43:35 in seconds
  const { toast } = useToast();
  
  const {
    isRecording,
    isPaused,
    recordingTime,
    videoRef,
    startRecording,
    pauseRecording,
    stopRecording,
    startCamera,
  } = useVideoRecorder();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const handleRecord = async () => {
    if (isRecording) {
      await stopRecording();
      toast({
        title: "Registrazione terminata",
        description: `Video salvato con ${highlights.length} highlights`,
      });
    } else {
      const started = await startRecording();
      if (started) {
        setHighlights([]);
        toast({
          title: "Registrazione avviata",
          description: "Premi la stella per marcare gli highlights",
        });
      }
    }
  };

  const handlePause = () => {
    pauseRecording();
    toast({
      title: isPaused ? "Registrazione ripresa" : "Registrazione in pausa",
    });
  };

  const handleAddHighlight = () => {
    if (!isRecording || isPaused) {
      toast({
        title: "Impossibile aggiungere highlight",
        description: "Devi essere in registrazione attiva",
        variant: "destructive",
      });
      return;
    }

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      timestamp: recordingTime,
      note: "",
      formattedTime: formatTime(recordingTime),
    };

    setHighlights((prev) => [...prev, newHighlight]);
    toast({
      title: "Highlight aggiunto!",
      description: `Timestamp: ${formatTime(recordingTime)}`,
    });
  };


  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Mobile Sidebar */}
      <MobileSidebar 
        onToggleHighlights={() => setShowHighlights(!showHighlights)}
        onToggleScoreboard={() => setShowScoreboard(!showScoreboard)}
      />
      
      {/* Main Content Area */}
      <div className="fixed inset-0 right-20 flex flex-col">
        {/* Video Preview - Full Screen */}
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Scoreboard Overlay */}
          {showScoreboard && <Scoreboard />}
          
          {/* Compact Highlights Overlay */}
          {showHighlights && isRecording && (
            <CompactHighlights highlights={highlights} recordingTime={recordingTime} />
          )}

          {/* Zoom Controls - Right Side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <Button
              size="icon"
              className="w-12 h-12 rounded-xl bg-muted/80 hover:bg-muted text-foreground"
            >
              <Plus className="w-6 h-6" />
            </Button>
            <div className="w-12 h-32 bg-muted/80 rounded-xl flex items-center justify-center">
              <div className="h-24 w-1 bg-border rounded-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-foreground rounded-full" />
              </div>
            </div>
            <Button
              size="icon"
              className="w-12 h-12 rounded-xl bg-muted/80 hover:bg-muted text-foreground"
            >
              <Minus className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Bottom Controls Panel */}
        <div className="bg-black border-t border-border/20 pb-safe">
          {/* Scoreboard Controls */}
          <div className="flex items-center justify-center gap-4 py-4 border-b border-border/20">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-white text-xs opacity-70">REAL TUSC</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="w-10 h-10 rounded-full bg-muted/80 hover:bg-muted text-foreground"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="text-white text-4xl font-bold w-16 text-center">
                  {homeScore}
                </div>
                <Button
                  size="icon"
                  onClick={() => setHomeScore(homeScore + 1)}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Plus className="w-8 h-8" />
                </Button>
              </div>
            </div>

            {/* Game Timer */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-white text-4xl font-bold font-mono">
                {Math.floor(gameTime / 60)}:{String(gameTime % 60).padStart(2, '0')}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setGameTime(Math.max(0, gameTime - 1))}
                  className="bg-muted/80 hover:bg-muted text-foreground text-xs px-3"
                >
                  -1s
                </Button>
                <Button
                  size="icon"
                  className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Play className="w-5 h-5" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setGameTime(gameTime + 1)}
                  className="bg-muted/80 hover:bg-muted text-foreground text-xs px-3"
                >
                  +1s
                </Button>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-white text-xs opacity-70">TOR3TESTE</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={() => setAwayScore(awayScore + 1)}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Plus className="w-8 h-8" />
                </Button>
                <div className="text-white text-4xl font-bold w-16 text-center">
                  {awayScore}
                </div>
                <Button
                  size="icon"
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="w-10 h-10 rounded-full bg-muted/80 hover:bg-muted text-foreground"
                >
                  <Minus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Control Buttons */}
          <div className="flex items-center justify-center gap-6 py-6">
            {/* Audio Toggle */}
            <Button
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="w-12 h-12 rounded-full bg-muted/80 hover:bg-muted text-foreground"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>

            {/* Highlight Button */}
            <Button
              size="icon"
              onClick={handleAddHighlight}
              disabled={!isRecording || isPaused}
              className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              <Plus className="w-10 h-10" />
            </Button>

            {/* Record Button */}
            <Button
              size="icon"
              onClick={handleRecord}
              className={`w-24 h-24 rounded-full shadow-lg ${
                isRecording
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30"
              }`}
            >
              {isRecording ? (
                <Square className="w-12 h-12" />
              ) : (
                <Circle className="w-12 h-12" />
              )}
            </Button>

            {/* Pause Button */}
            {isRecording && (
              <Button
                size="icon"
                onClick={handlePause}
                className="w-20 h-20 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
              >
                {isPaused ? <Play className="w-10 h-10" /> : <Pause className="w-10 h-10" />}
              </Button>
            )}

            {/* Star Highlight Button */}
            <Button
              size="icon"
              onClick={handleAddHighlight}
              disabled={!isRecording || isPaused}
              className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
            >
              <Star className="w-6 h-6 fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;
