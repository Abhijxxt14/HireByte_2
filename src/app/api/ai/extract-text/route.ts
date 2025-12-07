import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for Node.js environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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
    // Handle PDF files using PDF.js
    else if (fileType === 'application/pdf') {
      try {
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
        const pdf = await loadingTask.promise;
        
        const textParts: string[] = [];
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          textParts.push(pageText);
        }
        
        text = textParts.join('\n\n');
        
        if (!text || text.trim().length < 20) {
          return NextResponse.json(
            { error: 'Could not extract readable text from PDF. The file may be image-based. Please use the "Paste Text" option.' },
            { status: 400 }
          );
        }
      } catch (pdfError: any) {
        console.error('PDF extraction error:', pdfError);
        return NextResponse.json(
          { error: 'Could not process PDF file. Please use the "Paste Text" option to paste your resume content.' },
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
