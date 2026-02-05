import React from 'react';
import { Moon, Sun, LogOut, Bell, Search, Settings } from 'lucide-react';
import type { UserData } from './Auth';

interface NavbarProps {
    user: UserData;
    onLogout: () => void;
    darkMode: boolean;
    toggleTheme: () => void;
}

export default function Navbar({ user, onLogout, darkMode, toggleTheme }: NavbarProps) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300">

            {/* Left side - Organization info */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{user.org_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Organization</p>
                        <p className="text-sm font-semibold text-slate-800">{user.org_name}</p>
                    </div>
                </div>
            </div>

            {/* Center - Search (decorative) */}
            <div className="flex-1 max-w-md mx-8 hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search files, folders..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-300 hover:bg-white"
                    />
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-300"
                >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-300">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                {/* Settings */}
                <button className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-300">
                    <Settings className="w-5 h-5" />
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-slate-200 mx-2" />

                {/* User profile section */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                        <p className="text-xs text-slate-500">{user.org_name}</p>
                    </div>

                    {/* Avatar with dropdown */}
                    <div className="relative group">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-slate-300/40 cursor-pointer ring-2 ring-white hover:ring-slate-200 transition-all duration-300">
                            {user.user_name.charAt(0).toUpperCase()}
                        </div>

                        {/* Dropdown menu */}
                        <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right py-2">
                            <div className="px-4 py-3 border-b border-slate-50">
                                <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{user.org_name}</p>
                            </div>

                            <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors text-left">
                                    <Settings className="w-4 h-4" />
                                    Account Settings
                                </button>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Logout button (visible on mobile) */}
                    <button
                        onClick={onLogout}
                        className="sm:hidden p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}