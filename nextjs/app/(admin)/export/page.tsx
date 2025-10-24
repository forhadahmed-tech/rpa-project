"use client"

import { useRouter } from "next/navigation";

const ServiceCards = () => {
  const router = useRouter();
  const services = [
    {
      id: 1,
      title: "FCR Extraction",
      description: "FCR Extraction",
      status: "Active",
      icon: "📄",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      link: "/export/fcr-extraction",
    },
    {
      id: 2,
      title: "Bill Of Export (Soft Copy)",
      description: "Bill Of Export (Soft Copy)",
      status: "Inactive",
      icon: "📄",
      bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
    },
    {
      id: 3,
      title: "E-Invoice Extraction From Excel File",
      description: "E-Invoice Extraction From Excel File",
      status: "Inactive",
      icon: "🧾",
      bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
    },
    {
      id: 4,
      title: "PDF Combiner",
      description: "pdf combiner",
      status: "Inactive",
      icon: "📊",
      bgColor: "bg-gradient-to-r from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Export Services-Data Processing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Professional document processing and data extraction services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`rounded-xl shadow-lg overflow-hidden border ${service.borderColor} ${service.bgColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{service.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {service.title}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      service.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {service.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Status:</span>
                    <div className="flex items-center">
                      <span
                        className={`h-2 w-2 rounded-full mr-1 ${
                          service.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-700">
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors cursor-pointer ${
                      service.status === "Active"
                        ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        : "bg-gray-400 hover:bg-gray-500 focus:ring-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    onClick={() => router.push(`${service.link}`)}
                  >
                    View Details
                    <svg
                      className="ml-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
