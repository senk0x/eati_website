'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Cover Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div style={{ fontFamily: 'var(--font-rubik), sans-serif' }}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <img
              src={value}
              alt="Cover preview"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#85BEFF]"
              placeholder="Image URL"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#85BEFF] hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="text-sm text-gray-500">Uploading...</div>
            ) : (
              <>
                <svg
                  className="mb-2 h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">Click to upload an image</p>
                <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF up to 5MB</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="text-center text-xs text-gray-400">or enter URL manually</div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#85BEFF]"
            placeholder="/images/blog/my-image.jpg"
          />
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
