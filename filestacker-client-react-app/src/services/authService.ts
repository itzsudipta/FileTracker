import { api } from './api';
import { setSession, clearSession } from '../utils/sessionManager';

// Authentication API Service
export const authService = {
    // 7. POST /api/auth/register - Register new user
    register: async (userData: {
        user_name: string;
        user_email: string;
        password: string;
    }) => {
        const query = new URLSearchParams({
            user_name: userData.user_name,
            user_email: userData.user_email,
            password: userData.password,
        }).toString();

        const response = await api.request(`/api/auth/register?${query}`, {
            method: 'POST',
        });

        // Store session in cookies after successful registration (only if no error)
        if (response && !response.error && response.user_id) {
            setSession({
                user_id: response.user_id,
                email: response.user_email || userData.user_email,
                name: response.user_name || userData.user_name,
                token: response.token || 'mock-token', // Use actual token from backend
            });
        }

        return response;
    },

    // 8. POST /api/auth/login - User login
    login: async (credentials: {
        user_email: string;
        password: string;
    }) => {
        const query = new URLSearchParams({
            user_email: credentials.user_email,
            password: credentials.password,
        }).toString();

        const response = await api.request(`/api/auth/login?${query}`, {
            method: 'POST',
        });

        // Store session in cookies after successful login (only if no error)
        if (response && !response.error && response.user_id) {
            setSession({
                user_id: response.user_id,
                email: response.user_email || credentials.user_email,
                name: response.user_name || credentials.user_email.split('@')[0],
                token: response.token || 'mock-token', // Use actual token from backend
            });
        }

        return response;
    },

    // 9. POST /api/auth/logout - User logout
    logout: async () => {
        const response = await api.request('/api/auth/logout', {
            method: 'POST',
        });

        // Clear session cookies on logout
        clearSession();

        return response;
    },
};
