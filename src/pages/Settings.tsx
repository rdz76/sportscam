import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Radio, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Impostazioni salvate",
      description: "Le tue preferenze sono state aggiornate con successo",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Impostazioni</h1>
          <p className="text-muted-foreground">Configura la tua app di registrazione sportiva</p>
        </div>

        <Tabs defaultValue="streaming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="streaming">Streaming</TabsTrigger>
            <TabsTrigger value="recording">Registrazione</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>

          <TabsContent value="streaming" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Configurazione RTMP</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rtmp-url">URL Server RTMP</Label>
                  <Input
                    id="rtmp-url"
                    placeholder="rtmp://live.example.com/app"
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stream-key">Stream Key</Label>
                  <Input
                    id="stream-key"
                    placeholder="la-tua-stream-key-segreta"
                    type="password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-stream">Streaming automatico</Label>
                    <p className="text-sm text-muted-foreground">
                      Avvia streaming quando inizi a registrare
                    </p>
                  </div>
                  <Switch id="auto-stream" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recording" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <SettingsIcon className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Opzioni Registrazione</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality">Qualità Video</Label>
                  <select
                    id="quality"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option>1080p (Full HD)</option>
                    <option>720p (HD)</option>
                    <option>480p (SD)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fps">Frame Rate</Label>
                  <select
                    id="fps"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option>60 FPS</option>
                    <option>30 FPS</option>
                    <option>24 FPS</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save">Salvataggio automatico</Label>
                    <p className="text-sm text-muted-foreground">
                      Salva automaticamente ogni 5 minuti
                    </p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Personalizzazione</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-name">Nome Squadra</Label>
                  <Input
                    id="team-name"
                    placeholder="La mia squadra"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo Squadra</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Clicca per caricare il logo
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Banner Personalizzato</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Clicca per caricare il banner
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full" size="lg">
          Salva Impostazioni
        </Button>
      </div>
    </div>
  );
};

export default Settings;
