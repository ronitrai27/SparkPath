// /app/api/user/me/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import { connectDB } from '@/config/dbconfig';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    await connectDB();

    const user = await User.findOne({ email: decoded.email }).select(
      'email name occupation league milestones currPlan createdAt'
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[User Fetch Error]', err);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 500 });
  }
}
