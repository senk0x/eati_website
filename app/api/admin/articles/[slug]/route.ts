import { NextResponse } from 'next/server';
import { getArticleBySlug, saveArticle, deleteArticle, BlogArticle } from '@/lib/blog';
import { githubConfigured, putFile, deleteFile } from '@/lib/github-content';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const article = getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to get article:', error);
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const updates: Partial<BlogArticle> = await request.json();

    const existing = getArticleBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const updated: BlogArticle = { ...existing, ...updates, slug };

    if (githubConfigured()) {
      await putFile(
        `content/blog/${slug}.json`,
        JSON.stringify(updated, null, 2),
        `Update article: ${slug}`,
      );
    } else {
      saveArticle(updated);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const existing = getArticleBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (githubConfigured()) {
      await deleteFile(
        `content/blog/${slug}.json`,
        `Delete article: ${slug}`,
      );
    } else {
      deleteArticle(slug);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
