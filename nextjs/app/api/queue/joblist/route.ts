import { NextResponse } from "next/server";
import { Queue } from "bullmq";
import { redisConnection } from "../../../../../libs/redis/redis";

const queue = new Queue("excelQueue", { connection: redisConnection });

export async function GET() {
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getCompleted(),
    queue.getFailed(),
  ]);

  // Combine all jobs into one array with metadata
  const jobs = [
    ...waiting.map(j => ({ id: j.id, status: "waiting", data: j.data })),
    ...active.map(j => ({ id: j.id, status: "active", data: j.data, progress: j.progress })),
    ...completed.map(j => ({ id: j.id, status: "completed", data: j.data })),
    ...failed.map(j => ({ id: j.id, status: "failed", data: j.data, failedReason: j.failedReason })),
  ];

  return NextResponse.json(jobs);
}
