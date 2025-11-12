import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, Share2, Trash2, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockRecordings = [
  {
    id: 1,
    title: "Partita di calcio - 11/11/2025",
    duration: "45:32",
    thumbnail: "/placeholder.svg",
    date: "Oggi",
  },
  {
    id: 2,
    title: "Allenamento basket",
    duration: "1:23:15",
    thumbnail: "/placeholder.svg",
    date: "Ieri",
  },
  {
    id: 3,
    title: "Torneo tennis",
    duration: "2:15:48",
    thumbnail: "/placeholder.svg",
    date: "3 giorni fa",
  },
];

const Library = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: "Funzione in arrivo prossimamente",
    });
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
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold">{recording.title}</h3>
                    <p className="text-sm text-muted-foreground">{recording.date}</p>
                  </div>
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
