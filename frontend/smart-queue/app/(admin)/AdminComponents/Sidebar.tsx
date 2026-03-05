"use client";
import React, { useEffect, useState } from "react";
import Menu from "@/lib/menu";
import Link from "next/link";
import { ListStart } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const [Role, SetRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    SetRole(storedRole);
  }, []);

  const menu = Menu(Role || ""); // Pass role to get the correct menu

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 h-20 border-b border-gray-200">
        <ListStart className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-800">Qly</span>
      </div>

      {/* Menu */}
      <aside className="flex-1 overflow-y-auto mt-4 px-2">
        {menu.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="px-4 text-gray-400 uppercase text-xs font-semibold mb-2">
              {section.title}
            </div>

            <div className="flex flex-col">
              {section.options.map((option) => {
                const Icon = option.icon;
                const isActive = pathname === option.path;

                // If the option has an action (like Logout), render a button
                if (option.action) {
                  return (
                    <button
                      key={option.name}
                      onClick={option.action}
                      className="flex items-center gap-3 px-4 py-2 cursor-pointer rounded-md transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{option.name}</span>
                    </button>
                  );
                }

                // Otherwise, render a Link
                return (
                  <div key={option.name} className="Links py-1">
                    <Link
                      href={option.path || "#"}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        isActive ? "bg-blue-50 text-blue-600 font-medium" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{option.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
};

export default Sidebar;
