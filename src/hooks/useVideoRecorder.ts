import { useState, useRef, useCallback } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useToast } from '@/hooks/use-toast';

export interface RecordingData {
  videoUrl: string;
  fileName: string;
  duration: number;
  videoBlob?: Blob;
}

export const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
      
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Errore fotocamera",
        description: "Impossibile accedere alla fotocamera",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoStream]);

  const startRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await startCamera();
      if (!stream) return false;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Errore registrazione",
        description: "Impossibile avviare la registrazione",
        variant: "destructive",
      });
      return false;
    }
  }, [startCamera, toast]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  }, [isRecording, isPaused]);

  const stopRecording = useCallback(async (): Promise<RecordingData | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const fileName = `recording-${new Date().toISOString()}.webm`;
        const duration = recordingTime;

        // Save to filesystem using Capacitor
        try {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64Data = reader.result as string;
            const base64 = base64Data.split(',')[1];

            await Filesystem.writeFile({
              path: fileName,
              data: base64,
              directory: Directory.Documents
            });

            toast({
              title: "Video salvato",
              description: `Registrazione salvata: ${fileName}`,
            });
          };
        } catch (error) {
          console.error('Error saving video:', error);
          toast({
            title: "Errore salvataggio",
            description: "Impossibile salvare il video",
            variant: "destructive",
          });
        }

        stopCamera();
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        chunksRef.current = [];

        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        resolve({ videoUrl, fileName, duration, videoBlob: blob });
      };

      mediaRecorderRef.current.stop();
    });
  }, [recordingTime, stopCamera, toast]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    videoStream,
    videoRef,
    startRecording,
    pauseRecording,
    stopRecording,
    startCamera,
    stopCamera,
  };
};
