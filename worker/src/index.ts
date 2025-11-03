import { Worker } from "bullmq";
import { redisConnection } from "../../libs/redis/redis.js";
import { categoryProcessor } from "./processors/category.processor.js";
import logger from "./utils/logger.js";

// Single queue worker
const categoryWorker = new Worker("categoryQueue", categoryProcessor, {
  connection: redisConnection,
  concurrency: 3, // how many jobs can run in parallel
});

// Logging events
categoryWorker.on("completed", (job) =>
  logger.info(`✅ [${job.name}] Job ${job.id} done`)
);

categoryWorker.on("failed", (job, err) =>
  logger.error(`❌ [${job?.name}] Job ${job?.id} failed: ${err.message}`)
);

export default categoryWorker;
