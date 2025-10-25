import { Redis } from "ioredis";

// Use options object to set maxRetriesPerRequest to null
export const redisConnection = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, // ✅ required for BullMQ
  // Optional: if you want to support REDIS_URL
  ...(process.env.REDIS_URL ? { url: process.env.REDIS_URL } : {}),
});

redisConnection.on("connect", () => console.log("✅ Redis connected"));
redisConnection.on("error", (err) => console.error("❌ Redis error:", err));
