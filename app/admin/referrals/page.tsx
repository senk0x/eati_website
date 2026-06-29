'use client';

import { FormEvent, useEffect, useState } from 'react';
import AdminNav from '@/components/AdminNav';

interface ReferralPair {
  promoCode: string;
  active: boolean;
  createdAt: string;
}

export default function AdminReferralsPage() {
  const [pairs, setPairs] = useState<ReferralPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [generatedPair, setGeneratedPair] = useState<{ promoCode: string; password: string } | null>(null);

  const loadPairs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/referral-pairs');
      const payload = (await response.json().catch(() => null)) as {
        pairs?: ReferralPair[];
        configured?: boolean;
        error?: string;
      } | null;

      if (!response.ok) {
        if (payload?.configured === false) {
          setConfigured(false);
          setPairs([]);
          setError(payload.error || 'Referral backend is not configured.');
          return;
        }

        throw new Error(payload?.error || 'Failed to load promo code pairs.');
      }

      setConfigured(true);
      setPairs(payload?.pairs ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load promo code pairs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPairs();
  }, []);

  const handleCreatePair = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    setGeneratedPair(null);

    try {
      const response = await fetch('/api/admin/referral-pairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || 'Failed to create promo code pair.');
      }

      const payload = (await response.json()) as { promoCode: string; password: string };
      setGeneratedPair(payload);
      setPromoCode('');
      await loadPairs();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create promo code pair.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <AdminNav />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-eati-ink">Referral Partners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create promo code + password pairs for influencer dashboard access.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#F2D4D4] bg-[#FFF8F8] p-4 text-sm text-red-600">
            {error}
            {!configured ? (
              <p className="mt-3 text-xs text-gray-600">
                Add <code className="rounded bg-white px-1">SUPABASE_URL</code> and{' '}
                <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{' '}
                <code className="rounded bg-white px-1">.env.local</code>, then restart{' '}
                <code className="rounded bg-white px-1">npm run dev</code>. Use the same Eati Supabase project as
                gymbo-nutrition. The service role key is in Supabase Dashboard → Settings → API.
              </p>
            ) : null}
          </div>
        )}

        <form
          onSubmit={handleCreatePair}
          className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-6"
        >
          <div className="space-y-1.5">
            <label htmlFor="promoCode" className="text-sm font-medium text-eati-ink">
              Promo code
            </label>
            <input
              id="promoCode"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              required
              disabled={!configured}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#88B8FF] disabled:bg-gray-100"
              placeholder="E.g. ALICE10"
            />
          </div>

          <button
            type="submit"
            disabled={creating || !configured}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-eati-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-eati-ink-hover disabled:opacity-60"
          >
            {creating ? 'Generating...' : 'Generate password'}
          </button>

          {generatedPair && (
            <div className="rounded-xl border border-[#CCE2FF] bg-[#F2F8FF] p-4 text-sm">
              <p className="font-medium text-eati-ink">New pair created</p>
              <p className="mt-1 text-gray-700">
                Promo code: <strong>{generatedPair.promoCode}</strong>
              </p>
              <p className="text-gray-700">
                Password: <strong>{generatedPair.password}</strong>
              </p>
              <p className="mt-2 text-xs text-gray-500">Save this password now. It is not shown again.</p>
            </div>
          )}
        </form>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Promo code</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={3}>
                    Loading pairs...
                  </td>
                </tr>
              ) : pairs.length ? (
                pairs.map((pair) => (
                  <tr key={`${pair.promoCode}-${pair.createdAt}`} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-eati-ink">{pair.promoCode}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          pair.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {pair.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(pair.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={3}>
                    No referral pairs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
