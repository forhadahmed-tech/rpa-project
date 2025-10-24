"use client"

import { ArrowUpDownIcon, BellIcon, MessageSquareIcon, MoreHorizontalIcon, SearchIcon, UploadIcon } from 'lucide-react';

const employees = [
  { name: 'Jacob Jones', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Active' },
  { name: 'Darlene Robertson', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Active' },
  { name: 'Bessie Cooper', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: '3 selected', status: 'Active' },
  { name: 'Jerome Bell', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Active' },
  { name: 'Marvin McKinney', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Active' },
  { name: 'Arlene McCoy', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: '3 selected', status: 'Active' },
  { name: 'Albert Flores', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Inactive' },
  { name: 'Esther Howard', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Inactive' },
  { name: 'Cody Fisher', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: '3 selected', status: 'Inactive' },
  { name: 'Ralph Edwards', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: 'Miami Hospital', status: 'Inactive' },
  { name: 'Dianne Russell', specialty: 'Emergency room', type: 'Full-time', hireDate: 'Jun 25, 2024', floatPools: 3, preferredUnits: '3 selected', status: 'Active' },
];

const getInitials = (name) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0]?.[0]?.toUpperCase() || '';
};

const avatarColors = ['bg-blue-100 text-blue-800', 'bg-purple-100 text-purple-800', 'bg-green-100 text-green-800', 'bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800', 'bg-indigo-100 text-indigo-800', 'bg-pink-100 text-pink-800'];

const Avatar = ({ name }) => {
  const colorClass = avatarColors[name.length % avatarColors.length];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${colorClass}`}>
      {getInitials(name)}
    </div>
  );
}

const StatusPill = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  const statusClasses = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-red-100 text-red-700',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
}



const EmployeesPage = ({ onImportClick }) => {
  return (
    <div className="flex-1 flex flex-col bg-[#f7f8fa] overflow-hidden">
        <div className="p-6 flex-1 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Search for keywords" className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        </div>
                        <button onClick={onImportClick} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-semibold">
                            <UploadIcon className="w-5 h-5" />
                            <span>Import</span>
                        </button>
                        <button className="px-4 py-2 bg-[#0075FF] text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">New</button>
                        <span className="text-sm text-gray-500">Result: {employees.length} pools</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                      <thead>
                          <tr className="border-b border-gray-200 text-gray-500 font-medium">
                              {/* <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th> */}
                              <th className="p-4"><div className="flex items-center cursor-pointer">Employee name <ArrowUpDownIcon className="w-4 h-4 ml-1 opacity-50"/></div></th>
                              <th className="p-4">Specialty</th>
                              <th className="p-4">Employee Type</th>
                              <th className="p-4">Hire Date</th>
                              <th className="p-4">Float Pools</th>
                              <th className="p-4">Preferred Units</th>
                              <th className="p-4">Pool Status</th>
                              <th className="p-4">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {employees.map((employee, index) => (
                              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                  {/* <td className="p-4"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td> */}
                                  <td className="p-4">
                                      <div className="flex items-center space-x-3">
                                          <Avatar name={employee.name} />
                                          <span className="font-medium text-gray-900">{employee.name}</span>
                                      </div>
                                  </td>
                                  <td className="p-4 text-gray-600">{employee.specialty}</td>
                                  <td className="p-4 text-gray-600">{employee.type}</td>
                                  <td className="p-4 text-gray-600">{employee.hireDate}</td>
                                  <td className="p-4 text-gray-600">{employee.floatPools}</td>
                                  <td className="p-4 text-gray-600">{employee.preferredUnits}</td>
                                  <td className="p-4"><StatusPill status={employee.status} /></td>
                                  <td className="p-4"><button className="text-gray-500 hover:text-gray-700"><MoreHorizontalIcon /></button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EmployeesPage;