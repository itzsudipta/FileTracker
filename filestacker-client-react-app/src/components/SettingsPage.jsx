import React, { useState } from 'react';
import { User, Mail, Bell, Lock, Trash2, Shield, Database, Download } from 'lucide-react';

export const SettingsPage = ({ darkMode, user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        uploadNotifications: true,
        storageAlerts: true,
        securityAlerts: true,
    });
    const [storage, setStorage] = useState({
        autoDelete: false,
        autoDeleteDays: 30,
    });

    const handleProfileUpdate = () => {
        onUpdateUser(profile);
        alert('Profile updated successfully!');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'storage', label: 'Storage', icon: <Database size={18} /> },
    ];

    return (
        <div className={`${darkMode ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Tabs */}
                    <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-xl p-4 h-fit min-w-[200px]`}>
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                            : darkMode
                                                ? 'text-gray-400 hover:bg-slate-800 hover:text-gray-100'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className={`flex-1 ${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-xl p-6`}>
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>

                                {/* Avatar */}
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                        <User size={32} className="text-white" />
                                    </div>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                        Change Avatar
                                    </button>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-slate-800 border-slate-700 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-slate-800 border-slate-700 text-gray-100'
                                                : 'bg-white border-gray-300 text-gray-900'
                                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                                    />
                                </div>

                                <button
                                    onClick={handleProfileUpdate}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Notification Preferences</h2>

                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                                        <div>
                                            <p className="font-medium">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </p>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Receive notifications about {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={() => setNotifications({ ...notifications, [key]: !value })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Security Settings</h2>

                                {/* Change Password */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Lock size={20} className="text-blue-500" />
                                        <h3 className="font-medium">Change Password</h3>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                        Update Password
                                    </button>
                                </div>

                                {/* Two-Factor Authentication */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Shield size={20} className="text-green-500" />
                                        <h3 className="font-medium">Two-Factor Authentication</h3>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Add an extra layer of security to your account
                                    </p>
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                        Enable 2FA
                                    </button>
                                </div>

                                {/* Active Sessions */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <h3 className="font-medium mb-3">Active Sessions</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">Current Session - Windows</span>
                                            <span className="text-xs text-green-500">Active Now</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Storage Tab */}
                        {activeTab === 'storage' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold mb-4">Storage Management</h2>

                                {/* Storage Usage */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Database size={20} className="text-purple-500" />
                                        <h3 className="font-medium">Storage Usage</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>2.4 GB used of 10 GB</span>
                                            <span>24%</span>
                                        </div>
                                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Auto Delete */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Trash2 size={20} className="text-red-500" />
                                            <h3 className="font-medium">Auto Delete Old Files</h3>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={storage.autoDelete}
                                                onChange={() => setStorage({ ...storage, autoDelete: !storage.autoDelete })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    {storage.autoDelete && (
                                        <div>
                                            <label className={`block text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Delete files older than (days):
                                            </label>
                                            <input
                                                type="number"
                                                value={storage.autoDeleteDays}
                                                onChange={(e) => setStorage({ ...storage, autoDeleteDays: parseInt(e.target.value) })}
                                                className={`w-32 px-3 py-2 rounded-lg border ${darkMode
                                                        ? 'bg-slate-700 border-slate-600 text-gray-100'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                    } focus:ring-2 focus:ring-blue-500 outline-none`}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Export Data */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Download size={20} className="text-blue-500" />
                                        <h3 className="font-medium">Export Your Data</h3>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Download a copy of all your files and data
                                    </p>
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                        Request Export
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
