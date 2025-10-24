import { AutomationMetrics } from "../../../components/dashboard/AutomationMetrics";
import MonthlyAutomationChart from "../../../components/dashboard/MonthlyAutomationChart";

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <AutomationMetrics />
        <MonthlyAutomationChart />
      </div>
    </div>
  );
}
