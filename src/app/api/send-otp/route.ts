/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { sendOTP } from '@/lib/mailer';
import { saveOTP } from '@/lib/OtpStore';

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', otp);

  try {
    await sendOTP(email, otp);
    saveOTP(email, otp);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
