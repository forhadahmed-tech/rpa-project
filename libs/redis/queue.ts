import { Queue } from "bullmq";
import { redisConnection } from "./redis";

// Initialize queues
export const excelQueue = new Queue("excelQueue", {
  connection: redisConnection,
});

// Helper to get all queues
export const getAllQueues = () => {
  return {
    excelQueue: excelQueue,
  };
};

// Get stats for a specific queue
export async function getQueueStats(queue: Queue) {
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
// In your API route
export async function getJobsByStatus(queue: Queue, status: string, page: number = 0, pageSize: number = 50) {
  const start = page * pageSize;
  const end = start + pageSize - 1;
  
  const jobs = await queue.getJobs([status as any], start, end, true);
  
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
