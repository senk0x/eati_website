'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const SOCIAL_OPTIONS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'other', label: 'Other' },
] as const;

type ApplyStatus = 'idle' | 'submitting' | 'success' | 'error';
type LoginStatus = 'idle' | 'submitting' | 'error';

export default function ReferralProgramForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [usernamesByNetwork, setUsernamesByNetwork] = useState<Record<string, string>>({});
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [applyError, setApplyError] = useState('');
  const [showPartnerAccess, setShowPartnerAccess] = useState(false);
  const [partnerPassword, setPartnerPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
  const [loginError, setLoginError] = useState('');

  const selectedRows = useMemo(
    () =>
      selectedNetworks
        .map((networkId) => ({
          network:
            SOCIAL_OPTIONS.find((option) => option.id === networkId)?.label ?? networkId,
          username: usernamesByNetwork[networkId]?.trim() ?? '',
        }))
        .filter((row) => row.username.length > 0),
    [selectedNetworks, usernamesByNetwork]
  );

  const toggleNetwork = (networkId: string) => {
    setSelectedNetworks((current) => {
      if (current.includes(networkId)) {
        const next = current.filter((id) => id !== networkId);
        setUsernamesByNetwork((prev) => {
          const copy = { ...prev };
          delete copy[networkId];
          return copy;
        });
        return next;
      }

      return [...current, networkId];
    });
  };

  const handleApplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApplyError('');
    setApplyStatus('submitting');

    try {
      const response = await fetch('/api/referral/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          networks: selectedRows,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Failed to submit your application.');
      }

      setApplyStatus('success');
      setEmail('');
      setSelectedNetworks([]);
      setUsernamesByNetwork({});
    } catch (error) {
      setApplyError(error instanceof Error ? error.message : 'Failed to submit your application.');
      setApplyStatus('error');
    }
  };

  const handlePartnerLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');
    setLoginStatus('submitting');

    try {
      const response = await fetch('/api/referral/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: partnerPassword }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || 'Password is incorrect.');
      }

      router.push('/referral-program/dashboard');
      router.refresh();
    } catch (error) {
      setLoginStatus('error');
      setLoginError(error instanceof Error ? error.message : 'Login failed.');
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleApplySubmit}
        className="space-y-5 rounded-3xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:p-8"
      >
        <div className="space-y-1.5">
          <label htmlFor="referral-email" className="text-sm font-medium text-eati-ink">
            Email
          </label>
          <input
            id="referral-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="min-h-[44px] w-full rounded-xl border border-[#D5E3F5] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#88B8FF]"
            placeholder="you@example.com"
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-eati-ink">Social network(s)</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SOCIAL_OPTIONS.map((option) => {
              const checked = selectedNetworks.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${
                    checked
                      ? 'border-[#88B8FF] bg-[#EAF3FF] text-eati-ink'
                      : 'border-[#D5E3F5] bg-white text-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleNetwork(option.id)}
                    className="h-4 w-4 accent-[#88B8FF]"
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {selectedNetworks.map((networkId) => {
          const label = SOCIAL_OPTIONS.find((option) => option.id === networkId)?.label ?? networkId;
          return (
            <div key={networkId} className="space-y-1.5">
              <label htmlFor={`network-username-${networkId}`} className="text-sm font-medium text-eati-ink">
                {label} username
              </label>
              <input
                id={`network-username-${networkId}`}
                type="text"
                value={usernamesByNetwork[networkId] ?? ''}
                onChange={(event) =>
                  setUsernamesByNetwork((current) => ({
                    ...current,
                    [networkId]: event.target.value,
                  }))
                }
                required
                className="min-h-[44px] w-full rounded-xl border border-[#D5E3F5] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#88B8FF]"
                placeholder={`@your${networkId}`}
              />
            </div>
          );
        })}

        {applyStatus === 'success' && (
          <p className="text-sm text-green-700">Thanks! Your request has been sent and we will contact you soon.</p>
        )}
        {applyStatus === 'error' && <p className="text-sm text-red-600">{applyError}</p>}

        <button
          type="submit"
          disabled={applyStatus === 'submitting'}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-eati-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-eati-ink-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {applyStatus === 'submitting' ? 'Sending...' : 'Get Started'}
        </button>
      </form>

      <section className="rounded-3xl border border-[#E3ECF7] bg-white p-6 md:p-8">
        <h2 className="text-lg font-semibold text-eati-ink">Already an Eati partner?</h2>
        <p className="mt-2 text-sm text-gray-600">
          Use your private password to open your referral dashboard and track activations and purchases.
        </p>

        {!showPartnerAccess ? (
          <button
            type="button"
            onClick={() => setShowPartnerAccess(true)}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-eati-ink px-5 py-2.5 text-sm font-semibold text-eati-ink transition-colors hover:bg-[#F0F4F8]"
          >
            We&apos;re Already Working Together
          </button>
        ) : (
          <form onSubmit={handlePartnerLogin} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="partner-password" className="text-sm font-medium text-eati-ink">
                Unique password
              </label>
              <input
                id="partner-password"
                type="password"
                value={partnerPassword}
                onChange={(event) => setPartnerPassword(event.target.value)}
                required
                className="min-h-[44px] w-full rounded-xl border border-[#D5E3F5] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[#88B8FF]"
                placeholder="Enter your partner password"
              />
            </div>

            {loginStatus === 'error' && <p className="text-sm text-red-600">{loginError}</p>}

            <button
              type="submit"
              disabled={loginStatus === 'submitting'}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-eati-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-eati-ink-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginStatus === 'submitting' ? 'Checking...' : 'Open Dashboard'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
