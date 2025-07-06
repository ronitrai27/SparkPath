/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/wiki/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Wikipedia page not found");

    const data = await res.json();
    return NextResponse.json({ extract: data.extract });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch Wikipedia" }, { status: 500 });
  }
}
