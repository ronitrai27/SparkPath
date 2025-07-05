// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/dbconfig";
import User from "@/models/userModel"; // your Mongoose user model

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, topic, plan } = body;

    if (!email || !plan || !topic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await User.findOneAndUpdate(
      { email },
      {
        currPlan: {
          topic,
          currentDay: 1,
          plan,
        },
        updatedAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save Plan Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    return NextResponse.json({
      plan: user?.currPlan || null,
    });
  } catch (err) {
    console.error("Fetch Plan Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
