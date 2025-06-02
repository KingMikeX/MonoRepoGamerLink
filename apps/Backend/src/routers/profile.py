from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import UploadFile, File
from sqlalchemy import literal
from sqlalchemy.orm import Session
from register_login.user_register_login import UserProfileUpdate
from utils.auth_dependencies import get_current_user, get_db
from models.user import User
from models.user_profile import UserProfile
from register_login.user_register_login import PublicUserProfile
from uuid import uuid4
from pathlib import Path
from datetime import timezone, datetime
from models.friendship import Friendship
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from register_login.user_register_login import PublicUserProfile  # für Ausgabe
from models.tournament_participant import TournamentParticipant
from models.tournament_data import Tournament
from datetime import timezone

profile_router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)

class PublicFriendProfile(PublicUserProfile):
    friendship_id: UUID


class FriendshipCreate(BaseModel):
    receiver_id: UUID

class FriendshipOut(BaseModel):
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

@profile_router.get("/me")
def get_own_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil wurde nicht gefunden."
        )

    return {
        # ✅ Felder aus User-Tabelle
        "user_id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,

        # ✅ Felder aus UserProfile-Tabelle
        "region": profile.region,
        "main_game": profile.main_game,
        "rank": profile.rank,
        "platform": profile.platform,
        "play_style": profile.play_style,
        "favorite_games": profile.favorite_games,
        "bio": profile.bio,
        "created_at": profile.created_at,
        "profile_picture": profile.profile_picture,
        "birthdate": profile.birthdate,
        "languages": profile.languages,
        "discord": profile.discord,
        "steam": profile.steam,
        "twitch": profile.twitch,
        "youtube": profile.youtube,
        "is_public": profile.is_public,
        "is_online": profile.is_online,
        "allow_notifications": profile.allow_notifications,
        "allow_friend_requests": profile.allow_friend_requests
    }


@profile_router.put("/update")
def update_own_profile(
    updated_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil nicht gefunden"
        )

    # Nur die Felder aktualisieren, die im Request gesendet wurden
    for field, value in updated_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return {
        "message": "Profil erfolgreich aktualisiert.",
        "profile": {
            "region": profile.region,
            "main_game": profile.main_game,
            "rank": profile.rank,
            "platform": profile.platform,
            "play_style": profile.play_style,
            "favorite_games": profile.favorite_games,
            "bio": profile.bio,
            "created_at": profile.created_at,
            "birthdate": profile.birthdate,
            "languages": profile.languages,
            "discord": profile.discord,
            "steam": profile.steam,
            "twitch": profile.twitch,
            "youtube": profile.youtube,
            "is_public": profile.is_public,
            "is_online": profile.is_online,
            "allow_notifications": profile.allow_notifications,
            "allow_friend_requests": profile.allow_friend_requests
        }
    }

# Lokaler Speicherort für Profilbilder
BASE_DIR = Path(__file__).resolve().parent.parent  # /src/
UPLOAD_DIR = BASE_DIR / "uploads" / "profile_pictures"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@profile_router.post("/upload-picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Nur Bildformate zulassen
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Nur Bilddateien sind erlaubt.")

    # Eindeutiger Dateiname mit UUID
    filename = f"{uuid4().hex}_{file.filename}"
    file_path = UPLOAD_DIR / filename

    # Datei speichern
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Bildpfad in die Datenbank schreiben
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden.")

    # Öffentlicher Pfad für statischen Zugriff
    profile.profile_picture = f"/static/profile_pictures/{filename}"
    db.commit()

    return {
        "message": "Profilbild erfolgreich hochgeladen.",
        "profile_picture": profile.profile_picture
    }


@profile_router.post("/logout")
def logout_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profil nicht gefunden.")

    profile.is_online = False
    # Optional: Profil zuletzt gesehen Zeit setzen
    # profile.last_seen = datetime.now(timezone.utc)

    db.commit()

    return {"message": "Du wurdest erfolgreich ausgeloggt."}



@profile_router.post("/friends/request", response_model=FriendshipOut)
def send_friend_request(
    request_data: FriendshipCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if request_data.receiver_id == current_user.id:
        raise HTTPException(status_code=400, detail="Du kannst dir selbst keine Anfrage senden.")

    # Duplikate verhindern
    existing = db.query(Friendship).filter(
        ((Friendship.sender_id == current_user.id) & (Friendship.receiver_id == request_data.receiver_id)) |
        ((Friendship.sender_id == request_data.receiver_id) & (Friendship.receiver_id == current_user.id))
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Freundschaftsanfrage existiert bereits.")

    new_request = Friendship(
        sender_id=current_user.id,
        receiver_id=request_data.receiver_id
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@profile_router.get("/friends/requests/incoming", response_model=List[FriendshipOut])
def get_incoming_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Friendship).filter(
        Friendship.receiver_id == current_user.id,
        Friendship.status == "pending"
    ).all()

@profile_router.get("/friends/requests/sent", response_model=List[FriendshipOut])
def get_sent_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Friendship).filter(
        Friendship.sender_id == current_user.id,
        Friendship.status == "pending"
    ).all()


@profile_router.post("/friends/accept/{request_id}")
def accept_friend_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.receiver_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Anfrage nicht gefunden.")

    request.status = "accepted"
    db.commit()
    return {"message": "Freundschaftsanfrage akzeptiert."}


@profile_router.delete("/friends/decline/{request_id}")
def decline_friend_request(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.receiver_id == current_user.id
    ).first()

    if not request:
        raise HTTPException(status_code=404, detail="Anfrage nicht gefunden.")

    db.delete(request)
    db.commit()
    return {"message": "Anfrage abgelehnt oder gelöscht."}

@profile_router.get("/friends/list", response_model=List[PublicFriendProfile])
def get_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendships = db.query(Friendship).filter(
        ((Friendship.sender_id == current_user.id) | (Friendship.receiver_id == current_user.id)) &
        (Friendship.status == "accepted")
    ).all()

    friend_ids = [
        f.receiver_id if f.sender_id == current_user.id else f.sender_id
        for f in friendships
    ]

    friends = db.query(User).filter(User.id.in_(friend_ids)).all()
    profiles = db.query(UserProfile).filter(UserProfile.user_id.in_(friend_ids)).all()
    profile_map = {p.user_id: p for p in profiles}
    user_map = {u.id: u for u in friends}

    result = []

    for f in friendships:
        fid = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        profile = profile_map.get(fid)
        user = user_map.get(fid)

        if user and profile and profile.is_public:
            result.append(PublicFriendProfile(
                friendship_id=f.id,
                user_id=str(user.id),
                username=user.username,
                region=profile.region,
                main_game=profile.main_game,
                rank=profile.rank,
                play_style=profile.play_style,
                platform=profile.platform,
                favorite_games=profile.favorite_games,
                bio=profile.bio,
                profile_picture=profile.profile_picture,
                birthdate=profile.birthdate,
                languages=profile.languages,
                discord=profile.discord,
                steam=profile.steam,
                twitch=profile.twitch,
                youtube=profile.youtube,
                is_online=profile.is_online
            ))

    return result




@profile_router.get("/by-id/{user_id}")
def get_profile_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")

    return {"username": user.username}

@profile_router.delete("/friends/remove/{request_id}")
def remove_friend_route(
    request_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.status == "accepted",
        ((Friendship.sender_id == current_user.id) | (Friendship.receiver_id == current_user.id))
    ).first()

    if not friendship:
        raise HTTPException(status_code=404, detail="Freundschaft nicht gefunden oder keine Berechtigung.")

    db.delete(friendship)
    db.commit()
    return {"message": "Freund entfernt."}


@profile_router.get("/activities")
def get_friend_activities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("current_user:", current_user)
    print("user_id:", getattr(current_user, "id", None))
    # Hole alle akzeptierten Freundschaften
    friendships = db.query(Friendship).filter(
        ((Friendship.sender_id == current_user.id) | (Friendship.receiver_id == current_user.id)) &
        (Friendship.status == "accepted")
    ).all()

    # Extrahiere IDs der Freunde
    friend_ids = [
        f.receiver_id if f.sender_id == current_user.id else f.sender_id
        for f in friendships
    ]

    if not friend_ids:
        return []

    # Aktivitäten: Turnierteilnahmen
    joined = db.query(
        TournamentParticipant.joined_at.label("date"),
        Tournament.name,
        User.username,
        Tournament.id.label("tournament_id"),
        literal("joined").label("type")
    ).join(User, TournamentParticipant.user_id == User.id
    ).join(Tournament, Tournament.id == TournamentParticipant.tournament_id
    ).filter(TournamentParticipant.user_id.in_(friend_ids)).all()

    # Aktivitäten: erstellte Turniere
    created = db.query(
        Tournament.created_at.label("date"),
        Tournament.name,
        User.username,
        Tournament.id.label("tournament_id"),
        literal("created").label("type")
    ).join(User, Tournament.created_by == User.id
    ).filter(Tournament.created_by.in_(friend_ids)).all()

    # Kombinieren und sortieren
    def make_aware(dt):
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)

    combined = joined + created
    combined.sort(key=lambda x: make_aware(x.date), reverse=True)

    return [
        {
            "type": a.type,
            "username": a.username,
            "tournament": a.name,
            "date": a.date,
            "tournament_id": str(a.tournament_id)
        } for a in combined
    ]




@profile_router.get("/{username}", response_model=PublicUserProfile)
def get_profile_by_username(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Benutzer nicht gefunden."
        )

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil für diesen Benutzer nicht gefunden."
        )
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()

    if not profile or not profile.is_public:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil für diesen Benutzer ist nicht öffentlich oder existiert nicht."
        )

    return PublicUserProfile(
        user_id=str(user.id),
        username=user.username,
        region=profile.region,
        main_game=profile.main_game,
        rank=profile.rank,
        play_style=profile.play_style,
        platform=profile.platform,
        favorite_games=profile.favorite_games,
        bio=profile.bio,
        profile_picture=profile.profile_picture,
        birthdate=profile.birthdate,
        languages=profile.languages,
        discord=profile.discord,
        steam=profile.steam,
        twitch=profile.twitch,
        youtube=profile.youtube,
        is_online=profile.is_online
    )

@profile_router.get("/view/{user_id}", response_model=PublicUserProfile)
def get_public_profile_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Benutzer nicht gefunden.")

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile or not profile.is_public:
        raise HTTPException(status_code=404, detail="Profil nicht öffentlich oder existiert nicht.")

    return PublicUserProfile(
        user_id=str(user.id),
        username=user.username,
        region=profile.region,
        main_game=profile.main_game,
        rank=profile.rank,
        play_style=profile.play_style,
        platform=profile.platform,
        favorite_games=profile.favorite_games,
        bio=profile.bio,
        profile_picture=profile.profile_picture,
        birthdate=profile.birthdate,
        languages=profile.languages,
        discord=profile.discord,
        steam=profile.steam,
        twitch=profile.twitch,
        youtube=profile.youtube,
        is_online=profile.is_online
    )

@profile_router.post("/subscribe")
def subscribe_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "Subscriber":
        return {"message": "Du bist bereits Subscriber."}

    current_user.role = "Subscriber"
    db.commit()
    return {"message": "Du bist jetzt Subscriber. Viel Spaß!"}

@profile_router.post("/unsubscribe")
def unsubscribe_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "Subscriber":
        return {"message": "Du bist kein Subscriber."}

    current_user.role = "User"  # zurück auf Standardrolle
    db.commit()
    return {"message": "Du bist kein Subscriber mehr."}


