'use client';

import { FormEvent, useState } from 'react';

const LB_TO_KG = 0.453592;
const INCH_TO_CM = 2.54;
const FOOT_TO_CM = 30.48;

type UnitSystem = 'metric' | 'imperial';

interface BMICategory {
  label: string;
  color: string;
  explanation: string;
}

function getCategory(bmi: number): BMICategory {
  if (bmi < 18.5) {
    return {
      label: 'Underweight',
      color: '#6B7280',
      explanation:
        'BMI below 18.5 may indicate underweight. Consider speaking with a healthcare provider about nutrition and weight goals.',
    };
  }
  if (bmi < 25) {
    return {
      label: 'Normal weight',
      color: '#22C55E',
      explanation:
        'Your BMI falls in the normal range for adults. This is a broad indicator; body composition and health depend on many other factors.',
    };
  }
  if (bmi < 30) {
    return {
      label: 'Overweight',
      color: '#EAB308',
      explanation:
        'BMI in the overweight range. Small, sustained changes in diet and activity can help move toward a weight that feels right for you.',
    };
  }
  if (bmi < 35) {
    return {
      label: 'Obesity Class I',
      color: '#F97316',
      explanation:
        'BMI indicates obesity class I. A healthcare provider can help you set safe, sustainable goals for diet and activity.',
    };
  }
  if (bmi < 40) {
    return {
      label: 'Obesity Class II',
      color: '#EF4444',
      explanation:
        'BMI indicates obesity class II. Professional guidance can support you in building a plan that works for your health and lifestyle.',
    };
  }
  return {
    label: 'Obesity Class III',
    color: '#B91C1C',
    explanation:
      'BMI indicates obesity class III. Healthcare and nutrition support are important for long-term health and well-being.',
  };
}

export default function BMICalculator() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: BMICategory } | null>(null);
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
    setResult(null);

    const w = getWeightKg();
    if (w == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid weight in kg.'
          : 'Please enter a valid weight in lbs.'
      );
      return;
    }

    const hCm = getHeightCm();
    if (hCm == null) {
      setError(
        unitSystem === 'metric'
          ? 'Please enter a valid height in cm.'
          : 'Please enter valid height (feet and inches).'
      );
      return;
    }

    const heightM = hCm / 100;
    const bmi = w / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    const category = getCategory(bmiRounded);

    setResult({ bmi: bmiRounded, category });
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

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] sm:w-auto sm:px-8"
        >
          Calculate BMI
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            Your result
          </h2>
          <div
            className="overflow-hidden rounded-2xl border border-[#E3ECF7] bg-white p-6 md:rounded-3xl md:p-8"
          >
            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-bold md:text-5xl" style={{ color: result.category.color }}>
                {result.bmi}
              </span>
              <span className="text-lg text-gray-500">BMI</span>
            </div>
            <p
              className="mb-4 text-lg font-semibold"
              style={{ color: result.category.color }}
            >
              {result.category.label}
            </p>

            {/* Color-coded bar: underweight | normal | overweight | obesity */}
            <div className="mb-6 flex h-3 w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-gray-300"
                style={{ width: '18.5%' }}
                title="Underweight"
              />
              <div
                className="h-full bg-green-400"
                style={{ width: '25%' }}
                title="Normal"
              />
              <div
                className="h-full bg-amber-400"
                style={{ width: '20%' }}
                title="Overweight"
              />
              <div
                className="h-full bg-orange-400"
                style={{ width: '16.5%' }}
                title="Obesity I"
              />
              <div
                className="h-full bg-red-400"
                style={{ width: '20%' }}
                title="Obesity II–III"
              />
            </div>
            <p className="text-xs text-gray-500">
              &lt;18.5 · 18.5–24.9 · 25–29.9 · 30–34.9 · 35+
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {result.category.explanation}
            </p>
            <p className="mt-3 text-sm text-gray-500">
              BMI is a simple height-to-weight ratio. It does not distinguish muscle from fat or
              account for age, sex, or body composition. Use it as one general indicator, not a
              complete picture of health.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
