from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from models.user import User
from models.user_profile import UserProfile
from models.tournament_data import Tournament
from register_login.user_register_login import PublicUserProfile
from utils.auth_dependencies import get_current_user, get_db
from typing import List

search_router = APIRouter(
    prefix="/search",
    tags=["Search"]
)

@search_router.get("/")
def search_users_and_tournaments(
    query: str = Query(..., min_length=1, description="Suchbegriff"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 👥 Öffentliche Profile mit passenden Usernamen
    users = (
        db.query(User, UserProfile)
        .join(UserProfile, User.id == UserProfile.user_id)
        .filter(
            User.username.ilike(f"%{query}%"),
            UserProfile.is_public == True
        )
        .all()
    )
    user_results = [
        {
            "type": "user",
            "username": u.username,
            "user_id": str(u.id),
            "profile_picture": p.profile_picture
        } for u, p in users
    ]

    # 🏆 Öffentliche Turniere mit passenden Namen
    tournaments = (
        db.query(Tournament)
        .filter(
            Tournament.is_public == True,
            Tournament.name.ilike(f"%{query}%")
        )
        .all()
    )
    tournament_results = [
        {
            "type": "tournament",
            "tournament_id": str(t.id),
            "name": t.name,
            "game": t.game,
            "created_at": t.created_at
        } for t in tournaments
    ]

    return {
        "users": user_results,
        "tournaments": tournament_results
    }
