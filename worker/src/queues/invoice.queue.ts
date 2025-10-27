import { redisConnection } from "../../../libs/redis/redis.js"
import { Queue } from "bullmq";

export const invoiceQueue = new Queue("invoiceQueue", {
  connection: redisConnection,
});
