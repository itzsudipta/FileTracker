// Cookie utility functions for session management

interface UserData {
    user_id?: string;
    id?: string;
    email?: string;
    user_email?: string;
    name?: string;
    user_name?: string;
    token?: string;
}

/**
 * Set a cookie with name, value, and optional expiration days
 */
export const setCookie = (name: string, value: string, days: number = 7): void => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    // Remove 'Secure' flag for development (localhost/HTTP)
    // In production with HTTPS, add back: ; Secure
    document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
};

/**
 * Delete a cookie by name
 */
export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

/**
 * Set session data (user info and token) in cookies
 */
export const setSession = (userData: UserData): void => {
    setCookie('userId', userData.user_id || userData.id || '', 7);
    setCookie('userEmail', userData.email || userData.user_email || '', 7);
    setCookie('userName', userData.name || userData.user_name || '', 7);
    setCookie('token', userData.token || '', 7);
};

/**
 * Get session data from cookies
 */
export const getSession = () => {
    const userId = getCookie('userId');
    const userEmail = getCookie('userEmail');
    const userName = getCookie('userName');
    const token = getCookie('token');

    if (userId && userEmail) {
        return {
            id: userId,
            user_id: userId,
            email: userEmail,
            name: userName,
            token: token
        };
    }
    return null;
};

/**
 * Clear session data (logout)
 */
export const clearSession = () => {
    deleteCookie('userId');
    deleteCookie('userEmail');
    deleteCookie('userName');
    deleteCookie('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return getCookie('userId') !== null && getCookie('token') !== null;
};
