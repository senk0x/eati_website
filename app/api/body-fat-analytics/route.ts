import { NextRequest, NextResponse } from "next/server";

interface BodyFatAnalyticsResponse {
  body_fat_percentage: number;
  confidence_level: "low" | "medium" | "high";
  explanation: string;
  estimated_category: "essential" | "athlete" | "fitness" | "average" | "obese";
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

function parseBodyFatJSON(jsonString: string): BodyFatAnalyticsResponse {
  const parsed = JSON.parse(jsonString) as Record<string, unknown>;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid response shape");
  }
  const body_fat_percentage =
    typeof parsed.body_fat_percentage === "number"
      ? parsed.body_fat_percentage
      : Number(parsed.body_fat_percentage);
  const confidence_level = String(parsed.confidence_level || "medium").toLowerCase();
  const explanation = String(parsed.explanation || "");
  const estimated_category = String(parsed.estimated_category || "average").toLowerCase();

  const validConfidence: BodyFatAnalyticsResponse["confidence_level"][] = [
    "low",
    "medium",
    "high",
  ];
  const validCategory: BodyFatAnalyticsResponse["estimated_category"][] = [
    "essential",
    "athlete",
    "fitness",
    "average",
    "obese",
  ];

  return {
    body_fat_percentage: Number.isFinite(body_fat_percentage)
      ? Math.max(0, Math.min(100, body_fat_percentage))
      : 0,
    confidence_level: validConfidence.includes(confidence_level as BodyFatAnalyticsResponse["confidence_level"])
      ? (confidence_level as BodyFatAnalyticsResponse["confidence_level"])
      : "medium",
    explanation: explanation || "Visual estimation based on body shape and visible indicators.",
    estimated_category: validCategory.includes(estimated_category as BodyFatAnalyticsResponse["estimated_category"])
      ? (estimated_category as BodyFatAnalyticsResponse["estimated_category"])
      : "average",
  };
}

const SYSTEM_PROMPT = `You are an expert fitness and body composition analyst. Your task is to estimate body fat percentage from one or two photos (front view and optionally side view) of a person.

RULES:
1. Base your estimate ONLY on visible cues: overall body shape, muscle definition, fat distribution (e.g. abdomen, limbs), and posture. Do not guess race, age, or identity.
2. Do NOT make any comments about identity, attractiveness, or anything unrelated to body composition.
3. Respond ONLY with valid JSON. No markdown, no code block wrapper, no extra text.

OUTPUT FORMAT (exactly this structure):
{
  "body_fat_percentage": <number between 0 and 60>,
  "confidence_level": "low" | "medium" | "high",
  "explanation": "2-3 sentences describing the visible indicators you used (e.g. abdominal definition, limb leanness, overall shape). Be neutral and factual.",
  "estimated_category": "essential" | "athlete" | "fitness" | "average" | "obese"
}

CATEGORY GUIDELINES (approximate ranges):
- essential: very lean (men ~2-5%, women ~10-13%)
- athlete: athletic build (men ~6-13%, women ~14-20%)
- fitness: fit (men ~14-17%, women ~21-24%)
- average: average (men ~18-24%, women ~25-31%)
- obese: higher body fat (men 25%+, women 32%+)

Set confidence_level to "low" if image quality is poor, only one angle, or unclear; "medium" for one clear front view; "high" if both front and side are clear and well-lit.

Respond with ONLY the JSON object.`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { frontImage, sideImage } = body as { frontImage?: string; sideImage?: string };

    if (!frontImage || typeof frontImage !== "string" || !frontImage.startsWith("data:")) {
      return NextResponse.json(
        { error: "At least one image (front view) is required." },
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

    const content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [
      {
        type: "text",
        text: sideImage
          ? "Analyze these two photos: first image is FRONT view, second image is SIDE view. Estimate body fat percentage and return the JSON as specified."
          : "Analyze this single FRONT view photo. Estimate body fat percentage and return the JSON as specified.",
      },
      { type: "image_url", image_url: { url: frontImage } },
    ];
    if (sideImage && typeof sideImage === "string" && sideImage.startsWith("data:")) {
      content.push({ type: "image_url", image_url: { url: sideImage } });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content },
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      console.error("OpenAI API error:", responseText?.slice(0, 500));
      return NextResponse.json(
        { error: "Analysis failed. Please try again or use a clearer photo." },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: "No response from analysis" },
        { status: 500 }
      );
    }

    const jsonString = extractJSON(rawContent);
    const result = parseBodyFatJSON(jsonString);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in body-fat-analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
