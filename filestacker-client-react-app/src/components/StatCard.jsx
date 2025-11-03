import React from 'react';

export const StatCard = ({ icon, label, value, color, cardBg, textPrimary, textSecondary }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        emerald: 'from-emerald-500 to-emerald-600',
    };

    return (
        <div className={`${cardBg} rounded-xl p-6 border border-transparent hover:border-${color}-500/30 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm ${textSecondary} mb-1`}>{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};
