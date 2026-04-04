'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogArticle {
  slug: string;
  title: string;
  publishedAt: string;
  published: boolean;
}

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm(`Delete article "${slug}"?`)) return;

    try {
      await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
      setArticles((prev) => prev.filter((a) => a.slug !== slug));
    } catch (err) {
      console.error(err);
      alert('Failed to delete article');
    }
  };

  const handleTogglePublish = async (slug: string, currentlyPublished: boolean) => {
    try {
      await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentlyPublished }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.slug === slug ? { ...a, published: !currentlyPublished } : a))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update article');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
          >
            Blog Admin
          </h1>
          <Link
            href="/admin/blog/new"
            className="rounded-full bg-[#364052] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2b3545]"
          >
            + New Article
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-500">No articles yet. Create your first one!</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">Title</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.slug} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/blog/${article.slug}`}
                        className="font-medium text-[#364052] hover:text-[#85BEFF]"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          article.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/blog/${article.slug}`}
                          className="text-[#85BEFF] hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(article.slug, article.published)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {article.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDelete(article.slug)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#85BEFF]"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
