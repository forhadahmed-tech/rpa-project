import { runMockAutomation } from "./mockAutomation.js";

export const excelProcessor = async (job: any) => {
  await runMockAutomation(job.data);
};
