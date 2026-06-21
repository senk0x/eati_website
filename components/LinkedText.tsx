import Link from 'next/link';
import { parseContentWithLinks } from '@/lib/internal-links';
import { parseBoldSegments } from '@/lib/rich-text';

interface LinkedTextProps {
  text: string;
  className?: string;
}

export default function LinkedText({ text, className }: LinkedTextProps) {
  const segments = parseContentWithLinks(text);

  return (
    <>
      {segments.flatMap((segment, index) => {
        if (segment.type === 'link' && segment.href) {
          const isExternal = segment.href.startsWith('http');

          if (isExternal) {
            return (
              <a
                key={index}
                href={segment.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#88B8FF] hover:underline"
              >
                {segment.content}
              </a>
            );
          }

          return (
            <Link
              key={index}
              href={segment.href}
              className="text-[#88B8FF] hover:underline"
            >
              {segment.content}
            </Link>
          );
        }

        return parseBoldSegments(segment.content).map((part, partIndex) => {
          if (part.type === 'bold') {
            return (
              <strong
                key={`${index}-${partIndex}`}
                className="font-semibold text-eati-ink"
              >
                {part.content}
              </strong>
            );
          }

          return (
            <span key={`${index}-${partIndex}`} className={className}>
              {part.content}
            </span>
          );
        });
      })}
    </>
  );
}
