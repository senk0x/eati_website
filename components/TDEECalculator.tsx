'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const INCH_TO_CM = 2.54;
const FOOT_TO_CM = 30.48;
const KCAL_TO_KJ = 4.184;

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise' },
  { value: 1.375, label: 'Light exercise', description: '1–3 days per week' },
  { value: 1.55, label: 'Moderate exercise', description: '3–5 days per week' },
  { value: 1.725, label: 'Heavy exercise', description: '6–7 days per week' },
  { value: 1.9, label: 'Athlete', description: 'Intense daily training' },
] as const;

type UnitSystem = 'metric' | 'imperial';

interface Results {
  bmrKcal: number;
  tdeeKcal: number;
  maintenanceKcal: number;
  lossKcal: number;
  gainKcal: number;
}

function roundKcal(n: number) {
  return Math.round(n);
}

function kcalToKj(kcal: number) {
  return Math.round(kcal * KCAL_TO_KJ);
}

export default function TDEECalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [activityMultiplier, setActivityMultiplier] = useState(1.2);
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
      setError(unitSystem === 'metric' ? 'Please enter a valid weight in kg.' : 'Please enter a valid weight in lbs.');
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

    // Mifflin–St Jeor: weight kg, height cm, age years
    const bmr =
      gender === 'male'
        ? 10 * w + 6.25 * h - 5 * ageNum + 5
        : 10 * w + 6.25 * h - 5 * ageNum - 161;

    const tdee = bmr * activityMultiplier;
    const maintenance = tdee;
    const loss = tdee - 500;
    const gain = tdee + 500;

    setResults({
      bmrKcal: roundKcal(bmr),
      tdeeKcal: roundKcal(tdee),
      maintenanceKcal: roundKcal(maintenance),
      lossKcal: roundKcal(loss),
      gainKcal: roundKcal(gain),
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
        {/* Unit system */}
        <div>
          <span className={labelClass}>Unit system</span>
          <div className="flex gap-4">
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

        {/* Age */}
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

        {/* Gender */}
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

        {/* Weight */}
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

        {/* Height */}
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

        {/* Activity level */}
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

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] sm:w-auto sm:px-8"
        >
          Calculate TDEE
        </button>
      </form>

      {/* Results */}
      {results && (
        <div className="mt-8">
          <h2
            className="mb-4 text-xl font-semibold md:text-2xl"
          >
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              title="BMR"
              kcal={results.bmrKcal}
              explanation="Calories your body burns at rest to maintain basic functions."
            />
            <ResultCard
              title="Weight maintenance"
              kcal={results.maintenanceKcal}
              explanation="Eat this many calories to maintain your current weight."
            />
            <ResultCard
              title="Weight loss"
              kcal={results.lossKcal}
              explanation="About 500 kcal below maintenance for steady fat loss (~1 lb/week)."
            />
            <ResultCard
              title="Weight gain"
              kcal={results.gainKcal}
              explanation="About 500 kcal above maintenance for steady muscle gain."
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
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
