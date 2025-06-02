from sqlalchemy import Column, String, Boolean, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("NOW()"))
    last_login = Column(TIMESTAMP, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # 🆕 Rolle: 'User' oder 'Admin'
    role = Column(String(20), nullable=False, default="User")

