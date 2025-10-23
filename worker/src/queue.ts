import { Worker, Queue } from "bullmq";
import prisma from "../../libs/prisma/client.js";
import { performSiteTask } from "./jobs/exampleJob.js";

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
};

export const jobQueue = new Queue("rpa-jobs", { connection });

export const worker = new Worker(
  "rpa-jobs",
  async (job) => {
    if (!job.id) throw new Error("Job id undefined");
    try {
      const result = await performSiteTask(job.data);
      await prisma.jobLog.create({
        data: {
          jobId: job.id.toString(),
          status: "SUCCESS",
          message: JSON.stringify(result),
        },
      });
      return result;
    } catch (err: any) {
      await prisma.jobLog.create({
        data: {
          jobId: job.id.toString(),
          status: "FAILED",
          message: (err as Error).message,
          retries: job.attemptsMade ?? 0,
        },
      });
      throw err;
    }
  },
  { connection, concurrency: Number(process.env.WORKER_CONCURRENCY || 1) }
);
