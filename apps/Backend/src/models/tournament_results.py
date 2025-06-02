from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base
import uuid

class TournamentResult(Base):
    __tablename__ = "tournament_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("tournament_teams.id", ondelete="CASCADE"), nullable=False)
    points = Column(Integer, default=0)
    placement = Column(Integer)
    matches_played = Column(Integer, default=0)

    # Optionale Beziehung für einfaches ORM-Zugreifen
    team = relationship("TournamentTeam")
