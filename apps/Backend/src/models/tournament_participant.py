from sqlalchemy import Column, ForeignKey, TIMESTAMP, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from db.database import Base

class TournamentParticipant(Base):
    __tablename__ = "tournament_participants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("tournament_teams.id", ondelete="SET NULL"), nullable=True)
    joined_at = Column(TIMESTAMP, server_default=func.now())

    __table_args__ = (UniqueConstraint("tournament_id", "user_id", name="unique_participation"),)
