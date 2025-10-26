import { Worker } from "bullmq";
import { excelProcessor } from "./excelJob.processor.js";
import { redisConnection } from "../../../libs/redis/redis.js";
import logger from "../utils/logger.js";

const workers = [
  new Worker("excelQueue", excelProcessor, {
    connection: redisConnection,
    concurrency: 3,
  }),
];

workers.forEach((w) => {
  w.on("completed", (job) => logger.info(`✅ [${job.name}] Job ${job.id} done`));
  w.on("failed", (job, err) =>
    logger.error(`❌ [${job?.name}] Job ${job?.id} failed: ${err.message}`)
  );
});

export default workers;
