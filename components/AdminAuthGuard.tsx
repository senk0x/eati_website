'use client';

import { useEffect, useState, ReactNode } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.authenticated ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        setStatus('unauthenticated');
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid password');
      }

      setStatus('authenticated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setStatus('unauthenticated');
    setPassword('');
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading...
        </p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div
          className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6"
        >
          <h1 className="mb-6 text-center text-xl font-bold text-[#364052]">Admin Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#85BEFF]"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !password}
              className="w-full rounded-full bg-[#364052] py-2.5 text-sm font-semibold text-white hover:bg-[#2b3545] disabled:opacity-50"
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={handleLogout}
          className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}
