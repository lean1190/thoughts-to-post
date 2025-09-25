import { NextRequest, NextResponse } from 'next/server';
import { generateImage } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { post } = await request.json();

    if (!post) {
      return NextResponse.json({ error: 'No post content provided' }, { status: 400 });
    }

    const imageUrl = await generateImage(post);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

