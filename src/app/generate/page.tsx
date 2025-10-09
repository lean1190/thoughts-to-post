'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';
import { ArrowLeft, Copy, Check, Sparkles } from 'lucide-react';

interface Thought {
    id: string;
    text: string;
    timestamp: Date;
}

export default function GeneratePage() {
    const router = useRouter();
    const [thoughts, setThoughts] = useLocalStorage<Thought[]>('thoughts', []);
    const [selectedThoughtIds, setSelectedThoughtIds] = useLocalStorage<string[]>('selectedThoughtIds', []);
    const [generatedPost, setGeneratedPost] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    const selectedThoughts = thoughts
        .filter(thought => selectedThoughtIds.includes(thought.id))
        .map(thought => thought.text);

    useEffect(() => {
        if (selectedThoughts.length === 0) {
            router.push('/');
            return;
        }

        // Generate the post when the component mounts
        generatePost();
    }, []);

    const generatePost = async () => {
        if (selectedThoughts.length === 0) return;

        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ thoughts: selectedThoughts }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate post');
            }

            const data = await response.json();
            setGeneratedPost(data.post);
        } catch (error) {
            console.error('Error generating post:', error);
            setGeneratedPost('Sorry, there was an error generating your post. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedPost);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    const goBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={goBack}
                        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Thoughts</span>
                    </button>

                    <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
                        <Sparkles className="w-8 h-8 text-blue-400" />
                        <span>Your Magic Post</span>
                    </h1>

                    <div className="w-32"></div> {/* Spacer for centering */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Left Column - Selected Thoughts */}
                    <div className="space-y-6">
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Selected Thoughts ({selectedThoughts.length})
                            </h2>
                            <div className="space-y-3">
                                {selectedThoughts.map((thought, index) => (
                                    <div
                                        key={index}
                                        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4"
                                    >
                                        <p className="text-gray-300">{thought}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Generated Post */}
                    <div className="space-y-6">
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    Generated LinkedIn Post
                                </h2>
                                {generatedPost && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {isGenerating ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                        <p className="text-gray-300">Generating your magic post...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                                        {generatedPost || 'Your post will appear here...'}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {generatedPost && (
                            <div className="flex space-x-4">
                                <button
                                    onClick={generatePost}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                                >
                                    Regenerate Post
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20"
                                >
                                    Back to Thoughts
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
