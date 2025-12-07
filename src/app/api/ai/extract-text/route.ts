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
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    // Handle text files
    if (fileType === 'text/plain') {
      text = buffer.toString('utf-8');
    }
    // Handle PDF files using Groq AI to extract text
    else if (fileType === 'application/pdf') {
      try {
        // Convert PDF to base64 for Groq
        const base64Pdf = buffer.toString('base64');
        
        // Use Groq to extract text from PDF
        const completion = await groq.chat.completions.create({
          model: "llama-3.2-90b-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Extract all the text content from this resume/CV document. Return only the extracted text, no additional commentary or formatting. Include all sections like experience, education, skills, etc."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:application/pdf;base64,${base64Pdf}`
                  }
                }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 4000,
        });

        text = completion.choices[0]?.message?.content || '';
        
        if (!text || text.trim().length < 20) {
          return NextResponse.json(
            { error: 'Could not extract readable text from PDF. Please use the "Paste Text" option.' },
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
