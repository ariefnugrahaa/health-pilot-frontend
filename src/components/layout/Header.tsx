"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/core/stores/auth.store";
import { Logo } from "@/components/brand/Logo";
import {
  User,
  LogOut,
  Settings,
  FileText,
  History,
  ChevronDown,
  Activity,
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    setShowDropdown(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-[#14b8a6] rounded-full flex items-center justify-center mr-3">
                <Activity className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">HEALTH PILOT</h1>
                <p className="text-xs text-gray-500">Guidance you can act on.</p>
              </div>
            </Link>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <div className="w-8 h-8 bg-[#14b8a6]/10 rounded-full flex items-center justify-center">
                  <User className="text-[#14b8a6] w-4 h-4" />
                </div>
                <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link
                    href="/health-reports"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FileText className="mr-3 w-4 h-4 text-gray-500" />
                    Health Reports
                  </Link>
                  <Link
                    href="/health-history"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <History className="mr-3 w-4 h-4 text-gray-500" />
                    Health History
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="mr-3 w-4 h-4 text-gray-500" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    <LogOut className="mr-3 w-4 h-4 text-gray-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[#14b8a6] hover:text-[#0d9488] font-medium text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
