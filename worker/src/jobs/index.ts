import { Worker } from "bullmq";
import { excelProcessor } from "./processors/excelJob.processor.js";
import { invoiceProcessor } from "./processors/invoice.processor.js";
import { formProcessor } from "./processors/form.processor.js";
import { redisConnection } from "../../../libs/redis/redis.js";
import logger from "../utils/logger.js";

const workers = [
  new Worker("excelQueue", excelProcessor, {
    connection: redisConnection,
    concurrency: 3,
  }),
  new Worker("formQueue", formProcessor, {
    connection: redisConnection,
    concurrency: 3,
  }),
  new Worker("invoiceQueue", invoiceProcessor, {
    connection: redisConnection,
    concurrency: 2,
  }),
];

workers.forEach((w) => {
  w.on("completed", (job) => logger.info(`✅ [${job.name}] Job ${job.id} done`));
  w.on("failed", (job, err) =>
    logger.error(`❌ [${job?.name}] Job ${job?.id} failed: ${err.message}`)
  );
});

export default workers;
