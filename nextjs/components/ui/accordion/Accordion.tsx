"use client";

import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";

interface AccordionItem {
  title: string;
  content: string;
  nested?: AccordionItem[];
}

interface ServiceCardProps {
  title: string;
  items: AccordionItem[];
}

export const ServiceCard = ({ title, items }: ServiceCardProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [nestedOpen, setNestedOpen] = useState<Record<number, number | null>>({});

  return (
    <div className="flex flex-col w-full md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 gap-4 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
            >
              <span className="font-medium text-gray-800 dark:text-gray-100">{item.title}</span>
              <ChevronRightIcon
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openIndex === index ? "rotate-90" : ""
                }`}
              />
            </button>

            {openIndex === index && item.nested && (
              <div className="flex flex-col bg-gray-100 dark:bg-gray-800/50 p-3 gap-2">
                {item.nested.map((nestedItem, nIndex) => (
                  <div
                    key={nIndex}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200">{nestedItem.title}</span>
                    <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
            )}

            {openIndex === index && !item.nested && (
              <div className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
