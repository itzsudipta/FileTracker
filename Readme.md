# FileTracker

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-RDS-316192?style=flat&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![S3](https://img.shields.io/badge/AWS-S3-232F3E?style=flat&logo=amazonaws&logoColor=white)
![CloudFront](https://img.shields.io/badge/AWS-CloudFront-232F3E?style=flat&logo=amazonaws&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-1.24-009639?style=flat&logo=nginx&logoColor=white)

FileTracker is a modern file management web app with a FastAPI backend and a React + Vite frontend. It supports secure authentication, file upload, download, and organization for users and organizations.

---

## ✨ Highlights
- ✅ FastAPI backend with PostgreSQL (RDS)
- ✅ React + TypeScript frontend (Vite + Tailwind)
- ✅ Authentication via Supabase Auth
- ✅ File storage on Amazon S3 with signed URLs
- ✅ Production deployment behind Nginx + HTTPS

---

## 📁 Project Structure
```
FileTracker/
├── app/                    # FastAPI backend
│   ├── main.py
│   └── routes/
│       ├── auth.py
│       ├── files.py
│       ├── system.py
│       └── user.py
├── filestack/              # React frontend (Vite)
│   ├── src/
│   └── ...
├── database_model/         # SQLAlchemy models
├── models/                 # Pydantic schemas
├── dbConfig/               # DB configuration
├── sql/                    # SQL scripts (optional)
└── BACKEND_GUIDE.md        # Operations and deployment guide
```

---

## 🧱 Tech Stack
- Backend: FastAPI, SQLAlchemy, Pydantic, Uvicorn
- Database: PostgreSQL (Amazon RDS)
- Frontend: React, TypeScript, Vite, TailwindCSS
- Auth: Supabase Auth
- Storage: Amazon S3 (signed URLs)
- Infra: EC2 + Nginx + systemd + CloudFront + ACM

---

## 🔐 Environment Variables

### Backend (`/home/ubuntu/FileTracker/.env`)
```
DATABASE_URL=postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/DBNAME
FRONTEND_ORIGIN=https://www.filetracker.app

SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=filestackerstorage
```

### Frontend (`filestack/.env.production`)
```
VITE_API_URL=https://api.filetracker.app
```

---

## 🧪 Local Development

### Backend
```
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```
cd filestack
npm install
npm run dev
```

---

## 🚀 Production Deployment (Summary)

### Backend (EC2 + systemd)
1. Configure `/home/ubuntu/FileTracker/.env`
2. Start service:
```
sudo systemctl daemon-reload
sudo systemctl restart filestacker
sudo systemctl status filestacker
```

### Frontend (S3 + CloudFront)
1. Build:
```
cd filestack
npm run build
```
2. Upload:
```
aws s3 sync dist/ s3://myfiletracker --delete
```
3. CloudFront invalidation:
```
/*
```

---

## 🛠️ Common Ops Commands
```
sudo systemctl status filestacker
sudo systemctl restart filestacker
sudo journalctl -u filestacker -n 50 --no-pager
```

---

## 📘 Full Operations Guide
See `BACKEND_GUIDE.md` for:
- systemd explanation
- Supabase → RDS migration
- Supabase Storage → S3 migration
- troubleshooting
