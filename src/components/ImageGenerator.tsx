'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon, Loader2, Download, RefreshCw } from 'lucide-react';

interface ImageGeneratorProps {
  post: string;
}

export default function ImageGenerator({ post }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [error, setError] = useState('');

  const generateImage = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { imageUrl } = await response.json();
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImageUrl) return;

    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkedin-post-image.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const regenerateImage = () => {
    setGeneratedImageUrl('');
    generateImage();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-4">
        <ImageIcon className="w-6 h-6 text-green-500" />
        <h2 className="text-xl font-semibold text-gray-800">Image Generator</h2>
      </div>

      {!generatedImageUrl && !isGenerating && (
        <button
          onClick={generateImage}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Generate Image</span>
        </button>
      )}

      {isGenerating && (
        <div className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generating image...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button
            onClick={generateImage}
            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {generatedImageUrl && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Generated Image</h3>
            <div className="flex space-x-2">
              <button
                onClick={downloadImage}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={regenerateImage}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={generatedImageUrl}
              alt="Generated LinkedIn post image"
              width={1024}
              height={1536}
              className="w-full h-auto"
            />
          </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Post Content:</p>
            <p className="text-xs">{post.substring(0, 200)}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
