import { api } from './api';

// User API Service
export const userService = {
    // 10. GET /api/user/me - Get user profile
    getUserProfile: async (userId: string) => {
        return api.request(`/api/user/me?user_id=${userId}`);
    },
};
