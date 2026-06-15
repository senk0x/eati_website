'use client';

import { useMemo, useState } from 'react';

type RecipeMacroCalculatorProps = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  baseGrams: number;
};

function toPositiveNumber(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function roundToOne(n: number): number {
  return Math.round(n * 10) / 10;
}

export default function RecipeMacroCalculator({
  calories,
  protein,
  fat,
  carbs,
  baseGrams,
}: RecipeMacroCalculatorProps) {
  const [portionGrams, setPortionGrams] = useState('100');

  const values = useMemo(() => {
    const base = baseGrams > 0 ? baseGrams : null;
    const portion = toPositiveNumber(portionGrams);

    if (!base || !portion) {
      return null;
    }

    const factor = portion / base;
    return {
      calories: roundToOne(calories * factor),
      protein: roundToOne(protein * factor),
      fat: roundToOne(fat * factor),
      carbs: roundToOne(carbs * factor),
    };
  }, [baseGrams, portionGrams, calories, protein, fat, carbs]);

  return (
    <div className="mt-5 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-5">
      <h3 className="text-lg font-semibold text-eati-ink">
        Smart Macro Calculator
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Enter grams to scale calories and macros from this recipe&apos;s nutrition data.
      </p>

      <div className="mt-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-eati-ink">
            Grams
          </span>
          <input
            type="number"
            inputMode="decimal"
            min="1"
            step="1"
            value={portionGrams}
            onChange={(e) => setPortionGrams(e.target.value)}
            className="w-full rounded-xl border border-[#D4E3F7] bg-white px-3 py-2 text-eati-ink outline-none transition-colors focus:border-[#88B8FF]"
            placeholder="e.g. 180"
          />
        </label>
      </div>

      {values ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          <li className="rounded-xl border border-[#E3ECF7] bg-white px-4 py-3">
            <span className="text-sm text-gray-500">Calories</span>
            <p className="text-xl font-semibold text-eati-ink">{values.calories} kcal</p>
          </li>
          <li className="rounded-xl border border-[#E3ECF7] bg-white px-4 py-3">
            <span className="text-sm text-gray-500">Protein</span>
            <p className="text-xl font-semibold text-eati-ink">{values.protein} g</p>
          </li>
          <li className="rounded-xl border border-[#E3ECF7] bg-white px-4 py-3">
            <span className="text-sm text-gray-500">Fat</span>
            <p className="text-xl font-semibold text-eati-ink">{values.fat} g</p>
          </li>
          <li className="rounded-xl border border-[#E3ECF7] bg-white px-4 py-3">
            <span className="text-sm text-gray-500">Carbohydrates</span>
            <p className="text-xl font-semibold text-eati-ink">{values.carbs} g</p>
          </li>
        </ul>
      ) : (
        <p className="mt-4 text-sm text-red-600">
          Please enter valid gram values greater than 0.
        </p>
      )}
    </div>
  );
}
