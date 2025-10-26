import { NextResponse } from "next/server";
import { getAllQueues, getJobsByStatus } from "../../../../../libs/redis/queue";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queueName = searchParams.get("queue") || "all";
    const limit = parseInt(searchParams.get("limit") || "100");

    const queues = getAllQueues();
    const allFailedJobs: any[] = [];

    if (queueName === "all") {
      for (const [name, queue] of Object.entries(queues)) {
        const failedJobs = await getJobsByStatus(queue, "failed", 0, limit);
        allFailedJobs.push(...failedJobs);
      }
    } else {
      const queue = queues[queueName as keyof typeof queues];
      if (!queue) {
        return NextResponse.json(
          { error: `Queue ${queueName} not found` },
          { status: 404 }
        );
      }
      const failedJobs = await getJobsByStatus(queue, "failed", 0, limit);
      allFailedJobs.push(...failedJobs);
    }

    allFailedJobs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return NextResponse.json({
      failedJobs: allFailedJobs.slice(0, limit),
      total: allFailedJobs.length,
    });
  } catch (error) {
    console.error("Error fetching failed jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch failed jobs" },
      { status: 500 }
    );
  }
}
