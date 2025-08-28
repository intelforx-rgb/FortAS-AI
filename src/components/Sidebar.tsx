import React, { useState } from 'react';
import { Factory, User, LogOut, X, Plus, MessageSquare, Zap } from 'lucide-react';
import { RoleSelector } from './RoleSelector';
import { ChatHistoryList } from './ChatHistoryList';
import { useAuth } from '../contexts/AuthContext';
import { useChatHistory } from '../contexts/ChatHistoryContext';
import type { UserRole, ChatHistory } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
  onLoadChat: (history: ChatHistory) => void;
  onNewChat: () => void;
  messageCount: number;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedRole,
  onRoleChange,
  onLoadChat,
  onNewChat,
  messageCount,
  isLoading
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { histories } = useChatHistory();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onClose();
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative z-50 lg:z-auto
          w-80 h-full
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-700
          flex flex-col shadow-xl lg:shadow-none
          transition-transform duration-300 ease-in-out
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
                <Factory className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">FortAS AI</h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  AI-Driven Engineering
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="text-gray-500 dark:text-gray-400" size={20} />
            </button>
          </div>

          {/* User Profile */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.fullName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Logout"
              >
                <LogOut className="text-gray-400 hover:text-red-500" size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src="/untitled (10).jpeg" 
                  alt="Guest User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Vipul Sharma
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Guest Mode
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Top Section - Roles (50% height) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Select Expertise Area
            </h4>
            <div className="max-h-64 overflow-y-auto">
              <RoleSelector 
                selectedRole={selectedRole}
                onRoleChange={onRoleChange}
              />
            </div>
          </div>

          {/* Bottom Section - Chat History & Stats (50% height) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold"
            >
              <Plus size={16} />
              New Chat
            </button>

            {/* Chat History */}
            {isAuthenticated && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Chat History
                </h4>
                <ChatHistoryList 
                  history={histories}
                  onSelect={(history) => onLoadChat(history)}
                />
              </div>
            )}

            {/* Stats */}
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="text-blue-500" size={14} />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    MESSAGES
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{messageCount}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-yellow-500" size={14} />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    STATUS
                  </span>
                </div>
                <p className={`text-sm font-bold ${isLoading ? 'text-yellow-500' : 'text-green-500'}`}>
                  {isLoading ? 'Processing...' : 'Ready'}
                </p>
              </div>
            </div>

            {/* Guest Mode Notice */}
            {!isAuthenticated && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  GUEST MODE
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Login to save chats & access advanced features
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by <span className="text-blue-600 dark:text-blue-400 font-semibold">AI Technology</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              © 2024 Industrial Plant Expert
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to logout? Your chat history will be preserved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};