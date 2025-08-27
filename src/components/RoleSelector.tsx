import React from 'react';
import { Factory, BarChart3, TrendingUp, ShoppingCart, Wrench, Settings, Bot } from 'lucide-react';
import type { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectorProps {
  selectedRole: UserRole | 'General AI';
  onRoleChange: (role: UserRole | 'General AI') => void;
}

const roles: { 
  value: UserRole | 'General AI'; 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  description: string;
  requiresAuth?: boolean;
}[] = [
  { 
    value: 'Operations', 
    label: 'Operations & Maintenance', 
    icon: <Factory size={18} />, 
    color: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    description: 'Industrial machinery troubleshooting & process optimization'
  },
  { 
    value: 'Project Management', 
    label: 'Project Management', 
    icon: <BarChart3 size={18} />, 
    color: 'border-blue-500 bg-blue-50 text-blue-700',
    description: 'Project scheduling & resource planning'
  },
  { 
    value: 'Sales & Marketing', 
    label: 'Sales & Marketing', 
    icon: <TrendingUp size={18} />, 
    color: 'border-green-500 bg-green-50 text-green-700',
    description: 'Industrial market analysis & customer strategies'
  },
  { 
    value: 'Procurement', 
    label: 'Procurement & Supply Chain', 
    icon: <ShoppingCart size={18} />, 
    color: 'border-purple-500 bg-purple-50 text-purple-700',
    description: 'Industrial vendor negotiations & inventory optimization'
  },
  { 
    value: 'Erection & Commissioning', 
    label: 'Erection & Commissioning', 
    icon: <Wrench size={18} />, 
    color: 'border-red-500 bg-red-50 text-red-700',
    description: 'Plant installation sequencing & safety compliance'
  },
  { 
    value: 'Engineering & Design', 
    label: 'Engineering & Design', 
    icon: <Settings size={18} />, 
    color: 'border-orange-500 bg-orange-50 text-orange-700',
    description: 'Industrial process flow design & equipment selection'
  },
  { 
    value: 'General AI', 
    label: 'General AI Assistant', 
    icon: <Bot size={18} />, 
    color: 'border-purple-500 bg-purple-50 text-purple-700',
    description: 'General purpose AI for any questions',
    requiresAuth: true
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-2">
      {roles
        .filter(role => !role.requiresAuth || isAuthenticated)
        .map((role) => (
          <button
            key={role.value}
            onClick={() => onRoleChange(role.value)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 border ${
              selectedRole === role.value
                ? `${role.color} shadow-md`
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <div className={`p-1 rounded ${selectedRole === role.value ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'} flex-shrink-0`}>
              {role.icon}
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className={`font-semibold text-xs ${selectedRole === role.value ? '' : 'text-gray-900 dark:text-white'} truncate`}>
                {role.label}
              </div>
              <div className={`text-xs ${selectedRole === role.value ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'} truncate`}>
                {role.description}
              </div>
            </div>
            {selectedRole === role.value && (
              <div className="w-2 h-2 bg-white rounded-full shadow-lg flex-shrink-0"></div>
            )}
          </button>
        ))}
    </div>
  );
};