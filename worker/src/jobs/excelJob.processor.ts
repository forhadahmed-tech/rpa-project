import { runMockAutomation } from "./mockAutomation.js";

export const excelProcessor = async (job: any) => {
  console.log(`📦 Processing Excel Row #${job.id}`);
  await runMockAutomation(job.data);
};
