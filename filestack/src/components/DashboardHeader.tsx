import React from 'react';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { UserData } from './Auth';

interface DashboardHeaderProps {
    user: UserData;
    toggleSidebar: () => void;
    sidebarCollapsed: boolean;
    onLogout: () => void;
}

export default function DashboardHeader({
    user,
    toggleSidebar,
    sidebarCollapsed,
    onLogout
}: DashboardHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
            {/* Left side - Menu button and Search */}
            <div className="flex items-center gap-3 flex-1">
                {/* Mobile menu button */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Desktop sidebar toggle */}
                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300"
                >
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Search bar - Responsive */}
                <div className="flex-1 max-w-md hidden sm:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 lg:pl-4 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 lg:h-5 lg:w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search files..."
                            className="w-full pl-9 lg:pl-11 pr-4 py-2 lg:py-2.5 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all duration-300 hover:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Right actions - Responsive */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                {/* Mobile search button */}
                <button className="sm:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>

                {/* User profile - Responsive */}
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                    </div>
                    <div ref={menuRef} className="relative group">
                        <button
                            type="button"
                            onClick={() => setMenuOpen(prev => !prev)}
                            className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-semibold shadow-lg shadow-slate-300/40 cursor-pointer ring-2 ring-white hover:ring-slate-200 transition-all duration-300"
                            aria-expanded={menuOpen}
                            aria-haspopup="true"
                        >
                            {user.user_name.charAt(0).toUpperCase()}
                        </button>

                        {/* Dropdown */}
                        <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-200 transform origin-top-right z-50 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} sm:group-hover:opacity-100 sm:group-hover:visible`}>
                            <div className="p-2">
                                <div className="px-3 py-2 border-b border-slate-50 md:hidden">
                                    <p className="text-sm font-semibold text-slate-800">{user.user_name}</p>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left mt-1"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
