from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from sqlalchemy.orm import Session
from utils.auth_dependencies import get_current_user
from models.user_profile import UserProfile
from db.database import SessionLocal
from datetime import datetime, timezone

class UpdateLastSeenMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            db: Session = SessionLocal()
            user = await get_current_user(request)
            if user:
                profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
                if profile:
                    profile.last_seen = datetime.now(timezone.utc)
                    profile.is_online = True
                    db.commit()
        except Exception:
            pass  # Kein Problem, wenn der User nicht authentifiziert ist oder Fehler entsteht
        finally:
            db.close()

        response = await call_next(request)
        return response
