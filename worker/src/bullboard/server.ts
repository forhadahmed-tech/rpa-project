import Fastify from "fastify";
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter } from "@bull-board/fastify";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { formQueue } from "../queues/form.queue.js";
import { invoiceQueue } from "../queues/invoice.queue.js";

const server = Fastify({ logger: true });
const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: [new BullMQAdapter(formQueue), new BullMQAdapter(invoiceQueue)],
  serverAdapter,
});

serverAdapter.setBasePath("/admin/queues");
server.register(serverAdapter.registerPlugin(), { prefix: "/admin/queues" });

server.listen({ port: 3001 }, () =>
  console.log("🚀 Bull Board running on http://localhost:3001/admin/queues")
);
