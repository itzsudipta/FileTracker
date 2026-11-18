# FileStacker - Java Spring Boot Backend

This is the enterprise-grade Java Spring Boot backend for **FileStacker**, converted with 100% fidelity from the Python FastAPI backend.

---

## 🏛️ Architecture & Component Design

Every single component in the backend is strictly structured with the 5 core layers:
1. **Controller** (`@RestController`, `@RequestMapping`, `@CrossOrigin`)
2. **Service** (`@Service`, business logic & transactional management)
3. **Repository** (`@Repository`, Spring Data JPA interfaces)
4. **Enum** (Type-safe domain enums)
5. **Entity** (`@Entity`, JPA object-relational mapping to PostgreSQL tables)

### Component Matrix

| Component | Entity | Enum | Repository | Service | Controller |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User** | `User` (`user_data`) | `UserRole` | `UserRepository` | `UserService` | `UserController` |
| **Organization** | `Organization` (`org`) | `OrganizationStatus` | `OrganizationRepository` | `OrganizationService` | `OrganizationController` |
| **FileInfo** | `FileInfo` (`file_data`) | `StorageType` | `FileInfoRepository` | `FileInfoService` | `FileController` |
| **FileMetadata** | `FileMetadata` (`file_md`) | `VersionChangeType` | `FileMetadataRepository` | `FileMetadataService` | `FileMetadataController` |
| **FileAccess** | `FileAccess` (`fileacces`) | `AccessType`, `AccessStatus` | `FileAccessRepository` | `FileAccessService` | `FileAccessController` |
| **FileAnalytics** | `FileAnalytics` (`file_analytics`) | `AnalyticsEventType` | `FileAnalyticsRepository` | `FileAnalyticsService` | `FileAnalyticsController` |
| **Plan** | `Plan` (`plan`) | `PlanTier` | `PlanRepository` | `PlanService` | `PlanController` |
| **Subscription** | `Subscription` (`subscrip`) | `SubscriptionStatus` | `SubscriptionRepository` | `SubscriptionService` | `SubscriptionController` |
| **ActivityLog** | `ActivityLog` (`actv_log`) | `ActivityAction` | `ActivityLogRepository` | `ActivityLogService` | `ActivityLogController` |
| **EmbeddedData** | `EmbeddedData` (`embedd_index`) | `EmbeddingModelType` | `EmbeddedDataRepository` | `EmbeddedDataService` | `EmbeddedDataController` |
| **Notification** | `NotificationSettings` (`notification`) | `NotificationType` | `NotificationSettingsRepository` | `NotificationSettingsService` | `NotificationController` |
| **Webhook** | `WebhookLog` (`webhookstable`) | `WebhookEventType` | `WebhookLogRepository` | `WebhookLogService` | `WebhookController` |
| **Auth** | `AuthSession` | `AuthStatus` | `AuthRepository` | `AuthService` | `AuthController` |
| **System** | `SystemSetting` (`user_settings`) | `ThemeType` | `SystemRepository` | `SystemService` | `SystemController` |

---

## 📡 API Endpoint Coverage

All endpoints match the exact path, HTTP method, parameters, headers, and response formats expected by the React frontend and clients:

### 1. Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticates user with Supabase, sets HttpOnly cookies (`sb-access-token`, `sb-refresh-token`), returns user profile.
- `POST /api/auth/register`: Creates Supabase auth user, inserts organization and user into PostgreSQL, signs in, sets cookies.
- `POST /api/auth/logout`: Clears authentication cookies.
- `GET /api/auth/me`: Verifies cookie session via Supabase, automatically refreshes token if needed, returns profile.

### 2. Files (`/api/files` and legacy)
- `GET /api/files`: Lists non-deleted files for the current user's organization with optional `?search=` filter.
- `GET /api/files/{file_id}`: Retrieves metadata for a specific file.
- `POST /api/files/upload`: Enforces 1GB file size limit (unlimited for users named starting with "sudipta"), computes MD5 checksum, uploads to AWS S3, saves database entity.
- `GET /api/files/{file_id}/open`: Generates a short-lived AWS S3 presigned URL with `inline` disposition.
- `GET /api/files/{file_id}/download`: Generates a short-lived AWS S3 presigned URL with `attachment` disposition.
- `DELETE /api/files/{file_id}`: Soft-deletes file in DB and removes the file object from S3.
- `PATCH /api/files/{file_id}/tags`: Updates filename/tags.
- `POST /uploadfile/`: Legacy file upload endpoint.
- `GET /getfilesdata/`: Legacy file listing endpoint.

### 3. User & System
- `GET /api/user/me`: Returns user entity by `?user_id=`.
- `GET /getUserData/{user_id}`: Legacy user listing.
- `POST /createuser/`: Legacy user creation.
- `GET /DBtest`: Tests PostgreSQL connectivity (`SELECT current_database()`).
- `GET /api/stats`: Dashboard stats (`total_files`, `storage_used`, `storage_unit`).
- `GET /api/settings`: Returns settings for user.
- `PUT /api/settings`: Updates settings for user.

### 4. Other Domain Components
- `POST /createorg/`: Creates organization.
- `POST /createplan/` & `GET /getplandata/`: Manages subscription plans.
- `POST /createsubscription/` & `GET /api/subscription/org/{org_id}`: Manages subscriptions.
- `POST /createactivitylog/` & `GET /api/activity/user/{user_id}`: Logs activity.
- `POST /createfilemetadata/` & `GET /api/files/{file_id}/versions`: Version metadata.
- `POST /createfileaccess/` & `GET /api/files/{file_id}/access`: Access permissions.
- `POST /createfileanalytics/` & `GET /api/files/{file_id}/analytics`: Analytics counters.
- `POST /createembeddeddata/` & `GET /api/embedding/file/{file_id}`: Vector embeddings.
- `POST /api/notifications` & `GET /api/notifications/user/{user_id}`: User notifications.
- `POST /api/webhooks` & `GET /api/webhooks/org/{org_id}`: Outgoing webhooks.

---

## ⚙️ Configuration & Environment Variables

The backend reads configuration directly from environment variables or standard `.env`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `SERVER_PORT` | HTTP port for Spring Boot | `8000` |
| `DATABASE_URL` | PostgreSQL connection URL (supports `postgres://`, `postgresql://`, or `jdbc:postgresql://`) | `jdbc:postgresql://localhost:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | PostgreSQL username | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | PostgreSQL password | `postgres` |
| `FRONTEND_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `COOKIE_SECURE` | Set secure flag on cookies | `false` |
| `SUPABASE_URL` | Supabase project URL | `""` |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key | `""` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret | `""` |
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key ID | `""` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Access Key | `""` |
| `AWS_REGION` | AWS Region for S3 | `us-east-1` |
| `AWS_S3_BUCKET` | AWS S3 Bucket Name | `filestackerstorage` |

---

## 🚀 Running the Application

### Using Maven:
```bash
mvn clean spring-boot:run
```

### Packaging into a JAR:
```bash
mvn clean package -DskipTests
java -jar target/filestacker-backend-1.0.0.jar
```
