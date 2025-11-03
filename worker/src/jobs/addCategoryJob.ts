import { redisConnection } from "../../../libs/redis/redis.js";
import { Queue } from "bullmq";

const categoryQueue = new Queue("categoryQueue", {
  connection: redisConnection,
});

async function addJob() {
  await categoryQueue.add("createCategory", {
    title: "New Category",
    slug: "new-category",
    type: "product",
  });
  console.log("Job added to categoryQueue!");
}

addJob();
