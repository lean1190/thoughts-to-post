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
                        <div
                            className="relative backdrop-blur-xl border border-white/20 rounded-2xl p-6 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 relative z-10">
                                Selected Thoughts ({selectedThoughts.length})
                            </h2>
                            <div className="space-y-3 relative z-10">
                                {selectedThoughts.map((thought, index) => (
                                    <div
                                        key={index}
                                        className="relative backdrop-blur-sm border border-white/10 rounded-xl p-4 overflow-hidden group"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        <p className="text-white/90 relative z-10">{thought}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Generated Post */}
                    <div className="space-y-6">
                        <div
                            className="relative backdrop-blur-xl border border-white/20 rounded-2xl p-6 overflow-hidden"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                            }}
                        >
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <h2 className="text-xl font-semibold text-white">
                                    Generated LinkedIn Post
                                </h2>
                                {generatedPost && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="relative flex items-center space-x-2 px-4 py-2 border border-blue-400/30 text-blue-300 rounded-xl transition-all duration-300 overflow-hidden group"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
                                            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 relative z-10" />
                                                <span className="relative z-10">Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 relative z-10" />
                                                <span className="relative z-10">Copy</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {isGenerating ? (
                                <div className="flex items-center justify-center py-12 relative z-10">
                                    <div className="text-center">
                                        <div
                                            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                                            style={{
                                                borderColor: 'transparent',
                                                borderBottomColor: 'rgba(59, 130, 246, 0.8)',
                                                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
                                            }}
                                        ></div>
                                        <p className="text-white/80">Generating your magic post...</p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="relative backdrop-blur-sm border border-white/10 rounded-xl p-6 overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    }}
                                >
                                    <div className="whitespace-pre-wrap text-white/90 leading-relaxed relative z-10">
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
                                    className="relative flex-1 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-500 overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)',
                                        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <span className="relative z-10">Regenerate Post</span>
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="relative flex-1 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 overflow-hidden group"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    <span className="relative z-10">Back to Thoughts</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
