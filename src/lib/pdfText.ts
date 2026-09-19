import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

type PositionedText = {
  text: string;
  x: number;
  y: number;
};

export function pageText(items: unknown[]): string {
  const positioned = items.flatMap<PositionedText>((item) => {
    if (!item || typeof item !== 'object' || !('str' in item) || !('transform' in item)) return [];
    const str = String((item as { str: unknown }).str).trim();
    const transform = (item as { transform: unknown }).transform;
    if (!str || !Array.isArray(transform) || transform.length < 6) return [];
    return [{ text: str, x: Number(transform[4]) || 0, y: Number(transform[5]) || 0 }];
  });

  positioned.sort((a, b) => Math.abs(b.y - a.y) > 2 ? b.y - a.y : a.x - b.x);

  const lines: PositionedText[][] = [];
  for (const item of positioned) {
    const line = lines.find((candidate) => Math.abs(candidate[0].y - item.y) <= 2);
    if (line) line.push(item);
    else lines.push([item]);
  }

  return lines
    .map((line) => line.sort((a, b) => a.x - b.x).map((item) => item.text).join(' '))
    .join('\n');
}

/** Extract selectable text locally so a private report still works when the AI provider is unavailable. */
export async function extractPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(pageText(content.items));
      page.cleanup();
    }
  } finally {
    await pdf.destroy();
  }

  return pages.join('\n\n').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
