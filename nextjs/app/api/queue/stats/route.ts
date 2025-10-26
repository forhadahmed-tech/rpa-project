import { NextResponse } from "next/server";
import { getAllQueues, getQueueStats } from "../../../../../libs/redis/queue";

export async function GET() {
  try {
    const queues = getAllQueues();
    const stats: { [key: string]: any } = {};

    // Get stats for each queue
    for (const [queueName, queue] of Object.entries(queues)) {
      stats[queueName] = await getQueueStats(queue);
    }

    // Calculate values first
    const waiting = Object.values(stats).reduce((sum, s) => sum + s.waiting, 0);
    const active = Object.values(stats).reduce((sum, s) => sum + s.active, 0);
    const completed = Object.values(stats).reduce(
      (sum, s) => sum + s.completed,
      0
    );
    const failed = Object.values(stats).reduce((sum, s) => sum + s.failed, 0);
    const delayed = Object.values(stats).reduce((sum, s) => sum + s.delayed, 0);
    const totalProcessed = completed + failed;
    const successRate =
      totalProcessed > 0
        ? Math.round((completed / totalProcessed) * 100 * 100) / 100
        : 0;

    const overall = {
      waiting,
      active,
      completed,
      failed,
      delayed,
      successRate,
      totalProcessed,
    };

    return NextResponse.json({
      overall,
      queues: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching queue stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch queue statistics" },
      { status: 500 }
    );
  }
}
