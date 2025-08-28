import React from 'react';
import { Menu, User, Sun, Moon, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  selectedRole: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  selectedRole: string;
  onProfileClick?: () => void;
}

export default function Header({ onMenuClick, selectedRole, onProfileClick }: HeaderProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              FortAS AI
              {selectedRole && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {selectedRole}
                </span>
              )}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onProfileClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="relative">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  {user.membershipType === 'Premium' && (
                    <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.fullName}
                </span>
              </button>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}