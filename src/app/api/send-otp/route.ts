/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { sendOTP } from '@/lib/mailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('📧 Generated OTP:', otp);

  try {
    await sendOTP(email, otp);
    const otpToken = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: '5m' });

    return NextResponse.json({ success: true, otpToken });
  } catch (error) {
    console.error(' Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

