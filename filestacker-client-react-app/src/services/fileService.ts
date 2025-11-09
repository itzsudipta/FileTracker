import { api } from './api';

// File API Service
export const fileService = {
    // 1. GET /api/files - Fetch all files with search/filter
    getFiles: async (search?: string) => {
        const query = search ? `?search=${encodeURIComponent(search)}` : '';
        return api.request(`/api/files${query}`);
    },

    // 2. GET /api/files/:id - Get file metadata
    getFileById: async (fileId: string) => {
        return api.request(`/api/files/${fileId}`);
    },

    // 3. POST /api/files/upload - Upload file
    uploadFile: async (file: File, ownerId: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${api.baseURL}/api/files/upload?owner_id=${ownerId}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    // 4. GET /api/files/:id/download - Download file
    downloadFile: async (fileId: string) => {
        const response = await fetch(`${api.baseURL}/api/files/${fileId}/download`);
        if (!response.ok) {
            throw new Error('Download failed');
        }
        return response.json();
    },

    // 5. DELETE /api/files/:id - Delete file
    deleteFile: async (fileId: string) => {
        return api.request(`/api/files/${fileId}`, {
            method: 'DELETE',
        });
    },

    // 6. PATCH /api/files/:id/tags - Update file metadata
    updateFileTags: async (fileId: string, filename?: string) => {
        const query = filename ? `?filename=${encodeURIComponent(filename)}` : '';
        return api.request(`/api/files/${fileId}/tags${query}`, {
            method: 'PATCH',
        });
    },
};
