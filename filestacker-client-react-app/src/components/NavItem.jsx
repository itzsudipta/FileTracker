import React from 'react';

export const NavItem = ({ icon, label, active, onClick, darkMode, badge }) => {
    const activeClass = active
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        : darkMode
            ? 'text-gray-400 hover:bg-slate-700/50 hover:text-gray-100'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${activeClass}`}
        >
            <div className="flex items-center space-x-3">
                <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
                <span className="font-medium">{label}</span>
            </div>
            {badge > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                    {badge > 9 ? '9+' : badge}
                </span>
            )}
        </button>
    );
};
