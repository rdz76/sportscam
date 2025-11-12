import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Share2, Trash2, Video, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const mockRecordings = [
  {
    id: 1,
    title: "Partita di calcio - 11/11/2025",
    duration: "45:32",
    thumbnail: "/placeholder.svg",
    date: "Oggi",
    highlights: [
      { timestamp: "12:34", note: "Goal fantastico!" },
      { timestamp: "23:45", note: "Parata incredibile" },
      { timestamp: "38:12", note: "Calcio di punizione" },
    ],
  },
  {
    id: 2,
    title: "Allenamento basket",
    duration: "1:23:15",
    thumbnail: "/placeholder.svg",
    date: "Ieri",
    highlights: [
      { timestamp: "5:23", note: "Tripla vincente" },
      { timestamp: "45:12", note: "Schiacciata" },
    ],
  },
  {
    id: 3,
    title: "Torneo tennis",
    duration: "2:15:48",
    thumbnail: "/placeholder.svg",
    date: "3 giorni fa",
    highlights: [
      { timestamp: "15:34", note: "Ace perfetto" },
      { timestamp: "1:05:23", note: "Match point" },
      { timestamp: "1:45:12", note: "Rovescio vincente" },
      { timestamp: "2:10:05", note: "Vittoria!" },
    ],
  },
];

const Library = () => {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "Funzione in arrivo prossimamente",
    });
  };

  const toggleExpanded = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Le Mie Registrazioni</h1>
          <p className="text-muted-foreground">Gestisci tutti i tuoi video sportivi</p>
        </div>

        {mockRecordings.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nessuna registrazione</h3>
            <p className="text-muted-foreground">Inizia a registrare le tue partite!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRecordings.map((recording) => (
              <Card key={recording.id} className="overflow-hidden hover:shadow-[var(--shadow-primary)] transition-shadow">
                <div className="relative aspect-video bg-black">
                  <img
                    src={recording.thumbnail}
                    alt={recording.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-full"
                      onClick={() => handleAction("Riproduzione video")}
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {recording.duration}
                  </div>
                  {recording.highlights && recording.highlights.length > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {recording.highlights.length} highlights
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{recording.title}</h3>
                    <p className="text-sm text-muted-foreground">{recording.date}</p>
                  </div>
                  
                  {recording.highlights && recording.highlights.length > 0 && (
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-accent hover:text-accent hover:bg-accent/10"
                        onClick={() => toggleExpanded(recording.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        {expandedId === recording.id ? "Nascondi" : "Mostra"} Highlights
                      </Button>
                      
                      {expandedId === recording.id && (
                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                          {recording.highlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="bg-muted/50 p-2 rounded text-sm cursor-pointer hover:bg-muted transition-colors"
                              onClick={() => handleAction(`Vai a ${highlight.timestamp}`)}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-accent font-semibold">
                                  {highlight.timestamp}
                                </span>
                                <span className="text-foreground">{highlight.note}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAction("Download")}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Scarica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleAction("Condividi")}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Condividi
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction("Elimina")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
