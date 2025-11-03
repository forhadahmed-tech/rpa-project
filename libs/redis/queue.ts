import { Queue, Job } from "bullmq";
import { redisConnection } from "./redis";

// Initialize categoryQueue
export const categoryQueue = new Queue("categoryQueue", {
  connection: redisConnection,
});

// Get queue stats
export async function getQueueStats(queue = categoryQueue) {
  const counts = await queue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed"
  );

  const totalProcessed = counts.completed + counts.failed;
  const successRate =
    totalProcessed > 0 ? (counts.completed / totalProcessed) * 100 : 0;

  return {
    ...counts,
    successRate: Math.round(successRate * 100) / 100,
    totalProcessed,
  };
}

// Get jobs with pagination
export async function getJobsByStatus(
  queue = categoryQueue,
  status: "waiting" | "active" | "completed" | "failed" | "delayed",
  page = 0,
  pageSize = 50
) {
  const start = page * pageSize;
  const end = start + pageSize - 1;

  const jobs: Job[] = await queue.getJobs([status], start, end, true);

  return jobs.map(job => ({
    id: job.id,
    name: job.name,
    progress: job.progress,
    timestamp: job.processedOn || job.finishedOn,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
    failedReason: job.failedReason,
    returnValue: job.returnvalue,
    attempts: job.attemptsMade,
    data: job.data,
    delayed: job.delay,
    queueName: queue.name,
  }));
}
