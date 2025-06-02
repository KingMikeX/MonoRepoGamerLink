from db.database import Base, engine
from models.user import User
from models.user_profile import UserProfile
from models.tournament_data import Tournament
from models.tournament_participant import TournamentParticipant
from models.tournament_team import TournamentTeam
from models.tournament_matches import TournamentMatch
from models.tournament_results import TournamentResult
from models.tournament_prize import TournamentPrize
from models.friendship import  Friendship
import os

# Nur für Entwicklungsumgebungen: Löscht alle Tabellen und erstellt sie neu
print("⚠️ Lösche bestehende Tabellen...")
Base.metadata.drop_all(bind=engine)

print("🛠️ Erstelle Tabellen...")
Base.metadata.create_all(bind=engine)

print("✅ Tabellen wurden neu erstellt.")


upload_dir = "Backend/src/uploads/profile_pictures"
os.makedirs(upload_dir, exist_ok=True)
print(f"📁 Ordner '{upload_dir}' überprüft bzw. erstellt.")
