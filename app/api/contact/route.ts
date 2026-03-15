import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_MESSAGE_LENGTH = 10000;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 320;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }
    const name = typeof body.name === "string" ? body.name.trim().slice(0, MAX_NAME_LENGTH) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX_EMAIL_LENGTH) : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromAddress = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: fromAddress,
      to: "gymboteam@gmail.com",
      subject: `Eati contact form: ${name || "New message"}`,
      replyTo: email || fromAddress,
      text: [
        `Name: ${name || "Not provided"}`,
        `Email: ${email || "Not provided"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}

