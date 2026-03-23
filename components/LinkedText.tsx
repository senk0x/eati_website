import Link from 'next/link';
import { parseContentWithLinks } from '@/lib/internal-links';

interface LinkedTextProps {
  text: string;
  className?: string;
}

export default function LinkedText({ text, className }: LinkedTextProps) {
  const segments = parseContentWithLinks(text);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'link' && segment.href) {
          return (
            <Link
              key={index}
              href={segment.href}
              className="text-[#85BEFF] hover:underline"
            >
              {segment.content}
            </Link>
          );
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </>
  );
}
