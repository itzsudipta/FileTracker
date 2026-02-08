# Backend Ops Guide

This document explains how to start/check the backend, how systemd works (in simple terms), and how to migrate Supabase → RDS and Supabase → S3.

---

## 1) Start / Stop / Check Backend

### Start
```bash
sudo systemctl daemon-reload
sudo systemctl start filestacker
```

### Restart (most common)
```bash
sudo systemctl daemon-reload
sudo systemctl restart filestacker
```

### Check status
```bash
sudo systemctl status filestacker
```

### Reload service (after config change)
```bash
sudo systemctl daemon-reload
sudo systemctl reload filestacker
```

### View recent logs
```bash
sudo journalctl -u filestacker -n 50 --no-pager
```

### Test backend is live
```bash
curl https://api.filetracker.app/DBtest
```

Expected response:
```json
{"Database connected successfully":"postgres"}
```

---

## 2) How systemd works (simple)

systemd is the Linux service manager.  
It keeps your backend running even after you close SSH.

Key points:
- A service file (unit) lives at:
  ```
  /etc/systemd/system/filestacker.service
  ```
- `systemctl start` launches your app.
- `systemctl restart` reloads it after changes.
- `systemctl status` shows health.
- If you change the unit file, always run:
  ```
  sudo systemctl daemon-reload
  ```

Typical unit settings:
```
[Unit]
Description=FileTracker Backend
After=network.target

[Service]
WorkingDirectory=/home/ubuntu/FileTracker
EnvironmentFile=/home/ubuntu/FileTracker/.env
ExecStart=/home/ubuntu/FileTracker/filestacker@/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3
User=ubuntu

[Install]
WantedBy=multi-user.target
```

---

## 3) Supabase → RDS (DB Migration)

### Step A: Install PostgreSQL client (v17 required)
```bash
sudo apt update
sudo apt install -y curl ca-certificates gnupg
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /usr/share/postgresql-common/pgdg/apt.asc >/dev/null
echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.asc] http://apt.postgresql.org/pub/repos/apt noble-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
sudo apt update
sudo apt install -y postgresql-client-17
```

### Step B: Dump Supabase
```bash
PGPASSWORD='SUPABASE_DB_PASSWORD' /usr/lib/postgresql/17/bin/pg_dump \
  -h aws-1-ap-south-1.pooler.supabase.com -p 5432 \
  -U postgres.<project-ref> -d postgres \
  --format=custom --no-owner --no-privileges -f supabase.dump
```

### Step C: Create DB on RDS (if missing)
```bash
PGPASSWORD='RDS_PASSWORD' psql \
  -h filetracker.cwho2ig06xxa.us-east-1.rds.amazonaws.com -p 5432 \
  -U Sudiptadb -d postgres \
  -c "CREATE DATABASE filetracker;"
```

### Step D: Restore to RDS
```bash
PGPASSWORD='RDS_PASSWORD' /usr/lib/postgresql/17/bin/pg_restore \
  -h filetracker.cwho2ig06xxa.us-east-1.rds.amazonaws.com -p 5432 \
  -U Sudiptadb -d filetracker \
  --no-owner --no-privileges --clean --if-exists supabase.dump
```

### Step E: Verify tables
```bash
PGPASSWORD='RDS_PASSWORD' psql \
  -h filetracker.cwho2ig06xxa.us-east-1.rds.amazonaws.com -p 5432 \
  -U Sudiptadb -d filetracker \
  -c "\dt"
```

If you see errors about extensions like `pg_graphql` or `supabase_vault`, those are Supabase‑only. You can ignore them if your main app tables exist.

---

## 4) Supabase Storage → S3 (File Storage Migration)

### Step A: Create bucket
Bucket name: `filestackerstorage`

### Step B: Add CORS on bucket (for download via signed URL)
S3 → Bucket → Permissions → CORS:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://www.filetracker.app", "https://filetracker.app"],
    "ExposeHeaders": ["Content-Disposition", "Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

### Step C: Add AWS keys to backend `.env`
```
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=filestackerstorage
```

### Step D: Install boto3 + restart backend
```bash
source /home/ubuntu/FileTracker/filestacker@/bin/activate
pip install boto3
sudo systemctl restart filestacker
```

### Step E: (Optional) Copy old files from Supabase to S3
This requires a custom script or manual export.  
If needed, we can add a migration script to copy objects from Supabase Storage to S3.

---

## 5) Common Issues

### 1) Backend not starting
```bash
sudo journalctl -u filestacker -n 50 --no-pager
```
Most common causes: wrong `DATABASE_URL`, missing `.env`, or missing Python deps.

### 2) CORS error in browser
Make sure:
```
FRONTEND_ORIGIN=https://www.filetracker.app
```
Then restart backend.

### 3) Download works but open downloads too
Backend should generate:
- Open: `Content-Disposition: inline`
- Download: `Content-Disposition: attachment`

If cache issues persist, invalidate CloudFront and hard‑refresh.
