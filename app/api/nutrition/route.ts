import { NextRequest, NextResponse } from "next/server";

interface FoodItem {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface NutritionResponse {
  type: "nutrition" | "conversation";
  message?: string;
  foods?: FoodItem[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
}

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

function parseNutritionJSON(jsonString: string): {
  type: string;
  message?: string;
  foods?: FoodItem[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFats?: number;
} {
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
  return parsed as {
    type: string;
    message?: string;
    foods?: FoodItem[];
    totalCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFats?: number;
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

    const systemPrompt = `You are Eati, a friendly nutrition calculator assistant. Respond ONLY in valid JSON.

YOUR PURPOSE:
You help users track their food intake by calculating nutritional values (calories, protein, carbs, fats).
You ONLY respond to:
1. Food/dish names that need nutrition calculation
2. Questions about nutrition, calories, or food-related topics

LANGUAGE RULE (CRITICAL):
- Detect the language of the user's message
- ALL text in your response MUST be in that EXACT language
- Food names MUST stay in the user's original language - NEVER translate them

WHEN TO CALCULATE NUTRITION:
- User mentions a food, dish, meal, drink, or ingredient
- Examples: "chicken sandwich", "100g rice", "pizza", "apple", "coffee with milk"

WHEN TO RESPOND WITH CONVERSATION:
- Message is unclear, random text, or doesn't make sense
- Message is not about food or nutrition
- Message is a greeting without food context
- In these cases, politely explain you're here to help calculate nutrition

NUTRITION RULES:
1. Calculate nutrition for ANY food mentioned - never say "not in database"
2. If no weight specified, assume a typical serving size
3. For composite foods, account for ALL ingredients
4. Be accurate with nutritional values

WEIGHT/PORTION PARSING (CRITICAL):
- Numbers next to food names mean GRAMS by default: "Banana 100" = "Banana 100g"
- Only use different units if explicitly specified (ml, oz, lbs, pieces, etc.)

CRITICAL - FOODS ARRAY RULES:
- Each "foods" array item MUST be an ACTUAL food/dish the user mentioned
- NEVER add a "Result", "Total", "Sum", "Итого", "Результат", or similar entry to the foods array
- The totalCalories/totalProtein/totalCarbs/totalFats fields are for the sum - do NOT duplicate this as a food item

RESPONSE FORMAT:
- For food: {"type":"nutrition","foods":[{"name":"Food Name","weight":"150 g","calories":250,"protein":20,"carbs":25,"fats":8}],"totalCalories":250,"totalProtein":20,"totalCarbs":25,"totalFats":8}
- For multiple foods: {"type":"nutrition","foods":[{"name":"Dish 1","weight":"100 g","calories":100,"protein":10,"carbs":10,"fats":5},{"name":"Dish 2","weight":"200 g","calories":200,"protein":15,"carbs":20,"fats":10}],"totalCalories":300,"totalProtein":25,"totalCarbs":30,"totalFats":15}
- For unclear/non-food messages: {"type":"conversation","message":"Hi! I'm Eati, your nutrition assistant. Tell me what you ate and I'll calculate the calories and nutrients for you!"}

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
        temperature: 0.2,
        max_tokens: 2000,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("OpenAI API error:", responseText?.slice(0, 500));
      return NextResponse.json(
        { error: "Failed to calculate nutrition" },
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

    if (parsed.type === "conversation") {
      const result: NutritionResponse = {
        type: "conversation",
        message: parsed.message || "",
      };
      return NextResponse.json(result);
    }

    const foodsRaw = parsed.foods;
    const foodsArray = Array.isArray(foodsRaw) ? foodsRaw : [];
    const sanitized = sanitizeFoods(foodsArray);

    const result: NutritionResponse = {
      type: "nutrition",
      foods: sanitized,
      totalCalories: sanitized.reduce((s, f) => s + (f.calories || 0), 0),
      totalProtein: sanitized.reduce((s, f) => s + (f.protein || 0), 0),
      totalCarbs: sanitized.reduce((s, f) => s + (f.carbs || 0), 0),
      totalFats: sanitized.reduce((s, f) => s + (f.fats || 0), 0),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in nutrition API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
