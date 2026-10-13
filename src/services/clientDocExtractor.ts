import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromFileClient(file: File): Promise<string> {
  const ext = file.name.toLowerCase().split('.').pop();

  if (ext === 'txt') {
    return await file.text();
  }

  if (ext === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (err: any) {
      throw new Error(`Failed to read DOCX file: ${err?.message || err}`);
    }
  }

  if (ext === 'pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;
      const fullText: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ')
          .trim();
        if (pageText) {
          fullText.push(pageText);
        }
      }

      const result = fullText.join('\n\n').trim();
      if (!result) {
        throw new Error(
          'The uploaded PDF appears to be scanned or contains only images. Scanned PDFs are not supported by direct text extraction. Please copy/paste the text or upload a digital text PDF.'
        );
      }
      return result;
    } catch (err: any) {
      if (err?.message && err.message.includes('scanned')) {
        throw err;
      }
      throw new Error(`Failed to extract text from PDF: ${err?.message || err}`);
    }
  }

  throw new Error(`Unsupported file format '.${ext}'. Supported formats: .txt, .docx, .pdf`);
}
