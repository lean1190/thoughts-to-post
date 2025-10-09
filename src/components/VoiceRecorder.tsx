'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export default function VoiceRecorder({ onTranscription }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const { transcription } = await response.json();
      onTranscription(transcription);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-4">
        {!isRecording && !isTranscribing && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 px-8 py-4 backdrop-blur-md bg-red-500/20 border border-red-400/30 text-white rounded-full hover:bg-red-500/30 hover:border-red-400/50 transition-all duration-300 shadow-2xl font-semibold"
          >
            <Mic className="w-6 h-6" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 px-8 py-4 backdrop-blur-md bg-gray-500/20 border border-gray-400/30 text-white rounded-full hover:bg-gray-500/30 hover:border-gray-400/50 transition-all duration-300 shadow-2xl font-semibold"
          >
            <Square className="w-6 h-6" />
            <span>Stop Recording</span>
          </button>
        )}

        {isTranscribing && (
          <div className="flex items-center space-x-2 px-8 py-4 backdrop-blur-md bg-blue-500/20 border border-blue-400/30 text-white rounded-full shadow-2xl font-semibold">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Transcribing...</span>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center space-x-2 text-red-400">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}
    </div>
  );
}

