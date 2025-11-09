import { api } from './api';

// System & Analytics API Service
export const systemService = {
    // 11. GET /api/stats - Get dashboard statistics
    getStats: async () => {
        return api.request('/api/stats');
    },

    // 12. GET /api/settings - Get user settings
    getSettings: async (userId: string) => {
        return api.request(`/api/settings?user_id=${userId}`);
    },

    // 12. PUT /api/settings - Update user settings
    updateSettings: async (userId: string, settings: {
        theme?: string;
        notifications?: boolean;
    }) => {
        const query = new URLSearchParams({
            user_id: userId,
            ...(settings.theme && { theme: settings.theme }),
            ...(settings.notifications !== undefined && { notifications: String(settings.notifications) }),
        }).toString();

        return api.request(`/api/settings?${query}`, {
            method: 'PUT',
        });
    },
};
