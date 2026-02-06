const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {})
        }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export async function apiFetchForm<T>(path: string, body: FormData): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        body,
        credentials: 'include'
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
}
