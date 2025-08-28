import React, { useState } from 'react';
import { User, Settings, Crown, BarChart3, FileText, MessageSquare, X, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, upgradeToPremium, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    preferredRole: user?.preferredRole || 'Operations'
  });

  if (!isOpen || !user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleUpgrade = async () => {
    const success = await upgradeToPremium();
    if (success) {
      setShowUpgradeModal(false);
    }
  };

  const isPremium = user.membershipType === 'Premium';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                {isPremium && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="text-white" size={12} />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {user.fullName}
                  {isPremium && <Crown className="text-yellow-500" size={20} />}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isPremium ? 'Premium Member' : 'Free Member'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="text-gray-500" size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'activity', label: 'Activity', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Membership Status */}
                <div className={`p-4 rounded-xl border-2 ${
                  isPremium 
                    ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-bold ${isPremium ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-800 dark:text-gray-200'}`}>
                        {isPremium ? '👑 Premium Member' : '🆓 Free Member'}
                      </h3>
                      <p className={`text-sm ${isPremium ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {isPremium 
                          ? 'Full access to all AI features & file uploads'
                          : 'Limited to text chat with structured responses'
                        }
                      </p>
                    </div>
                    {!isPremium && (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>
                    <button
                      onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isEditing ? <Save size={16} /> : <Settings size={16} />}
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Mobile
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Role
                      </label>
                      <select
                        name="preferredRole"
                        value={formData.preferredRole}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="Operations">Operations & Maintenance</option>
                        <option value="Project Management">Project Management</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                        <option value="Procurement">Procurement & Supply Chain</option>
                        <option value="Erection & Commissioning">Erection & Commissioning</option>
                        <option value="Engineering & Design">Engineering & Design</option>
                        {isPremium && <option value="General AI">General AI Assistant</option>}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activity Dashboard</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="text-blue-600 dark:text-blue-400" size={20} />
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total Chats</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {user.activityStats?.totalChats || 0}
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="text-green-600 dark:text-green-400" size={20} />
                      <span className="text-sm font-semibold text-green-800 dark:text-green-200">Files Uploaded</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {user.activityStats?.filesUploaded || 0}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="text-purple-600 dark:text-purple-400" size={20} />
                      <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Reports Generated</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {user.activityStats?.reportsGenerated || 0}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><span className="font-semibold">Member since:</span> {user.registrationDate.toLocaleDateString()}</p>
                    <p><span className="font-semibold">Last login:</span> {user.lastLoginDate?.toLocaleDateString() || 'Never'}</p>
                    <p><span className="font-semibold">Membership:</span> {user.membershipType}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Account Settings</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Security</h4>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Remember login session</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Auto-logout after inactivity</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upgrade to Premium</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Unlock advanced AI features, file uploads, and detailed reports
              </p>
              
              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Upload PDFs, Images, Excel files</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Advanced AI agent responses</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Generate detailed reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Priority server response</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpgrade}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Upgrading...' : 'Upgrade Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};