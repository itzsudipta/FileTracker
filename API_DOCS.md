# API Docs (Simple Reference)

Base URL (local): `http://localhost:8000`

All endpoints return JSON unless noted.

---

## Auth

### POST `/api/auth/login`
Sign in with email/password. Sets HttpOnly cookies.

Body:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "user_id": "uuid",
    "user_name": "Name",
    "org_id": "uuid",
    "org_name": "Org"
  }
}
```

### POST `/api/auth/register`
Create user + org, then sign in (sets cookies).

Body:
```json
{
  "email": "user@example.com",
  "password": "password",
  "user_name": "Full Name",
  "org_name": "Org Name"
}
```

Response: same shape as login.

### GET `/api/auth/me`
Get current user from cookie session (refreshes tokens if needed).

Response:
```json
{
  "user": {
    "user_id": "uuid",
    "user_name": "Name",
    "org_id": "uuid",
    "org_name": "Org"
  }
}
```

### POST `/api/auth/logout`
Clears auth cookies.

Response:
```json
{ "message": "Logout successful" }
```

---

## Files

### GET `/api/files`
List files for current org (cookie-auth required).

Query params:
`search` (optional): filter by filename (case-insensitive).

Response (array):
```json
[
  {
    "file_id": "uuid",
    "filename": "report.pdf",
    "file_type": "application/pdf",
    "file_size": 12345,
    "uploaded_at": "2026-02-06T12:34:56",
    "storage_path": "org_id/uuid_report.pdf",
    "owner_name": "User Name"
  }
]
```

### GET `/api/files/{file_id}`
Fetch a single file (cookie-auth required).

Response: same shape as list item.

### POST `/api/files/upload`
Upload a file to Supabase Storage + DB (cookie-auth required).

Form-data:
- `file`: binary

Response: same shape as list item.

### GET `/api/files/{file_id}/download`
Get a short-lived signed URL (cookie-auth required).

Response:
```json
{
  "filename": "report.pdf",
  "signed_url": "https://<supabase>/storage/v1/object/sign/..."
}
```

### DELETE `/api/files/{file_id}`
Soft-delete file and delete from storage (cookie-auth required).

Response:
```json
{ "message": "File deleted successfully" }
```

### PATCH `/api/files/{file_id}/tags`
Update filename (cookie-auth required).

Query params:
`filename` (optional)

Response:
```json
{ "message": "File updated successfully", "file": { ... } }
```

---

## User

### GET `/api/user/me`
Get user profile by `user_id` (query param).

Query params:
`user_id` (required UUID)

Response:
```json
{
  "user_id": "uuid",
  "org_id": "uuid",
  "user_name": "Name",
  "user_email": "user@example.com",
  "u_role": "user",
  "joined_at": "...",
  "is_active": true
}
```

---

## System & Analytics

### GET `/api/stats`
Basic file stats.

Response:
```json
{
  "total_files": 42,
  "storage_used": 123456,
  "storage_unit": "KB"
}
```

### GET `/api/settings`
Returns mock settings.

Query params:
`user_id` (required UUID)

Response:
```json
{ "theme": "light", "notifications": true, "user_id": "uuid" }
```

### PUT `/api/settings`
Updates mock settings.

Query params:
`user_id` (required UUID)
`theme` (optional)
`notifications` (optional boolean)

Response:
```json
{ "message": "Settings updated successfully", "theme": "light", "notifications": true }
```

---

## Health / Utilities (Legacy)

These are older/seed endpoints used for manual testing:

### GET `/DBtest`
Checks DB connection.

Response:
```json
{ "Database connected successfully": "postgres" }
```

### POST `/uploadfile/`
Legacy upload that writes metadata only (no storage).

### POST `/createuser/`
Creates a sample user (hardcoded values).

### POST `/createorg/`
Creates a sample org (hardcoded values).

### GET `/getfilesdata/`
List all files (no auth).

### GET `/getUserData/{user_id}`
List all users (no auth).

### POST `/createplan/`
Creates a sample plan.

### GET `/getplandata/`
List all plans.

### POST `/createsubscription/`
Creates a sample subscription.

### POST `/createactivitylog/`
Creates a sample activity log.

### POST `/createfilemetadata/`
Creates sample file metadata.

### POST `/createfileanalytics/`
Creates sample file analytics.

### POST `/createfileaccess/`
Creates sample file access.

### POST `/createembeddeddata/`
Creates sample embedded data.

---

## Auth Notes

- Auth is cookie-based (HttpOnly cookies).
- Frontend must send `credentials: 'include'`.

## Storage Notes

- Supabase Storage is required for upload/download.
- `SUPABASE_SERVICE_ROLE_KEY` must be set on the backend.
