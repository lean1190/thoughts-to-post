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
              className="relative cursor-pointer text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 font-semibold text-lg transition-all duration-500 transform hover:scale-105 overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">✨ Make Magic Post</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}