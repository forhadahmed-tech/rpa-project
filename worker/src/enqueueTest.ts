import { jobQueue } from "./queue.js";

async function run() {
  const job = await jobQueue.add("test-job", {
    site: "http://10.20.100.16:3080/",
    credentials: { userId: "101897", password: "forhad123" },
    // payload: { text: "Hello World" },
  });
  console.log("Job added:", job.id);
}

run().catch(console.error);
