import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Circle, Square, Settings, Radio } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";
import { useToast } from "@/hooks/use-toast";

const Record = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(true);
  const { toast } = useToast();

  const handleRecord = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Registrazione terminata" : "Registrazione avviata",
      description: isRecording ? "Il video è stato salvato" : "Registrazione in corso...",
    });
  };

  const handleStream = () => {
    setIsStreaming(!isStreaming);
    toast({
      title: isStreaming ? "Streaming terminato" : "Streaming avviato",
      description: isStreaming ? "Lo streaming è stato interrotto" : "Streaming live in corso...",
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
                <div className="flex items-center gap-2 text-destructive animate-pulse">
                  <Circle className="w-3 h-3 fill-current" />
                  <span className="font-semibold">REC</span>
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
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default Record;
