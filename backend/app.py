from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import List
from fastapi import Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import String, DateTime, Integer, create_engine, select, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(BASE_DIR, 'emails.db')}",
)
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change-me")

security = HTTPBasic()

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

class Base(DeclarativeBase):
    pass

class EmailRecord(Base):
    __tablename__ = "email_records"
    __table_args__ = (UniqueConstraint("email", name="uq_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=True)
    message: Mapped[str] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

Base.metadata.create_all(engine)

class EmailIn(BaseModel):
    email: EmailStr
    name: str = ""
    message: str = ""

class EmailOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    message: str
    created_at: datetime

app = FastAPI(title="Email Collector API", version="1.0.0")

def admin_auth(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(
        credentials.username, ADMIN_USERNAME
    )
    correct_password = secrets.compare_digest(
        credentials.password, ADMIN_PASSWORD
    )

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )

    return True

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/emails", status_code=201)
def create_email(payload: EmailIn):
    email = payload.email.lower().strip()
    name = payload.name.strip()
    message = payload.message.strip()
    now = datetime.now(timezone.utc)

    with Session(engine) as session:
        # Check duplicate
        existing = session.scalar(select(EmailRecord).where(EmailRecord.email == email))
        if existing:
            # idempotent behavior
            return {
                "id": existing.id, 
                "email": existing.email, 
                "name": existing.name,
                "message": existing.message,
                "created_at": existing.created_at
            }

        rec = EmailRecord(email=email, name=name, message=message, created_at=now)
        session.add(rec)
        try:
            session.commit()
        except Exception as e:
            session.rollback()
            raise HTTPException(status_code=400, detail="Could not save email") from e
        session.refresh(rec)
        return {
            "id": rec.id, 
            "email": rec.email, 
            "name": rec.name,
            "message": rec.message,
            "created_at": rec.created_at
        }

# admin/debug endpoint 
@app.get("/api/admin/emails", response_model=List[EmailOut])
def list_emails(
    limit: int = 200,
    auth=Depends(admin_auth),
):
    with Session(engine) as session:
        rows = session.scalars(
            select(EmailRecord)
            .order_by(EmailRecord.created_at.desc())
            .limit(limit)
        ).all()
        return [
            EmailOut(
                id=r.id, 
                email=r.email, 
                name=r.name or "",
                message=r.message or "",
                created_at=r.created_at
            ) for r in rows
        ]