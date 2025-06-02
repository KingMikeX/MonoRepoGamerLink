from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from db.database import Base

class TournamentPrize(Base):
    __tablename__ = "tournament_prizes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tournament_id = Column(UUID(as_uuid=True), ForeignKey("tournaments.id", ondelete="CASCADE"), nullable=False)

    place = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
