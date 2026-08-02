# /platform — Universeller SaaS Platform-Builder

Intelligenter Assistent für Multi-Project SaaS-Plattformen mit MariaDB, GrapesJS und auto-generierten SDKs.

## Commands

### `/platform start`
Geführter Wizard für neuen Platform-Setup.

### `/platform ask [frage]`
Chat-Assistent für Clarifications & Customizations.

### `/platform status`
Zeige aktuelle Platform-Config.

### `/platform extend`
Neues Projekt hinzufügen.

### `/platform docs [sektion]`
Dokumentation anzeigen.

### `/platform reset`
Zurücksetzen (mit Bestätigung).

---

## Zwei Modi

**Guided Flow (`/platform start`):**
- Discovery: Nutzer antwortet Fragen (nicht-technisch)
- Planning: Assistent empfiehlt Tech-Stack & erklärt
- Implementation: Automatische Generierung kompletter Platform

**Chat Assistant (`/platform ask`):**
- Verfügbar während & nach Setup
- Clarifications, Code-Beispiele, Troubleshooting
- Kann Platform erweitern (Projekte hinzufügen, etc.)

---

## Output

Jede Platform enthält:
- Docker-Compose Setup (Datenbank + API + Adminer, lokal)
- Schema fuer die gewaehlte Datenbank (auto-generiert)
- GrapesJS Editor-Konfiguration
- SDK-Clients (Flutter, Swift, PHP, JavaScript)
- Marketplace-Boilerplate
- Anfänger-freundliche Dokumentation

---

## Tech Stack

- **Backend:** MariaDB, MySQL oder PostgreSQL -- Auswahl im Assistenten
- **Editor:** GrapesJS (Drag-and-Drop, visuell)
- **SDKs:** Auto-generiert pro Sprache
- **Marketplace:** Custom (Datenbank + Webhooks)
- **Deployment:** Docker Compose (lokal-first)

---

## Non-Technical First

All explanations use analogies, not jargon. Generated docs explain "why" before "how". No programming background assumed.

---

*Version: 1.0.0 | Lizenz: MIT*
