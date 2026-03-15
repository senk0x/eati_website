'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const INCH_TO_CM = 2.54;
const FOOT_TO_CM = 30.48;
const KG_TO_LB = 2.20462;

type UnitSystem = 'metric' | 'imperial';
type FrameSize = 'small' | 'medium' | 'large';

const FRAME_MULTIPLIER: Record<FrameSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.1,
};

interface Results {
  devineKg: number;
  robinsonKg: number;
  rangeLowerKg: number;
  rangeUpperKg: number;
  frameAdjustedKg: number | null;
  currentWeightKg: number | null;
  frameSize: FrameSize | null;
}

function kgToLb(kg: number) {
  return Math.round(kg * KG_TO_LB * 10) / 10;
}

// Devine: height in cm
function devineIbwKg(heightCm: number, isMale: boolean): number {
  const base = isMale ? 50 : 45.5;
  const ibw = base + 0.9 * (heightCm - 152);
  return Math.max(ibw, 20); // reasonable floor
}

// Robinson: height in inches
function robinsonIbwKg(heightInches: number, isMale: boolean): number {
  const base = isMale ? 52 : 49;
  const multiplier = isMale ? 1.9 : 1.7;
  const ibw = base + multiplier * (heightInches - 60);
  return Math.max(ibw, 20);
}

export default function IBWCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [frameSize, setFrameSize] = useState<FrameSize | ''>('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getHeightCm(): number | null {
    if (unitSystem === 'metric') {
      const h = parseFloat(heightCm);
      return Number.isFinite(h) && h > 0 ? h : null;
    }
    const f = parseInt(feet, 10);
    const i = parseFloat(inches);
    if (!Number.isFinite(f) || f < 0 || !Number.isFinite(i) || i < 0) return null;
    return f * FOOT_TO_CM + i * INCH_TO_CM;
  }

  function getCurrentWeightKg(): number | null {
    if (!currentWeight.trim()) return null;
    if (unitSystem === 'metric') {
      const w = parseFloat(currentWeight);
      return Number.isFinite(w) && w > 0 ? w : null;
    }
    const lbs = parseFloat(currentWeight);
    if (!Number.isFinite(lbs) || lbs <= 0) return null;
    return lbs * LB_TO_KG;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const hCm = getHeightCm();
    if (hCm == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid height in cm.'
          : 'Please enter valid height (feet and inches).'
      );
      return;
    }

    const heightIn = hCm / INCH_TO_CM;
    const devineKg = Math.round(devineIbwKg(hCm, gender === 'male') * 10) / 10;
    const robinsonKg = Math.round(robinsonIbwKg(heightIn, gender === 'male') * 10) / 10;
    const rangeLowerKg = Math.round(devineKg * 0.9 * 10) / 10;
    const rangeUpperKg = Math.round(devineKg * 1.1 * 10) / 10;
    const frame = frameSize === '' ? null : frameSize;
    const frameAdjustedKg =
      frame != null && frame !== 'medium'
        ? Math.round(devineKg * FRAME_MULTIPLIER[frame] * 10) / 10
        : null;
    const currentKg = getCurrentWeightKg();

    setResults({
      devineKg,
      robinsonKg,
      rangeLowerKg,
      rangeUpperKg,
      frameAdjustedKg,
      currentWeightKg: currentKg,
      frameSize: frame,
    });
  }

  const inputClass =
    'w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#85BEFF]';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#364052]';

  return (
    <div style={{ fontFamily: 'var(--font-rubik), sans-serif' }}>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:rounded-3xl md:p-8"
      >
        <div>
          <span className={labelClass}>Unit system</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="unit"
                checked={unitSystem === 'metric'}
                onChange={() => setUnitSystem('metric')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Metric (kg, cm)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="unit"
                checked={unitSystem === 'imperial'}
                onChange={() => setUnitSystem('imperial')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Imperial (lbs, feet & inches)</span>
            </label>
          </div>
        </div>

        <div>
          <span className={labelClass}>Gender</span>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Male</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="gender"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Female</span>
            </label>
          </div>
        </div>

        {unitSystem === 'metric' ? (
          <div>
            <label className={labelClass} htmlFor="heightCm">
              Height (cm)
            </label>
            <input
              id="heightCm"
              type="number"
              min={100}
              step={1}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className={inputClass}
              placeholder="e.g. 175"
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="feet">
                Height (feet)
              </label>
              <input
                id="feet"
                type="number"
                min={0}
                max={8}
                step={1}
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className={inputClass}
                placeholder="5"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="inches">
                Height (inches)
              </label>
              <input
                id="inches"
                type="number"
                min={0}
                max={11}
                step={0.5}
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className={inputClass}
                placeholder="9"
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="currentWeight">
            Current weight (optional)
          </label>
          <input
            id="currentWeight"
            type="number"
            min={0.1}
            step={unitSystem === 'metric' ? 0.1 : 1}
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 75' : 'e.g. 165'}
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave blank if you only want ideal weight and range.
          </p>
        </div>

        <div>
          <label className={labelClass}>Frame size (optional)</label>
          <select
            value={frameSize}
            onChange={(e) => setFrameSize(e.target.value as FrameSize | '')}
            className={inputClass}
          >
            <option value="">No selection</option>
            <option value="small">Small frame</option>
            <option value="medium">Medium frame</option>
            <option value="large">Large frame</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Adjusts ideal weight: small frame toward lower end, large toward upper end.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] sm:w-auto sm:px-8"
        >
          Calculate ideal weight
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <WeightResultCard
              title="Ideal Body Weight (Devine)"
              valueKg={results.devineKg}
              explanation="Most widely used in medical settings. Based on height and sex using the Devine formula."
            />
            <WeightResultCard
              title="Ideal Body Weight (Robinson)"
              valueKg={results.robinsonKg}
              explanation="Alternative formula often used for comparison. Slightly different coefficients."
            />
            <RangeResultCard
              lowerKg={results.rangeLowerKg}
              upperKg={results.rangeUpperKg}
            />
            {results.frameAdjustedKg != null && results.frameSize !== 'medium' && (
              <WeightResultCard
                title={`Frame-adjusted ideal (${results.frameSize} frame)`}
                valueKg={results.frameAdjustedKg}
                explanation={`Adjusted from Devine for a ${results.frameSize} frame (${results.frameSize === 'small' ? '−10%' : '+10%'}).`}
              />
            )}
            {results.currentWeightKg != null && (
              <DifferenceCard
                currentKg={results.currentWeightKg}
                devineKg={results.devineKg}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WeightResultCard({
  title,
  valueKg,
  explanation,
}: {
  title: string;
  valueKg: number;
  explanation: string;
}) {
  const lbs = kgToLb(valueKg);
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{valueKg} kg</p>
      <p className="mb-3 text-sm text-gray-500">{lbs} lbs</p>
      <p className="text-sm leading-relaxed text-gray-600">{explanation}</p>
    </div>
  );
}

function RangeResultCard({ lowerKg, upperKg }: { lowerKg: number; upperKg: number }) {
  const lowerLb = kgToLb(lowerKg);
  const upperLb = kgToLb(upperKg);
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Healthy weight range
      </h3>
      <p className="mb-1 text-lg font-bold text-[#85BEFF]">
        {lowerKg} – {upperKg} kg
      </p>
      <p className="mb-3 text-sm text-gray-500">
        {lowerLb} – {upperLb} lbs
      </p>
      <p className="text-sm leading-relaxed text-gray-600">
        ±10% of Devine IBW. Many people fall within this range; use it as a general guide, not a strict target.
      </p>
    </div>
  );
}

function DifferenceCard({ currentKg, devineKg }: { currentKg: number; devineKg: number }) {
  const diffKg = Math.round((currentKg - devineKg) * 10) / 10;
  const diffLb = kgToLb(Math.abs(diffKg));
  const above = diffKg > 0;
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl sm:col-span-2 lg:col-span-4"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Difference from current weight
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">
        {above ? '+' : ''}{diffKg} kg ({above ? '+' : ''}{diffLb} lbs)
      </p>
      <p className="text-sm leading-relaxed text-gray-600">
        {diffKg === 0
          ? 'Your current weight matches the Devine ideal body weight.'
          : above
            ? `You are ${diffKg} kg (${diffLb} lbs) above the Devine IBW. This is only a reference; health depends on many factors.`
            : `You are ${Math.abs(diffKg)} kg (${diffLb} lbs) below the Devine IBW. This is only a reference; some people are healthy at lower weights.`}
      </p>
    </div>
  );
}
