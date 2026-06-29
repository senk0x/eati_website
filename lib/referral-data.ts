import { getServiceSupabaseClient } from '@/lib/supabase-server';
import {
  createRandomReferralPassword,
  hashReferralPassword,
  normalizePromoCode,
  verifyReferralPassword,
} from '@/lib/referral-auth';

interface ReferralPairRow {
  promo_code: string;
  password_salt: string;
  password_hash: string;
  active: boolean;
  created_at: string;
}

interface RedemptionRow {
  id: string;
  user_id: string;
  code: string;
  redeemed_at: string;
}

interface PurchaseRow {
  id: string;
  user_id: string;
  code: string | null;
  purchased_at: string;
}

export interface ReferralPerformanceRow {
  activationDate: string;
  paid: boolean;
  paymentDate: string | null;
}

export interface ReferralPairSummary {
  promoCode: string;
  active: boolean;
  createdAt: string;
}

export interface ReferralApplicationInput {
  email: string;
  networks: Array<{ network: string; username: string }>;
}

export async function saveReferralApplication(input: ReferralApplicationInput): Promise<void> {
  const supabase = getServiceSupabaseClient();
  const { error } = await supabase.from('referral_applications').insert({
    email: input.email,
    networks: input.networks,
  });

  if (error) {
    throw new Error(`Failed to save referral application: ${error.message}`);
  }
}

export async function findPromoCodeByPassword(password: string): Promise<string | null> {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('referral_partner_access')
    .select('promo_code,password_salt,password_hash,active')
    .eq('active', true);

  if (error) {
    throw new Error(`Failed to read referral access pairs: ${error.message}`);
  }

  const rows = (data ?? []) as ReferralPairRow[];
  for (const row of rows) {
    if (verifyReferralPassword(password, row.password_salt, row.password_hash)) {
      return normalizePromoCode(row.promo_code);
    }
  }

  return null;
}

export async function listReferralPairs(): Promise<ReferralPairSummary[]> {
  const supabase = getServiceSupabaseClient();
  const { data, error } = await supabase
    .from('referral_partner_access')
    .select('promo_code,active,created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to list referral pairs: ${error.message}`);
  }

  return ((data ?? []) as ReferralPairRow[]).map((row) => ({
    promoCode: normalizePromoCode(row.promo_code),
    active: row.active,
    createdAt: row.created_at,
  }));
}

export async function createReferralPair(promoCodeInput: string): Promise<{ promoCode: string; password: string }> {
  const promoCode = normalizePromoCode(promoCodeInput);
  const password = createRandomReferralPassword();
  const { salt, hash } = hashReferralPassword(password);
  const supabase = getServiceSupabaseClient();

  const { error } = await supabase.from('referral_partner_access').insert({
    promo_code: promoCode,
    password_salt: salt,
    password_hash: hash,
    active: true,
  });

  if (error) {
    throw new Error(`Failed to create referral pair: ${error.message}`);
  }

  return { promoCode, password };
}

function rankPurchaseForRedemption(redemption: RedemptionRow, purchase: PurchaseRow): number {
  if (purchase.user_id !== redemption.user_id) {
    return -1;
  }

  const redemptionTime = new Date(redemption.redeemed_at).getTime();
  const purchaseTime = new Date(purchase.purchased_at).getTime();
  if (Number.isFinite(redemptionTime) && Number.isFinite(purchaseTime) && purchaseTime < redemptionTime) {
    return -1;
  }

  const redemptionCode = redemption.code.trim().toLowerCase();
  const purchaseCode = purchase.code?.trim().toLowerCase();
  if (purchaseCode === redemptionCode) {
    return 2;
  }

  if (!purchaseCode) {
    return 1;
  }

  return 0;
}

export async function getReferralPerformanceForCode(promoCodeInput: string): Promise<ReferralPerformanceRow[]> {
  const promoCode = normalizePromoCode(promoCodeInput);
  const supabase = getServiceSupabaseClient();

  const { data: redemptionsData, error: redemptionsError } = await supabase
    .from('code_redemptions')
    .select('id,user_id,code,redeemed_at')
    .ilike('code', promoCode)
    .order('redeemed_at', { ascending: false });

  if (redemptionsError) {
    throw new Error(`Failed to read promo code activations: ${redemptionsError.message}`);
  }

  const redemptions = (redemptionsData ?? []) as RedemptionRow[];
  if (!redemptions.length) {
    return [];
  }

  const userIds = Array.from(new Set(redemptions.map((row) => row.user_id)));
  const { data: purchasesData, error: purchasesError } = await supabase
    .from('purchases')
    .select('id,user_id,code,purchased_at')
    .in('user_id', userIds)
    .order('purchased_at', { ascending: true });

  if (purchasesError) {
    throw new Error(`Failed to read purchases: ${purchasesError.message}`);
  }

  const purchases = (purchasesData ?? []) as PurchaseRow[];

  return redemptions.map((redemption) => {
    const bestPurchase = purchases
      .map((purchase) => ({
        purchase,
        score: rankPurchaseForRedemption(redemption, purchase),
      }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        return new Date(a.purchase.purchased_at).getTime() - new Date(b.purchase.purchased_at).getTime();
      })[0]?.purchase;

    return {
      activationDate: redemption.redeemed_at,
      paid: Boolean(bestPurchase),
      paymentDate: bestPurchase?.purchased_at ?? null,
    };
  });
}
