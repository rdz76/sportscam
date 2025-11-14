import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Circle, Star, Volume2, VolumeX, Plus, Minus, Clock, Edit2, Save, Trash2, Download } from "lucide-react";
import Scoreboard from "@/components/Scoreboard";
import { Highlight } from "@/components/HighlightsList";
import { useToast } from "@/hooks/use-toast";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import MobileSidebar from "@/components/MobileSidebar";
import CompactHighlights from "@/components/CompactHighlights";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SportType, SPORT_PRESETS } from "@/types/sports";
import { useTeamConfig } from "@/hooks/useTeamConfig";
import { ScrollArea } from "@/components/ui/scroll-area";
const Record = () => {
  const [showScoreboard, setShowScoreboard] = useState(true);
  const [showHighlights, setShowHighlights] = useState(true);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [gameTime, setGameTime] = useState(2635); // 43:35 in seconds
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [homeTeamName, setHomeTeamName] = useState("REAL TUSC");
  const [awayTeamName, setAwayTeamName] = useState("TOR3TESTE");
  const [tempHomeTeamName, setTempHomeTeamName] = useState("REAL TUSC");
  const [tempAwayTeamName, setTempAwayTeamName] = useState("TOR3TESTE");
  const [selectedSport, setSelectedSport] = useState<SportType>('calcio');
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [homeLogo, setHomeLogo] = useState<string>("");
  const [awayLogo, setAwayLogo] = useState<string>("");
  const [tempHomeLogo, setTempHomeLogo] = useState<string>("");
  const [tempAwayLogo, setTempAwayLogo] = useState<string>("");
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [recordedFileName, setRecordedFileName] = useState<string>("");
  const {
    toast
  } = useToast();
  const {
    savedConfigs,
    saveConfig,
    deleteConfig
  } = useTeamConfig();
  const {
    isRecording,
    isPaused,
    recordingTime,
    videoRef,
    startRecording,
    pauseRecording,
    stopRecording,
    startCamera
  } = useVideoRecorder();
  useEffect(() => {
    startCamera();
  }, [startCamera]);
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };
  const handleRecord = async () => {
    if (isRecording) {
      const recordingData = await stopRecording();
      if (recordingData?.videoBlob) {
        setRecordedVideoBlob(recordingData.videoBlob);
        setRecordedFileName(recordingData.fileName);
      }
      toast({
        title: "Registrazione terminata",
        description: `Video salvato con ${highlights.length} highlights`
      });
    } else {
      setShowTeamDialog(true);
    }
  };
  const handleLogoUpload = (file: File, team: 'home' | 'away') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (team === 'home') {
        setTempHomeLogo(base64String);
      } else {
        setTempAwayLogo(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartRecordingWithTeams = async () => {
    setHomeTeamName(tempHomeTeamName);
    setAwayTeamName(tempAwayTeamName);
    setHomeLogo(tempHomeLogo);
    setAwayLogo(tempAwayLogo);
    setShowTeamDialog(false);

    // Save configuration
    saveConfig(tempHomeTeamName, tempAwayTeamName, selectedSport, tempHomeLogo, tempAwayLogo);

    // Apply sport preset
    const preset = SPORT_PRESETS[selectedSport];
    setGameTime(preset.defaultDuration);
    setCurrentPeriod(1);
    const started = await startRecording();
    if (started) {
      setHighlights([]);
      toast({
        title: "Registrazione avviata",
        description: "Premi la stella per marcare gli highlights"
      });
    }
  };
  const handleEditTeams = () => {
    setTempHomeTeamName(homeTeamName);
    setTempAwayTeamName(awayTeamName);
    setTempHomeLogo(homeLogo);
    setTempAwayLogo(awayLogo);
    setShowEditDialog(true);
  };
  const handleSaveEditedTeams = () => {
    setHomeTeamName(tempHomeTeamName);
    setAwayTeamName(tempAwayTeamName);
    setHomeLogo(tempHomeLogo);
    setAwayLogo(tempAwayLogo);
    setShowEditDialog(false);
    toast({
      title: "Nomi squadre aggiornati"
    });
  };
  const handleLoadConfig = (configId: string) => {
    const config = savedConfigs.find(c => c.id === configId);
    if (config) {
      setTempHomeTeamName(config.homeTeam);
      setTempAwayTeamName(config.awayTeam);
      setSelectedSport(config.sport);
      setTempHomeLogo(config.homeLogo || "");
      setTempAwayLogo(config.awayLogo || "");
      toast({
        title: "Configurazione caricata",
        description: `${config.homeTeam} vs ${config.awayTeam}`
      });
    }
  };
  
  const createWebVTTChapters = (highlights: Highlight[]): string => {
    let vtt = "WEBVTT\n\n";
    
    highlights.forEach((highlight, index) => {
      const startTime = formatVTTTime(highlight.timestamp);
      const endTime = index < highlights.length - 1 
        ? formatVTTTime(highlights[index + 1].timestamp)
        : formatVTTTime(highlight.timestamp + 30); // 30 seconds default duration
      
      const chapterTitle = highlight.note || `Highlight ${index + 1}`;
      
      vtt += `${index + 1}\n`;
      vtt += `${startTime} --> ${endTime}\n`;
      vtt += `${chapterTitle}\n\n`;
    });
    
    return vtt;
  };
  
  const formatVTTTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const milliseconds = Math.floor((seconds % 1) * 1000);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };
  
  const handleExportVideo = () => {
    if (!recordedVideoBlob || highlights.length === 0) {
      toast({
        title: "Nessun video da esportare",
        description: "Completa una registrazione con highlights prima di esportare",
        variant: "destructive"
      });
      return;
    }
    
    // Export video file
    const videoUrl = URL.createObjectURL(recordedVideoBlob);
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.download = recordedFileName;
    document.body.appendChild(videoLink);
    videoLink.click();
    document.body.removeChild(videoLink);
    URL.revokeObjectURL(videoUrl);
    
    // Export WebVTT chapters file
    const vttContent = createWebVTTChapters(highlights);
    const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
    const vttUrl = URL.createObjectURL(vttBlob);
    const vttLink = document.createElement('a');
    vttLink.href = vttUrl;
    vttLink.download = recordedFileName.replace('.webm', '-chapters.vtt');
    document.body.appendChild(vttLink);
    vttLink.click();
    document.body.removeChild(vttLink);
    URL.revokeObjectURL(vttUrl);
    
    // Export JSON metadata file
    const metadata = {
      fileName: recordedFileName,
      sport: selectedSport,
      homeTeam: homeTeamName,
      awayTeam: awayTeamName,
      finalScore: {
        home: homeScore,
        away: awayScore
      },
      duration: gameTime,
      highlights: highlights.map(h => ({
        timestamp: h.timestamp,
        formattedTime: h.formattedTime,
        note: h.note
      })),
      exportDate: new Date().toISOString()
    };
    
    const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = recordedFileName.replace('.webm', '-metadata.json');
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    toast({
      title: "Esportazione completata",
      description: `Video, capitoli WebVTT e metadati esportati con successo`
    });
  };
  const handleScoreChange = (team: 'home' | 'away', increment: boolean) => {
    const preset = SPORT_PRESETS[selectedSport];
    const points = increment ? preset.pointsPerScore : -preset.pointsPerScore;
    if (team === 'home') {
      setHomeScore(Math.max(0, homeScore + points));
    } else {
      setAwayScore(Math.max(0, awayScore + points));
    }
  };
  const handlePause = () => {
    pauseRecording();
    toast({
      title: isPaused ? "Registrazione ripresa" : "Registrazione in pausa"
    });
  };
  const handleAddHighlight = () => {
    if (!isRecording || isPaused) {
      toast({
        title: "Impossibile aggiungere highlight",
        description: "Devi essere in registrazione attiva",
        variant: "destructive"
      });
      return;
    }
    const newHighlight: Highlight = {
      id: Date.now().toString(),
      timestamp: recordingTime,
      note: "",
      formattedTime: formatTime(recordingTime)
    };
    setHighlights(prev => [...prev, newHighlight]);
    toast({
      title: "Highlight aggiunto!",
      description: `Timestamp: ${formatTime(recordingTime)}`
    });
  };
  return <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Team Setup Dialog */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurazione Partita</DialogTitle>
            <DialogDescription>
              Seleziona lo sport e personalizza le squadre
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="sport">Sport</Label>
              <Select value={selectedSport} onValueChange={(value: SportType) => setSelectedSport(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calcio">⚽ Calcio</SelectItem>
                  <SelectItem value="basket">🏀 Basket</SelectItem>
                  <SelectItem value="pallavolo">🏐 Pallavolo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {savedConfigs.length > 0 && <div className="grid gap-2">
                <Label>Configurazioni Salvate</Label>
                <ScrollArea className="h-32 rounded-md border p-2">
                  {savedConfigs.map(config => <div key={config.id} className="flex items-center justify-between py-2 px-2 hover:bg-muted rounded-lg mb-1">
                      <button onClick={() => handleLoadConfig(config.id)} className="flex-1 text-left text-sm">
                        <div className="font-medium">{config.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {SPORT_PRESETS[config.sport].name}
                        </div>
                      </button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteConfig(config.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>)}
                </ScrollArea>
              </div>}

            <div className="grid gap-2">
              <Label htmlFor="home-team">Squadra Casa</Label>
              <Input id="home-team" value={tempHomeTeamName} onChange={e => setTempHomeTeamName(e.target.value)} placeholder="Nome squadra casa" />
              <Label htmlFor="home-logo" className="text-sm text-muted-foreground">Logo Squadra Casa</Label>
              <Input id="home-logo" type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'home')} />
              {tempHomeLogo && <img src={tempHomeLogo} alt="Home logo preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="away-team">Squadra Ospite</Label>
              <Input id="away-team" value={tempAwayTeamName} onChange={e => setTempAwayTeamName(e.target.value)} placeholder="Nome squadra ospite" />
              <Label htmlFor="away-logo" className="text-sm text-muted-foreground">Logo Squadra Ospite</Label>
              <Input id="away-logo" type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'away')} />
              {tempAwayLogo && <img src={tempAwayLogo} alt="Away logo preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleStartRecordingWithTeams} className="w-full">
              Inizia Registrazione
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teams Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifica Squadre</DialogTitle>
            <DialogDescription>
              Aggiorna i nomi delle squadre durante la registrazione
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-home-team">Squadra Casa</Label>
              <Input id="edit-home-team" value={tempHomeTeamName} onChange={e => setTempHomeTeamName(e.target.value)} placeholder="Nome squadra casa" />
              <Label htmlFor="edit-home-logo" className="text-sm text-muted-foreground">Logo Squadra Casa</Label>
              <Input id="edit-home-logo" type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'home')} />
              {tempHomeLogo && <img src={tempHomeLogo} alt="Home logo preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-away-team">Squadra Ospite</Label>
              <Input id="edit-away-team" value={tempAwayTeamName} onChange={e => setTempAwayTeamName(e.target.value)} placeholder="Nome squadra ospite" />
              <Label htmlFor="edit-away-logo" className="text-sm text-muted-foreground">Logo Squadra Ospite</Label>
              <Input id="edit-away-logo" type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleLogoUpload(e.target.files[0], 'away')} />
              {tempAwayLogo && <img src={tempAwayLogo} alt="Away logo preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEditedTeams} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Salva Modifiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile Sidebar */}
      <MobileSidebar onToggleHighlights={() => setShowHighlights(!showHighlights)} onToggleScoreboard={() => setShowScoreboard(!showScoreboard)} />
      
      {/* Main Content Area */}
      <div className="fixed inset-0 right-20 flex flex-col">
        {/* Top Left Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
          {/* Rec/Live Toggle Buttons */}
          <div className="flex gap-2 my-[50px]">
            <Button onClick={handleRecord} className={`h-14 px-4 rounded-2xl border-2 ${isRecording ? "bg-black/80 border-primary" : "bg-black/60 border-white/20"} backdrop-blur-sm`}>
              <Circle className={`w-8 h-8 mr-2 ${isRecording ? "fill-primary text-primary" : "fill-white/20 text-white/20"}`} />
              <span className="text-white font-semibold text-lg">Rec.</span>
            </Button>
            <Button className="h-14 px-4 rounded-2xl border-2 bg-black/60 border-white/20 backdrop-blur-sm my-0">
              <Circle className="w-8 h-8 mr-2 fill-white/20 text-white/20" />
              <span className="text-white font-semibold text-lg">Live</span>
            </Button>
            {!isRecording && recordedVideoBlob && highlights.length > 0 && (
              <Button 
                onClick={handleExportVideo} 
                className="h-14 px-4 rounded-2xl border-2 bg-primary/90 border-primary backdrop-blur-sm"
              >
                <Download className="w-6 h-6 mr-2" />
                <span className="text-white font-semibold text-lg">Esporta</span>
              </Button>
            )}
          </div>

          {/* Logo */}
          

          {/* Highlight Box */}
          {isRecording && highlights.length > 0 && <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-white/10 p-6 w-64">
              <div className="text-white text-center mb-3">
                Highlight - {formatTime(highlights[highlights.length - 1].timestamp)}
              </div>
              <div className="flex justify-center">
                <Button size="icon" className="w-16 h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Star className="w-8 h-8" />
                </Button>
              </div>
            </div>}

          {/* Audio Toggle */}
          <div className="flex gap-2 my-[400px] px-[10px] py-0 mx-0">
            <Button size="icon" onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full ${isMuted ? "bg-muted/80" : "bg-primary"} border-2 ${isMuted ? "border-white/20" : "border-primary"}`}>
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </Button>
            <Button size="icon" className="w-14 h-14 rounded-full border-2 border-white/20 bg-red-600 hover:bg-red-500">
              <VolumeX className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Video Preview - Full Screen */}
        <div className="relative flex-1 bg-black">
          <video ref={videoRef} autoPlay playsInline muted={isMuted} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Scoreboard Overlay */}
          {showScoreboard && <Scoreboard homeTeam={homeTeamName} awayTeam={awayTeamName} homeScore={homeScore} awayScore={awayScore} minutes={Math.floor(gameTime / 60)} seconds={gameTime % 60} homeLogo={homeLogo} awayLogo={awayLogo} />}

          {/* Zoom Controls - Right Side */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <Button size="icon" className="w-16 h-16 rounded-2xl bg-muted/80 hover:bg-muted text-foreground backdrop-blur-sm">
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
            <Button size="icon" className="w-16 h-16 rounded-2xl bg-muted/80 hover:bg-muted text-foreground backdrop-blur-sm">
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
              <div className="flex items-center gap-2">
                {homeLogo && <img src={homeLogo} alt={homeTeamName} className="w-8 h-8 rounded-full object-cover" />}
                <span className="text-white text-base font-semibold">{homeTeamName}</span>
                {isRecording && <Button size="icon" variant="ghost" className="h-6 w-6 text-white/60 hover:text-white" onClick={handleEditTeams}>
                    <Edit2 className="w-4 h-4" />
                  </Button>}
              </div>
              <div className="flex items-center gap-3">
                <Button size="icon" onClick={() => handleScoreChange('home', false)} className="w-14 h-14 rounded-full bg-muted/80 hover:bg-muted text-foreground">
                  <Minus className="w-6 h-6" />
                </Button>
                <div className="text-white text-5xl font-bold w-20 text-center">
                  {homeScore}
                </div>
                <Button size="icon" onClick={() => handleScoreChange('home', true)} className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 text-slate-50">
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
                <Button size="sm" onClick={() => setGameTime(Math.max(0, gameTime - 1))} className="h-10 px-4 rounded-full bg-muted/80 hover:bg-muted text-foreground text-sm font-semibold">
                  -1s
                </Button>
                <Button size="icon" className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                  <Clock className="w-8 h-8" />
                </Button>
                <Button size="sm" onClick={() => setGameTime(gameTime + 1)} className="h-10 px-4 rounded-full bg-muted/80 hover:bg-muted text-foreground text-sm font-semibold">
                  +1s
                </Button>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                {awayLogo && <img src={awayLogo} alt={awayTeamName} className="w-8 h-8 rounded-full object-cover" />}
                <span className="text-white text-base font-semibold">{awayTeamName}</span>
                {isRecording && <Button size="icon" variant="ghost" className="h-6 w-6 text-white/60 hover:text-white" onClick={handleEditTeams}>
                    <Edit2 className="w-4 h-4" />
                  </Button>}
              </div>
              <div className="flex items-center gap-3">
                <Button size="icon" onClick={() => handleScoreChange('away', true)} className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                  <Plus className="w-12 h-12" />
                </Button>
                <div className="text-white text-5xl font-bold w-20 text-center">
                  {awayScore}
                </div>
                <Button size="icon" onClick={() => handleScoreChange('away', false)} className="w-14 h-14 rounded-full bg-muted/80 hover:bg-muted text-foreground">
                  <Minus className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Record;