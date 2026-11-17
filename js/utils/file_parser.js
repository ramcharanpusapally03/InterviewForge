// File Parser Utility: Extracts text from PDF, DOCX, and TXT files directly in the browser

export async function extractTextFromFile(file, onProgress = () => {}) {
  if (!file) throw new Error('No file provided');

  const filename = file.name.toLowerCase();

  // 1. Plain text and markdown
  if (filename.endsWith('.txt') || filename.endsWith('.md') || filename.endsWith('.json')) {
    onProgress('Reading text file...');
    return await readAsPlainText(file);
  }

  // 2. PDF Documents via Mozilla PDF.js
  if (filename.endsWith('.pdf')) {
    onProgress('Extracting text from PDF pages...');
    return await parsePdfFile(file, onProgress);
  }

  // 3. Word Documents (.docx) via Mammoth.js
  if (filename.endsWith('.docx')) {
    onProgress('Extracting text from Word document...');
    return await parseDocxFile(file);
  }

  // Fallback: try plain text
  try {
    return await readAsPlainText(file);
  } catch (e) {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
  }
}

function readAsPlainText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

async function parsePdfFile(file, onProgress) {
  if (typeof window.pdfjsLib === 'undefined') {
    throw new Error('PDF parsing library is still loading. Please check your internet connection or paste text directly.');
  }

  // Configure worker
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  const totalPages = pdf.numPages;

  for (let i = 1; i <= totalPages; i++) {
    onProgress(`Reading page ${i} of ${totalPages}...`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map(item => item.str);
    fullText += pageStrings.join(' ') + '\n\n';
  }

  if (!fullText.trim()) {
    throw new Error('The uploaded PDF appears to be empty or contains only scanned images without selectable text.');
  }

  return fullText.trim();
}

async function parseDocxFile(file) {
  if (typeof window.mammoth === 'undefined') {
    throw new Error('Word document parser is not ready. Please paste your text or upload a PDF.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  return (result.value || '').trim();
}
