import { runFormAutomation } from "../automation/formAutomation.js";

export const formProcessor = async (job: any) => {
  console.log(`📦 Filling form Job #${job.id}`);
  await runFormAutomation(job.data);
};