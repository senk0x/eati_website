import fs from 'fs';
import path from 'path';

export interface BlogSection {
  heading: string;
  content: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  introduction: string;
  sections: BlogSection[];
  midArticleCta?: string;
  conclusion: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  publishedAt: string;
  published: boolean;
  relatedSlugs?: string[];
  /** Optional FAQ for long-tail keywords and FAQ schema */
  faqs?: BlogFAQ[];
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export function getAllArticles(): BlogArticle[] {
  ensureBlogDir();
  
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.json'));
  const articles: BlogArticle[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
      const article = JSON.parse(content) as BlogArticle;
      articles.push(article);
    } catch (e) {
      console.error(`Failed to parse ${file}:`, e);
    }
  }

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPublishedArticles(): BlogArticle[] {
  return getAllArticles().filter((a) => a.published);
}

export function getArticleBySlug(slug: string): BlogArticle | null {
  ensureBlogDir();
  
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as BlogArticle;
  } catch (e) {
    console.error(`Failed to read article ${slug}:`, e);
    return null;
  }
}

export function saveArticle(article: BlogArticle): void {
  ensureBlogDir();
  
  const filePath = path.join(BLOG_DIR, `${article.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2), 'utf-8');
}

export function deleteArticle(slug: string): boolean {
  ensureBlogDir();
  
  const filePath = path.join(BLOG_DIR, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export function getRelatedArticles(currentSlug: string, limit = 3): BlogArticle[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];

  const published = getPublishedArticles().filter((a) => a.slug !== currentSlug);

  if (current.relatedSlugs && current.relatedSlugs.length > 0) {
    const related = current.relatedSlugs
      .map((slug) => published.find((a) => a.slug === slug))
      .filter(Boolean) as BlogArticle[];
    if (related.length >= limit) {
      return related.slice(0, limit);
    }
    const remaining = published.filter((a) => !current.relatedSlugs!.includes(a.slug));
    return [...related, ...remaining].slice(0, limit);
  }

  return published.slice(0, limit);
}

export function generateTableOfContents(sections: BlogSection[]): { id: string; title: string }[] {
  return sections.map((section, index) => ({
    id: `section-${index}`,
    title: section.heading,
  }));
}
