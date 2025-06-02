from sqlalchemy import Column, String, Integer, TIMESTAMP, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from db.database import Base

class TournamentMatch(Base):
    __tablename__ = "tournament_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    team_a_id = Column(UUID(as_uuid=True), ForeignKey("tournament_teams.id", ondelete="CASCADE"), nullable=True)
    team_b_id = Column(UUID(as_uuid=True), ForeignKey("tournament_teams.id", ondelete="CASCADE"), nullable=True)
    matchday = Column(Integer, nullable=False)
    winner_team_id = Column(UUID(as_uuid=True), ForeignKey("tournament_teams.id"), nullable=True)

    score_team_a = Column(Integer, default=0)
    score_team_b = Column(Integer, default=0)
    played = Column(Boolean, default=False)
    played_at = Column(TIMESTAMP(timezone=True), nullable=True)