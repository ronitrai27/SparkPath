import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/config/dbconfig';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { email, otp, otpToken } = await req.json();
  const cookieStore = cookies();

  if (!email || !otp || !otpToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const payload = jwt.verify(otpToken, JWT_SECRET) as { email: string; otp: string };

    if (payload.email !== email || payload.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    const authToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });

    if (user) {
      (await cookieStore).set('auth_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      console.log('Existing user verified, auth_token set');
      return NextResponse.json({ success: true, status: 'existing' });
    } else {
      (await cookieStore).set('temp_token', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60,
      });

      console.log('New user verified, temp_token set');
      return NextResponse.json({ success: true, status: 'new' });
    }
  } catch (err) {
    console.error('OTP verification failed:', err);
    return NextResponse.json({ error: 'Invalid or expired OTP token' }, { status: 401 });
  }
}
