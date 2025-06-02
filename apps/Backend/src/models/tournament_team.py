from sqlalchemy import Column, ForeignKey, String, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base
import uuid

class TournamentTeam(Base):
    __tablename__ = "tournament_teams"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    color = Column(String(30), nullable=True)
    points = Column(Integer, default=0)
    matches_played = Column(Integer, default=0)

    # Optional: Relationship für späteren Zugriff
    # tournament = relationship("Tournament", back_populates="teams")
    # team = relationship("Team", back_populates="tournaments")
