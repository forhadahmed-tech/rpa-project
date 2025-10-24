"use client";

import { ArrowDown, ArrowUp, Box, Users } from "lucide-react";
import Badge from "../ui/badge/Badge";

export const AutomationMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric 1 - Customers */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-5 md:p-6 transition-colors duration-300">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100">
          <Users className="size-6 text-gray-800" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Customers</span>
            <h4 className="mt-2 font-semibold text-gray-900 text-lg">3,782</h4>
          </div>
          <Badge>
            <ArrowUp className="size-4" />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Metric 2 - Orders */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-md p-5 md:p-6 transition-colors duration-300">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100">
          <Box className="size-6 text-gray-800" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Orders</span>
            <h4 className="mt-2 font-semibold text-gray-900 text-lg">5,359</h4>
          </div>
          <Badge>
            <ArrowDown className="size-4" />
            9.05%
          </Badge>
        </div>
      </div>
    </div>
  );
};
