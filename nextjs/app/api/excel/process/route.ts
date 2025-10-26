
import { NextResponse } from "next/server";
import { Queue } from "bullmq";
import { redisConnection } from "../../../../../libs/redis/redis";

const excelQueue = new Queue("excelQueue", { connection: redisConnection });

export async function POST(req: Request) {
  const data = await req.json();

  if (!Array.isArray(data)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  for (const row of data) {
    console.log("Rows", row)
    await excelQueue.add("processExcelRow", row);
  }

  return NextResponse.json({ message: "Excel data queued for processing" });
}
