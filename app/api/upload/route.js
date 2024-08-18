import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.min.mjs';

console.log('PDF.js worker configuration:', GlobalWorkerOptions.workerSrc);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const filePath = join(uploadsDir, file.name);
    await writeFile(filePath, buffer);

    let text = '';

    if (file.name.toLowerCase().endsWith('.pdf')) {
      try {
        const typedArray = new Uint8Array(buffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const maxPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
      } catch (pdfError) {
        console.error('Error processing PDF:', pdfError.message, pdfError.stack);
        return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
      }
    } else {
      text = buffer.toString('utf-8');
    }

    // Split the text into 20 chunks
    const chunkSize = Math.ceil(text.length / 20);
    const chunks = [];
    
    for (let i = 0; i < 20; i++) {
      const start = i * chunkSize;
      const end = (i + 1) * chunkSize;
      chunks.push(text.slice(start, end));
    }

    // Save chunks to rawdata.txt
    const rawdataPath = join(process.cwd(), 'public', 'rawdata.txt');
    let rawdataContent = '';

    chunks.forEach((chunk, index) => {
      rawdataContent += `ID: ${index + 1}\nDocument: ${chunk}\n\n`;
    });

    await writeFile(rawdataPath, rawdataContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing upload:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
