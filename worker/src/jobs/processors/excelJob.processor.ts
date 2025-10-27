import { runMockAutomation } from "../automation/mockAutomation.js";

export const excelProcessor = async (job: any) => {
  await runMockAutomation(job.data);
};
