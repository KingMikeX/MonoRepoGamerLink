from sqlalchemy import Column, ForeignKey, Enum, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.database import Base
import uuid
import enum


class FriendshipStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    blocked = "blocked"


class Friendship(Base):
    __tablename__ = "friendships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(Enum(FriendshipStatus), default=FriendshipStatus.pending, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Optional: für Beziehungen in beide Richtungen
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_friend_requests")
    receiver = relationship("User", foreign_keys=[receiver_id], backref="received_friend_requests")
