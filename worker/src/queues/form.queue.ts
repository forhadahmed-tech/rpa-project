import { redisConnection } from "../../../libs/redis/redis.js"
import { Queue } from "bullmq";

export const formQueue = new Queue("formQueue", {
  connection: redisConnection,
});
