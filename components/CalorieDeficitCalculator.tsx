'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const INCH_TO_CM = 2.54;
const FOOT_TO_CM = 30.48;
const KCAL_TO_KJ = 4.184;
const KCAL_PER_KG_FAT = 7700;

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise' },
  { value: 1.375, label: 'Light exercise', description: '1–3 days per week' },
  { value: 1.55, label: 'Moderate exercise', description: '3–5 days per week' },
  { value: 1.725, label: 'Heavy exercise', description: '6–7 days per week' },
  { value: 1.9, label: 'Athlete', description: 'Intense daily training' },
] as const;

const DEFICIT_OPTIONS = [
  { value: 300, label: 'Mild deficit', description: '−300 kcal per day' },
  { value: 500, label: 'Standard deficit', description: '−500 kcal per day' },
  { value: 700, label: 'Aggressive deficit', description: '−700 kcal per day' },
] as const;

type UnitSystem = 'metric' | 'imperial';

interface Results {
  tdeeKcal: number;
  deficitKcal: number;
  targetKcal: number;
  weeklyLossKg: number;
}

function roundKcal(n: number) {
  return Math.round(n);
}

function kcalToKj(kcal: number) {
  return Math.round(kcal * KCAL_TO_KJ);
}

export default function CalorieDeficitCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [activityMultiplier, setActivityMultiplier] = useState(1.2);
  const [deficitKcal, setDeficitKcal] = useState(500);
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const ageNum = parseInt(age, 10);
    if (!Number.isFinite(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please enter a valid age (1–120).');
      return;
    }

    const w = getWeightKg();
    if (w == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid weight in kg.'
          : 'Please enter a valid weight in lbs.'
      );
      return;
    }

    const h = getHeightCm();
    if (h == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid height in cm.'
          : 'Please enter valid height (feet and inches).'
      );
      return;
    }

    // Step 1: BMR (Mifflin–St Jeor)
    const bmr =
      gender === 'male'
        ? 10 * w + 6.25 * h - 5 * ageNum + 5
        : 10 * w + 6.25 * h - 5 * ageNum - 161;

    // Step 2: TDEE
    const tdee = bmr * activityMultiplier;

    // Step 3: Target = TDEE − deficit
    const targetKcal = Math.max(tdee - deficitKcal, 800);

    // Weekly weight loss: (deficit × 7) / 7700 kg
    const weeklyLossKg = (deficitKcal * 7) / KCAL_PER_KG_FAT;

    setResults({
      tdeeKcal: roundKcal(tdee),
      deficitKcal,
      targetKcal: roundKcal(targetKcal),
      weeklyLossKg: Math.round(weeklyLossKg * 100) / 100,
    });
  }

  const inputClass =
    'w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#85BEFF]';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#364052]';

  return (
    <div>
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
          <label className={labelClass} htmlFor="age">
            Age (years)
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
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className={inputClass}
            placeholder={unitSystem === 'metric' ? 'e.g. 70' : 'e.g. 154'}
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
          <label className={labelClass}>Activity level</label>
          <select
            value={activityMultiplier}
            onChange={(e) => setActivityMultiplier(parseFloat(e.target.value))}
            className={inputClass}
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label} — {level.description}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Deficit level (goal intensity)</label>
          <div className="space-y-2">
            {DEFICIT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3ECF7] bg-white px-4 py-3 transition-colors has-[:checked]:border-[#85BEFF] has-[:checked]:bg-[#E7F0FF]/50"
              >
                <input
                  type="radio"
                  name="deficit"
                  checked={deficitKcal === opt.value}
                  onChange={() => setDeficitKcal(opt.value)}
                  className="mt-1 h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
                />
                <div>
                  <span className="text-sm font-medium text-[#364052]">{opt.label}</span>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </div>
              </label>
            ))}
          </div>
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
          Calculate deficit
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CalorieResultCard
              title="TDEE (maintenance calories)"
              kcal={results.tdeeKcal}
              explanation="Calories you burn per day at your current activity level. Eating this maintains your weight."
            />
            <CalorieResultCard
              title="Selected deficit"
              kcal={results.deficitKcal}
              explanation="The daily calorie gap between your TDEE and your target. This drives fat loss over time."
            />
            <CalorieResultCard
              title="Target daily calories"
              kcal={results.targetKcal}
              explanation="Aim for this many calories per day to lose weight at your chosen deficit pace."
            />
            <WeeklyLossCard weeklyLossKg={results.weeklyLossKg} />
          </div>
        </div>
      )}
    </div>
  );
}

function CalorieResultCard({
  title,
  kcal,
  explanation,
}: {
  title: string;
  kcal: number;
  explanation: string;
}) {
  const kj = kcalToKj(kcal);
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
    >
      <h3 className="mb-3 text-base font-semibold">
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{kcal} kcal</p>
      <p className="mb-3 text-sm text-gray-500">{kj} kJ</p>
      <p className="text-sm leading-relaxed text-gray-600">{explanation}</p>
    </div>
  );
}

function WeeklyLossCard({ weeklyLossKg }: { weeklyLossKg: number }) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
    >
      <h3 className="mb-3 text-base font-semibold">
        Estimated weekly weight loss
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{weeklyLossKg} kg</p>
      <p className="mb-3 text-sm text-gray-500">
        ≈ {(weeklyLossKg * 2.205).toFixed(2)} lbs per week
      </p>
      <p className="text-sm leading-relaxed text-gray-600">
        Based on ~7700 kcal per kg of body fat. Actual loss can vary with water weight and adherence.
      </p>
    </div>
  );
}
