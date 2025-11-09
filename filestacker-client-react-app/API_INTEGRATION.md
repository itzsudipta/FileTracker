# Frontend API Integration Guide

## 📁 Service Files Created

All API services are located in `src/services/`:

```
src/services/
├── api.ts            # Base API configuration
├── fileService.ts    # File operations
├── authService.ts    # Authentication
├── userService.ts    # User profile
├── systemService.ts  # Stats & settings
└── index.ts          # Export all services
```

## 🔌 How to Use in Components

### Import Services

```typescript
import { fileService, authService, userService, systemService } from '../services';
```

---

## 📋 Usage Examples

### 1. File Operations

```typescript
// Fetch all files
const files = await fileService.getFiles();

// Search files
const results = await fileService.getFiles('document');

// Get single file
const file = await fileService.getFileById('file-uuid');

// Upload file
const result = await fileService.uploadFile(file, 'user-uuid');

// Delete file
await fileService.deleteFile('file-uuid');

// Update file metadata
await fileService.updateFileTags('file-uuid', 'newname.pdf');
```

### 2. Authentication

```typescript
// Register
const result = await authService.register({
    user_name: 'John Doe',
    user_email: 'john@example.com',
    password: 'password123'
});

// Login
const loginResult = await authService.login({
    user_email: 'john@example.com',
    password: 'password123'
});

// Save token
localStorage.setItem('userId', loginResult.user_id);
localStorage.setItem('token', loginResult.token);

// Logout
await authService.logout();
```

### 3. User Profile

```typescript
// Get user profile
const userId = localStorage.getItem('userId');
const profile = await userService.getUserProfile(userId);
```

### 4. Dashboard Stats

```typescript
// Get statistics
const stats = await systemService.getStats();
console.log(stats.total_files);
console.log(stats.storage_used);
```

### 5. Settings

```typescript
// Get settings
const settings = await systemService.getSettings(userId);

// Update settings
await systemService.updateSettings(userId, {
    theme: 'dark',
    notifications: true
});
```

---

## 🎯 Real Component Example

```typescript
import { useState, useEffect } from 'react';
import { fileService } from '../services';

export const FilesPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    const loadFiles = async () => {
        setLoading(true);
        try {
            const data = await fileService.getFiles();
            setFiles(data);
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (fileId: string) => {
        try {
            await fileService.deleteFile(fileId);
            loadFiles(); // Refresh list
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <div>
            {loading ? <p>Loading...</p> : (
                <ul>
                    {files.map((file: any) => (
                        <li key={file.file_id}>
                            {file.filename}
                            <button onClick={() => handleDelete(file.file_id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
```

---

## ⚙️ Configuration

Update API URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://127.0.0.1:8000'; // Change for production
```

---

## 🚀 Quick Start

1. **Start Backend:**
   ```bash
   cd app
   uvicorn main:app --reload
   ```

2. **Start Frontend:**
   ```bash
   cd filestacker-client-react-app
   npm run dev
   ```

3. **Use in Components:**
   ```typescript
   import { fileService } from '../services';
   
   const files = await fileService.getFiles();
   ```

---

## ✅ All Available Methods

| Service | Method | Route |
|---------|--------|-------|
| `fileService.getFiles()` | GET | `/api/files` |
| `fileService.getFileById(id)` | GET | `/api/files/{id}` |
| `fileService.uploadFile(file, ownerId)` | POST | `/api/files/upload` |
| `fileService.downloadFile(id)` | GET | `/api/files/{id}/download` |
| `fileService.deleteFile(id)` | DELETE | `/api/files/{id}` |
| `fileService.updateFileTags(id, name)` | PATCH | `/api/files/{id}/tags` |
| `authService.register(data)` | POST | `/api/auth/register` |
| `authService.login(credentials)` | POST | `/api/auth/login` |
| `authService.logout()` | POST | `/api/auth/logout` |
| `userService.getUserProfile(id)` | GET | `/api/user/me` |
| `systemService.getStats()` | GET | `/api/stats` |
| `systemService.getSettings(id)` | GET | `/api/settings` |
| `systemService.updateSettings(id, settings)` | PUT | `/api/settings` |
