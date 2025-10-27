import { runInvoiceAutomation } from "../automation/invoiceAutomation.js";

export const invoiceProcessor = async (job: any) => {
  console.log(`📦 Downloading invoice Job #${job.id}`);
  await runInvoiceAutomation(job.data);
};