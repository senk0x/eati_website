/** Inline bold segments: **text** */
export interface BoldSegment {
  type: 'text' | 'bold';
  content: string;
}

export function parseBoldSegments(text: string): BoldSegment[] {
  const segments: BoldSegment[] = [];
  const regex = /\*\*([^*]+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'bold', content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}

export type TextElement =
  | { type: 'paragraph'; content: string }
  | { type: 'subheading'; content: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

const SUBHEADING_REGEX = /^\*\*(.+)\*\*$/;
const ORDERED_LIST_REGEX = /^\d+\.\s+/;
const BULLET_LIST_REGEX = /^-\s+/;

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.length > 2;
}

function isSubheadingLine(line: string): boolean {
  const trimmed = line.trim();
  if (!SUBHEADING_REGEX.test(trimmed)) return false;
  // Inline labels like "**Important:** text" stay in paragraph flow.
  return trimmed.replace(SUBHEADING_REGEX, '$1').trim().length > 0;
}

export function parseTextElements(content: string): TextElement[] {
  const lines = content.split('\n');
  const elements: TextElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    if (isTableRow(lines[i])) {
      break;
    }

    if (BULLET_LIST_REGEX.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const lineTrimmed = lines[i].trim();
        if (lineTrimmed === '' || isTableRow(lines[i])) break;
        if (!BULLET_LIST_REGEX.test(lineTrimmed)) break;
        items.push(lineTrimmed.replace(/^-\s+/, ''));
        i++;
      }
      if (items.length > 0) {
        elements.push({ type: 'ul', items });
      }
      continue;
    }

    if (ORDERED_LIST_REGEX.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const lineTrimmed = lines[i].trim();
        if (lineTrimmed === '' || isTableRow(lines[i])) break;
        if (!ORDERED_LIST_REGEX.test(lineTrimmed)) break;
        items.push(lineTrimmed.replace(/^\d+\.\s+/, ''));
        i++;
      }
      if (items.length > 0) {
        elements.push({ type: 'ol', items });
      }
      continue;
    }

    if (isSubheadingLine(trimmed)) {
      const match = trimmed.match(SUBHEADING_REGEX);
      if (match) {
        elements.push({ type: 'subheading', content: match[1] });
        i++;
        continue;
      }
    }

    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const lineTrimmed = lines[i].trim();
      if (lineTrimmed === '') break;
      if (isTableRow(lines[i])) break;
      if (BULLET_LIST_REGEX.test(lineTrimmed)) break;
      if (ORDERED_LIST_REGEX.test(lineTrimmed)) break;
      if (isSubheadingLine(lineTrimmed)) break;
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      elements.push({ type: 'paragraph', content: paragraphLines.join('\n') });
    }
  }

  return elements;
}
