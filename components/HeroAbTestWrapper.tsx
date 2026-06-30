import { cookies } from "next/headers";
import HeroAbTest from "@/components/HeroAbTest";
import { HERO_AB_COOKIE, isHeroAbVariant, type HeroAbVariant } from "@/lib/hero-ab";

export default async function HeroAbTestWrapper() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(HERO_AB_COOKIE)?.value;
  const initialVariant: HeroAbVariant | null = isHeroAbVariant(raw) ? raw : null;

  return <HeroAbTest initialVariant={initialVariant} />;
}
