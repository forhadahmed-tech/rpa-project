import { Queue } from "bullmq";
import { redisConnection } from "../../../../libs/redis/redis.js";

export const excelQueue = new Queue("excelQueue", {
  connection: redisConnection,
});
