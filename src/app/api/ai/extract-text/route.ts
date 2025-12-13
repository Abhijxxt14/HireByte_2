import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

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
    // Handle PDF files using pdf2json (lightweight and Next.js compatible)
    else if (fileType === 'application/pdf') {
      try {
        const pdfParser = new PDFParser();
        
        // Parse PDF and extract text
        const pdfText = await new Promise<string>((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', (errData: any) => {
            console.error('PDF Parser Error:', errData.parserError);
            reject(errData.parserError);
          });
          
          pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            try {
              // Extract text from all pages
              let extractedText = '';
              
              if (pdfData && pdfData.Pages) {
                pdfData.Pages.forEach((page: any) => {
                  if (page.Texts) {
                    page.Texts.forEach((textItem: any) => {
                      if (textItem.R) {
                        textItem.R.forEach((run: any) => {
                          if (run.T) {
                            extractedText += decodeURIComponent(run.T) + ' ';
                          }
                        });
                      }
                    });
                    extractedText += '\n';
                  }
                });
              }
              
              console.log('Extracted text length:', extractedText.length);
              console.log('First 200 chars:', extractedText.substring(0, 200));
              resolve(extractedText);
            } catch (e) {
              console.error('Error processing PDF data:', e);
              reject(e);
            }
          });
          
          pdfParser.parseBuffer(buffer);
        });
        
        text = pdfText;
        
        if (!text || text.trim().length < 20) {
          console.log('Text extraction failed - length:', text?.length);
          return NextResponse.json(
            { error: 'Could not extract readable text from PDF. The file may be image-based or empty. Please use the "Paste Text" option.' },
            { status: 400 }
          );
        }
      } catch (pdfError: any) {
        console.error('PDF extraction error:', pdfError);
        return NextResponse.json(
          { error: 'Could not process PDF file. Please ensure it\'s a valid PDF or use the "Paste Text" option.' },
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
