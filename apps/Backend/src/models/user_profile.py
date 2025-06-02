from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Text, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from sqlalchemy import text
from db.database import Base

class UserProfile(Base):
    __tablename__ = "user_profile"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    favorite_games = Column(ARRAY(Text))  # z.B. ['Valorant', 'LoL']
    main_game = Column(String(100))
    rank = Column(String(50))
    play_style = Column(String(100))      # z.B. "Taktisch", "Support"
    platform = Column(String(50))         # z.B. "PC", "PS5"
    region = Column(String(50))           # z.B. "EUW", "NA"
    bio = Column(Text)
    profile_picture = Column(String, nullable=True)  # URL oder Dateipfad für das Profilbild
    birthdate = Column(Date, nullable=True)
    languages = Column(ARRAY(String(50)))  # z.B. ["Deutsch", "Englisch"]
    discord = Column(String(100))
    steam = Column(String(100))
    twitch = Column(String(100))
    youtube = Column(String(100))
    is_public = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)
    allow_notifications = Column(Boolean, default=True)
    allow_friend_requests = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=text("NOW()"))