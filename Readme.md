# FileStacker - A Modern SaaS WebApplication 

FileStacker can evolve into a SaaS-based intelligent file management system where users or organizations can sign up, upload, analyze, and manage their files securely via the cloud, without needing any local installation.

## 🚀 Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | Latest | REST API Framework |
| | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | 3.11+ | Programming Language |
| | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) | Latest | Database |
| | ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat&logo=python&logoColor=white) | 2.x | ORM |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | 19.1.1 | UI Library |
| | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | 5.9.3 | Type Safety |
| | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | 7.1.7 | Build Tool |
| | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | 3.4.14 | Styling |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat&logo=lucide&logoColor=white) | 0.552.0 | Icon Library |
| **Dev Tools** | ![Uvicorn](https://img.shields.io/badge/Uvicorn-499848?style=flat&logo=gunicorn&logoColor=white) | Latest | ASGI Server |
| | ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat&logo=pydantic&logoColor=white) | 2.x | Data Validation |

## 📁 Project Structure

```
FileStacker/
├── app/                      # FastAPI backend
│   ├── main.py              # Main application
│   ├── routes/              # API routes
│   │   ├── files.py         # File operations
│   │   ├── auth.py          # Authentication
│   │   ├── user.py          # User profile
│   │   └── system.py        # Stats & settings
│   └── ...
├── filestacker-client-react-app/  # React frontend
│   ├── src/
│   │   ├── components/      
│   │   ├── utils/           
│   │   └── App.tsx          
│   └── ...
├── database_model/          # SQLAlchemy models
├── models/                  # Pydantic schemas
└── dbConfig/               # Database configuration
```

## 📝 Status

🚧 Under active development



