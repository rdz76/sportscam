import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Circle, Square, Settings, Radio, Star, Play, Pause } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";
import HighlightsList, { Highlight } from "@/components/HighlightsList";
import { useToast } from "@/hooks/use-toast";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  const handleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      toast({
        title: "Registrazione terminata",
        description: `Video salvato con ${highlights.length} highlights`,
      });
    } else {
      // Start recording
      setIsRecording(true);
      setHighlights([]);
      toast({
        title: "Registrazione avviata",
        description: "Premi la stella per marcare gli highlights",
      });
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    toast({
      title: isPaused ? "Registrazione ripresa" : "Registrazione in pausa",
    });
  };

  const handleStream = () => {
    setIsStreaming(!isStreaming);
    toast({
      title: isStreaming ? "Streaming terminato" : "Streaming avviato",
      description: isStreaming ? "Lo streaming è stato interrotto" : "Streaming live in corso...",
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

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
    toast({
      title: "Highlight eliminato",
    });
  };

  const handleUpdateHighlight = (id: string, note: string) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, note } : h))
    );
    toast({
      title: "Nota aggiornata",
    });
  };

  const handleExportHighlights = () => {
    const data = highlights.map((h) => ({
      timestamp: h.formattedTime,
      note: h.note || "Nessuna nota",
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `highlights-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Highlights esportati",
      description: "File JSON scaricato con successo",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Video Preview Area */}
        <Card className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-[var(--shadow-primary)]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Video className="w-16 h-16 text-muted-foreground/50 mx-auto" />
              <p className="text-muted-foreground">Anteprima video</p>
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-destructive animate-pulse">
                    <Circle className="w-3 h-3 fill-current" />
                    <span className="font-semibold">REC</span>
                  </div>
                  <div className="text-white font-mono text-2xl">
                    {formatTime(recordingTime)}
                  </div>
                  {isPaused && (
                    <div className="text-accent font-semibold">PAUSA</div>
                  )}
                </div>
              )}
              {isStreaming && (
                <div className="flex items-center gap-2 text-accent animate-pulse">
                  <Radio className="w-4 h-4" />
                  <span className="font-semibold">LIVE</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Scoreboard Overlay */}
          {showScoreboard && <Scoreboard />}

          {/* Recording Controls Overlay */}
          {isRecording && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <Button
                size="lg"
                onClick={handlePause}
                variant="secondary"
                className="shadow-lg"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Riprendi
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausa
                  </>
                )}
              </Button>
              <Button
                size="lg"
                onClick={handleAddHighlight}
                className="bg-accent hover:bg-accent/90 shadow-lg"
                disabled={isPaused}
              >
                <Star className="w-4 h-4 mr-2 fill-current" />
                Segna Highlight
              </Button>
            </div>
          )}
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Registrazione Locale
                </h3>
                <Button
                  onClick={handleRecord}
                  variant={isRecording ? "destructive" : "default"}
                  className="w-full"
                  size="lg"
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Ferma Registrazione
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Avvia Registrazione
                    </>
                  )}
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-accent" />
                  Streaming Live
                </h3>
                <Button
                  onClick={handleStream}
                  variant={isStreaming ? "destructive" : "default"}
                  className="w-full bg-accent hover:bg-accent/90"
                  size="lg"
                >
                  {isStreaming ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Ferma Stream
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4 mr-2" />
                      Avvia Stream
                    </>
                  )}
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
                Impostazioni Rapide
              </h3>
              <Button
                onClick={() => setShowScoreboard(!showScoreboard)}
                variant="outline"
                className="w-full"
                size="lg"
              >
                {showScoreboard ? "Nascondi" : "Mostra"} Tabellone
              </Button>
            </Card>
          </div>

          {/* Highlights Panel */}
          <HighlightsList
            highlights={highlights}
            onDeleteHighlight={handleDeleteHighlight}
            onUpdateHighlight={handleUpdateHighlight}
            onExportHighlights={handleExportHighlights}
            isRecording={isRecording}
          />
        </div>
      </div>
    </div>
  );
};

export default Record;
