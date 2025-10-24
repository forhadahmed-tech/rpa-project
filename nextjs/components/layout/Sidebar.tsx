"use client";

import React, { useState } from "react";
import { ChevronDownIcon, LayoutDashboard, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  link: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    link: "/dashboard",
  },
  {
    label: "Export",
    icon: <Upload className="w-5 h-5" />,
    link: "/export",
  },
  // {
  //   label: 'Video Generation',
  //   icon: <VideoIcon className="w-5 h-5" />,
  //   children: [
  //     {
  //       label: 'Create New',
  //       icon: <PlusIcon className="w-4 h-4" />,
  //       children: [
  //         {
  //           label: 'Text to Video',
  //           icon: <TextModeIcon className="w-4 h-4" />,
  //         },
  //         {
  //           label: 'Frames to Video',
  //           icon: <FramesModeIcon className="w-4 h-4" />,
  //         },
  //         {
  //           label: 'References to Video',
  //           icon: <ReferencesModeIcon className="w-4 h-4" />,
  //         },
  //         {label: 'Extend Video', icon: <FilmIcon className="w-4 h-4" />},
  //       ],
  //     },
  //     {label: 'My Projects', icon: <ProjectsIcon className="w-4 h-4" />},
  //     {label: 'Templates', icon: <TemplatesIcon className="w-4 h-4" />},
  //   ],
  // },
  // {
  //   label: 'Media Library',
  //   icon: <MediaLibraryIcon className="w-5 h-5" />,
  // },
  // {
  //   label: 'Settings',
  //   icon: <SettingsIcon className="w-5 h-5" />,
  //   children: [
  //     {label: 'Account', icon: <UserIcon className="w-4 h-4" />},
  //     {label: 'Billing', icon: <BillingIcon className="w-4 h-4" />},
  //     {label: 'API Keys', icon: <KeyIcon className="w-4 h-4" />},
  //   ],
  // },
];

const MenuItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else if (item.link) {
      router.push(item.link);
    }
  };

  const paddingLeft = 0.5 + level * 1.25;

  return (
    <li>
      <a
        href={item?.link}
        onClick={handleToggle}
        className={`flex items-center justify-between p-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer`}
        style={{ paddingLeft: `${paddingLeft}rem` }}
      >
        <div className="flex items-center gap-3">
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {hasChildren && (
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        )}
      </a>
      {isExpanded && hasChildren && item.children && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child) => (
            <MenuItem key={child.label} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#0A1629] shrink-0 p-4 border-r border-gray-800 flex flex-col">
      <div className="px-2 mb-6">
        <h1 className="text-2xl font-semibold tracking-wide bg-linear-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          RPA-Automation
        </h1>
      </div>
      <nav className="grow">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        {/* Placeholder for user profile or footer links */}
      </div>
    </aside>
  );
};

export default Sidebar;
