import fs from 'fs';
import path from 'path';

export interface BlogSection {
  heading: string;
  content: string;
  /** Optional image shown under section heading */
  imageUrl?: string;
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
  /** Optional cluster used for topic navigation and related-article grouping */
  topicCluster?: string;
  /** Optional emoji used as visual cover fallback in cards and article headers */
  emoji?: string;
  /** Optional FAQ for long-tail keywords and FAQ schema */
  faqs?: BlogFAQ[];
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const CLUSTER_LABELS: Record<string, string> = {
  'calories-burned': 'Calories Burned',
  'ozempic-glp1': 'Ozempic & GLP-1 Weight Loss',
  'weight-loss-problems': 'Weight Loss Problems',
  'belly-fat': 'Belly Fat',
  'weight-loss-demographic': 'Weight Loss by Demographic',
  'app-comparisons': 'App Comparisons',
  'ai-nutrition': 'AI Nutrition & Food Logging',
  'calorie-deficit': 'Calorie Deficit',
  'calorie-tracking': 'Calorie Tracking',
  'high-protein-recipes': 'High-Protein Recipes',
  'weight-loss-guides': 'Weight Loss Guides',
};

const CLUSTER_EMOJIS: Record<string, string> = {
  'calories-burned': '🔥',
  'ozempic-glp1': '💉',
  'weight-loss-problems': '🧠',
  'belly-fat': '🫄',
  'weight-loss-demographic': '👥',
  'app-comparisons': '📱',
  'ai-nutrition': '🤖',
  'calorie-deficit': '📉',
  'calorie-tracking': '🧾',
  'high-protein-recipes': '🍽️',
  'weight-loss-guides': '🎯',
};

function inferTopicCluster(article: BlogArticle): string {
  if (article.topicCluster?.trim()) return article.topicCluster.trim().toLowerCase();

  const haystack = `${article.slug} ${article.title} ${article.targetKeyword}`.toLowerCase();

  if (
    haystack.includes('belly fat') ||
    haystack.includes('visceral fat') ||
    haystack.includes('subcutaneous fat')
  ) {
    return 'belly-fat';
  }

  if (
    haystack.includes('women over 40') ||
    haystack.includes('women over 50') ||
    haystack.includes('men over 40') ||
    haystack.includes('menopause') ||
    haystack.includes('busy professional') ||
    haystack.includes('college student') ||
    haystack.includes('weight loss for parent') ||
    haystack.includes('weight loss for senior') ||
    haystack.includes('workouts for women') ||
    haystack.includes('fat loss plan for men')
  ) {
    return 'weight-loss-demographic';
  }

  if (
    haystack.includes('vs') ||
    haystack.includes('alternative') ||
    haystack.includes('best weight loss app') ||
    haystack.includes('best calorie counter') ||
    haystack.includes('best app for') ||
    haystack.includes('myfitnesspal') ||
    haystack.includes('lose it') ||
    haystack.includes('cronometer') ||
    haystack.includes('macrofactor')
  ) {
    return 'app-comparisons';
  }

  if (
    haystack.includes('ai food') ||
    haystack.includes('ai nutrition') ||
    haystack.includes('ai calorie') ||
    haystack.includes('voice food') ||
    haystack.includes('voice logging') ||
    haystack.includes('barcode scanning') ||
    haystack.includes('future of')
  ) {
    return 'ai-nutrition';
  }

  if (
    haystack.includes('not losing weight') ||
    haystack.includes('weight plateau') ||
    haystack.includes('stop losing weight') ||
    haystack.includes('weight fluctuat') ||
    haystack.includes('belly fat') ||
    haystack.includes('hungry all the time') ||
    haystack.includes('tired on a diet')
  ) {
    return 'weight-loss-problems';
  }

  if (
    haystack.includes('ozempic') ||
    haystack.includes('wegovy') ||
    haystack.includes('mounjaro') ||
    haystack.includes('glp-1') ||
    haystack.includes('glp1') ||
    haystack.includes('semaglutide') ||
    haystack.includes('tirzepatide')
  ) {
    return 'ozempic-glp1';
  }

  if (
    haystack.includes('calories burned') ||
    haystack.includes('calorie burn') ||
    haystack.includes('walking') ||
    haystack.includes('running') ||
    haystack.includes('cycling') ||
    haystack.includes('swimming') ||
    haystack.includes('treadmill') ||
    haystack.includes('hiit') ||
    haystack.includes('jump rope') ||
    haystack.includes('rowing')
  ) {
    return 'calories-burned';
  }

  if (haystack.includes('calorie deficit')) return 'calorie-deficit';

  if (
    haystack.includes('track calories') ||
    haystack.includes('calorie tracker') ||
    haystack.includes('counting calories')
  ) {
    return 'calorie-tracking';
  }

  if (haystack.includes('recipe') || haystack.includes('high protein')) {
    return 'high-protein-recipes';
  }

  return 'weight-loss-guides';
}

function inferEmoji(article: BlogArticle, cluster: string): string {
  if (article.emoji?.trim()) return article.emoji.trim();
  return CLUSTER_EMOJIS[cluster] || '📝';
}

export function normalizeArticle(article: BlogArticle): BlogArticle {
  const topicCluster = inferTopicCluster(article);
  return {
    ...article,
    topicCluster,
    emoji: inferEmoji(article, topicCluster),
  };
}

export function getClusterLabel(cluster: string): string {
  return CLUSTER_LABELS[cluster] || 'General';
}

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
      articles.push(normalizeArticle(article));
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
    return normalizeArticle(JSON.parse(content) as BlogArticle);
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

  const sameCluster = published.filter(
    (a) => a.topicCluster && current.topicCluster && a.topicCluster === current.topicCluster
  );
  const relatedBySlug = current.relatedSlugs?.length
    ? current.relatedSlugs
        .map((slug) => published.find((a) => a.slug === slug))
        .filter(Boolean) as BlogArticle[]
    : [];

  const used = new Set<string>();
  const picked: BlogArticle[] = [];
  const tryAdd = (items: BlogArticle[]) => {
    for (const item of items) {
      if (picked.length >= limit) break;
      if (used.has(item.slug)) continue;
      used.add(item.slug);
      picked.push(item);
    }
  };

  // Requirement: related articles should come from same topic cluster when available.
  tryAdd(relatedBySlug.filter((a) => sameCluster.some((s) => s.slug === a.slug)));
  tryAdd(sameCluster);
  tryAdd(relatedBySlug);
  tryAdd(published);

  return picked.slice(0, limit);
}

export function generateTableOfContents(sections: BlogSection[]): { id: string; title: string }[] {
  const stripMarkdownLink = (value: string): string => {
    // Convert: [Dish Name](/blog/dish-slug) -> Dish Name
    const match = value.match(/^\[([^\]]+?)\]\((?:https?:\/\/)?\/blog\/[a-z0-9-]+\)$/i);
    if (match) return match[1];
    return value;
  };

  return sections.map((section, index) => ({
    id: `section-${index}`,
    title: stripMarkdownLink(section.heading),
  }));
}
