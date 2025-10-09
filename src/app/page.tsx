'use client';

import { useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
import VoiceRecorder from '@/components/VoiceRecorder';
import ThoughtCard from '@/components/ThoughtCard';

interface Thought {
  id: string;
  text: string;
  timestamp: Date;
}

export default function Home() {
  const router = useRouter();

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
      initializeWithValue: false
    }
  );

  const [selectedThoughtIds, setSelectedThoughtIds] = useLocalStorage<string[]>(
    'selectedThoughtIds',
    []
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">

        {/* Fixed Recording Button */}
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <VoiceRecorder onTranscription={addThought} />
        </div>

        {/* Thoughts Section - Shows when scrolling */}
        {thoughts.length > 0 && (
          <div className="mt-32 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Your Thoughts ({thoughts.length})
              </h2>
              <p className="text-gray-400">Select the thoughts you want to include in your post</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {thoughts.map(thought => (
                <div key={thought.id} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-2 hover:bg-white/10 transition-all duration-300">
                  <ThoughtCard
                    thought={thought}
                    isSelected={selectedThoughtIds.includes(thought.id)}
                    onSelect={toggleThoughtSelection}
                    onDelete={deleteThought}
                    onUpdate={updateThought}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating CTA Button */}
        {selectedThoughts.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={() => router.push('/generate')}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-900 text-white px-8 py-4 rounded-full shadow-2xl backdrop-blur-md border border-white/20 font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              ✨ Make Magic Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}