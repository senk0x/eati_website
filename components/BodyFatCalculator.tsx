'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const IN_TO_CM = 2.54;

/** U.S. Navy body fat formula — all inputs in cm */
function navyBodyFatMale(waistCm: number, neckCm: number, heightCm: number): number {
  const denom =
    1.0324 -
    0.19077 * Math.log10(waistCm - neckCm) +
    0.15456 * Math.log10(heightCm);
  return 495 / denom - 450;
}

function navyBodyFatFemale(
  waistCm: number,
  neckCm: number,
  hipCm: number,
  heightCm: number
): number {
  const denom =
    1.29579 -
    0.35004 * Math.log10(waistCm + hipCm - neckCm) +
    0.221 * Math.log10(heightCm);
  return 495 / denom - 450;
}

const MALE_CATEGORIES = [
  { min: 2, max: 5, label: 'Essential' },
  { min: 6, max: 13, label: 'Athletes' },
  { min: 14, max: 17, label: 'Fitness' },
  { min: 18, max: 24, label: 'Average' },
  { min: 25, max: 100, label: 'Obese' },
] as const;

const FEMALE_CATEGORIES = [
  { min: 10, max: 13, label: 'Essential' },
  { min: 14, max: 20, label: 'Athletes' },
  { min: 21, max: 24, label: 'Fitness' },
  { min: 25, max: 31, label: 'Average' },
  { min: 32, max: 100, label: 'Obese' },
] as const;

function getCategory(bf: number, isMale: boolean): string {
  const list = isMale ? MALE_CATEGORIES : FEMALE_CATEGORIES;
  const pct = Math.max(0, Math.min(100, bf));
  const cat = list.find((c) => pct >= c.min && pct <= c.max);
  return cat?.label ?? '—';
}

type UnitSystem = 'metric' | 'imperial';
type Gender = 'male' | 'female';

interface Results {
  bodyFatPct: number;
  fatMassKg: number;
  leanMassKg: number;
  fatMassLbs: number;
  leanMassLbs: number;
  category: string;
  isMale: boolean;
}

function kgToLbs(kg: number): number {
  return kg / LB_TO_KG;
}

export default function BodyFatCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getWeightKg(): number | null {
    const v = parseFloat(weight);
    if (!Number.isFinite(v) || v <= 0) return null;
    return unitSystem === 'metric' ? v : v * LB_TO_KG;
  }

  function getHeightCm(): number | null {
    if (unitSystem === 'metric') {
      const v = parseFloat(heightCm);
      return Number.isFinite(v) && v > 0 ? v : null;
    }
    const ft = parseFloat(heightFt);
    const inch = parseFloat(heightIn);
    if (!Number.isFinite(ft) || !Number.isFinite(inch) || ft < 0 || inch < 0) return null;
    const totalInches = ft * 12 + inch;
    if (totalInches <= 0) return null;
    return totalInches * IN_TO_CM;
  }

  function toCm(value: string): number | null {
    const v = parseFloat(value);
    if (!Number.isFinite(v) || v <= 0) return null;
    return unitSystem === 'metric' ? v : v * IN_TO_CM;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const weightKg = getWeightKg();
    const height = getHeightCm();
    const waistCm = toCm(waist);
    const neckCm = toCm(neck);
    const hipCm = gender === 'female' ? toCm(hip) : 0;

    if (weightKg == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid weight in kg.'
          : 'Please enter a valid weight in lbs.'
      );
      return;
    }
    if (height == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid height in cm.'
          : 'Please enter valid height (feet and inches).'
      );
      return;
    }
    if (waistCm == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid waist measurement in cm.'
          : 'Please enter a valid waist measurement in inches.'
      );
      return;
    }
    if (neckCm == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid neck measurement in cm.'
          : 'Please enter a valid neck measurement in inches.'
      );
      return;
    }
    if (gender === 'female' && (hipCm == null || hipCm <= 0)) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid hip measurement in cm (required for women).'
          : 'Please enter a valid hip measurement in inches (required for women).'
      );
      return;
    }

    if (gender === 'male' && waistCm <= neckCm) {
      setError('Waist must be larger than neck for the Navy formula.');
      return;
    }
    if (gender === 'female' && waistCm + hipCm <= neckCm) {
      setError('Waist + hip must be larger than neck for the Navy formula.');
      return;
    }

    let bf: number;
    if (gender === 'male') {
      bf = navyBodyFatMale(waistCm, neckCm, height);
    } else {
      bf = navyBodyFatFemale(waistCm, neckCm, hipCm!, height);
    }

    // Clamp to reasonable display range (formula can occasionally produce edge values)
    bf = Math.max(0.1, Math.min(100, bf));

    const fatMassKg = (weightKg * bf) / 100;
    const leanMassKg = weightKg - fatMassKg;
    const fatMassLbs = kgToLbs(fatMassKg);
    const leanMassLbs = kgToLbs(leanMassKg);
    const category = getCategory(bf, gender === 'male');

    setResults({
      bodyFatPct: Math.round(bf * 10) / 10,
      fatMassKg: Math.round(fatMassKg * 10) / 10,
      leanMassKg: Math.round(leanMassKg * 10) / 10,
      fatMassLbs: Math.round(fatMassLbs * 10) / 10,
      leanMassLbs: Math.round(leanMassLbs * 10) / 10,
      category,
      isMale: gender === 'male',
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
              <span className="text-sm text-[#364052]">Imperial (lbs, inches)</span>
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

        <div>
          <label className={labelClass} htmlFor="weight">
            Weight {unitSystem === 'metric' ? '(kg)' : '(lbs)'}
          </label>
          <input
            id="weight"
            type="number"
            min={0.1}
            step={unitSystem === 'metric' ? 0.1 : 1}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 75' : 'e.g. 165'}
          />
        </div>

        {unitSystem === 'metric' ? (
          <div>
            <label className={labelClass} htmlFor="heightCm">
              Height (cm)
            </label>
            <input
              id="heightCm"
              type="number"
              min={1}
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
              <label className={labelClass} htmlFor="heightFt">
                Height (feet)
              </label>
              <input
                id="heightFt"
                type="number"
                min={0}
                max={8}
                step={1}
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
                className={inputClass}
                placeholder="5"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="heightIn">
                Height (inches)
              </label>
              <input
                id="heightIn"
                type="number"
                min={0}
                max={11}
                step={1}
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
                className={inputClass}
                placeholder="9"
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="waist">
            Waist {unitSystem === 'metric' ? '(cm)' : '(inches)'}
          </label>
          <input
            id="waist"
            type="number"
            min={0.1}
            step={unitSystem === 'metric' ? 0.1 : 0.5}
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 85' : 'e.g. 34'}
          />
          <p className="mt-1 text-xs text-gray-500">Measure around navel (belly button).</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="neck">
            Neck {unitSystem === 'metric' ? '(cm)' : '(inches)'}
          </label>
          <input
            id="neck"
            type="number"
            min={0.1}
            step={unitSystem === 'metric' ? 0.1 : 0.5}
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 38' : 'e.g. 15'}
          />
          <p className="mt-1 text-xs text-gray-500">Measure around the neck, below the larynx.</p>
        </div>

        {gender === 'female' && (
          <div>
            <label className={labelClass} htmlFor="hip">
              Hip {unitSystem === 'metric' ? '(cm)' : '(inches)'}
            </label>
            <input
              id="hip"
              type="number"
              min={0.1}
              step={unitSystem === 'metric' ? 0.1 : 0.5}
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              className={inputClass}
              placeholder={unitSystem === 'metric' ? 'e.g. 98' : 'e.g. 38'}
            />
            <p className="mt-1 text-xs text-gray-500">Required for women (Navy formula). Widest part.</p>
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] sm:w-auto sm:px-8"
        >
          Calculate body fat
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
            Your results
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Estimated using the U.S. Navy body fat formula. All measurements were converted to metric for calculation.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              title="Body fat percentage"
              value={`${results.bodyFatPct}%`}
              description="Estimated body fat from waist, neck, height (and hip for women) using the Navy method."
            />
            <ResultCard
              title="Body fat category"
              value={results.category}
              description={`Healthy ranges: ${results.isMale ? 'Men' : 'Women'} — Essential, Athletes, Fitness, Average, Obese.`}
            />
            <ResultCard
              title="Fat mass"
              value={`${results.fatMassKg} kg (${results.fatMassLbs} lbs)`}
              description="Estimated fat mass = weight × (body fat % / 100)."
            />
            <ResultCard
              title="Lean body mass"
              value={`${results.leanMassKg} kg (${results.leanMassLbs} lbs)`}
              description="Lean mass = weight − fat mass (muscle, bone, water, etc.)."
            />
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
