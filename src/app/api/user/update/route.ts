/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/config/dbconfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const { currPlan, userId } = await request.json();

    // Validate request body
    if (!userId || !currPlan) {
      return NextResponse.json(
        { success: false, error: "Missing userId or currPlan" },
        { status: 400 }
      );
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { currPlan } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}