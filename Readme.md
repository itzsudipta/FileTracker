<h1 align="center">
  <img src="./client/public/FileStacker.png" alt="FileStacker logo" width="180"><br>
  FileStacker
</h1>

FileStacker is a web-based file management application for teams. It gives each organization a dashboard where members can upload, search, preview, download, and manage their files.

## Tech Stack

| Icon | Technology | Area | Role in FileStacker |
| :---: | :--- | :--- | :--- |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/react/react-original.svg" width="24" alt=""> | **React 19** | Frontend | Renders the file dashboard and sign-in screens. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/typescript/typescript-original.svg" width="24" alt=""> | **TypeScript 5.9** | Frontend | Types UI components and API responses. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/vitejs/vitejs-original.svg" width="24" alt=""> | **Vite 7** | Frontend tooling | Runs the frontend development server and builds production assets. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/tailwindcss/tailwindcss-original.svg" width="24" alt=""> | **Tailwind CSS 4** | Frontend styling | Styles the dashboard and authentication screens. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/java/java-original.svg" width="24" alt=""> | **Java 21** | Backend | Runs the backend application. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/spring/spring-original.svg" width="24" alt=""> | **Spring Boot 3.3** | Backend | Provides the REST API and integrates with PostgreSQL through Spring Data JPA. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/postgresql/postgresql-original.svg" width="24" alt=""> | **PostgreSQL** | Database | Stores file metadata, users, organizations, and application records. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/supabase/supabase-original.svg" width="24" alt=""> | **Supabase Auth** | Authentication | Handles user registration, sign-in, and session refresh. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="24" alt=""> | **Amazon S3** | Object storage | Stores uploaded files and serves them through short-lived presigned URLs. |
| <img src="https://raw.githubusercontent.com/devicons/devicon/v2.17.0/icons/maven/maven-original.svg" width="24" alt=""> | **Apache Maven** | Backend tooling | Manages Java dependencies and packages the backend. |

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

See the [FileStacker API reference](API_DOCS.md) for routes, request parameters, and response examples.

---

## ⚙️ Configuration & Environment Variables

The backend reads configuration directly from environment variables or standard `.env`:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `SERVER_PORT` | HTTP port for Spring Boot | `8080` |
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
