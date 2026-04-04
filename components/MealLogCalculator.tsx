'use client';

import { useState, useRef, FormEvent } from 'react';

const KCAL_TO_KJ = 4.184;

interface MealItem {
  id: string;
  food: string;
  quantity: string;
}

const INITIAL_ITEM: MealItem = { id: '0', food: '', quantity: '' };

interface NutritionFood {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface NutritionResult {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  foods: NutritionFood[];
}

export default function MealLogCalculator() {
  const nextIdRef = useRef(1);
  const [items, setItems] = useState<MealItem[]>([INITIAL_ITEM]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<NutritionResult | null>(null);

  function addItem() {
    const id = String(nextIdRef.current++);
    setItems((prev) => [...prev, { id, food: '', quantity: '' }]);
    setError(null);
    setResult(null);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setError(null);
    setResult(null);
  }

  function updateItem(id: string, field: 'food' | 'quantity', value: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
    setError(null);
    setResult(null);
  }

  function buildMessage(): string {
    return items
      .map(({ food, quantity }) => {
        const f = food.trim();
        const q = quantity.trim();
        return q ? `${f} ${q}` : f;
      })
      .filter((line) => line.length > 0)
      .join(', ');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = buildMessage();
    if (!message.trim()) {
      setError('Enter at least one food and quantity (e.g. chicken breast 200g, rice 150g).');
      return;
    }
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not calculate nutrition. Please try again.');
        setLoading(false);
        return;
      }
      if (data.type === 'conversation') {
        setError(data.message || 'Please enter specific foods with amounts (e.g. chicken 200g, rice 150g).');
        setLoading(false);
        return;
      }
      if (data.type === 'nutrition' && data.foods && data.foods.length > 0) {
        setResult({
          totalCalories: data.totalCalories ?? data.foods.reduce((s: number, f: NutritionFood) => s + (f.calories || 0), 0),
          totalProtein: data.totalProtein ?? data.foods.reduce((s: number, f: NutritionFood) => s + (f.protein || 0), 0),
          totalCarbs: data.totalCarbs ?? data.foods.reduce((s: number, f: NutritionFood) => s + (f.carbs || 0), 0),
          totalFats: data.totalFats ?? data.foods.reduce((s: number, f: NutritionFood) => s + (f.fats || 0), 0),
          foods: data.foods,
        });
      } else {
        setError('No nutrition data returned. Try listing foods with amounts (e.g. chicken breast 200g).');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <p className="text-sm text-gray-600">
          Add each food and its amount (e.g. 200g, 1 cup, 2 eggs). You can add multiple items and
          use free text like &quot;chicken breast grilled&quot; or &quot;rice cooked&quot;.
        </p>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-[#E3ECF7] bg-white p-4 sm:flex-row sm:items-end sm:gap-4"
            >
              <div className="flex-1">
                <label className={labelClass} htmlFor={`food-${item.id}`}>
                  Food
                </label>
                <input
                  id={`food-${item.id}`}
                  type="text"
                  value={item.food}
                  onChange={(e) => updateItem(item.id, 'food', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. chicken breast grilled, rice cooked"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className={labelClass} htmlFor={`qty-${item.id}`}>
                  Quantity
                </label>
                <input
                  id={`qty-${item.id}`}
                  type="text"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                  className={inputClass}
                  placeholder="200g, 1 cup"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length <= 1}
                className="rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm font-medium text-[#364052] transition-colors hover:bg-[#F7FAFF] disabled:opacity-50"
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="rounded-xl border border-dashed border-[#85BEFF] bg-transparent px-4 py-2.5 text-sm font-medium text-[#85BEFF] transition-colors hover:bg-[#85BEFF]/10"
        >
          + Add another item
        </button>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#364052] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#2b3545] disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {loading ? 'Calculating…' : 'Calculate calories & macros'}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold md:text-2xl">
            Your results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              title="Total calories"
              value={`${Math.round(result.totalCalories)} kcal`}
              sub={`${Math.round(result.totalCalories * KCAL_TO_KJ)} kJ`}
              description="Estimated total for this meal."
            />
            <ResultCard
              title="Protein"
              value={`${Math.round(result.totalProtein)} g`}
              description="Total protein from this meal."
            />
            <ResultCard
              title="Carbs"
              value={`${Math.round(result.totalCarbs)} g`}
              description="Total carbohydrates."
            />
            <ResultCard
              title="Fats"
              value={`${Math.round(result.totalFats)} g`}
              description="Total fat."
            />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-base font-semibold">
              Per-item breakdown
            </h3>
            <ul className="space-y-2 rounded-2xl border border-[#E3ECF7] bg-white p-4 md:rounded-3xl">
              {result.foods.map((f, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E3ECF7] pb-2 last:border-0 last:pb-0"
                >
                  <span className="font-medium text-[#364052]">
                    {f.name}
                    {f.weight ? ` (${f.weight})` : ''}
                  </span>
                  <span className="text-sm text-gray-600">
                    {f.calories} kcal · P {f.protein}g C {f.carbs}g F {f.fats}g
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            Confidence: AI-based estimate. Values may vary by preparation, brand, and portion accuracy.
          </p>

          <div
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 md:rounded-3xl"
          >
            <p className="text-sm font-medium text-amber-800">
              Nutritional values are AI-based estimates and may vary depending on preparation
              method, brand, and portion accuracy. Use for general tracking only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  title,
  value,
  sub,
  description,
}: {
  title: string;
  value: string;
  sub?: string;
  description: string;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl border border-[#E3ECF7] bg-white p-5 transition-shadow hover:shadow-md md:rounded-3xl"
    >
      <h3 className="mb-3 text-base font-semibold">
        {title}
      </h3>
      <p className="mb-0.5 text-2xl font-bold text-[#85BEFF]">{value}</p>
      {sub && <p className="mb-1 text-sm text-gray-500">{sub}</p>}
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
