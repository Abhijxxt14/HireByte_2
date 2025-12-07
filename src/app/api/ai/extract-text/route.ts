import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = '';

    // Handle text files
    if (fileType === 'text/plain') {
      text = buffer.toString('utf-8');
    }
    // Handle PDF files - Use Groq's vision API to extract text
    else if (fileType === 'application/pdf') {
      // For serverless compatibility, suggest using text input instead
      return NextResponse.json(
        { 
          error: 'PDF extraction is not available in serverless environment. Please copy and paste your resume text instead, or use the text input option below.' 
        },
        { status: 400 }
      );
    }
    // Handle other document types
    else if (fileType.includes('document') || fileType.includes('word')) {
      return NextResponse.json(
        { error: 'Word document parsing not supported. Please copy and paste your resume text instead.' },
        { status: 400 }
      );
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please paste your resume text using the text input option.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Could not extract readable text from file. Please paste your resume text instead.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try pasting your resume text instead.' },
      { status: 500 }
    );
  }
}
