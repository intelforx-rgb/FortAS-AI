import React from 'react';
import { Menu, X, Factory, User, Moon, Sun, Crown, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { UserRole } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  selectedRole: UserRole | 'General AI';
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen, selectedRole, onOpenProfile }) => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const isPremium = user?.membershipType === 'Premium';

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile/Tablet Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="text-gray-700 dark:text-gray-300" size={24} />
            ) : (
              <Menu className="text-gray-700 dark:text-gray-300" size={24} />
            )}
          </button>

          {/* App Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <Factory className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FortAS AI</h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                {selectedRole} Expert
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="text-yellow-500" size={20} />
            ) : (
              <Moon className="text-gray-600" size={20} />
            )}
          </button>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="text-right hidden md:block">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.fullName}
                    </span>
                    {isPremium && <Crown className="text-yellow-500" size={14} />}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {isPremium ? 'Premium' : 'Free'} Member
                  </span>
                </div>
                <button
                  onClick={onOpenProfile}
                  className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center hover:shadow-lg transition-all"
                >
                  <User className="text-white" size={16} />
                  {isPremium && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown className="text-white" size={8} />
                    </div>
                  )}
                </button>
            {/* User Info */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white hidden md:inline">
                  {user.fullName}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <User className="text-white" size={16} />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white hidden md:inline">
                  Guest
                </span>
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    src="/untitled (10).jpeg" 
                    alt="Guest User"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};