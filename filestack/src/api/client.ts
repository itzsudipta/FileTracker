const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getErrorMessageFromBody(bodyText: string, status: number): string {
    if (!bodyText) return `Request failed: ${status}`;

    try {
        const parsed = JSON.parse(bodyText) as { detail?: unknown; message?: unknown; error?: unknown };
        const candidate = parsed.detail ?? parsed.message ?? parsed.error;

        if (typeof candidate === 'string' && candidate.trim()) {
            return candidate;
        }

        if (Array.isArray(candidate)) {
            const flat = candidate
                .map((item) => {
                    if (typeof item === 'string') return item;
                    if (item && typeof item === 'object' && 'msg' in item && typeof (item as { msg?: unknown }).msg === 'string') {
                        return (item as { msg: string }).msg;
                    }
                    return '';
                })
                .filter(Boolean)
                .join(', ');
            if (flat) return flat;
        }
    } catch {
        // Non-JSON body; fall through to plain text.
    }

    return bodyText.trim() || `Request failed: ${status}`;
}

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
        throw new Error(getErrorMessageFromBody(text, res.status));
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
        throw new Error(getErrorMessageFromBody(text, res.status));
    }

    return res.json() as Promise<T>;
}

interface UploadFileOptions {
    onProgress?: (loaded: number, total: number) => void;
}

export function apiUploadFile<T>(
    path: string,
    body: FormData,
    options: UploadFileOptions = {}
): Promise<T> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}${path}`);
        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
            if (!event.lengthComputable || !options.onProgress) return;
            options.onProgress(event.loaded, event.total);
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText) as T);
                } catch {
                    reject(new Error('Invalid JSON response from server'));
                }
                return;
            }
            reject(new Error(getErrorMessageFromBody(xhr.responseText, xhr.status)));
        };

        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(body);
    });
}
