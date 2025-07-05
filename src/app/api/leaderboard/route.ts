/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { connectDB } from "@/config/dbconfig";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");
  

    if (!userId) {
    //   console.log("[Leaderboard API] Error: userId is missing");
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
    //   console.log("[Leaderboard API] Error: Invalid userId", userId);
      return NextResponse.json({ success: false, error: "Invalid userId" }, { status: 400 });
    }

    const currentUser = await User.findById(userId).select("occupation name milestones");
    // console.log("[Leaderboard API] Fetched currentUser:", {
    //   _id: currentUser?._id,
    //   name: currentUser?.name,
    //   occupation: currentUser?.occupation,
    //   milestones: currentUser?.milestones,
    //   milestoneCount: currentUser?.milestones?.length || 0,
    //   exists: !!currentUser,
    // });

    if (!currentUser) {
      console.log("[Leaderboard API] Error: User not found for userId:", userId);
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const users = await User.find({
      occupation: currentUser.occupation || "Other",
      _id: { $ne: userId }, // Exclude current user
    })
      .select("_id name occupation milestones")
      .sort({ milestones: -1 }); // Sort by milestones length (descending)
    // console.log("[Leaderboard API] Fetched users:", users.map(u => ({
    //   _id: u._id,
    //   name: u.name,
    //   occupation: u.occupation,
    //   milestones: u.milestones,
    //   milestoneCount: u.milestones?.length || 0,
    // })));

    const leaderboard = [
      ...users,
      {
        _id: currentUser._id,
        name: currentUser.name,
        occupation: currentUser.occupation || "Other",
        milestones: currentUser.milestones || [],
      },
    ].sort((a, b) => (b.milestones?.length || 0) - (a.milestones?.length || 0));
    // console.log("[Leaderboard API] Final leaderboard:", leaderboard.map(u => ({
    //   _id: u._id,
    //   name: u.name,
    //   occupation: u.occupation,
    //   milestones: u.milestones,
    //   milestoneCount: u.milestones?.length || 0,
    // })));

    return NextResponse.json({ success: true, data: leaderboard }, { 
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    console.error("[Leaderboard API] Error:", error.message);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}