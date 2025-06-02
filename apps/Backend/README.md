# 🎮 Gamerlink – Backend

## ✅ Voraussetzungen

- Python 3.10 oder neuer
- `pip` (Python-Paketmanager)
- Optional: `virtualenv` oder `venv` zur Verwaltung des Environments
- PostgreSQL installiert und lauffähig

---

## 🛠️ Setup-Schritte

### 1. Virtuelle Umgebung erstellen

```bash
python3 -m venv venv
source venv/bin/activate
```


---

### 2. PostgreSQL-Datenbank einrichten

- Installiere PostgreSQL, z. B. mit `apt`, `brew` oder dem offiziellen Installer.
- Erstelle eine Datenbank und einen Benutzer.
- Lege eine `.env`-Datei im Projektverzeichnis an mit:

DB_USER=postgres
DB_PASSWORD=passwort
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
JWT_EXPIRATION_MINUTES=60
JWT_ALGORITHM=HS256
JWT_SECRET=ein_langer_geheimer_schlüssel



---

### 3. Python-Module installieren

Falls keine `requirements.txt` vorhanden ist, installiere die benötigten Module manuell:

```bash
pip install fastapi
pip install sqlalchemy
pip install pydantic
pip install python-dotenv
pip install passlib[bcrypt]
```

Optional, je nach Code:

```bash
pip install uvicorn
```


### 4. Tabellen erstellen

```bash
python create_tables.py
```

---

### 5. Projekt starten

```bash
uvicorn main:app --reload
```

Die API ist nun unter [http://localhost:8000](http://localhost:8000) erreichbar.

---

