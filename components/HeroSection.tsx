"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import GreetingMascotIcon from "@/components/GreetingMascotIcon";

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

interface MealSuggestion {
  mealType: string;
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  recipe?: {
    summary?: string;
    cookTimeMinutes?: number;
    ingredients?: string[];
    steps?: string[];
  };
}

type HeroContentType = "food" | "activity" | "meal_plan" | "conversation";

interface HeroDemo {
  userMessage: string;
  contentType: HeroContentType;
  foods?: FoodItem[];
  activities?: ActivityItem[];
  meals?: MealSuggestion[];
  message?: string;
}

interface CustomSession {
  userMessage: string;
  response: HeroDemo | null;
  isLoading: boolean;
}

const PLACEHOLDER_HINTS = [
  "Suggest me a meal...",
  "Jogging 30 mins...",
  "Today I ate...",
  "Give me a breakfast idea...",
  "Bench press 5 reps...",
  "Rice 200g...",
];

const defaultDemos: HeroDemo[] = [
  {
    userMessage: "Chicken breast with spagetti",
    contentType: "food",
    foods: [
      { name: "Chicken Breast", weight: "100 g", calories: 234, protein: 23, carbs: 23, fats: 23 },
      { name: "Spagetti", weight: "200 g", calories: 234, protein: 23, carbs: 23, fats: 23 },
    ],
  },
  {
    userMessage: "Ran 30 minutes this morning",
    contentType: "activity",
    activities: [
      { name: "Running", duration: 30, caloriesBurned: 300, intensity: "moderate" },
    ],
  },
  {
    userMessage: "Give me a high-protein lunch recipe",
    contentType: "meal_plan",
    meals: [
      {
        mealType: "lunch",
        name: "Grilled Chicken Bowl",
        foods: [
          { name: "Chicken Breast", weight: "150 g", calories: 248, protein: 46, carbs: 0, fats: 5 },
          { name: "Brown Rice", weight: "120 g", calories: 134, protein: 3, carbs: 28, fats: 1 },
          { name: "Broccoli", weight: "80 g", calories: 27, protein: 2, carbs: 5, fats: 0 },
        ],
        totalCalories: 409,
        totalProtein: 51,
        totalCarbs: 33,
        totalFats: 6,
        recipe: {
          summary: "Simple grilled chicken with rice and steamed broccoli.",
          cookTimeMinutes: 25,
        },
      },
    ],
  },
  {
    userMessage: "How much protein should I eat per day?",
    contentType: "conversation",
    message:
      "Most active adults do well with 1.6–2.2 g of protein per kg of body weight. For a 70 kg person, that's roughly 110–155 g daily.",
  },
];

function buildCustomResponse(userInput: string, data: Record<string, unknown>): HeroDemo {
  if (
    (data.type === "food" || data.type === "nutrition") &&
    Array.isArray(data.foods) &&
    data.foods.length > 0
  ) {
    return {
      userMessage: userInput,
      contentType: "food",
      foods: data.foods as FoodItem[],
    };
  }

  if (data.type === "activity" && Array.isArray(data.activities) && data.activities.length > 0) {
    return {
      userMessage: userInput,
      contentType: "activity",
      activities: data.activities as ActivityItem[],
    };
  }

  if (data.type === "meal_plan" && Array.isArray(data.meals) && data.meals.length > 0) {
    return {
      userMessage: userInput,
      contentType: "meal_plan",
      meals: data.meals as MealSuggestion[],
    };
  }

  if (data.type === "conversation") {
    return {
      userMessage: userInput,
      contentType: "conversation",
      message: String(data.message || "How can I help with your nutrition or fitness?"),
    };
  }

  return {
    userMessage: userInput,
    contentType: "conversation",
    message: "Could not process request. Please try again.",
  };
}

export default function HeroSection() {
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [customSession, setCustomSession] = useState<CustomSession | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderFading, setPlaceholderFading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoRotating && !customSession) {
      intervalRef.current = setInterval(() => {
        setCurrentDemoIndex((prev) => (prev + 1) % defaultDemos.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, customSession]);

  useEffect(() => {
    if (inputValue.trim()) return;

    const rotate = setInterval(() => {
      setPlaceholderFading(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_HINTS.length);
        setPlaceholderFading(false);
      }, 220);
    }, 3200);

    return () => clearInterval(rotate);
  }, [inputValue]);

  const activeDemo = customSession?.response ?? defaultDemos[currentDemoIndex];
  const displayUserMessage =
    customSession?.userMessage ?? defaultDemos[currentDemoIndex].userMessage;
  const isPhoneLoading = customSession?.isLoading ?? false;

  const totals = (activeDemo.foods ?? []).reduce(
    (acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fats: acc.fats + food.fats,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const dailyGoals = { calories: 2000, protein: 150, carbs: 250, fats: 65 };

  const handleSubmit = async () => {
    if (!inputValue.trim() || customSession?.isLoading) return;

    setIsAutoRotating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const userInput = inputValue.trim();
    setInputValue("");
    setCustomSession({ userMessage: userInput, response: null, isLoading: true });

    try {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setCustomSession({
          userMessage: userInput,
          response: {
            userMessage: userInput,
            contentType: "conversation",
            message: data.error || "Service temporarily unavailable. Please try again.",
          },
          isLoading: false,
        });
      } else {
        setCustomSession({
          userMessage: userInput,
          response: buildCustomResponse(userInput, data),
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching nutrition:", error);
      setCustomSession({
        userMessage: userInput,
        response: {
          userMessage: userInput,
          contentType: "conversation",
          message: "Network error. Please check your connection and try again.",
        },
        isLoading: false,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const isSubmitting = customSession?.isLoading ?? false;

  return (
    <section className="px-4 sm:px-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative flex min-h-[min(680px,100svh)] flex-col overflow-hidden rounded-[2rem] md:min-h-[500px] md:flex-none md:rounded-[3rem] lg:min-h-[540px]"
          style={{ backgroundColor: "#88B8FF" }}
        >
          {/* Pattern background */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <Image
              src="/images/Frame 101563.svg"
              alt="Decorative blue wave pattern"
              width={1440}
              height={800}
              priority
              className="h-full w-full object-cover object-right"
            />
          </div>

          {/* Hero content - top on mobile, left on tablet+ */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-8 text-center md:min-h-[500px] md:items-start md:px-8 md:py-12 md:text-left lg:px-16 lg:py-16">
            {/* App icon */}
            <div className="mx-auto mb-4 md:mx-0 md:mb-5">
              <GreetingMascotIcon size={72} />
            </div>

            {/* Title */}
            <h1 className="font-eati-heading text-3xl font-normal uppercase leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              I AM EATI!
              <br />
              YOUR ALL-IN-ONE
              <br />
              FITNESS COACH
            </h1>

            {/* Input field and send button */}
            <div className="mt-6 flex flex-col items-center md:mt-8 md:items-start md:text-left lg:mt-10">
              <div className="flex w-full max-w-[280px] items-center gap-3 sm:max-w-[320px] md:max-w-none md:w-auto md:max-w-[320px]">
                <div className="relative min-w-0 flex-1 rounded-full border-[3px] border-white sm:w-64 md:w-80">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder=" "
                    disabled={isSubmitting}
                    aria-label="Chat with Eati"
                    className="min-h-[44px] w-full bg-transparent px-5 py-3 text-base font-medium text-white focus:outline-none disabled:opacity-50 sm:px-6 md:px-8 md:py-4 md:text-lg"
                  />
                  {!inputValue && (
                    <span
                      aria-hidden
                      className={`hero-placeholder-hint pointer-events-none absolute inset-y-0 left-5 flex items-center text-base font-medium text-white/80 sm:left-6 md:left-8 md:text-lg ${placeholderFading ? "hero-placeholder-hint-fade" : ""}`}
                    >
                      {PLACEHOLDER_HINTS[placeholderIndex]}
                    </span>
                  )}
                </div>

                {/* Send button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !inputValue.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-90 disabled:opacity-50 md:h-14 md:w-14"
                  aria-label="Send"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#88B8FF] border-t-transparent md:h-6 md:w-6" />
                  ) : (
                    <svg
                      className="h-5 w-5 text-[#88B8FF] md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Try now label and arrow */}
              <div className="mt-4 flex items-center justify-center gap-2 md:justify-start md:pl-4">
                <span
                  className="text-base text-white sm:text-lg md:text-xl"
                  style={{
                    fontFamily:
                      '"Bradley Hand", "Bradley Hand ITC", system-ui, cursive',
                  }}
                >
                  try now
                </span>
                <svg
                  width="30"
                  height="20"
                  viewBox="0 0 40 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M1 25.226C1.10578 25.226 6.07004 25.2066 13.9963 24.9068C22.6289 24.5802 28.6451 14.1941 30.3959 10.9453C32.5729 6.90562 30.5965 2.21943 30.1591 1.61038C27.8975 -1.53881 36.5963 8.43345 38.0393 9.84418C41.7756 13.4968 31.3038 4.23091 29.5275 1.63126C27.9081 -0.738732 25.1974 7.01808 23.6929 8.21484C24.3529 7.72213 26.3956 6.50953 28.6159 5.37676C29.7011 4.75967 30.702 4.05683 31.7763 3.01213"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* iPhone mockup */}
          <div className="relative z-10 mt-6 flex w-full shrink-0 justify-center pb-0 pt-10 md:mt-0 md:w-auto md:absolute md:right-8 md:top-8 md:justify-end md:pt-0 lg:right-16">
            <div className="relative flex w-full justify-center overflow-hidden md:w-auto md:overflow-visible">
              <div className="relative inline-flex w-56 justify-center sm:w-64 md:w-64 lg:w-72 xl:w-80 -mb-12 sm:-mb-16 md:mb-0">
                <svg
                  className="h-auto w-full min-w-0 flex-shrink-0"
                  viewBox="0 0 408 885"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="5.06293"
                    y="5.06293"
                    width="396.934"
                    height="874.874"
                    rx="45.5664"
                    stroke="white"
                    strokeWidth="10.1259"
                  />
                  <rect
                    x="127.584"
                    y="46.5801"
                    width="150.875"
                    height="42.5286"
                    rx="21.2643"
                    fill="white"
                  />
                </svg>

                <div
                  className="absolute left-[12px] right-[12px] top-[82px] bottom-[8px] overflow-hidden rounded-[26px]"
                  style={{
                    width: "calc(100% - 24px)",
                    maxWidth: "calc(100% - 24px)",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="flex h-full w-full min-w-0 flex-col gap-2 overflow-hidden px-2.5 pt-2.5 pb-0">
                    <div className="flex min-w-0 flex-col gap-2 overflow-hidden">
                      <div
                        key={`user-${displayUserMessage}`}
                        className="hero-phone-bubble-enter flex min-w-0 justify-end overflow-hidden"
                      >
                        <div
                          className="max-w-[80%] shrink-0 rounded-[12px] rounded-br-[4px] px-3 py-2 text-white md:rounded-[13px] md:rounded-br-[4px] md:px-3.5 md:py-2.5"
                          style={{ backgroundColor: "#2F5176" }}
                        >
                          <p className="m-0 break-words text-[11px] leading-[1.15] md:text-xs">
                            {displayUserMessage}
                          </p>
                        </div>
                      </div>

                      <div
                        key={`reply-${isPhoneLoading ? "loading" : `${activeDemo.contentType}-${displayUserMessage}`}`}
                        className="hero-phone-bubble-enter hero-phone-bubble-delay flex min-w-0 justify-start overflow-hidden"
                      >
                        <div
                          className="min-w-0 max-w-full shrink-0 rounded-[12px] rounded-bl-[3px] p-2 overflow-hidden"
                          style={{
                            backgroundColor: "#F5F9FF",
                            boxSizing: "border-box",
                          }}
                        >
                          {isPhoneLoading ? (
                            <div className="flex items-center justify-center py-3">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#88B8FF] border-t-transparent" />
                            </div>
                          ) : (
                            <PhoneResponseContent
                              demo={activeDemo}
                              totals={totals}
                              dailyGoals={dailyGoals}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneResponseContent({
  demo,
  totals,
  dailyGoals,
}: {
  demo: HeroDemo;
  totals: { calories: number; protein: number; carbs: number; fats: number };
  dailyGoals: { calories: number; protein: number; carbs: number; fats: number };
}) {
  if (demo.contentType === "conversation" && demo.message) {
    return (
      <p className="m-0 text-[11px] leading-[1.25] text-eati-ink md:text-xs">{demo.message}</p>
    );
  }

  if (demo.contentType === "activity" && demo.activities?.length) {
    return (
      <div className="min-w-0 overflow-hidden">
        {demo.activities.map((activity, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <p className="m-0 text-[11px] font-medium leading-[1.15] md:text-xs">
              {activity.name}
              {activity.duration > 0 ? ` (${activity.duration} min)` : ""}
            </p>
            <div className="mt-0.5 flex flex-wrap gap-1">
              <MacroTag label="Burned" value={`${activity.caloriesBurned} cal`} />
              {activity.intensity && (
                <MacroTag
                  label="Intensity"
                  value={activity.intensity.charAt(0).toUpperCase() + activity.intensity.slice(1)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (demo.contentType === "meal_plan" && demo.meals?.length) {
    return (
      <div className="min-w-0 overflow-hidden">
        {demo.meals.map((meal, mealIndex) => (
          <div key={mealIndex} className={mealIndex > 0 ? "mt-2 border-t border-[#EEF5FF] pt-2" : ""}>
            <p className="mb-1.5 text-[13px] font-bold leading-[1.15] text-eati-ink md:text-sm">
              {meal.name}
            </p>
            {meal.foods.map((food, index) => (
              <div key={index} className="mb-2 last:mb-1">
                <p className="m-0 text-[11px] font-medium leading-[1.15] md:text-xs">
                  {food.name}
                  {food.weight ? ` (${food.weight})` : ""}
                </p>
                {food.calories > 0 && (
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    <MacroTag label="Calories" value={`${food.calories}`} />
                    <MacroTag label="Protein" value={`${food.protein} g`} />
                    <MacroTag label="Carbs" value={`${food.carbs} g`} />
                    <MacroTag label="Fats" value={`${food.fats} g`} />
                  </div>
                )}
              </div>
            ))}
            {meal.totalCalories > 0 && (
              <div className="mt-1.5 flex justify-between border-t border-[#EEF5FF] pt-1.5">
                <TotalItem
                  value={`${meal.totalCalories} cal`}
                  percent={Math.min(
                    Math.round((meal.totalCalories / dailyGoals.calories) * 100),
                    100
                  )}
                  color="#44EF5B"
                />
                <TotalItem
                  value={`${meal.totalProtein} g`}
                  percent={Math.min(
                    Math.round((meal.totalProtein / dailyGoals.protein) * 100),
                    100
                  )}
                  color="#44CAEF"
                />
                <TotalItem
                  value={`${meal.totalCarbs} g`}
                  percent={Math.min(
                    Math.round((meal.totalCarbs / dailyGoals.carbs) * 100),
                    100
                  )}
                  color="#EFCD44"
                />
                <TotalItem
                  value={`${meal.totalFats} g`}
                  percent={Math.min(
                    Math.round((meal.totalFats / dailyGoals.fats) * 100),
                    100
                  )}
                  color="#F399FF"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const foods = demo.foods ?? [];
  return (
    <div className="min-w-0 overflow-hidden">
      {foods.map((food, index) => (
        <div key={index} className="mb-2 last:mb-1">
          <p className="m-0 text-[11px] font-medium leading-[1.15] md:text-xs">
            {food.name}
            {food.weight ? ` (${food.weight})` : ""}
          </p>
          {food.calories > 0 && (
            <div className="mt-0.5 flex flex-wrap gap-1">
              <MacroTag label="Calories" value={`${food.calories}`} />
              <MacroTag label="Protein" value={`${food.protein} g`} />
              <MacroTag label="Carbs" value={`${food.carbs} g`} />
              <MacroTag label="Fats" value={`${food.fats} g`} />
            </div>
          )}
        </div>
      ))}

      {totals.calories > 0 && (
        <div className="mt-1.5 flex justify-between border-t border-[#EEF5FF] pt-1.5">
          <TotalItem
            value={`${totals.calories} cal`}
            percent={Math.min(
              Math.round((totals.calories / dailyGoals.calories) * 100),
              100
            )}
            color="#44EF5B"
          />
          <TotalItem
            value={`${totals.protein} g`}
            percent={Math.min(
              Math.round((totals.protein / dailyGoals.protein) * 100),
              100
            )}
            color="#44CAEF"
          />
          <TotalItem
            value={`${totals.carbs} g`}
            percent={Math.min(
              Math.round((totals.carbs / dailyGoals.carbs) * 100),
              100
            )}
            color="#EFCD44"
          />
          <TotalItem
            value={`${totals.fats} g`}
            percent={Math.min(
              Math.round((totals.fats / dailyGoals.fats) * 100),
              100
            )}
            color="#F399FF"
          />
        </div>
      )}
    </div>
  );
}

function MacroTag({ label, value }: { label: string; value: string }) {
  return (
    <span
      className="text-eati-ink rounded-full px-1.5 py-0.5 text-[8px] leading-tight md:text-[9px]"
      style={{
        backgroundColor: "#E0E5ED",
      }}
    >
      {label}: {value}
    </span>
  );
}

function TotalItem({
  value,
  percent,
  color,
}: {
  value: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] font-medium leading-tight text-eati-ink md:text-[10px]">{value}</span>
      <div
        className="my-0.5 h-1 w-8 overflow-hidden rounded-full md:w-10"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color, width: `${percent}%` }}
        />
      </div>
      <span className="text-[7px] leading-tight text-eati-ink/80 md:text-[8px]">{percent}%</span>
    </div>
  );
}
