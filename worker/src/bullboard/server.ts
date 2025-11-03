// server/bullBoard.js
import Fastify from "fastify";
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter } from "@bull-board/fastify";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { redisConnection } from "../../../libs/redis/redis.js";

// Create queue instance (same name as your worker queue)
export const categoryQueue = new Queue("categoryQueue", { connection: redisConnection });

// Fastify server
const server = Fastify({ logger: true });
const serverAdapter = new FastifyAdapter();

// Create Bull Board
createBullBoard({
  queues: [new BullMQAdapter(categoryQueue)],
  serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");
server.register(serverAdapter.registerPlugin(), { prefix: "/admin/queues" });

// Start server
server.listen({ port: 3030 }, () =>
  console.log("🚀 Bull Board running on http://localhost:3030/admin/queues")
);
