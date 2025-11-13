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
        {/* Top Left Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
          {/* Rec/Live Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleRecord}
              className={`h-14 px-4 rounded-2xl border-2 ${
                isRecording
                  ? "bg-black/80 border-primary"
                  : "bg-black/60 border-white/20"
              } backdrop-blur-sm`}
            >
              <Circle className={`w-8 h-8 mr-2 ${isRecording ? "fill-primary text-primary" : "fill-white/20 text-white/20"}`} />
              <span className="text-white font-semibold text-lg">Rec.</span>
            </Button>
            <Button
              className="h-14 px-4 rounded-2xl border-2 bg-black/60 border-white/20 backdrop-blur-sm"
            >
              <Circle className="w-8 h-8 mr-2 fill-white/20 text-white/20" />
              <span className="text-white font-semibold text-lg">Live</span>
            </Button>
          </div>

          {/* Logo */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10 p-6 w-64">
            <div className="text-center">
              <div className="text-3xl font-bold">
                <span className="text-white">PIX</span>
                <span className="text-primary">LIVE</span>
              </div>
              <div className="text-white/50 text-xs mt-1">by MOVE'N SEE</div>
            </div>
          </div>

          {/* Highlight Box */}
          {isRecording && highlights.length > 0 && (
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10 p-6 w-64">
              <div className="text-white text-center mb-3">
                Highlight - {formatTime(highlights[highlights.length - 1].timestamp)}
              </div>
              <div className="flex justify-center">
                <Button
                  size="icon"
                  className="w-16 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Star className="w-8 h-8" />
                </Button>
              </div>
            </div>
          )}

          {/* Audio Toggle */}
          <div className="flex gap-2">
            <Button
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 rounded-full ${
                isMuted ? "bg-muted/80" : "bg-primary"
              } border-2 ${isMuted ? "border-white/20" : "border-primary"}`}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
            <Button
              size="icon"
              className="w-14 h-14 rounded-full bg-muted/80 border-2 border-white/20"
            >
              <VolumeX className="w-6 h-6" />
            </Button>
          </div>
        </div>

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

          {/* Zoom Controls - Right Side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <Button
              size="icon"
              className="w-16 h-16 rounded-2xl bg-muted/80 hover:bg-muted text-foreground backdrop-blur-sm"
            >
              <Plus className="w-8 h-8" />
            </Button>
            <div className="w-16 rounded-2xl bg-muted/80 backdrop-blur-sm p-4 flex items-center justify-center">
              <div className="text-white font-semibold">Zoom</div>
            </div>
            <div className="w-16 h-40 bg-muted/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-2">
              <div className="h-full w-2 bg-border rounded-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-10 bg-foreground rounded-full" />
              </div>
            </div>
            <Button
              size="icon"
              className="w-16 h-16 rounded-2xl bg-muted/80 hover:bg-muted text-foreground backdrop-blur-sm"
            >
              <Minus className="w-8 h-8" />
            </Button>
          </div>
        </div>

        {/* Bottom Controls Panel */}
        <div className="bg-black pb-safe">
          {/* Scoreboard Controls */}
          <div className="flex items-center justify-center gap-8 py-6">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-white text-base font-semibold">REAL TUSC</span>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="w-14 h-14 rounded-full bg-muted/80 hover:bg-muted text-foreground"
                >
                  <Minus className="w-6 h-6" />
                </Button>
                <div className="text-white text-5xl font-bold w-20 text-center">
                  {homeScore}
                </div>
                <Button
                  size="icon"
                  onClick={() => setHomeScore(homeScore + 1)}
                  className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Plus className="w-12 h-12" />
                </Button>
              </div>
            </div>

            {/* Game Timer */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-white text-5xl font-bold font-mono">
                {Math.floor(gameTime / 60)}:{String(gameTime % 60).padStart(2, '0')}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setGameTime(Math.max(0, gameTime - 1))}
                  className="h-10 px-4 rounded-full bg-muted/80 hover:bg-muted text-foreground text-sm font-semibold"
                >
                  -1s
                </Button>
                <Button
                  size="icon"
                  className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Clock className="w-8 h-8" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setGameTime(gameTime + 1)}
                  className="h-10 px-4 rounded-full bg-muted/80 hover:bg-muted text-foreground text-sm font-semibold"
                >
                  +1s
                </Button>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-white text-base font-semibold">TOR3TESTE</span>
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  onClick={() => setAwayScore(awayScore + 1)}
                  className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                  <Plus className="w-12 h-12" />
                </Button>
                <div className="text-white text-5xl font-bold w-20 text-center">
                  {awayScore}
                </div>
                <Button
                  size="icon"
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="w-14 h-14 rounded-full bg-muted/80 hover:bg-muted text-foreground"
                >
                  <Minus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Record;
