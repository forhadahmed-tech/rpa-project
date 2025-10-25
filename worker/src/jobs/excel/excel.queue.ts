import { Queue } from "bullmq";
import { redisConnection } from "../../utils/redis.js";

export const excelQueue = new Queue("excelQueue", {
  connection: redisConnection,
});
