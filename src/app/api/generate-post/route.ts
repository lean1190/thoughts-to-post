import { NextRequest, NextResponse } from 'next/server';
import { generateLinkedInPost } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { thoughts } = await request.json();

    if (!thoughts || !Array.isArray(thoughts) || thoughts.length === 0) {
      return NextResponse.json({ error: 'No thoughts provided' }, { status: 400 });
    }

    const linkedInPost = await generateLinkedInPost(thoughts);
    
    return NextResponse.json({ post: linkedInPost });
  } catch (error) {
    console.error('Post generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LinkedIn post' },
      { status: 500 }
    );
  }
}

