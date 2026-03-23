import { FOODS } from './foods';

interface InternalLink {
  pattern: RegExp;
  href: string;
  label: string;
}

const TOOLS_LINKS: InternalLink[] = [
  { pattern: /\bcalorie calculator\b/gi, href: '/tools/calorie-calculator', label: 'calorie calculator' },
  { pattern: /\bcalorie goal calculator\b/gi, href: '/tools/calorie-calculator', label: 'calorie goal calculator' },
  { pattern: /\btdee calculator\b/gi, href: '/tools/tdee-calculator', label: 'TDEE calculator' },
  { pattern: /\bmacro calculator\b/gi, href: '/tools/macro-goal-calculator', label: 'macro calculator' },
  { pattern: /\bmacro goal calculator\b/gi, href: '/tools/macro-goal-calculator', label: 'macro goal calculator' },
  { pattern: /\bwater intake calculator\b/gi, href: '/tools/water-intake-calculator', label: 'water intake calculator' },
  { pattern: /\bprotein calculator\b/gi, href: '/tools/protein-calculator', label: 'protein calculator' },
  { pattern: /\bbody fat calculator\b/gi, href: '/tools/body-fat-calculator', label: 'body fat calculator' },
  { pattern: /\bbmi calculator\b/gi, href: '/tools/bmi-calculator', label: 'BMI calculator' },
  { pattern: /\bcalorie burn calculator\b/gi, href: '/tools/calorie-burn-calculator', label: 'calorie burn calculator' },
  { pattern: /\bcalorie deficit calculator\b/gi, href: '/tools/calorie-deficit-calculator', label: 'calorie deficit calculator' },
  { pattern: /\bideal body weight calculator\b/gi, href: '/tools/ideal-body-weight-calculator', label: 'ideal body weight calculator' },
  { pattern: /\bmeal log calculator\b/gi, href: '/tools/meal-log-calculator', label: 'meal log calculator' },
  { pattern: /\bmeal log\b/gi, href: '/tools/meal-log-calculator', label: 'meal log' },
];

const FOOD_LINKS: InternalLink[] = FOODS.map((food) => ({
  pattern: new RegExp(`\\b${food.name.replace(/[()]/g, '\\$&')}\\b`, 'gi'),
  href: `/foods/${food.slug}`,
  label: food.name,
}));

const ALL_LINKS = [...TOOLS_LINKS, ...FOOD_LINKS];

export interface TextSegment {
  type: 'text' | 'link';
  content: string;
  href?: string;
}

export function parseContentWithLinks(text: string): TextSegment[] {
  interface Match {
    start: number;
    end: number;
    href: string;
    matchedText: string;
  }

  const matches: Match[] = [];

  for (const link of ALL_LINKS) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(link.pattern.source, link.pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const overlap = matches.some(
        (m) =>
          (match!.index >= m.start && match!.index < m.end) ||
          (match!.index + match![0].length > m.start && match!.index + match![0].length <= m.end) ||
          (match!.index <= m.start && match!.index + match![0].length >= m.end)
      );
      if (!overlap) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          href: link.href,
          matchedText: match[0],
        });
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);

  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of matches) {
    if (match.start > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.start) });
    }
    segments.push({ type: 'link', content: match.matchedText, href: match.href });
    lastIndex = match.end;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}
