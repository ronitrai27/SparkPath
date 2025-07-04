import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/config/dbconfig';
import User from '@/models/userModel';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  console.log("🔥 [API] /api/profile-complete HIT");

  const { email, name, occupation } = await req.json();
  const cookieStore = cookies();

  if (!email || !name || !occupation) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          occupation,
          verified: true,
        },
      },
      {
        new: true,
        upsert: true, // ✅ important
      }
    );

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    (await cookieStore).set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    (await cookieStore).delete('temp_token');

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Profile completion error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
