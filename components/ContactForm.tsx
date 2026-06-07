'use client';

import { FormEvent, useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!message) {
      setErrorMessage('Please enter a message.');
      setStatus('error');
      return;
    }

    setErrorMessage(null);

    const subject = encodeURIComponent(`Eati contact from ${name || 'user'}`);
    const lines = [
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      '',
      'Message:',
      message,
    ].filter(Boolean);

    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:gymboteam@gmail.com?subject=${subject}&body=${body}`;

    setStatus('success');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-[#E3ECF7] bg-[#F7FAFF] p-6 md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="min-h-[44px] w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none ring-0 transition-colors focus:border-[#88B8FF]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="min-h-[44px] w-full rounded-xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none ring-0 transition-colors focus:border-[#88B8FF]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="min-h-[120px] w-full rounded-2xl border border-[#D5E3F5] px-3 py-2.5 text-sm outline-none ring-0 transition-colors focus:border-[#88B8FF]"
        />
      </div>

      {status === 'success' && (
        <p className="text-sm text-green-700">Your message has been sent. Thank you!</p>
      )}
      {status === 'error' && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-eati-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-eati-ink-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === 'submitting' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
