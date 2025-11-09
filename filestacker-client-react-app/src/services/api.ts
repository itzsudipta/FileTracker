// API Base Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = {
    baseURL: API_BASE_URL,

    // Helper function for making requests
    request: async (endpoint: string, options: RequestInit = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },
};
