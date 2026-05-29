import { NextRequest, NextResponse } from "next/server";

interface FoodItem {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface ActivityItem {
  name: string;
  duration: number;
  caloriesBurned: number;
  intensity?: "light" | "moderate" | "intense";
}

interface MealRecipe {
  summary?: string;
  cookTimeMinutes?: number;
  servings?: number;
  ingredients: string[];
  steps: string[];
  tip?: string;
}

interface MealSuggestion {
  mealType: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  recipe?: MealRecipe;
}

type ChatResponse =
  | {
      type: "food" | "nutrition";
      foods?: FoodItem[];
      totalCalories?: number;
      totalProtein?: number;
      totalCarbs?: number;
      totalFats?: number;
    }
  | {
      type: "activity";
      activities?: ActivityItem[];
      totalCaloriesBurned?: number;
    }
  | {
      type: "meal_plan";
      title?: string;
      meals?: MealSuggestion[];
      totalCalories?: number;
      totalProtein?: number;
      totalCarbs?: number;
      totalFats?: number;
    }
  | {
      type: "conversation";
      message?: string;
    };

function parseWeight(weightStr: string): { value: number; unit: string } | null {
  const match = (weightStr || "")
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*(g|ml|oz|lbs|кг|грам|грамм|gram|grams)?$/i);
  if (!match) return null;
  return { value: parseFloat(match[1]), unit: (match[2] || "g").toLowerCase() };
}

function sanitizeFoods(foods: FoodItem[]): FoodItem[] {
  if (!foods || !Array.isArray(foods)) return [];

  const TOTAL_KEYWORDS = [
    "total",
    "sum",
    "result",
    "summary",
    "итого",
    "результат",
    "сумма",
    "total calories",
    "total protein",
    "всего",
    "total:",
    "итого:",
  ];

  const isTotalLike = (name: string): boolean => {
    const normalized = name.trim().toLowerCase();
    return TOTAL_KEYWORDS.some(
      (kw) =>
        normalized === kw ||
        normalized.startsWith(kw + " ") ||
        normalized.startsWith(kw + ":")
    );
  };

  const filtered = foods.filter((food) => !isTotalLike(food.name));
  if (filtered.length === 0) return [];

  const merged = new Map<string, FoodItem>();
  for (const food of filtered) {
    const nameKey = food.name.trim().toLowerCase();
    const existing = merged.get(nameKey);
    if (!existing) {
      merged.set(nameKey, { ...food, name: food.name.trim() });
      continue;
    }
    const combined: FoodItem = {
      ...existing,
      calories: (existing.calories || 0) + (food.calories || 0),
      protein: (existing.protein || 0) + (food.protein || 0),
      carbs: (existing.carbs || 0) + (food.carbs || 0),
      fats: (existing.fats || 0) + (food.fats || 0),
    };
    const p1 = parseWeight(existing.weight || "");
    const p2 = parseWeight(food.weight || "");
    if (p1 && p2 && p1.unit === p2.unit) {
      const total = Math.round((p1.value + p2.value) * 10) / 10;
      combined.weight = `${total} ${p1.unit}`;
    } else if (p2) {
      combined.weight = food.weight || existing.weight || "";
    }
    merged.set(nameKey, combined);
  }
  return Array.from(merged.values());
}

function extractJSON(content: string): string {
  if (!content || typeof content !== "string") return "";
  let cleaned = content.trim();
  const jsonBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    cleaned = jsonBlockMatch[1].trim();
  }
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace >= 0) {
    cleaned = cleaned.slice(firstBrace);
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace > firstBrace) {
      cleaned = cleaned.slice(0, lastBrace + 1);
    }
  }
  return cleaned;
}

function parseNutritionJSON(jsonString: string): Record<string, unknown> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    let repaired = jsonString.trim();
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/]/g) || []).length;
    if (openBraces > closeBraces || openBrackets > closeBrackets) {
      repaired += "]".repeat(Math.max(0, openBrackets - closeBrackets));
      repaired += "}".repeat(Math.max(0, openBraces - closeBraces));
      try {
        parsed = JSON.parse(repaired);
      } catch {
        throw e;
      }
    } else {
      throw e;
    }
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response shape");
  }
  return parsed;
}

function coerceNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeResponse(parsed: Record<string, unknown>): ChatResponse {
  const type = String(parsed.type ?? "conversation");

  if (type === "conversation") {
    return {
      type: "conversation",
      message: String(parsed.message ?? "I'm Eati, your fitness assistant!"),
    };
  }

  if (type === "activity") {
    const rawActs = Array.isArray(parsed.activities) ? parsed.activities : [];
    const activities: ActivityItem[] = rawActs.map((a: Record<string, unknown>) => ({
      name: String(a?.name ?? "Activity"),
      duration: Math.max(0, coerceNumber(a?.duration)),
      caloriesBurned: Math.max(0, coerceNumber(a?.caloriesBurned)),
      intensity: ["light", "moderate", "intense"].includes(String(a?.intensity))
        ? (a.intensity as ActivityItem["intensity"])
        : undefined,
    }));
    return {
      type: "activity",
      activities,
      totalCaloriesBurned: activities.reduce((s, a) => s + a.caloriesBurned, 0),
    };
  }

  if (type === "meal_plan") {
    const rawMeals = Array.isArray(parsed.meals) ? parsed.meals : [];
    const meals: MealSuggestion[] = rawMeals.map((m: Record<string, unknown>) => {
      const foods = sanitizeFoods((m.foods as FoodItem[]) || []);
      return {
        mealType: String(m.mealType ?? "lunch"),
        name: String(m.name ?? "Meal"),
        foods,
        totalCalories:
          coerceNumber(m.totalCalories) ||
          foods.reduce((s, f) => s + (f.calories || 0), 0),
        totalProtein:
          coerceNumber(m.totalProtein) ||
          foods.reduce((s, f) => s + (f.protein || 0), 0),
        totalCarbs:
          coerceNumber(m.totalCarbs) ||
          foods.reduce((s, f) => s + (f.carbs || 0), 0),
        totalFats:
          coerceNumber(m.totalFats) ||
          foods.reduce((s, f) => s + (f.fats || 0), 0),
        recipe: m.recipe as MealRecipe | undefined,
      };
    });
    return {
      type: "meal_plan",
      title: String(parsed.title ?? ""),
      meals,
      totalCalories: meals.reduce((s, m) => s + m.totalCalories, 0),
      totalProtein: meals.reduce((s, m) => s + m.totalProtein, 0),
      totalCarbs: meals.reduce((s, m) => s + m.totalCarbs, 0),
      totalFats: meals.reduce((s, m) => s + m.totalFats, 0),
    };
  }

  const foods = sanitizeFoods((parsed.foods as FoodItem[]) || []);
  return {
    type: "food",
    foods,
    totalCalories: foods.reduce((s, f) => s + (f.calories || 0), 0),
    totalProtein: foods.reduce((s, f) => s + (f.protein || 0), 0),
    totalCarbs: foods.reduce((s, f) => s + (f.carbs || 0), 0),
    totalFats: foods.reduce((s, f) => s + (f.fats || 0), 0),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    const systemPrompt = `You are Eati, a friendly AI nutrition and fitness assistant. Respond ONLY in valid JSON.

DEMO MODE (mandatory):
- NEVER return {"type":"clarification"} — use sensible defaults for missing details.
- For FOOD with missing weight or cooking: assume 100–200 g and return {"type":"food",...} immediately.
- For ACTIVITY with missing duration: assume 30 min and moderate intensity.
- For MEAL_PLAN: return a complete meal_plan JSON immediately with recipe details.
- For CONVERSATION: answer nutrition/fitness questions in 1–3 sentences.

CLASSIFICATION:
1. FOOD: User mentions food/drinks they ate (e.g., "chicken 200g", "coffee", "Today I ate pizza").
2. MEAL_PLAN: User asks for meal suggestions, recipes, or meal ideas (e.g., "give me a recipe", "what should I eat for lunch", "I have chicken and rice — what can I cook?").
3. ACTIVITY: User mentions physical activity/exercise (e.g., "ran 30 min", "gym workout", "swimming 1 hour").
4. CONVERSATION: Questions about nutrition/fitness, greetings, or general chat.

LANGUAGE: Reply in the SAME language as the user's message. Food names stay in the user's language.

For FOOD:
{"type":"food","foods":[{"name":"Food Name","weight":"150 g","calories":250,"protein":20,"carbs":25,"fats":8}],"totalCalories":250,"totalProtein":20,"totalCarbs":25,"totalFats":8}
- NEVER add "Total" or "Result" entries to foods array.
- Numbers next to food names mean grams by default.

For MEAL_PLAN:
{"type":"meal_plan","title":"...","meals":[{"mealType":"lunch","name":"...","foods":[{"name":"...","weight":"150 g","calories":200,"protein":20,"carbs":10,"fats":5}],"totalCalories":200,"totalProtein":20,"totalCarbs":10,"totalFats":5,"recipe":{"summary":"...","cookTimeMinutes":25,"servings":1,"ingredients":["200 g chicken breast","1 tbsp olive oil"],"steps":["Step 1","Step 2"],"tip":"..."}}]}

For ACTIVITY:
{"type":"activity","activities":[{"name":"Running","duration":30,"caloriesBurned":300,"intensity":"moderate"}],"totalCaloriesBurned":300}
- Running ~10 cal/min, walking ~4, cycling ~8, swimming ~9, weights ~5, HIIT ~12.

For CONVERSATION:
{"type":"conversation","message":"..."}
- Answer fitness/nutrition questions helpfully. For off-topic, be playful and redirect to food/fitness.

Respond with ONLY the JSON, no markdown or extra text.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.25,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("OpenAI API error:", responseText?.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to process message" },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const jsonString = extractJSON(content);
    const parsed = parseNutritionJSON(jsonString);
    const result = normalizeResponse(parsed);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in nutrition API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
