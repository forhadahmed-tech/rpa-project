import { Job } from "bullmq";
import logger from "../../utils/logger.js";


export const excelProcessor = async (job: Job) => {
  const row = job.data;
  logger.info(`Processing Excel row ${job.id}`);

  try {
    await fetch("https://thirdparty.example.com/api", {
      method: "POST",
      body: JSON.stringify(row),
      headers: { "Content-Type": "application/json" },
    });

    logger.info(`✅ Completed job ${job.id}`);
    return { success: true };
  } catch (error) {
    logger.error(`❌ Failed job ${job.id}: ${(error as Error).message}`);
    throw error;
  }
};