'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

interface BlogSection {
  heading: string;
  content: string;
  imageUrl: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    title: '',
    introduction: '',
    sections: [{ heading: '', content: '', imageUrl: '' }] as BlogSection[],
    midArticleCta: '',
    conclusion: '',
    coverImage: '',
    metaTitle: '',
    metaDescription: '',
    targetKeyword: '',
    published: false,
    relatedSlugs: [] as string[],
  });

  const handleAddSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: '', content: '', imageUrl: '' }],
    }));
  };

  const handleRemoveSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSectionChange = (
    index: number,
    field: 'heading' | 'content' | 'imageUrl',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          publishedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      router.push(`/admin/blog/${data.slug}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create article');
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#85BEFF]';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-rubik), sans-serif', color: '#364052' }}
          >
            New Article
          </h1>
          <Link
            href="/admin/blog"
            className="text-sm text-gray-500 hover:text-[#85BEFF]"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            ← Back to list
          </Link>
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
              <label className={labelClass}>Slug (URL) *</label>
              <input
                type="text"
                required
                placeholder="my-article-url"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
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
                  <div className="mt-3">
                    <ImageUpload
                      value={section.imageUrl}
                      onChange={(url) => handleSectionChange(index, 'imageUrl', url)}
                      label="Section Image"
                    />
                  </div>
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
              Publish immediately
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#364052] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2b3545] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Article'}
            </button>
            <Link
              href="/admin/blog"
              className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
