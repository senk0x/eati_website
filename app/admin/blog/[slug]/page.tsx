'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

interface BlogSection {
  heading: string;
  content: string;
}

interface BlogArticle {
  slug: string;
  title: string;
  introduction: string;
  sections: BlogSection[];
  midArticleCta: string;
  conclusion: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  publishedAt: string;
  published: boolean;
  relatedSlugs: string[];
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogArticle | null>(null);

  useEffect(() => {
    fetch(`/api/admin/articles/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleAddSection = () => {
    if (!form) return;
    setForm({
      ...form,
      sections: [...form.sections, { heading: '', content: '' }],
    });
  };

  const handleRemoveSection = (index: number) => {
    if (!form) return;
    setForm({
      ...form,
      sections: form.sections.filter((_, i) => i !== index),
    });
  };

  const handleSectionChange = (index: number, field: 'heading' | 'content', value: string) => {
    if (!form) return;
    setForm({
      ...form,
      sections: form.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      alert('Article saved!');
      setSaving(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save article');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await fetch(`/api/admin/articles/${slug}`, { method: 'DELETE' });
      router.push('/admin/blog');
    } catch (err) {
      console.error(err);
      alert('Failed to delete article');
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#85BEFF]';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="mb-4 text-gray-500">Article not found</p>
        <Link href="/admin/blog" className="text-[#85BEFF] hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
          >
            Edit Article
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              className="text-sm text-[#85BEFF] hover:underline"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
            >
              View live →
            </Link>
            <Link
              href="/admin/blog"
              className="text-sm text-gray-500 hover:text-[#85BEFF]"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
            >
              ← Back to list
            </Link>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
          style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
        >
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                disabled
                className={`${inputClass} bg-gray-100`}
              />
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label className={labelClass}>Introduction (Hook) *</label>
            <textarea
              required
              rows={3}
              value={form.introduction}
              onChange={(e) => setForm({ ...form, introduction: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Sections */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={labelClass}>H2 Sections</label>
              <button
                type="button"
                onClick={handleAddSection}
                className="text-sm text-[#85BEFF] hover:underline"
              >
                + Add Section
              </button>
            </div>
            <div className="space-y-4">
              {form.sections.map((section, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Section {index + 1}</span>
                    {form.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(index)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="H2 Heading"
                    value={section.heading}
                    onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                    className={`${inputClass} mb-2`}
                  />
                  <textarea
                    placeholder="Section content..."
                    rows={3}
                    value={section.content}
                    onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mid-Article CTA */}
          <div>
            <label className={labelClass}>Mid-Article CTA</label>
            <input
              type="text"
              placeholder="Download Eati and start tracking today!"
              value={form.midArticleCta}
              onChange={(e) => setForm({ ...form, midArticleCta: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Conclusion */}
          <div>
            <label className={labelClass}>Conclusion *</label>
            <textarea
              required
              rows={3}
              value={form.conclusion}
              onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Cover Image */}
          <ImageUpload
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
          />

          {/* SEO */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">SEO Settings</h3>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Target Keyword</label>
                <input
                  type="text"
                  value={form.targetKeyword}
                  onChange={(e) => setForm({ ...form, targetKeyword: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Publish */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Published
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#364052] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2b3545] disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin/blog"
                className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm text-red-500 hover:underline"
            >
              Delete article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
