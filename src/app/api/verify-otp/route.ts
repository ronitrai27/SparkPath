import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyOTP, deleteOTP } from '@/lib/OtpStore';
import {connectDB} from '@/config/dbconfig';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const cookieStore = cookies();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const isValid = verifyOTP(email, otp);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '7d' });

    if (user) {

      (await
            // Existing user → set auth_token
            cookieStore).set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      deleteOTP(email);
      console.log('User already exists, auth_token set');
      return NextResponse.json({ success: true, status: 'existing' });
    } else {

      (await
            // New user → set temp_token
         cookieStore).set('temp_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 15 * 60, // 15 mins 
      });

      deleteOTP(email);
        console.log('New user, temp_token set');
      return NextResponse.json({ success: true, status: 'new' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
