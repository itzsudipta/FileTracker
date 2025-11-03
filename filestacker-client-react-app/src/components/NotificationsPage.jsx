import React, { useState } from 'react';
import { Bell, Check, Trash2, Upload, Download, AlertCircle, Info, CheckCircle } from 'lucide-react';

export const NotificationsPage = ({ darkMode }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'File uploaded successfully',
            message: 'project-proposal.pdf has been uploaded',
            time: '2 minutes ago',
            read: false,
            icon: <Upload size={20} />,
        },
        {
            id: 2,
            type: 'info',
            title: 'Storage usage update',
            message: 'You are using 24% of your storage',
            time: '1 hour ago',
            read: false,
            icon: <Info size={20} />,
        },
        {
            id: 3,
            type: 'success',
            title: 'File downloaded',
            message: 'report-2024.docx was downloaded',
            time: '3 hours ago',
            read: true,
            icon: <Download size={20} />,
        },
        {
            id: 4,
            type: 'warning',
            title: 'Storage almost full',
            message: 'Your storage is 85% full. Consider upgrading.',
            time: '1 day ago',
            read: true,
            icon: <AlertCircle size={20} />,
        },
        {
            id: 5,
            type: 'success',
            title: 'Files backed up',
            message: '15 files have been successfully backed up',
            time: '2 days ago',
            read: true,
            icon: <CheckCircle size={20} />,
        },
    ]);

    const [filter, setFilter] = useState('all');

    const markAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIconColor = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'error':
                return 'text-red-500';
            case 'info':
            default:
                return 'text-blue-500';
        }
    };

    const getBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return darkMode ? 'bg-green-900/20' : 'bg-green-100';
            case 'warning':
                return darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100';
            case 'error':
                return darkMode ? 'bg-red-900/20' : 'bg-red-100';
            case 'info':
            default:
                return darkMode ? 'bg-blue-900/20' : 'bg-blue-100';
        }
    };

    return (
        <div className={`${darkMode ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen`}>
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Bell size={32} className="text-blue-500" />
                            <h1 className="text-3xl font-bold">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={markAllAsRead}
                                className={`px-4 py-2 rounded-lg transition ${darkMode
                                        ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                                        : 'bg-white hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Check size={18} className="inline mr-2" />
                                Mark all as read
                            </button>
                            <button
                                onClick={clearAll}
                                className={`px-4 py-2 rounded-lg transition ${darkMode
                                        ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                                    }`}
                            >
                                <Trash2 size={18} className="inline mr-2" />
                                Clear all
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'all'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : darkMode
                                        ? 'bg-slate-800 text-gray-400 hover:text-gray-100'
                                        : 'bg-white text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'unread'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                    : darkMode
                                        ? 'bg-slate-800 text-gray-400 hover:text-gray-100'
                                        : 'bg-white text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-xl p-12 text-center`}>
                            <Bell size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No notifications to display
                            </p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`${darkMode ? 'bg-slate-900' : 'bg-white'} rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${!notification.read ? 'border-l-4 border-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`p-3 rounded-full ${getBackgroundColor(notification.type)}`}>
                                        <span className={getIconColor(notification.type)}>
                                            {notification.icon}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className={`font-semibold ${!notification.read ? 'text-blue-500' : ''}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {notification.time}
                                            </span>
                                            <div className="flex gap-2">
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className={`text-xs px-3 py-1 rounded-lg transition ${darkMode
                                                                ? 'bg-slate-800 hover:bg-slate-700 text-gray-300'
                                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                            }`}
                                                    >
                                                        Mark as read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className={`text-xs px-3 py-1 rounded-lg transition ${darkMode
                                                            ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400'
                                                            : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
