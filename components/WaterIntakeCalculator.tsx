'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const ML_PER_KG = 35;
const ML_TO_OZ = 0.033814;

const ACTIVITY_LEVELS = [
  { value: 0, label: 'Sedentary', description: 'Little or no exercise' },
  { value: 300, label: 'Light activity', description: 'Light exercise a few days per week' },
  { value: 500, label: 'Moderate exercise', description: 'Regular exercise 3–5 days/week' },
  { value: 750, label: 'Heavy training', description: 'Intense training most days' },
  { value: 1000, label: 'Athlete', description: 'Daily intense training' },
] as const;

const CLIMATE_OPTIONS = [
  { value: 0, label: 'Normal' },
  { value: 500, label: 'Hot' },
] as const;

type UnitSystem = 'metric' | 'imperial';

interface Results {
  totalMl: number;
  baseMl: number;
  activityMl: number;
  climateMl: number;
  activityLabel: string;
  climateLabel: string;
  weightKg: number;
}

function mlToL(ml: number) {
  return Math.round((ml / 1000) * 10) / 10;
}

function mlToOz(ml: number) {
  return Math.round(ml * ML_TO_OZ * 10) / 10;
}

export default function WaterIntakeCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityBonus, setActivityBonus] = useState(300);
  const [climateBonus, setClimateBonus] = useState(0);
  const [exerciseDays, setExerciseDays] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getWeightKg(): number | null {
    if (unitSystem === 'metric') {
      const w = parseFloat(weightKg);
      return Number.isFinite(w) && w > 0 ? w : null;
    }
    const lbs = parseFloat(weightKg);
    if (!Number.isFinite(lbs) || lbs <= 0) return null;
    return lbs * LB_TO_KG;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const w = getWeightKg();
    if (w == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid weight in kg.'
          : 'Please enter a valid weight in lbs.'
      );
      return;
    }

    const baseMl = Math.round(w * ML_PER_KG);
    const activityMl = activityBonus;
    const climateMl = climateBonus;
    const totalMl = baseMl + activityMl + climateMl;
    const activityLabel = ACTIVITY_LEVELS.find((a) => a.value === activityBonus)?.label ?? 'Activity';
    const climateLabel = CLIMATE_OPTIONS.find((c) => c.value === climateBonus)?.label ?? 'Climate';

    setResults({
      totalMl,
      baseMl,
      activityMl,
      climateMl,
      activityLabel,
      climateLabel,
      weightKg: w,
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
              <span className="text-sm text-[#364052]">Metric (kg)</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="unit"
                checked={unitSystem === 'imperial'}
                onChange={() => setUnitSystem('imperial')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Imperial (lbs)</span>
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
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 70' : 'e.g. 154'}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="age">
            Age (optional)
          </label>
          <input
            id="age"
            type="number"
            min={1}
            max={120}
            step={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
            placeholder="e.g. 30"
          />
          <p className="mt-1 text-xs text-gray-500">For future personalized recommendations.</p>
        </div>

        <div>
          <span className={labelClass}>Gender (optional)</span>
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
          <label className={labelClass}>Activity level</label>
          <select
            value={activityBonus}
            onChange={(e) => setActivityBonus(Number(e.target.value))}
            className={inputClass}
          >
            {ACTIVITY_LEVELS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label} — {a.description} {a.value > 0 ? `(+${a.value} ml)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Climate (optional)</label>
          <select
            value={climateBonus}
            onChange={(e) => setClimateBonus(Number(e.target.value))}
            className={inputClass}
          >
            {CLIMATE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} {c.value > 0 ? `(+${c.value} ml)` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="exerciseDays">
            Exercise frequency (optional)
          </label>
          <input
            id="exerciseDays"
            type="number"
            min={0}
            max={7}
            step={1}
            value={exerciseDays}
            onChange={(e) => setExerciseDays(e.target.value)}
            className={inputClass}
            placeholder="Days per week"
          />
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
          Calculate water intake
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <VolumeCard
              title="Daily water intake (ml)"
              value={results.totalMl}
              unit="ml"
              explanation="Total recommended fluid per day in milliliters. Includes base need plus activity and climate adjustments."
            />
            <VolumeCard
              title="Daily water intake (liters)"
              value={mlToL(results.totalMl)}
              unit="L"
              explanation="Same target in liters. About 2–3 L is common for many adults; your needs may be higher with activity or heat."
            />
            <VolumeCard
              title="Daily water intake (oz)"
              value={mlToOz(results.totalMl)}
              unit="oz"
              explanation="Same target in US fluid ounces. Useful for tracking with standard bottles (e.g. 16–20 oz)."
            />
            <BreakdownCard results={results} />
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeCard({
  title,
  value,
  unit,
  explanation,
}: {
  title: string;
  value: number;
  unit: string;
  explanation: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">
        {value} {unit}
      </p>
      <p className="text-sm leading-relaxed text-gray-600">{explanation}</p>
    </div>
  );
}

function BreakdownCard({ results }: { results: Results }) {
  const liters = mlToL(results.totalMl);
  const oz = mlToOz(results.totalMl);
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl sm:col-span-2 lg:col-span-4"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Breakdown
      </h3>
      <ul className="mb-3 space-y-1 text-sm text-gray-600">
        <li>
          <strong>Base</strong> (35 ml per kg × {results.weightKg} kg): {results.baseMl} ml
        </li>
        <li>
          <strong>{results.activityLabel}</strong>: +{results.activityMl} ml
        </li>
        <li>
          <strong>{results.climateLabel} climate</strong>: +{results.climateMl} ml
        </li>
      </ul>
      <p className="text-sm leading-relaxed text-gray-600">
        Total: <strong>{results.totalMl} ml</strong> ({liters} L, {oz} oz) per day. Spread intake
        across the day; drink more around exercise and in heat.
      </p>
    </div>
  );
}
