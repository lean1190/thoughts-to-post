'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check } from 'lucide-react';

interface LinkedInPostGeneratorProps {
  selectedThoughts: string[];
  onGenerateImage: (post: string) => void;
}

export default function LinkedInPostGenerator({ 
  selectedThoughts, 
  onGenerateImage 
}: LinkedInPostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const generatePost = async () => {
    if (selectedThoughts.length === 0) {
      alert('Please select at least one thought to generate a post.');
      return;
    }

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

      const { post } = await response.json();
      setGeneratedPost(post);
    } catch (error) {
      console.error('Error generating post:', error);
      alert('Failed to generate LinkedIn post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPost);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateImage = () => {
    if (generatedPost) {
      onGenerateImage(generatedPost);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-800">LinkedIn Post Generator</h2>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Selected thoughts: {selectedThoughts.length}
        </p>
        {selectedThoughts.length > 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            {selectedThoughts.map((thought, index) => (
              <div key={index} className="truncate">
                {index + 1}. {thought}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={generatePost}
        disabled={isGenerating || selectedThoughts.length === 0}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating Post...</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>Generate LinkedIn Post</span>
          </>
        )}
      </button>

      {generatedPost && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Generated Post</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              {isCopied ? (
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
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
              {generatedPost}
            </pre>
          </div>

          <button
            onClick={generateImage}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <span>Generate Image for Post</span>
          </button>
        </div>
      )}
    </div>
  );
}

