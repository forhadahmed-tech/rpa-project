import { redisConnection } from "../../../libs/redis/redis.js"
import { Queue } from "bullmq";

export const mockQueue = new Queue("mockQueue", {
  connection: redisConnection,
});
