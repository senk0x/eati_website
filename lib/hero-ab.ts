export const HERO_AB_COOKIE = 'eati_hero_ab';
export const HERO_AB_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Variant A: interactive chat hero (original). Variant B: visual hero with Download CTA. */
export type HeroAbVariant = 'interactive' | 'visual';

export function isHeroAbVariant(value: string | undefined): value is HeroAbVariant {
  return value === 'interactive' || value === 'visual';
}

export function pickHeroAbVariant(): HeroAbVariant {
  return Math.random() < 0.5 ? 'interactive' : 'visual';
}

export function readHeroAbVariantFromCookie(cookieHeader?: string): HeroAbVariant | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${HERO_AB_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isHeroAbVariant(value) ? value : null;
}

export function setHeroAbCookie(variant: HeroAbVariant): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${HERO_AB_COOKIE}=${variant}; path=/; max-age=${HERO_AB_MAX_AGE}; SameSite=Lax`;
}

export function readHeroAbVariantClient(): HeroAbVariant | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${HERO_AB_COOKIE}=([^;]+)`));
  const value = match?.[1];
  return isHeroAbVariant(value) ? value : null;
}
