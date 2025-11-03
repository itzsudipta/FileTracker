import React from 'react';
import { Home, Upload, Folder, Moon, Sun, LogOut, User, Settings, Bell } from 'lucide-react';
import { NavItem } from './NavItem.jsx';

export const Sidebar = ({ currentPage, setCurrentPage, darkMode, toggleDarkMode, user, onLogout, notificationCount }) => {
    const navItems = [
        { label: 'Dashboard', icon: <Home size={20} />, page: 'dashboard' },
        { label: 'Upload', icon: <Upload size={20} />, page: 'upload' },
        { label: 'Files', icon: <Folder size={20} />, page: 'files' },
        { label: 'Notifications', icon: <Bell size={20} />, page: 'notifications', badge: notificationCount },
        { label: 'Settings', icon: <Settings size={20} />, page: 'settings' },
    ];

    return (
        <div className={`${darkMode ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-800'} w-64 min-h-screen p-5 border-r flex flex-col`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    FileStacker
                </h1>
            </div>

            {/* User Profile */}
            {user && (
                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {user.name}
                            </p>
                            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="space-y-2 flex-1">{navItems.map((item) => (
                <NavItem
                    key={item.page}
                    icon={item.icon}
                    label={item.label}
                    active={currentPage === item.page}
                    onClick={() => setCurrentPage(item.page)}
                    darkMode={darkMode}
                    badge={item.badge}
                />
            ))}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${darkMode
                        ? 'text-gray-400 hover:bg-slate-800 hover:text-gray-100'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                >
                    <span className="w-5 h-5 flex items-center justify-center">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </span>
                    <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${darkMode
                        ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                        : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                >
                    <span className="w-5 h-5 flex items-center justify-center">
                        <LogOut size={20} />
                    </span>
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};
