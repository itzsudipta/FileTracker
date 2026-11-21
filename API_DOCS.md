# FileStacker API Reference

The Spring Boot API listens on `http://localhost:8080` by default. Set `SERVER_PORT` to override the port. Send JSON request bodies with `Content-Type: application/json`. File uploads use `multipart/form-data`. Resource IDs in paths and query parameters are UUIDs.

- [Authentication](#authentication)
- [Files](#files)
- [Users, organizations, and settings](#users-organizations-and-settings)
- [Related records](#related-records)
- [Legacy and diagnostic endpoints](#legacy-and-diagnostic-endpoints)
- [Errors](#errors)

## Authentication

Login and registration set the HttpOnly `sb-access-token` cookie. The session lasts up to 60 seconds. Sign in again after it expires. Browser clients making cross-origin requests should use `credentials: "include"`.

| Method | Path | Input | Successful response |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/login` | JSON with `email` and `password` | `200` with `message`, `user`, and `expires_at`. |
| POST | `/api/auth/register` | JSON with `email`, `password`, `user_name`, and `org_name` | `200` with `message`, `user`, and `expires_at`. Creates the account and organization, then signs in. |
| GET | `/api/auth/me` | Session cookie | `200` with `user` and `expires_at`. |
| POST | `/api/auth/logout` | None | `200` with `{"message":"Logout successful"}`. Clears the authentication cookies. |

Registration requires a valid email address, a password of 6–72 characters, and nonblank user and organization names. `expires_at` is a Unix timestamp in milliseconds.

### Example login response

```json
{
  "message": "Login successful",
  "user": {
    "user_id": "9f820642-7d9c-4e08-8902-a66168f5e009",
    "user_name": "Alex Morgan",
    "user_email": "alex@example.com",
    "u_role": "admin",
    "org_id": "27148700-8b57-438d-b631-ef358cc992b6",
    "org_name": "Example Team"
  },
  "expires_at": 1795266000000
}
```

## Files

These endpoints require a session cookie and use the signed-in user's organization. File contents are stored in Amazon S3, and file metadata is stored in PostgreSQL.

| Method | Path | Input | Successful response |
| :--- | :--- | :--- | :--- |
| GET | `/api/files` | Optional `search` query parameter for a case-insensitive filename filter | `200` with an array of file records. |
| GET | `/api/files/{file_id}` | File ID | `200` with a file record. A missing file returns `200` with `{"error":"File not found"}`. |
| POST | `/api/files/upload` | Multipart field `file` with binary content | `200` with the uploaded file record. |
| GET | `/api/files/{file_id}/open` | File ID | `200` with `filename` and `signed_url` for inline preview. |
| GET | `/api/files/{file_id}/download` | File ID | `200` with `filename` and `signed_url` for download as an attachment. |
| PATCH | `/api/files/{file_id}/tags` | File ID and optional `filename` query parameter | `200` with `message` and the updated `file` entity. A nonblank filename changes the stored display name. |
| DELETE | `/api/files/{file_id}` | File ID | `200` with `{"message":"File deleted successfully"}`. Marks the file as deleted and attempts to delete its S3 object. |

The standard upload limit is 1 GiB, and Spring Boot caps multipart files and requests at 2 GB. Open and download URLs expire after 60 seconds. Both endpoints return JSON with the URL to request directly from S3.

### Example file record

```json
{
  "file_id": "a86b780b-06a9-4e0c-aad2-4efd82b5b376",
  "filename": "report.pdf",
  "file_type": "application/pdf",
  "file_size": 12345,
  "uploaded_at": "2026-02-06T12:34:56",
  "storage_path": "27148700-8b57-438d-b631-ef358cc992b6/21bee490-db35-428b-aee9-08060a39c98a_report.pdf",
  "owner_name": "Alex Morgan"
}
```

`file_size` is measured in bytes for files uploaded through `/api/files/upload`. `uploaded_at` is a local timestamp without a UTC offset.

## Users, organizations, and settings

| Method | Path | Input | Response |
| :--- | :--- | :--- | :--- |
| GET | `/api/user/me` | Required `user_id` query parameter | `200` with the user record, or `{"error":"User not found"}` if the ID is unknown. |
| GET | `/api/org/{id}` | Organization ID | `200` with the organization record or `404` with an empty body. |
| GET | `/api/stats` | None | `200` with `total_files`, `storage_used`, and `storage_unit` across non-deleted files. |
| GET | `/api/settings` | Required `user_id` query parameter | `200` with `user_id`, `theme`, and `notifications`. Defaults to `light` and `true` when no record exists. |
| PUT | `/api/settings` | Required `user_id` and optional `theme` and `notifications` query parameters | `200` with `message`, `theme`, and `notifications` after saving the settings. |

`/api/stats` returns the sum of stored `file_size` values and labels the result `KB` without converting sizes. Current uploads store bytes, and legacy uploads store whole kilobytes.

## Related records

| Method | Path | Input | Response |
| :--- | :--- | :--- | :--- |
| GET | `/api/files/{file_id}/versions` | File ID | `200` with an array of version metadata records. |
| GET | `/api/files/{file_id}/access` | File ID | `200` with an array of file access records. |
| GET | `/api/files/{file_id}/analytics` | File ID | `200` with an analytics record or `404` with an empty body. |
| GET | `/api/embedding/file/{file_id}` | File ID | `200` with an array of stored embedding records. |
| GET | `/api/subscription/org/{org_id}` | Organization ID | `200` with an array of subscription records. |
| GET | `/api/activity/user/{user_id}` | User ID | `200` with an array of activity logs. |
| GET | `/api/notifications/user/{user_id}` | User ID | `200` with an array of notification records. |
| POST | `/api/notifications` | JSON with `user_id`, `notification_type`, and `notification_message`. Optional fields are `notification_id`, `is_read`, and `create_at`. | `200` with the saved notification record. |
| GET | `/api/webhooks/org/{org_id}` | Organization ID | `200` with an array of webhook records. |
| POST | `/api/webhooks` | JSON with `org_id`, `url`, `event_type`, and `secret_token`. Optional fields are `webhook_id` and `is_active`. | `200` with the saved webhook record. |

## Legacy and diagnostic endpoints

Use the trailing slash where shown. Seed routes take no request body and return the created record on success.

| Method | Path | Behavior |
| :--- | :--- | :--- |
| GET | `/DBtest` | Checks PostgreSQL connectivity. Returns `200` with the database name under `Database connected successfully` or an object with `message` and `error` if the check fails. |
| POST | `/uploadfile/` | Accepts multipart field `file` and writes a legacy metadata record. |
| GET | `/getfilesdata/` | Returns file records or the text `No files found`. |
| GET | `/getUserData/{user_id}` | Returns the full user list or the text `no files found`. The route requires a UUID in the path. |
| GET | `/getplandata/` | Returns the plan list or the text `no files found`. |
| POST | `/createuser/` | Creates a sample user. |
| POST | `/createorg/` | Creates a sample organization. |
| POST | `/createplan/` | Creates a sample plan. |
| POST | `/createsubscription/` | Creates a sample subscription. |
| POST | `/createactivitylog/` | Creates a sample activity log. |
| POST | `/createfilemetadata/` | Creates sample file metadata. |
| POST | `/createfileanalytics/` | Creates a sample analytics record. |
| POST | `/createfileaccess/` | Creates a sample file access record. |
| POST | `/createembeddeddata/` | Creates a sample embedding record. |

## Errors

Errors handled by the application exception handler include `detail`, `message`, and `error` with the same text. For example, an unauthenticated file request can return `401 Unauthorized` with this body.

```json
{
  "detail": "Not authenticated",
  "message": "Not authenticated",
  "error": "Not authenticated"
}
```

| Status | When to expect it |
| :--- | :--- |
| `401 Unauthorized` | Invalid login credentials or a missing, expired, or invalid session on a route that requires it. |
| `404 Not Found` | A missing resource on a route that uses `404`. Open and download also use it when the file has no S3 storage path. |
| `409 Conflict` | Registration finds an account that is already registered. |
| `413 Payload Too Large` | The upload exceeds an applicable size limit. |
| `422 Unprocessable Entity` | Registration validation fails. |

Some routes return an empty `404` or a `200` response containing an `error` field, as shown in the tables.
