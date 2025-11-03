import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-rose-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] animate-slide-in`}>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-80">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
