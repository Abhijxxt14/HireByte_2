import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// @ts-ignore
import extract from 'pdf-text-extract';

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
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
    // Handle PDF files
    else if (fileType === 'application/pdf') {
      // Write to temporary file
      tempFilePath = join(tmpdir(), `resume-${Date.now()}.pdf`);
      writeFileSync(tempFilePath, buffer);
      
      // Extract text from PDF
      text = await new Promise((resolve, reject) => {
        extract(tempFilePath!, (err: any, pages: string[]) => {
          if (err) reject(err);
          resolve(pages.join(' '));
        });
      });
    }
    // Handle other document types
    else if (fileType.includes('document') || fileType.includes('word')) {
      return NextResponse.json(
        { error: 'Word document parsing not implemented. Please save as PDF or paste text.' },
        { status: 400 }
      );
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or text file.' },
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
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        unlinkSync(tempFilePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
}
