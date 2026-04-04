'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const INCH_TO_CM = 2.54;
const FOOT_TO_CM = 30.48;
const KCAL_TO_KJ = 4.184;
const PROTEIN_PER_KG = 2.0;
const FAT_PER_KG = 0.8;
const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_FAT = 9;
const KCAL_PER_G_CARB = 4;

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary', description: 'Little or no exercise' },
  { value: 1.375, label: 'Light', description: '1–3 days per week' },
  { value: 1.55, label: 'Moderate', description: '3–5 days per week' },
  { value: 1.725, label: 'Heavy', description: '6–7 days per week' },
  { value: 1.9, label: 'Athlete', description: 'Intense daily training' },
] as const;

type UnitSystem = 'metric' | 'imperial';
type Goal = 'fat-loss' | 'maintain' | 'muscle-gain';

interface Results {
  totalCaloriesKcal: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  proteinKcal: number;
  fatKcal: number;
  carbKcal: number;
}

function roundKcal(n: number) {
  return Math.round(n);
}

function roundG(n: number) {
  return Math.round(n * 10) / 10;
}

function kcalToKj(kcal: number) {
  return Math.round(kcal * KCAL_TO_KJ);
}

export default function MacroGoalCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [activityMultiplier, setActivityMultiplier] = useState(1.2);
  const [goal, setGoal] = useState<Goal>('maintain');
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

    // Step 1: BMR (Mifflin–St Jeor) then TDEE
    const bmr =
      gender === 'male'
        ? 10 * w + 6.25 * h - 5 * ageNum + 5
        : 10 * w + 6.25 * h - 5 * ageNum - 161;
    const tdee = bmr * activityMultiplier;

    // Step 2: Target calories by goal
    let totalCalories: number;
    if (goal === 'fat-loss') {
      totalCalories = tdee - 500;
    } else if (goal === 'muscle-gain') {
      totalCalories = tdee + 300;
    } else {
      totalCalories = tdee;
    }
    totalCalories = Math.max(totalCalories, 800); // floor for safety

    // Step 3: Macros — protein 2 g/kg, fat 0.8 g/kg, rest from carbs
    const proteinG = roundG(w * PROTEIN_PER_KG);
    const fatG = roundG(w * FAT_PER_KG);
    const proteinKcal = proteinG * KCAL_PER_G_PROTEIN;
    const fatKcal = fatG * KCAL_PER_G_FAT;
    let carbKcal = totalCalories - proteinKcal - fatKcal;
    if (carbKcal < 0) carbKcal = 0;
    const carbG = roundG(carbKcal / KCAL_PER_G_CARB);

    setResults({
      totalCaloriesKcal: roundKcal(totalCalories),
      proteinG,
      fatG,
      carbG,
      proteinKcal: roundKcal(proteinKcal),
      fatKcal: roundKcal(fatKcal),
      carbKcal: roundKcal(carbKcal),
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
          <label className={labelClass}>Goal</label>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="goal"
                checked={goal === 'fat-loss'}
                onChange={() => setGoal('fat-loss')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Fat loss</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="goal"
                checked={goal === 'maintain'}
                onChange={() => setGoal('maintain')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Maintain weight</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="goal"
                checked={goal === 'muscle-gain'}
                onChange={() => setGoal('muscle-gain')}
                className="h-4 w-4 border-[#D5E3F5] text-[#85BEFF] focus:ring-[#85BEFF]"
              />
              <span className="text-sm text-[#364052]">Muscle gain</span>
            </label>
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
          Calculate macros
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            Your macro goals
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CalorieResultCard
              title="Total daily calories"
              kcal={results.totalCaloriesKcal}
              explanation="Your daily calorie target. Split this across protein, fats, and carbs below."
            />
            <MacroResultCard
              title="Protein"
              valueG={results.proteinG}
              valueKcal={results.proteinKcal}
              explanation="Supports muscle repair and satiety. Based on 2 g per kg body weight."
            />
            <MacroResultCard
              title="Fats"
              valueG={results.fatG}
              valueKcal={results.fatKcal}
              explanation="Essential for hormones and absorption. Based on 0.8 g per kg body weight."
            />
            <MacroResultCard
              title="Carbohydrates"
              valueG={results.carbG}
              valueKcal={results.carbKcal}
              explanation="Remaining calories as carbs to fuel activity and recovery."
            />
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

function MacroResultCard({
  title,
  valueG,
  valueKcal,
  explanation,
}: {
  title: string;
  valueG: number;
  valueKcal: number;
  explanation: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
    >
      <h3 className="mb-3 text-base font-semibold">
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{valueG} g</p>
      <p className="mb-3 text-sm text-gray-500">{valueKcal} kcal</p>
      <p className="text-sm leading-relaxed text-gray-600">{explanation}</p>
    </div>
  );
}
