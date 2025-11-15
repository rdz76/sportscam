import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { toast } from "sonner";

export interface TimeRange {
  id: string;
  start: number;
  end: number;
}

export const useVideoEditor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cutRanges, setCutRanges] = useState<TimeRange[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFFmpeg = async () => {
    if (isLoaded) return;
    
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;

      ffmpeg.on("log", ({ message }) => {
        console.log(message);
      });

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setIsLoaded(true);
      toast.success("Editor video caricato!");
    } catch (error) {
      console.error("Errore caricamento FFmpeg:", error);
      toast.error("Errore nel caricamento dell'editor video");
    }
  };

  const addCutRange = (start: number, end: number) => {
    const newRange: TimeRange = {
      id: `range-${Date.now()}`,
      start: Math.max(0, start),
      end: Math.max(start, end),
    };
    setCutRanges([...cutRanges, newRange]);
    toast.success("Sezione da rimuovere aggiunta");
  };

  const removeCutRange = (id: string) => {
    setCutRanges(cutRanges.filter((range) => range.id !== id));
    toast.success("Sezione rimossa");
  };

  const clearCutRanges = () => {
    setCutRanges([]);
    toast.success("Tutte le sezioni cancellate");
  };

  const processVideo = async (videoBlob: Blob, duration: number): Promise<Blob | null> => {
    if (!ffmpegRef.current || !isLoaded) {
      toast.error("Editor video non caricato");
      return null;
    }

    if (cutRanges.length === 0) {
      toast.error("Nessuna sezione da rimuovere");
      return null;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const ffmpeg = ffmpegRef.current;

      // Scrivi il file video in input
      await ffmpeg.writeFile("input.mp4", await fetchFile(videoBlob));

      // Calcola i segmenti da mantenere (inverso dei cutRanges)
      const keepRanges: TimeRange[] = [];
      let currentStart = 0;

      // Ordina i cutRanges per tempo di inizio
      const sortedCuts = [...cutRanges].sort((a, b) => a.start - b.start);

      sortedCuts.forEach((cut) => {
        if (currentStart < cut.start) {
          keepRanges.push({
            id: `keep-${keepRanges.length}`,
            start: currentStart,
            end: cut.start,
          });
        }
        currentStart = Math.max(currentStart, cut.end);
      });

      // Aggiungi l'ultimo segmento se necessario
      if (currentStart < duration) {
        keepRanges.push({
          id: `keep-${keepRanges.length}`,
          start: currentStart,
          end: duration,
        });
      }

      if (keepRanges.length === 0) {
        toast.error("Il video risulterebbe vuoto");
        setIsProcessing(false);
        return null;
      }

      // Crea i segmenti individuali
      for (let i = 0; i < keepRanges.length; i++) {
        const range = keepRanges[i];
        const segmentDuration = range.end - range.start;

        await ffmpeg.exec([
          "-i",
          "input.mp4",
          "-ss",
          range.start.toString(),
          "-t",
          segmentDuration.toString(),
          "-c",
          "copy",
          `segment${i}.mp4`,
        ]);
      }

      // Crea il file di concatenazione
      const concatList = keepRanges
        .map((_, i) => `file 'segment${i}.mp4'`)
        .join("\n");
      await ffmpeg.writeFile("concat.txt", concatList);

      // Concatena tutti i segmenti
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "concat.txt",
        "-c",
        "copy",
        "output.mp4",
      ]);

      // Leggi il file risultante
      const data = await ffmpeg.readFile("output.mp4");
      const uint8Array = data instanceof Uint8Array ? new Uint8Array(data) : new Uint8Array();
      const outputBlob = new Blob([uint8Array], { type: "video/mp4" });

      // Cleanup
      await ffmpeg.deleteFile("input.mp4");
      await ffmpeg.deleteFile("concat.txt");
      await ffmpeg.deleteFile("output.mp4");
      for (let i = 0; i < keepRanges.length; i++) {
        await ffmpeg.deleteFile(`segment${i}.mp4`);
      }

      setIsProcessing(false);
      setProgress(0);
      toast.success("Video elaborato con successo!");

      return outputBlob;
    } catch (error) {
      console.error("Errore elaborazione video:", error);
      toast.error("Errore durante l'elaborazione del video");
      setIsProcessing(false);
      setProgress(0);
      return null;
    }
  };

  return {
    isProcessing,
    progress,
    cutRanges,
    isLoaded,
    loadFFmpeg,
    addCutRange,
    removeCutRange,
    clearCutRanges,
    processVideo,
  };
};
