# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

# Nur lokal die .env-Datei laden.
# Auf Vercel werden die Umgebungsvariablen direkt gesetzt.
# "VERCEL_ENV" ist eine Vercel-spezifische Umgebungsvariable.
if os.environ.get("VERCEL_ENV") != "production": # Oder einfach `if not os.getenv("DATABASE_URL"): load_dotenv()`
    load_dotenv()

# ************ WICHTIGE ANPASSUNG HIER ************
# Versuche zuerst, die komplette DATABASE_URL zu laden, wie sie von Vercel (oder Supabase) bereitgestellt wird.
# Du hast `POSTGRES_URL` in Vercel gesetzt, also verwenden wir diese.
DATABASE_URL = os.getenv("POSTGRES_URL")

# Wenn POSTGRES_URL nicht direkt verfügbar ist (z.B. wenn du lokal einzelne Variablen nutzt),
# dann baue sie aus den einzelnen Komponenten zusammen.
# Dies ist die Fallback-Logik für deine lokale Entwicklung, falls du keine vollständige URL in deiner .env hast.
if not DATABASE_URL:
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")

    # Stelle sicher, dass alle benötigten Variablen gesetzt sind, bevor du die URL baust
    if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
        raise ValueError("Missing one or more database environment variables (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME or POSTGRES_URL)")

    # Es ist eine gute Praxis, den Datenbanktreiber explizit anzugeben.
    # Wenn du Supabase/PostgreSQL nutzt, ist es oft 'postgresql+psycopg2://'
    # oder 'postgresql://' wenn du die Standard-Python-Bibliothek 'pg' oder 'psycopg2' verwendest.
    # Stelle sicher, dass 'psycopg2-binary' (oder ein anderer PostgreSQL-Treiber) in deiner requirements.txt ist.
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


# Engine und Session einrichten
# Für Supabase oder andere Cloud-Postgres-Dienste musst du oft SSL/TLS konfigurieren.
# SQLAlchemy's create_engine nimmt einen `connect_args` Parameter für spezifische Verbindungsoptionen.
# Wenn du SQLAlchemy mit psycopg2 nutzt, könnte das so aussehen:
# engine = create_engine(DATABASE_URL, connect_args={"sslmode": "require"}) # Füge dies hinzu, wenn nötig
engine = create_engine(DATABASE_URL) # Für den Anfang ohne SSL-Mode
# Wenn du Supabase verwendest, könnte der "Connection string" von Supabase bereits `?sslmode=require` enthalten,
# dann musst du es hier nicht extra angeben.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base-Klasse für Modelle
Base = declarative_base()

# Optional: Eine Abhängigkeit für FastAPI, um eine DB-Session zu erhalten
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()