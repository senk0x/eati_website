import nodemailer from 'nodemailer';

export interface SendEmailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export interface SendEmailResult {
  deliveredTo: string;
  sandboxForwarded: boolean;
}

function stripEnvQuotes(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value.replace(/^["']|["']$/g, '').trim();
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function isResendSandboxFrom(from: string): boolean {
  return from.includes('onboarding@resend.dev');
}

function resolveResendFromAddress(): string {
  return (
    stripEnvQuotes(process.env.CONTACT_FROM_EMAIL) ||
    stripEnvQuotes(process.env.RESEND_FROM_EMAIL) ||
    'Eati <hello@eatiapp.com>'
  );
}

function resolveResendProductionFromAddress(): string {
  return (
    stripEnvQuotes(process.env.RESEND_PRODUCTION_FROM_EMAIL) ||
    stripEnvQuotes(process.env.CONTACT_FROM_EMAIL) ||
    'Eati <hello@eatiapp.com>'
  );
}

export function isEmailDeliveryConfigured(): boolean {
  return isResendConfigured() || isSmtpConfigured();
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Resend API key is missing.');
  }

  const configuredFrom = resolveResendFromAddress();
  const fallbackProductionFrom = resolveResendProductionFromAddress();
  const from =
    isResendSandboxFrom(configuredFrom) && fallbackProductionFrom
      ? fallbackProductionFrom
      : configuredFrom;
  const sandboxInbox = stripEnvQuotes(process.env.RESEND_SANDBOX_INBOX_EMAIL);
  let to = input.to.trim();
  let text = input.text;
  let sandboxForwarded = false;

  let response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: input.subject,
      text,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const looksLikeSandboxRestriction =
      response.status === 403 &&
      /testing emails to your own email address|verify a domain/i.test(body);

    // If sender/domain isn't ready yet, route to sandbox inbox as explicit fallback.
    if (
      looksLikeSandboxRestriction &&
      sandboxInbox &&
      isResendSandboxFrom(configuredFrom) &&
      to.toLowerCase() !== sandboxInbox.toLowerCase()
    ) {
      text = [`Intended recipient: ${to}`, '', text].join('\n');
      to = sandboxInbox;
      sandboxForwarded = true;

      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: configuredFrom,
          to: [to],
          subject: input.subject,
          text,
          reply_to: input.replyTo,
        }),
      });
    }

    if (!response.ok) {
      const finalBody = await response.text().catch(() => body);
      throw new Error(`Resend request failed (${response.status}): ${finalBody.slice(0, 300)}`);
    }
  }

  return { deliveredTo: to, sandboxForwarded };
}

async function sendViaSmtp(input: SendEmailInput): Promise<SendEmailResult> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fromAddress = stripEnvQuotes(process.env.CONTACT_FROM_EMAIL) || process.env.SMTP_USER;

  await transporter.sendMail({
    from: fromAddress,
    to: input.to,
    subject: input.subject,
    replyTo: input.replyTo || fromAddress,
    text: input.text,
  });

  return { deliveredTo: input.to, sandboxForwarded: false };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (isResendConfigured()) {
    return sendViaResend(input);
  }

  if (isSmtpConfigured()) {
    return sendViaSmtp(input);
  }

  throw new Error('Email delivery is not configured.');
}
