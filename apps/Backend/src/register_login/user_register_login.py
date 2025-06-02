from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List
from typing import Optional, List
from pydantic import BaseModel
from datetime import date
from uuid import UUID

UserName: type = constr(min_length=3, max_length=50)
PasswordStr: type = constr(min_length=6)

class UserCreate(BaseModel):
    username: UserName # type: ignore
    email: EmailStr
    password: PasswordStr # type: ignore

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    region: Optional[str] = None
    main_game: Optional[str] = None
    rank: Optional[str] = None
    play_style: Optional[str] = None
    platform: Optional[str] = None
    favorite_games: Optional[List[str]] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

    birthdate: Optional[date] = None
    languages: Optional[List[str]] = None

    discord: Optional[str] = None
    steam: Optional[str] = None
    twitch: Optional[str] = None
    youtube: Optional[str] = None

    is_public: Optional[bool] = None
    is_online: Optional[bool] = None
    allow_notifications: Optional[bool] = None
    allow_friend_requests: Optional[bool] = None

class PublicUserProfile(BaseModel):
    user_id: str
    username: str
    region: Optional[str] = None
    main_game: Optional[str] = None
    rank: Optional[str] = None
    play_style: Optional[str] = None
    platform: Optional[str] = None
    favorite_games: Optional[List[str]] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None

    birthdate: Optional[date] = None
    languages: Optional[List[str]] = None

    discord: Optional[str] = None
    steam: Optional[str] = None
    twitch: Optional[str] = None
    youtube: Optional[str] = None

    is_public: Optional[bool] = None
    is_online: Optional[bool] = None
    allow_notifications: Optional[bool] = None
    allow_friend_requests: Optional[bool] = None

    class Config:
        orm_mode = True