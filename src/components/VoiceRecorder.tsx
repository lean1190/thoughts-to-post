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
            className="relative flex items-center space-x-2 px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 shadow-2xl font-semibold overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Mic className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="relative flex items-center space-x-2 px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 shadow-2xl font-semibold overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <Square className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Stop Recording</span>
          </button>
        )}

        {isTranscribing && (
          <div
            className="relative flex items-center space-x-2 px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-2xl shadow-2xl font-semibold overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <Loader2 className="w-6 h-6 animate-spin relative z-10" />
            <span className="relative z-10">Transcribing...</span>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center space-x-2 text-white/80 backdrop-blur-sm bg-white/5 rounded-full px-4 py-2 border border-white/10">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg" style={{ boxShadow: '0 0 10px rgba(248, 113, 113, 0.5)' }}></div>
          <span className="text-sm font-medium">Recording...</span>
        </div>
      )}
    </div>
  );
}

