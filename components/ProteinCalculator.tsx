'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;

// Grams of protein per kg bodyweight by goal
const PROTEIN_GOALS = [
  { value: 0.8, label: 'Sedentary / general health', description: 'Little or no structured training' },
  { value: 1.2, label: 'Light activity', description: 'Light exercise a few days per week' },
  { value: 1.6, label: 'Moderate training', description: 'Regular strength or cardio 3–5 days/week' },
  { value: 2.0, label: 'Muscle gain / heavy training', description: 'Focused on building muscle or intense training' },
  { value: 2.2, label: 'Fat loss (high-protein)', description: 'Cutting while preserving muscle' },
] as const;

type UnitSystem = 'metric' | 'imperial';

interface Results {
  dailyProteinG: number;
  rangeMinG: number;
  rangeMaxG: number;
  perMeal3: number;
  perMeal4: number;
  goalLabel: string;
  multiplier: number;
  trainingDays: number | null;
  weightKg: number;
}

export default function ProteinCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState('');
  const [multiplier, setMultiplier] = useState(1.6);
  const [trainingDays, setTrainingDays] = useState('');
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

    const dailyG = Math.round(w * multiplier * 10) / 10;
    const rangeMin = Math.round(w * 1.2 * 10) / 10;
    const rangeMax = Math.round(w * 2.2 * 10) / 10;
    const perMeal3 = Math.round((dailyG / 3) * 10) / 10;
    const perMeal4 = Math.round((dailyG / 4) * 10) / 10;
    const goalLabel = PROTEIN_GOALS.find((g) => g.value === multiplier)?.label ?? 'Your goal';
    const trainingNum = trainingDays.trim() === '' ? null : parseInt(trainingDays, 10);
    const trainingDaysValid =
      trainingNum != null && Number.isFinite(trainingNum) && trainingNum >= 0 && trainingNum <= 7
        ? trainingNum
        : null;

    setResults({
      dailyProteinG: dailyG,
      rangeMinG: rangeMin,
      rangeMaxG: rangeMax,
      perMeal3,
      perMeal4,
      goalLabel,
      multiplier,
      trainingDays: trainingDaysValid,
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
          <label className={labelClass}>Goal</label>
          <select
            value={multiplier}
            onChange={(e) => setMultiplier(parseFloat(e.target.value))}
            className={inputClass}
          >
            {PROTEIN_GOALS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label} — {g.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="trainingDays">
            Training frequency (optional)
          </label>
          <input
            id="trainingDays"
            type="number"
            min={0}
            max={7}
            step={1}
            value={trainingDays}
            onChange={(e) => setTrainingDays(e.target.value)}
            className={inputClass}
            placeholder="e.g. 4 days per week"
          />
          <p className="mt-1 text-xs text-gray-500">Days per week you train. Used for context in your recommendation.</p>
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
          Calculate protein
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl" style={{ color: '#364052' }}>
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DailyProteinCard dailyG={results.dailyProteinG} weightKg={results.weightKg} multiplier={results.multiplier} />
            <RangeCard minG={results.rangeMinG} maxG={results.rangeMaxG} />
            <PerMealCard perMeal3={results.perMeal3} perMeal4={results.perMeal4} />
            <GoalCard
              goalLabel={results.goalLabel}
              multiplier={results.multiplier}
              trainingDays={results.trainingDays}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ~100g protein ≈ 1 lb (450g) lean meat
function proteinToFoodLb(g: number): number {
  return Math.round((g / 100) * 10) / 10;
}

function DailyProteinCard({
  dailyG,
  weightKg,
  multiplier,
}: {
  dailyG: number;
  weightKg: number;
  multiplier: number;
}) {
  const foodLb = proteinToFoodLb(dailyG);
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Recommended daily protein
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{dailyG} g</p>
      <p className="mb-3 text-sm text-gray-500">Roughly {foodLb} lb lean meat equivalent per day</p>
      <p className="text-sm leading-relaxed text-gray-600">
        Based on {multiplier} g per kg body weight ({weightKg} kg). Spread this across your meals for best absorption and satiety.
      </p>
    </div>
  );
}

function RangeCard({ minG, maxG }: { minG: number; maxG: number }) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Protein range
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">
        {minG} – {maxG} g
      </p>
      <p className="mb-3 text-sm text-gray-500">per day</p>
      <p className="text-sm leading-relaxed text-gray-600">
        General range (1.2–2.2 g/kg). Most people fall within this. Sedentary needs sit toward the lower end; athletes and those in a cut toward the upper end.
      </p>
    </div>
  );
}

function PerMealCard({ perMeal3, perMeal4 }: { perMeal3: number; perMeal4: number }) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Protein per meal
      </h3>
      <p className="mb-1 text-lg font-bold text-[#85BEFF]">
        {perMeal3} g (3 meals)
      </p>
      <p className="mb-3 text-lg font-bold text-[#85BEFF]">
        {perMeal4} g (4 meals)
      </p>
      <p className="text-sm leading-relaxed text-gray-600">
        Aim for 20–40 g per meal for most adults. Splitting daily protein across 3–4 meals supports muscle protein synthesis and fullness.
      </p>
    </div>
  );
}

function GoalCard({
  goalLabel,
  multiplier,
  trainingDays,
}: {
  goalLabel: string;
  multiplier: number;
  trainingDays: number | null;
}) {
  const tips: Record<number, string> = {
    0.8: 'For general health, 0.8 g/kg is the minimum. You can go higher if you are active.',
    1.2: 'Light activity benefits from slightly more protein for recovery and satiety.',
    1.6: 'To support muscle growth, aim for 1.6–2.2 g per kg of body weight. You are in a good range.',
    2.0: 'Heavy training and muscle gain are well supported at 2 g/kg. Pair with enough calories and resistance training.',
    2.2: 'High protein during a cut helps preserve muscle. Keep training and prioritize whole foods and lean sources.',
  };
  const tip = tips[multiplier] ?? 'Adjust up or down based on how you feel and your progress.';
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl sm:col-span-2 lg:col-span-4"
      style={{ fontFamily: 'var(--font-rubik), sans-serif' }}
    >
      <h3 className="mb-3 text-base font-semibold" style={{ color: '#364052' }}>
        Goal-based recommendation
      </h3>
      <p className="mb-2 font-medium text-[#364052]">{goalLabel}</p>
      {trainingDays != null && (
        <p className="mb-2 text-sm text-gray-600">
          Training {trainingDays} day{trainingDays !== 1 ? 's' : ''} per week.
        </p>
      )}
      <p className="text-sm leading-relaxed text-gray-600">{tip}</p>
    </div>
  );
}
