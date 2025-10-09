'use client';

import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import VoiceRecorder from '@/components/VoiceRecorder';
import ThoughtCard from '@/components/ThoughtCard';
import LinkedInPostGenerator from '@/components/LinkedInPostGenerator';
import ImageGenerator from '@/components/ImageGenerator';
import { Brain, FileText, Image as ImageIcon } from 'lucide-react';

interface Thought {
  id: string;
  text: string;
  timestamp: Date;
}

export default function Home() {
  // Custom serializers to handle Date objects
  const serializeThoughts = (thoughts: Thought[]): string => {
    return JSON.stringify(thoughts);
  };

  const deserializeThoughts = (value: string): Thought[] => {
    const parsed = JSON.parse(value);
    return parsed.map((thought: { id: string; text: string; timestamp: string }) => ({
      ...thought,
      timestamp: new Date(thought.timestamp)
    }));
  };

  const [thoughts, setThoughts, removeThoughts] = useLocalStorage<Thought[]>(
    'thoughts',
    [],
    {
      serializer: serializeThoughts,
      deserializer: deserializeThoughts,
      initializeWithValue: true
    }
  );

  const [selectedThoughtIds, setSelectedThoughtIds] = useState<string[]>([]);
  const [generatedPost, setGeneratedPost] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const addThought = (text: string) => {
    const newThought: Thought = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    };
    setThoughts(prev => [newThought, ...prev]);
  };

  const deleteThought = (id: string) => {
    setThoughts(prev => {
      const updatedThoughts = prev.filter(thought => thought.id !== id);
      // Clear localStorage if no thoughts remain
      if (updatedThoughts.length === 0) {
        removeThoughts();
        return [];
      }
      return updatedThoughts;
    });
    setSelectedThoughtIds(prev => prev.filter(thoughtId => thoughtId !== id));
  };

  const updateThought = (id: string, newText: string) => {
    setThoughts(prev =>
      prev.map(thought =>
        thought.id === id ? { ...thought, text: newText } : thought
      )
    );
  };

  const toggleThoughtSelection = (id: string) => {
    setSelectedThoughtIds(prev =>
      prev.includes(id)
        ? prev.filter(thoughtId => thoughtId !== id)
        : [...prev, id]
    );
  };

  const selectedThoughts = thoughts
    .filter(thought => selectedThoughtIds.includes(thought.id))
    .map(thought => thought.text);

  const handleGenerateImage = (post: string) => {
    setGeneratedPost(post);
    setShowImageGenerator(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Voice to LinkedIn
          </h1>
          <p className="text-lg text-gray-600">
            Transform your voice into engaging LinkedIn posts
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Record Thoughts</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedThoughts.length > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Generate Post</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${showImageGenerator ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
                }`}>
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-gray-700">Create Image</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Voice Recording and Thoughts */}
          <div className="space-y-6">
            <VoiceRecorder onTranscription={addThought} />

            {thoughts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Thoughts ({thoughts.length})
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {thoughts.map(thought => (
                    <ThoughtCard
                      key={thought.id}
                      thought={thought}
                      isSelected={selectedThoughtIds.includes(thought.id)}
                      onSelect={toggleThoughtSelection}
                      onDelete={deleteThought}
                      onUpdate={updateThought}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Post Generation and Image */}
          <div className="space-y-6">
            {selectedThoughts.length > 0 && (
              <LinkedInPostGenerator
                selectedThoughts={selectedThoughts}
                onGenerateImage={handleGenerateImage}
              />
            )}

            {showImageGenerator && generatedPost && (
              <ImageGenerator post={generatedPost} />
            )}
          </div>
        </div>

        {/* Instructions */}
        {thoughts.length === 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                How it works
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-gray-600">
                    <strong>Record your voice:</strong> Click the microphone button and speak your thoughts.
                    The app will transcribe your speech using AI.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-gray-600">
                    <strong>Select thoughts:</strong> Choose which thoughts you want to include in your LinkedIn post
                    by clicking on the thought cards.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-gray-600">
                    <strong>Generate post:</strong> Click &quot;Generate LinkedIn Post&quot; to transform your selected
                    thoughts into a professional, engaging LinkedIn post.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-gray-600">
                    <strong>Create image:</strong> Generate a professional image that represents the core idea
                    of your LinkedIn post.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}