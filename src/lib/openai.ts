import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const result = await response.json();
  return result.text;
}

export async function generateLinkedInPost(thoughts: string[]): Promise<string> {
  const prompt = `Transform the following thoughts into a compelling LinkedIn post. The post should be professional, engaging, and suitable for a business audience. Make it conversational but authoritative.

Thoughts to transform:
${thoughts.map((thought, index) => `${index + 1}. ${thought}`).join('\n')}

Generate a LinkedIn post that:
- Has a compelling hook in the first line
- Is between 150-300 words
- Uses relevant hashtags (3-5 hashtags)
- Has a clear call-to-action
- Maintains a professional yet approachable tone

LinkedIn Post:`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a professional LinkedIn content creator who specializes in transforming raw thoughts into engaging, professional posts that drive engagement and provide value to business audiences.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || '';
}

export async function generateImage(prompt: string): Promise<string> {
  const imagePrompt = `Create a professional, business-focused image that represents the core idea of this LinkedIn post. The image should be clean, modern, and suitable for professional social media. Avoid text in the image.

LinkedIn post content: ${prompt}

The image should be:
- Professional and business-appropriate
- Clean and modern design
- Abstract or conceptual representation
- High quality and visually appealing
- Suitable for LinkedIn post header`;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    size: '1024x1792',
    quality: 'standard',
    n: 1,
  });

  return response.data?.[0]?.url || '';
}

export { openai };
