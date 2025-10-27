import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary store (في مشروع حقيقي استخدم DB أو Redis)
const otpStore = new Map<string, string>();

export async function POST(req: Request) {
  const { email } = await req.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, otp);

  try {
    await resend.emails.send({
      from: 'Skillify <onboarding@resend.dev>',
      to: email,
      subject: 'Your Skillify verification code',
      html: `
        <p>Welcome to <strong>Skillify</strong> 🎉</p>
        <p>Your verification code is:</p>
        <h2 style="font-size: 22px; letter-spacing: 4px;">${otp}</h2>
        <p>This code will expire in 5 minutes.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}

// للتحقق في خطوة تانية
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const otp = searchParams.get('otp');

  if (!email || !otp) return NextResponse.json({ success: false });

  const valid = otpStore.get(email) === otp;
  if (valid) otpStore.delete(email);

  return NextResponse.json({ success: valid });
}
