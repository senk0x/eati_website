'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewAlt?: string;
}

const DEFAULT_PREVIEW_ALT = 'Blog article cover image preview for the Eati content editor';

/** Resize and compress an image file client-side. Returns a JPEG data URL. */
async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/** Try server-side upload first; fall back to client-side compression. */
async function uploadImage(file: File): Promise<string> {
  // 1. Attempt server upload (works locally + on Vercel with BLOB_READ_WRITE_TOKEN)
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      return data.url as string;
    }
  } catch {
    // network error — fall through to client-side path
  }

  // 2. Client-side fallback: resize + compress in-browser, store as data URL
  return compressImage(file);
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Cover Image',
  previewAlt = DEFAULT_PREVIEW_ALT,
}: ImageUploadProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setError('');

    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <img
              src={value}
              alt={previewAlt}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="text"
              value={value.startsWith('data:') ? '(embedded image)' : value}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#88B8FF]"
              placeholder="Image URL"
              readOnly={value.startsWith('data:')}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#88B8FF] hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {processing ? (
              <div className="text-sm text-gray-500">Processing…</div>
            ) : (
              <>
                <svg className="mb-2 h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#88B8FF]"
            placeholder="/images/blog/my-image.jpg"
          />
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
