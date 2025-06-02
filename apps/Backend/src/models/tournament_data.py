from sqlalchemy import Column, String, Integer, Boolean, Float, TIMESTAMP, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from db.database import Base
from sqlalchemy.orm import relationship


class Tournament(Base):
    __tablename__ = "tournaments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), nullable=False)
    game = Column(String(100), nullable=False)
    niveau = Column(String(50), nullable=False)
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    max_players = Column(Integer)
    description = Column(Text)

    # ✅ Neue Felder laut Frontend
    teamanzahl = Column(Integer, nullable=False, default=2)
    teamgroeße = Column(Integer, nullable=False, default=1)
    entry_fee = Column(Float, default=0.0)
    timezone = Column(String(50), default="CET")
    rules = Column(Text, default="")
    scoring_system = Column(String(50), default="STANDARD")
    mode = Column(String(50), default="singleElimination")
    check_in_required = Column(Boolean, default=False)
    registration_start = Column(TIMESTAMP(timezone=True))
    registration_end = Column(TIMESTAMP(timezone=True))
    is_public = Column(Boolean, default=True)
    invite_only = Column(Boolean, default=False)

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # 👇 Beziehung zu TournamentPrize
    prizes = relationship("TournamentPrize", backref="tournament", cascade="all, delete")


