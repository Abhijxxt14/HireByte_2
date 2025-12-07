import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

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
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    // Handle text files
    if (fileType === 'text/plain') {
      text = buffer.toString('utf-8');
    }
    // Handle PDF files with pdf-parse
    else if (fileType === 'application/pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
        
        if (!text || text.trim().length < 20) {
          return NextResponse.json(
            { error: 'No readable text found in PDF. The file may be image-based or corrupted. Please try the "Paste Text" option.' },
            { status: 400 }
          );
        }
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        return NextResponse.json(
          { error: 'Could not parse PDF file. Please ensure it\'s a valid PDF or use the "Paste Text" option.' },
          { status: 400 }
        );
      }
    }
    // Handle other document types
    else if (fileType.includes('document') || fileType.includes('word')) {
      return NextResponse.json(
        { error: 'Word documents are not supported. Please convert to PDF or use the "Paste Text" option.' },
        { status: 400 }
      );
    }
    else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or text file.' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: 'Could not extract enough text from file. Please use the "Paste Text" option.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Text extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try the "Paste Text" option.' },
      { status: 500 }
    );
  }
}
