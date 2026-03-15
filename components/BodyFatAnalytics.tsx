'use client';

import { useState, useRef } from 'react';

const GUIDELINES = [
  'Good, even lighting (no harsh shadows)',
  'Neutral, uncluttered background',
  'Full body visible (head to feet)',
  'Minimal clothing (e.g. fitness attire) for clearer shape',
  'No filters or editing',
  'No mirror distortion; stand at a small distance from the mirror',
];

type ConfidenceLevel = 'low' | 'medium' | 'high';
type Category = 'essential' | 'athlete' | 'fitness' | 'average' | 'obese';

interface AnalysisResult {
  body_fat_percentage: number;
  confidence_level: ConfidenceLevel;
  explanation: string;
  estimated_category: Category;
}

const CATEGORY_LABELS: Record<Category, string> = {
  essential: 'Essential',
  athlete: 'Athlete',
  fitness: 'Fitness',
  average: 'Average',
  obese: 'Obese',
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_FILE_MB = 8;
const ACCEPT = 'image/jpeg,image/png,image/webp';

export default function BodyFatAnalytics() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [sideFile, setSideFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [sidePreview, setSidePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const sideInputRef = useRef<HTMLInputElement>(null);

  function handleFrontChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    if (!file) {
      setFrontFile(null);
      setFrontPreview(null);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_MB} MB.`);
      setFrontFile(null);
      setFrontPreview(null);
      return;
    }
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
  }

  function handleSideChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setError(null);
    setResult(null);
    if (sidePreview) URL.revokeObjectURL(sidePreview);
    if (!file) {
      setSideFile(null);
      setSidePreview(null);
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_FILE_MB} MB.`);
      setSideFile(null);
      setSidePreview(null);
      return;
    }
    setSideFile(file);
    setSidePreview(URL.createObjectURL(file));
  }

  async function handleAnalyze() {
    if (!frontFile) {
      setError('Please upload at least a front view photo.');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const frontDataUrl = await fileToDataUrl(frontFile);
      const body: { frontImage: string; sideImage?: string } = { frontImage: frontDataUrl };
      if (sideFile) {
        body.sideImage = await fileToDataUrl(sideFile);
      }
      const res = await fetch('/api/body-fat-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Analysis failed. Please try again.');
        return;
      }
      setResult(data as AnalysisResult);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#85BEFF] file:mr-3 file:rounded-lg file:border-0 file:bg-[#E7F0FF] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#364052]';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#364052]';

  return (
    <div style={{ fontFamily: 'var(--font-rubik), sans-serif' }}>
      <div className="space-y-6 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:rounded-3xl md:p-8">
        <div>
          <h3 className={labelClass}>Photo guidelines</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {GUIDELINES.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

        <div>
          <label className={labelClass} htmlFor="front-photo">
            Front view photo <span className="text-red-500">*</span>
          </label>
          <input
            id="front-photo"
            ref={frontInputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleFrontChange}
            className={inputClass}
          />
          {frontPreview && (
            <div className="mt-2">
              <img
                src={frontPreview}
                alt="Front view preview"
                className="max-h-40 rounded-xl border border-[#E3ECF7] object-contain"
              />
            </div>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="side-photo">
            Side view photo <span className="text-gray-400">(recommended for better accuracy)</span>
          </label>
          <input
            id="side-photo"
            ref={sideInputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleSideChange}
            className={inputClass}
          />
          {sidePreview && (
            <div className="mt-2">
              <img
                src={sidePreview}
                alt="Side view preview"
                className="max-h-40 rounded-xl border border-[#E3ECF7] object-contain"
              />
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading || !frontFile}
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {loading ? 'Analyzing…' : 'Analyze photos'}
        </button>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              title="Estimated body fat %"
              value={`${result.body_fat_percentage.toFixed(1)}%`}
              description="AI-based visual estimate from your photo(s)."
            />
            <ResultCard
              title="Confidence level"
              value={result.confidence_level.charAt(0).toUpperCase() + result.confidence_level.slice(1)}
              description="How reliable the estimate is given image quality and angles."
            />
            <ResultCard
              title="Body fat category"
              value={CATEGORY_LABELS[result.estimated_category]}
              description="Estimated category (essential, athlete, fitness, average, obese)."
            />
            <div
              className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 sm:col-span-2 md:rounded-3xl"
              style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
            >
              <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
                Visual interpretation
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">{result.explanation}</p>
            </div>
          </div>

          <div
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:rounded-3xl"
            style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
          >
            <p className="text-sm font-medium text-amber-800">
              Disclaimer: This is an AI-based estimation tool and does not replace medical or
              professional body composition testing (e.g. DEXA, calipers, or other clinical
              methods). Use results for general interest and tracking trends only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{value}</p>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
