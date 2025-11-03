// app/api/category/add/route.ts
import { NextResponse } from "next/server";
import { categoryQueue } from "../../../../../libs/redis/queue";

export async function POST(req: Request) {
  const data = await req.json();

  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  for (const row of data) {
    await categoryQueue.add("createCategory", row); // each row becomes a job
  }

  return NextResponse.json({ message: "Category data queued for processing" });
}
