'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReferralDashboardResponse {
  promoCode: string;
  rows: Array<{
    activationDate: string;
    paid: boolean;
    paymentDate: string | null;
  }>;
}

function formatDate(value: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString();
}

export default function ReferralDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<ReferralDashboardResponse | null>(null);

  useEffect(() => {
    fetch('/api/referral/stats')
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please sign in with your partner password first.');
            setLoading(false);
            return;
          }

          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error || 'Failed to load referral data.');
        }

        const payload = (await response.json()) as ReferralDashboardResponse;
        setData(payload);
        setLoading(false);
      })
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load referral data.');
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/referral/auth', { method: 'DELETE' });
    router.push('/referral-program');
    router.refresh();
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading your referral dashboard...</p>;
  }

  if (error) {
    return (
      <div className="space-y-4 rounded-3xl border border-[#F2D4D4] bg-[#FFF8F8] p-6">
        <p className="text-sm text-red-600">{error}</p>
        <Link
          href="/referral-program"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-eati-ink px-5 py-2.5 text-sm font-semibold text-eati-ink transition-colors hover:bg-[#F0F4F8]"
        >
          Back to Referral Program
        </Link>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:p-8">
        <p className="text-sm text-gray-600">Your promo code:</p>
        <p className="mt-2 text-2xl font-semibold text-eati-ink">&quot;{data.promoCode}&quot;</p>
      </div>

      <section className="rounded-3xl border border-[#E3ECF7] bg-white p-6 md:p-8">
        <h2 className="text-lg font-semibold text-eati-ink">Performance</h2>
        <p className="mt-2 text-sm text-gray-600">
          Promo code activation date, payment status, and subscription payment date.
        </p>

        {data.rows.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500">
                  <th className="pb-2 pr-4 font-medium">Activation date</th>
                  <th className="pb-2 pr-4 font-medium">Subscription paid</th>
                  <th className="pb-2 font-medium">Payment date</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={`${row.activationDate}-${row.paymentDate ?? 'no-payment'}`} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 pr-4">{formatDate(row.activationDate)}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {row.paid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-2.5">{formatDate(row.paymentDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No activations for this promo code yet.</p>
        )}
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
      >
        Log out
      </button>
    </div>
  );
}
