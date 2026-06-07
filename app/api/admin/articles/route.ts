import { NextResponse } from 'next/server';
import { getAllArticles, BlogArticle } from '@/lib/blog';
import { persistArticle } from '@/lib/blog-blob';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to get articles:', error);
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const article: BlogArticle = await request.json();

    if (!article.slug || !article.title) {
      return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
    }

    article.slug = article.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (!article.publishedAt) {
      article.publishedAt = new Date().toISOString();
    }

    await persistArticle(article);
    return NextResponse.json({ ok: true, slug: article.slug });
  } catch (error) {
    console.error('Failed to save article:', error);
    const message = error instanceof Error ? error.message : 'Failed to save article';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
