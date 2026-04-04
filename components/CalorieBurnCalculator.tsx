'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const IN_TO_CM = 2.54;
const KCAL_TO_KJ = 4.184;
const KCAL_PER_KG_FAT = 7700;

/** Activity MET values — easy to extend */
const ACTIVITIES = [
  { id: 'light-walking', label: 'Light walking', met: 2.5 },
  { id: 'brisk-walking', label: 'Brisk walking', met: 4.0 },
  { id: 'running-moderate', label: 'Running (moderate)', met: 8.0 },
  { id: 'running-fast', label: 'Running (fast)', met: 11.0 },
  { id: 'cycling', label: 'Cycling', met: 7.5 },
  { id: 'strength-training', label: 'Strength training', met: 6.0 },
  { id: 'swimming', label: 'Swimming', met: 8.0 },
  { id: 'hiit', label: 'HIIT', met: 9.0 },
] as const;

type UnitSystem = 'metric' | 'imperial';

interface Results {
  totalKcal: number;
  totalKj: number;
  per30Min: number;
  perHour: number;
  fatLossKg: number;
  activityLabel: string;
  durationMinutes: number;
}

/**
 * MET-based formula: Calories = MET × weight (kg) × duration (hours)
 */
function caloriesBurned(met: number, weightKg: number, durationMinutes: number): number {
  const hours = durationMinutes / 60;
  return met * weightKg * hours;
}

export default function CalorieBurnCalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityId, setActivityId] = useState<string>(ACTIVITIES[0].id);
  const [durationMinutes, setDurationMinutes] = useState('');
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);

    const weightKg = getWeightKg();
    const minutes = parseFloat(durationMinutes);
    const activity = ACTIVITIES.find((a) => a.id === activityId);

    if (weightKg == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid weight in kg.'
          : 'Please enter a valid weight in lbs.'
      );
      return;
    }
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setError('Please enter a valid duration in minutes.');
      return;
    }
    if (!activity) {
      setError('Please select an activity.');
      return;
    }

    const totalKcal = caloriesBurned(activity.met, weightKg, minutes);
    const totalKj = totalKcal * KCAL_TO_KJ;
    const per30Min = caloriesBurned(activity.met, weightKg, 30);
    const perHour = caloriesBurned(activity.met, weightKg, 60);
    const fatLossKg = totalKcal / KCAL_PER_KG_FAT;

    setResults({
      totalKcal: Math.round(totalKcal * 10) / 10,
      totalKj: Math.round(totalKj * 10) / 10,
      per30Min: Math.round(per30Min * 10) / 10,
      perHour: Math.round(perHour * 10) / 10,
      fatLossKg: Math.round(fatLossKg * 1000) / 1000,
      activityLabel: activity.label,
      durationMinutes: minutes,
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
              <span className="text-sm text-[#364052]">Imperial (lbs, feet + inches)</span>
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
            placeholder={unitSystem === 'metric' ? 'e.g. 70' : 'e.g. 154'}
          />
        </div>

        {unitSystem === 'metric' ? (
          <div>
            <label className={labelClass} htmlFor="heightCm">
              Height (cm) — optional
            </label>
            <input
              id="heightCm"
              type="number"
              min={0}
              step={1}
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              className={inputClass}
              placeholder="e.g. 175"
            />
            <p className="mt-1 text-xs text-gray-500">Not used in MET formula; for future modes.</p>
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
          <p className="mt-1 text-xs text-gray-500">For future heart rate or advanced modes.</p>
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
          <label className={labelClass} htmlFor="activity">
            Activity type
          </label>
          <select
            id="activity"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
            className={inputClass}
          >
            {ACTIVITIES.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} — {a.met} MET
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="duration">
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            min={1}
            step={1}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className={inputClass}
            placeholder="e.g. 45"
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
          Calculate calories burned
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            Your results
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            For <strong>{results.activityLabel}</strong> over {results.durationMinutes} minutes. Based on MET × weight (kg) × time (hours).
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              title="Total calories burned"
              value={`${results.totalKcal} kcal`}
              description="Estimated energy expended for this activity and duration."
            />
            <ResultCard
              title="Calories in kilojoules"
              value={`${results.totalKj} kJ`}
              description="Same energy in kJ (1 kcal = 4.184 kJ)."
            />
            <ResultCard
              title="Hourly burn rate"
              value={`${results.perHour} kcal/hour`}
              description={`Calories per hour for this activity. Per 30 min: ${results.per30Min} kcal.`}
            />
            <ResultCard
              title="Fat loss equivalent"
              value={`≈ ${results.fatLossKg} kg`}
              description="Rough fat mass equivalent (calories ÷ 7700). Actual weight change depends on diet and body composition."
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
    >
      <h3 className="mb-3 text-base font-semibold">
        {title}
      </h3>
      <p className="mb-1 text-2xl font-bold text-[#85BEFF]">{value}</p>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
