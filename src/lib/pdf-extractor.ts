export async function extractTextFromPDF(file: File): Promise<string> {
  // Only run on client side
  if (typeof window === 'undefined') {
    throw new Error('PDF extraction only works on the client side');
  }

  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure the worker with the correct CDN path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`
    });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText || fullText.trim().length < 20) {
      throw new Error('No readable text found in PDF');
    }
    
    return fullText.trim();
  } catch (error: any) {
    console.error('Error extracting PDF text:', error);
    const errorMessage = error?.message || 'Unknown error';
    
    if (errorMessage.includes('worker')) {
      throw new Error('PDF processing failed. Please try pasting your resume text instead.');
    } else if (errorMessage.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
    } else if (errorMessage.includes('No readable text')) {
      throw new Error('Could not extract text from PDF. It may be image-based. Please paste your text instead.');
    }
    
    throw new Error('Failed to process PDF. Please use the "Paste Text" option instead.');
  }
}
