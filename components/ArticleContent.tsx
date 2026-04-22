import LinkedText from '@/components/LinkedText';

type Block =
  | { type: 'text'; content: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

function splitRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.startsWith('|') ? trimmed.slice(1) : trimmed;
  const closed = inner.endsWith('|') ? inner.slice(0, -1) : inner;
  return closed.split('|').map((c) => c.trim());
}

const SEPARATOR_REGEX = /^\s*\|?[\s:-]*\|[\s:|\-]*$/;

function isSeparatorRow(line: string): boolean {
  if (!line.includes('|')) return false;
  if (!/-{2,}/.test(line)) return false;
  return SEPARATOR_REGEX.test(line);
}

function isTableRow(line: string): boolean {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.length > 2;
}

function parseBlocks(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let textBuffer: string[] = [];

  const flushText = () => {
    if (textBuffer.length === 0) return;
    // Trim trailing empty lines from the buffer
    while (textBuffer.length && textBuffer[textBuffer.length - 1].trim() === '') {
      textBuffer.pop();
    }
    if (textBuffer.length) {
      blocks.push({ type: 'text', content: textBuffer.join('\n') });
    }
    textBuffer = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1];

    if (isTableRow(line) && next !== undefined && isSeparatorRow(next)) {
      flushText();
      const headers = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && isTableRow(lines[i])) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    textBuffer.push(line);
    i++;
  }
  flushText();

  return blocks;
}

interface ArticleContentProps {
  content: string;
  className?: string;
}

export default function ArticleContent({ content, className }: ArticleContentProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === 'table') {
          return (
            <div key={index} className="my-5 overflow-x-auto rounded-xl border border-[#E3ECF7]">
              <table className="min-w-full divide-y divide-[#E3ECF7] text-sm">
                <thead className="bg-[#F7FAFF]">
                  <tr>
                    {block.headers.map((h, hi) => (
                      <th
                        key={hi}
                        className="px-4 py-2.5 text-left font-semibold text-[#364052]"
                      >
                        <LinkedText text={h} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3ECF7] bg-white">
                  {block.rows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-[#F7FAFF]">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-4 py-2.5 text-gray-700">
                          <LinkedText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p
            key={index}
            className="text-base leading-relaxed text-gray-700"
            style={{ whiteSpace: 'pre-line' }}
          >
            <LinkedText text={block.content} />
          </p>
        );
      })}
    </div>
  );
}
