'use client';

import { useState, useMemo } from 'react';
import type { Food, NutritionPer100g } from '@/lib/foods';

const KCAL_TO_KJ = 4.184;

/** Human-readable label for variant key */
function variantLabel(key: string): string {
  const labels: Record<string, string> = {
    raw: 'Raw',
    'raw-dry': 'Raw (dry)',
    cooked: 'Cooked',
    grilled: 'Grilled',
    boiled: 'Boiled',
    fried: 'Fried',
    baked: 'Baked',
    steamed: 'Steamed',
    scrambled: 'Scrambled',
  };
  return labels[key] || key.replace(/-/g, ' ');
}

interface Props {
  food: Food;
}

export default function FoodPortionCalculator({ food }: Props) {
  const [weightGrams, setWeightGrams] = useState('');
  const variantKeys = food.variants ? Object.keys(food.variants) : [];
  const [selectedMethod, setSelectedMethod] = useState(variantKeys[0] ?? '');

  const base: NutritionPer100g = useMemo(() => {
    if (food.variants && selectedMethod && food.variants[selectedMethod]) {
      return food.variants[selectedMethod];
    }
    return {
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
    };
  }, [food, selectedMethod]);

  const grams = useMemo(() => {
    const n = parseFloat(weightGrams);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [weightGrams]);

  const multiplier = grams / 100;
  const totalCalories = Math.round(base.caloriesPer100g * multiplier * 10) / 10;
  const totalProtein = Math.round(base.proteinPer100g * multiplier * 10) / 10;
  const totalCarbs = Math.round(base.carbsPer100g * multiplier * 10) / 10;
  const totalFat = Math.round(base.fatPer100g * multiplier * 10) / 10;
  const totalKj = Math.round(totalCalories * KCAL_TO_KJ * 10) / 10;

  const inputClass =
    'w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#85BEFF]';
  const labelClass = 'mb-1.5 block text-sm font-medium text-[#364052]';

  return (
    <section
      className="mb-10 rounded-2xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:rounded-3xl md:p-8"
    >
      <h2 className="mb-3 text-xl font-semibold md:text-2xl">
        Calculate Nutrition for Your Portion
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Enter the weight in grams and, if applicable, the cooking method. Totals update in real time.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <div className="sm:col-span-2 lg:col-span-4">
          <label className={labelClass} htmlFor="portion-weight">
            Weight (g)
          </label>
          <input
            id="portion-weight"
            type="number"
            min={1}
            step={1}
            value={weightGrams}
            onChange={(e) => {
              const v = e.target.value;
              if (v === '' || /^\d*\.?\d*$/.test(v)) setWeightGrams(v);
            }}
            className={inputClass}
            placeholder="e.g. 150"
          />
          <p className="mt-1 text-xs text-gray-500">Positive numbers only</p>
        </div>
        {variantKeys.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-4">
            <label className={labelClass} htmlFor="portion-method">
              Cooking method
            </label>
            <select
              id="portion-method"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className={inputClass}
            >
              {variantKeys.map((key) => (
                <option key={key} value={key}>
                  {variantLabel(key)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {grams > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-[#364052]">
            For {grams}g {variantKeys.length > 0 ? `(${variantLabel(selectedMethod)})` : ''}:
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#E3ECF7] bg-white p-4 md:rounded-3xl">
              <span className="text-sm text-gray-500">Total calories</span>
              <p className="mt-1 text-2xl font-bold text-[#85BEFF]">{totalCalories} kcal</p>
              <p className="text-sm text-gray-500">{totalKj} kJ</p>
            </div>
            <div className="rounded-2xl border border-[#E3ECF7] bg-white p-4 md:rounded-3xl">
              <span className="text-sm text-gray-500">Protein</span>
              <p className="mt-1 text-2xl font-bold text-[#85BEFF]">{totalProtein} g</p>
            </div>
            <div className="rounded-2xl border border-[#E3ECF7] bg-white p-4 md:rounded-3xl">
              <span className="text-sm text-gray-500">Carbohydrates</span>
              <p className="mt-1 text-2xl font-bold text-[#85BEFF]">{totalCarbs} g</p>
            </div>
            <div className="rounded-2xl border border-[#E3ECF7] bg-white p-4 md:rounded-3xl">
              <span className="text-sm text-gray-500">Fat</span>
              <p className="mt-1 text-2xl font-bold text-[#85BEFF]">{totalFat} g</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
