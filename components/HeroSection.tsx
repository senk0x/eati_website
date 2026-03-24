"use client";

import { useState, useEffect, useRef } from "react";

interface FoodItem {
  name: string;
  weight: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  userMessage: string;
  foods: FoodItem[];
}

const defaultMeals: Meal[] = [
  {
    userMessage: "Chicken breast 200g with spaghetti 150g",
    foods: [
      { name: "Chicken Breast", weight: "200g", calories: 330, protein: 62, carbs: 0, fats: 7 },
      { name: "Spaghetti", weight: "150g", calories: 237, protein: 8, carbs: 47, fats: 1 },
    ],
  },
  {
    userMessage: "Greek salad with feta cheese",
    foods: [
      { name: "Greek Salad", weight: "100g", calories: 48, protein: 1, carbs: 3, fats: 4 },
      { name: "Feta Cheese", weight: "100g", calories: 264, protein: 14, carbs: 4, fats: 21 },
    ],
  },
  {
    userMessage: "Salmon 180g with rice 150g and vegetables",
    foods: [
      { name: "Salmon Fillet", weight: "180g", calories: 367, protein: 40, carbs: 0, fats: 22 },
      { name: "White Rice", weight: "150g", calories: 195, protein: 4, carbs: 43, fats: 0 },
      { name: "Mixed Vegetables", weight: "100g", calories: 65, protein: 3, carbs: 13, fats: 0 },
    ],
  },
  {
    userMessage: "Oatmeal 80g with banana 120g and honey 20g",
    foods: [
      { name: "Oatmeal", weight: "80g", calories: 303, protein: 11, carbs: 51, fats: 5 },
      { name: "Banana", weight: "120g", calories: 107, protein: 1, carbs: 27, fats: 0 },
      { name: "Honey", weight: "20g", calories: 64, protein: 0, carbs: 17, fats: 0 },
    ],
  },
  {
    userMessage: "Beef steak with mashed potatoes",
    foods: [
      { name: "Beef Steak", weight: "100g", calories: 271, protein: 25, carbs: 0, fats: 18 },
      { name: "Mashed Potatoes", weight: "100g", calories: 107, protein: 2, carbs: 16, fats: 4 },
    ],
  },
];

export default function HeroSection() {
  const rays = generateSunburstRays();
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customMeal, setCustomMeal] = useState<Meal | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoRotating && !customMeal) {
      intervalRef.current = setInterval(() => {
        setCurrentMealIndex((prev) => (prev + 1) % defaultMeals.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoRotating, customMeal]);

  const currentMeal = customMeal || defaultMeals[currentMealIndex];
  const totals = currentMeal.foods.reduce(
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
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    setIsAutoRotating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const userInput = inputValue.trim();
    
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
        // Handle API errors - show error message in the phone
        setCustomMeal({
          userMessage: userInput,
          foods: [
            {
              name: data.error || "Service temporarily unavailable. Please try again.",
              weight: "",
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            },
          ],
        });
      } else if (data.type === "nutrition" && data.foods && data.foods.length > 0) {
        setCustomMeal({
          userMessage: userInput,
          foods: data.foods,
        });
      } else if (data.type === "conversation") {
        setCustomMeal({
          userMessage: userInput,
          foods: [
            {
              name: data.message || "Please describe a food item",
              weight: "",
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            },
          ],
        });
      } else {
        // Fallback for unexpected response format
        setCustomMeal({
          userMessage: userInput,
          foods: [
            {
              name: "Could not process request. Please try again.",
              weight: "",
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error fetching nutrition:", error);
      // Show error in the phone display
      setCustomMeal({
        userMessage: userInput,
        foods: [
          {
            name: "Network error. Please check your connection and try again.",
            weight: "",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
          },
        ],
      });
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <section className="px-4 sm:px-5 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative flex min-h-[min(680px,100svh)] flex-col overflow-hidden rounded-[2rem] md:min-h-[500px] md:flex-none md:rounded-[3rem] lg:min-h-[540px]"
          style={{ backgroundColor: "#85BEFF" }}
        >
          {/* Sunburst rays background */}
          <div className="absolute inset-0">
            <svg
              className="h-full w-full"
              viewBox="0 0 1000 800"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#99CAFF">
                {rays.map((points, i) => (
                  <polygon key={i} points={points} />
                ))}
              </g>
            </svg>
          </div>

          {/* Hero content - top on mobile, left on tablet+ */}
          <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-8 text-center md:min-h-[500px] md:items-start md:px-8 md:py-12 md:text-left lg:px-16 lg:py-16">
            {/* Title */}
            <h1
              className="text-3xl font-black uppercase leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              style={{
                fontFamily: "var(--font-bowlby-one), sans-serif",
                fontWeight: 400,
              }}
            >
              TRACK YOUR
              <br />
              CALORIES
              <br />
              IN SECONDS
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-pretty text-base font-medium leading-snug text-white/95 sm:text-lg md:mx-0 md:text-left md:text-xl"
              style={{ fontFamily: "var(--font-rubik), sans-serif" }}
            >
              AI calorie tracker and meal planner — log by text, photo, barcode, or voice. Built for
              fat loss, macro goals, and everyday consistency.
            </p>

            {/* Input field and send button */}
            <div className="mt-6 flex flex-col items-center md:mt-8 md:items-start md:text-left lg:mt-12">
              <div className="flex w-full max-w-[280px] items-center gap-3 sm:max-w-[320px] md:max-w-none md:w-auto md:max-w-[320px]">
                <div className="min-w-0 flex-1 rounded-full border-[3px] border-white sm:w-64 md:w-80">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your meal..."
                    disabled={isLoading}
                    className="min-h-[44px] w-full bg-transparent px-5 py-3 text-base text-white placeholder:text-white/80 focus:outline-none disabled:opacity-50 sm:px-6 md:px-8 md:py-4 md:text-lg"
                    style={{
                      fontFamily: "var(--font-rubik), sans-serif",
                      fontWeight: 500,
                    }}
                  />
                </div>

                {/* Send button - 44px min touch target */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !inputValue.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white transition-opacity hover:opacity-90 disabled:opacity-50 md:h-14 md:w-14"
                  aria-label="Send"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#85BEFF] border-t-transparent md:h-6 md:w-6" />
                  ) : (
                    <svg
                      className="h-5 w-5 text-[#85BEFF] md:h-6 md:w-6"
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

          {/* iPhone mockup - on mobile: larger, centered, lower with bottom slightly cropped */}
          <div className="relative z-10 mt-6 flex w-full shrink-0 justify-center pb-0 pt-10 md:mt-0 md:w-auto md:absolute md:right-8 md:top-8 md:justify-end md:pt-0 lg:right-16">
            <div className="relative flex w-full justify-center overflow-hidden md:w-auto md:overflow-visible">
              {/* Larger phone; no overflow on wrapper so SVG stroke is not cropped; inner content clips messages */}
              <div className="relative inline-flex w-56 justify-center sm:w-64 md:w-64 lg:w-72 xl:w-80 -mb-12 sm:-mb-16 md:mb-0">
                  {/* iPhone frame - SVG stroke can extend; wrapper does not clip it */}
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

              {/* Phone screen content - inset; hard clip so messages cannot extend past */}
              <div
                className="absolute left-[12px] right-[12px] top-[82px] bottom-[8px] overflow-hidden rounded-[26px]"
                style={{
                  width: "calc(100% - 24px)",
                  maxWidth: "calc(100% - 24px)",
                  boxSizing: "border-box",
                }}
              >
                <div className="flex h-full w-full min-w-0 flex-col gap-2 overflow-hidden px-2.5 pt-2.5 pb-0">
                  {/* User message bubble - fixed max width so it never exceeds frame */}
                  <div key={`msg-${customMeal ? 'custom' : currentMealIndex}`} className="flex min-w-0 flex-col gap-2 overflow-hidden">
                    <div className="hero-phone-bubble-enter flex min-w-0 justify-end overflow-hidden">
                      <div
                        className={`max-w-[70%] shrink-0 rounded-[12px] rounded-br-[3px] px-2 py-1.5 text-white transition-all duration-500 ${isLoading ? "animate-pulse" : ""}`}
                        style={{
                          backgroundColor: "#2F5176",
                          fontFamily: "var(--font-rubik), sans-serif",
                          fontWeight: 400,
                          maxWidth: "min(70%, 8.5rem)",
                        }}
                      >
                        <span className="break-words text-[11px] leading-tight md:text-xs">
                          {currentMeal.userMessage}
                        </span>
                      </div>
                    </div>

                    {/* AI response bubble - contained within frame */}
                    <div className="hero-phone-bubble-enter hero-phone-bubble-delay flex min-w-0 justify-start overflow-hidden">
                      <div
                        className={`min-w-0 max-w-full shrink-0 rounded-[12px] rounded-bl-[3px] p-2 transition-all duration-500 overflow-hidden ${isLoading ? "animate-pulse" : ""}`}
                        style={{
                          backgroundColor: "#F5F9FF",
                          fontFamily: "var(--font-rubik), sans-serif",
                          boxSizing: "border-box",
                        }}
                      >
                      {isLoading ? (
                        <div className="flex items-center justify-center py-3">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#85BEFF] border-t-transparent" />
                        </div>
                      ) : (
                        <div className="min-w-0 overflow-hidden">
                          {/* Food items - smaller */}
                          {currentMeal.foods.map((food, index) => (
                            <div key={index} className="mb-2 last:mb-1">
                              <p
                                className="text-[11px] font-medium leading-tight md:text-xs"
                                style={{ color: "#364052" }}
                              >
                                {food.name}
                                {food.weight ? ` (${food.weight})` : ""}
                              </p>
                              {food.calories > 0 && (
                                <div className="mt-0.5 flex flex-wrap gap-1">
                                  <MacroTag
                                    label="Calories"
                                    value={`${food.calories}`}
                                  />
                                  <MacroTag
                                    label="Protein"
                                    value={`${food.protein} g`}
                                  />
                                  <MacroTag
                                    label="Carbs"
                                    value={`${food.carbs} g`}
                                  />
                                  <MacroTag
                                    label="Fats"
                                    value={`${food.fats} g`}
                                  />
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Totals summary - smaller */}
                          {totals.calories > 0 && (
                            <div
                              className="mt-1.5 flex justify-between border-t border-[#EEF5FF] pt-1.5"
                            >
                              <TotalItem
                                value={`${totals.calories} cal`}
                                percent={Math.min(
                                  Math.round(
                                    (totals.calories / dailyGoals.calories) * 100
                                  ),
                                  100
                                )}
                                color="#44EF5B"
                              />
                              <TotalItem
                                value={`${totals.protein} g`}
                                percent={Math.min(
                                  Math.round(
                                    (totals.protein / dailyGoals.protein) * 100
                                  ),
                                  100
                                )}
                                color="#44CAEF"
                              />
                              <TotalItem
                                value={`${totals.carbs} g`}
                                percent={Math.min(
                                  Math.round(
                                    (totals.carbs / dailyGoals.carbs) * 100
                                  ),
                                  100
                                )}
                                color="#F399FF"
                              />
                              <TotalItem
                                value={`${totals.fats} g`}
                                percent={Math.min(
                                  Math.round(
                                    (totals.fats / dailyGoals.fats) * 100
                                  ),
                                  100
                                )}
                                color="#EFCD44"
                              />
                            </div>
                          )}
                        </div>
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

function MacroTag({ label, value }: { label: string; value: string }) {
  return (
    <span
      className="rounded-full px-1.5 py-0.5 text-[8px] leading-tight md:text-[9px]"
      style={{
        backgroundColor: "#E0E5ED",
        color: "#364052",
        fontFamily: "var(--font-rubik), sans-serif",
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
      <span
        className="text-[9px] font-medium leading-tight md:text-[10px]"
        style={{ color: "#364052", fontFamily: "var(--font-rubik), sans-serif" }}
      >
        {value}
      </span>
      <div
        className="my-0.5 h-1 w-8 overflow-hidden rounded-full md:w-10"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ backgroundColor: color, width: `${percent}%` }}
        />
      </div>
      <span
        className="text-[7px] leading-tight md:text-[8px]"
        style={{
          color: "#364052",
          opacity: 0.8,
          fontFamily: "var(--font-rubik), sans-serif",
        }}
      >
        {percent}%
      </span>
    </div>
  );
}

function generateSunburstRays(): string[] {
  const originX = 1000;
  const originY = 800;
  const rayLength = 2000;
  const numRays = 7;
  const startAngle = 180;
  const endAngle = 360;
  const totalAngle = endAngle - startAngle;
  const sliceAngle = totalAngle / (numRays * 2);

  const rays: string[] = [];

  for (let i = 0; i < numRays; i++) {
    const angle1 = startAngle + (i * 2 + 1) * sliceAngle;
    const angle2 = startAngle + (i * 2 + 2) * sliceAngle;

    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;

    const x1 = Math.round(originX + rayLength * Math.cos(rad1));
    const y1 = Math.round(originY + rayLength * Math.sin(rad1));
    const x2 = Math.round(originX + rayLength * Math.cos(rad2));
    const y2 = Math.round(originY + rayLength * Math.sin(rad2));

    rays.push(`${originX},${originY} ${x1},${y1} ${x2},${y2}`);
  }

  return rays;
}
