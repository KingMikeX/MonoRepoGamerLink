from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import SessionLocal
from register_login.user_register_login import UserCreate
from controllers.auth_controller import register_user
from register_login.user_register_login import UserLogin
from controllers.auth_controller import login_user
from utils.auth_dependencies import get_current_user
from models.user import User

auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# DB-Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user(user_data, db)

@auth_router.post("/login", status_code=status.HTTP_200_OK)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    return login_user(credentials, db)

@auth_router.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Willkommen {current_user.username}!",
        "user_id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email
    }