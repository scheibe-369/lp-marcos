/**
 * Parser puro de rich-text. Quebra uma string com marcações **negrito**
 * em segmentos. NÃO interpreta markdown além de **bold** (PRD §4).
 * Testável isolado; o RichText.astro renderiza os segmentos no build (zero JS).
 */

export interface RichSegment {
  text: string;
  strong: boolean;
}

export function parseRichText(input: string): RichSegment[] {
  const segments: RichSegment[] = [];
  const parts = input.split(/(\*\*[^*]+\*\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      segments.push({ text: part.slice(2, -2), strong: true });
    } else {
      segments.push({ text: part, strong: false });
    }
  }
  return segments;
}
