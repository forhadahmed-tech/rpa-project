import { BellIcon, MessageSquareIcon } from "lucide-react";

const Header = () => (
  <header className="flex items-center justify-end p-4 bg-white border-b border-gray-200">
    <div className="flex items-center space-x-4">
      <button className="relative p-2 text-gray-500 hover:text-gray-700">
        <BellIcon className="w-6 h-6" />
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white"></span>
        </span>
      </button>
      <button className="relative p-2 text-gray-500 hover:text-gray-700">
        <MessageSquareIcon className="w-6 h-6" />
        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-1 ring-white"></span>
        </span>
      </button>
      <div className="w-px h-8 bg-gray-200"></div>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
          PS
        </div>
        <div>
          <div className="font-semibold text-sm">Pawel Samuczuk</div>
          <div className="text-xs text-gray-500">Super Admin</div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;