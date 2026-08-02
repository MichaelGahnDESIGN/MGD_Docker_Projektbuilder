<div align="center">

# 🏗 MGD Platform Builder

**Sieben Fragen beantworten — fertiges Plattform-Gerüst bekommen.**

Datenbank, API-Schicht, Admin-Oberfläche und Schema als lauffähiges
Docker-Setup. Selbstgehostet, kein Cloud-Zwang.

[![Lizenz](https://img.shields.io/badge/Lizenz-MIT-blue?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/Node-%E2%89%A518-339933?style=flat-square)](#-installation)
[![Tests](https://img.shields.io/badge/Tests-25%20gr%C3%BCn-brightgreen?style=flat-square)](#tests)

</div>

---

## So liest sich diese Dokumentation

> [!NOTE]
> **👤 FÜR ENTWICKLER** — Einrichtung und Befehle, die **du** ausführst.

> [!TIP]
> **🤖 FÜR KI-AGENTEN** — Anweisungen für Claude Code oder ChatGPT Codex.

> [!WARNING]
> **⚠️ FALLSTRICK** — Verhalten, das überrascht.

---

## Das Problem

Jedes neue Projekt beginnt mit denselben zwei Tagen: Datenbank aufsetzen,
Schema schreiben, eine API davorbauen, Admin-Oberfläche einrichten,
Docker-Compose zusammenstöpseln. Immer dasselbe, immer leicht anders, immer
mit denselben Flüchtigkeitsfehlern.

Dieser Assistent nimmt dir das ab — **ohne dass du dich vorher für einen
Technik-Stapel entscheiden musst**. Er fragt in normaler Sprache, erklärt seine
Empfehlung und erzeugt dann ein Gerüst, das startet.

## Was dabei herauskommt

```
platform-<dein-name>/
├─ docker-compose.yml    Datenbank + API + Adminer, startklar
├─ schema.sql            Tabellen für Nutzer, Projekte, Inhalte, Rechte
├─ .env.example          Zugangsdaten-Vorlage
└─ README.md             Schnellstart für genau dieses Gerüst
```

---

## 🗄 Die Datenbank wählst du

| | Datenbank | API-Schicht | Admin |
|---|---|---|---|
| **Standard** | **MariaDB 11** | Directus (REST + GraphQL) | Adminer |
| | MySQL 8 | Directus (REST + GraphQL) | Adminer |
| | PostgreSQL 16 | PostgREST | Adminer |

**Warum Directus bei MariaDB?** PostgREST erzeugt seine REST-Schnittstelle aus
PostgreSQL-Bordmitteln — mit MariaDB gibt es das schlicht nicht. Directus läuft
mit MariaDB und MySQL, liefert REST *und* GraphQL plus eine
Admin-Oberfläche, ist Open Source und Docker-fähig. Der Nutzen bleibt derselbe:
**fertige API ohne selbstgeschriebenen Backend-Code.**

> [!WARNING]
> **⚠️ FALLSTRICK** — Das erzeugte Schema ist **dialektabhängig**. MariaDB und
> MySQL kennen kein `SERIAL`, kein `JSONB` und kein `uuid_generate_v4()`. Der
> Generator erzeugt für sie `BIGINT AUTO_INCREMENT`, `JSON` und
> `ENGINE=InnoDB … utf8mb4`. Ein PostgreSQL-Schema lässt sich **nicht** einfach
> gegen MariaDB fahren — dafür gibt es die Auswahl.

---

## 🚀 Installation

> [!NOTE]
> **👤 FÜR ENTWICKLER**
>
> ```bash
> git clone https://github.com/MichaelGahnDESIGN/MGD_Platform-Builder_TOOL.git
> cd MGD_Platform-Builder_TOOL
> npm install
> npm start
> ```
>
> Voraussetzung: Node 18 oder neuer. Für das erzeugte Gerüst zusätzlich Docker.

## 💬 So läuft der Assistent

```
npm start
  → 7 Fragen in normaler Sprache, plus Name und Zweck je Projekt
  → Empfehlung wird erklärt, du genehmigst oder änderst
  → Gerüst wird erzeugt
```

Danach:

> [!NOTE]
> **👤 FÜR ENTWICKLER**
>
> ```bash
> cd platform-<dein-name>
> cp .env.example .env      # Zugangsdaten anpassen
> docker compose up
> ```
>
> Adminer liegt dann auf `http://localhost:8080`, die API auf `:8055`
> (Directus) beziehungsweise `:3000` (PostgREST).

> [!WARNING]
> **⚠️ FALLSTRICK** — Die erzeugte `docker-compose.yml` enthält
> **Beispiel-Passwörter** und bei Directus `KEY`/`SECRET` als Platzhalter.
> Vor jedem Einsatz außerhalb deines Rechners ersetzen.

---

## 🤖 Für KI-Agenten

> [!TIP]
> **🤖 FÜR KI-AGENTEN** — Das Projekt bringt Befehlsdateien für Claude Code und
> ChatGPT Codex mit (`platform-builder.md`). Der Assistent ist ein
> Kommandozeilen-Dialog: Er stellt Fragen und wartet auf Eingaben. Er lässt sich
> deshalb nicht sinnvoll unbeaufsichtigt starten — sammle die Antworten vorher
> und gib sie ein, oder rufe `buildRecommendation()` und `generate()` direkt auf:
>
> ```js
> const planning = require('./skill/planning');
> const implementation = require('./skill/implementation');
>
> const discovery = {
>   platformName: 'Mein Projekt',
>   mainGoal: 'quest-editor',
>   database: 'mariadb',          // mariadb | mysql | postgres
>   projects: [{ name: 'Quests', description: 'Quest-Editor' }],
>   hasMarketplace: false,
>   needsRealtime: false,
> };
>
> await implementation.generate(discovery, planning.buildRecommendation(discovery));
> ```

---

## Tests

```bash
npm test          # 25 Tests, Jest
node test-phase1.js   # 16 zusätzliche Prüfungen
```

Abgedeckt sind unter anderem: die Empfehlung je Datenbank, dass ein
MariaDB-Setup **kein** `postgres`/`postgrest` enthält, dass das MariaDB-Schema
frei von `SERIAL` und `JSONB` ist, und dass Plattformnamen zu gültigen
Datenbanknamen werden.

> [!WARNING]
> **⚠️ FALLSTRICK** — Ein Plattformname wie „Probe-App" ergab früher die
> Datenbank `probe-app`. In MariaDB und MySQL ist das zwar erlaubt, aber nur
> mit Backticks ansprechbar — eine Falle in jedem handgeschriebenen SQL.
> Umlaute brachen es ganz. Namen werden jetzt zu gültigen Bezeichnern
> normalisiert (`probe_app`), inklusive Umlaut-Auflösung.

---

## 🚫 Grenzen

- **Phase 1.** Erzeugt wird das Gerüst: Datenbank, Schema, API-Schicht, Admin.
  **Nicht** enthalten sind die in der Empfehlung genannten SDK-Generatoren für
  Flutter, Swift, PHP und JavaScript — die sind geplant, nicht gebaut.
- **Kein Ersatz für Datenmodellierung.** Das Schema ist ein tragfähiger
  Ausgangspunkt (Nutzer, Projekte, Inhalte, Rechte), kein fertiges Fachmodell.
- **Kein Produktionshärten.** Das erzeugte Setup ist für die lokale Entwicklung
  gedacht. Passwörter, TLS, Sicherungen und Rechtevergabe bleiben deine Aufgabe.

---

## 🔗 Passt zusammen mit

| Projekt | Rolle |
|---|---|
| [`/autopilot`](https://github.com/MichaelGahnDESIGN/MGD_Autopilot_SKILL) | Ziele unbeaufsichtigt abarbeiten, mit Pflichtprüfung |
| [`/todo`](https://github.com/MichaelGahnDESIGN/MGD_Todo_SKILL) | Aufgaben im Projekt festhalten |
| [`/dev`](https://github.com/MichaelGahnDESIGN/MGD_DEV_SKILL) | Release, Sync, Tests |
| [`/backup`](https://github.com/MichaelGahnDESIGN/MGD_Backup_SKILL) | Sicherungen, bevor es riskant wird |

---

## 📄 Lizenz

MIT — siehe [LICENSE](LICENSE).

---

## Impressum

**Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)**

Michael Gahn DESIGN  
https://Michael-Gahn.de

Michael Gahn  
Dr.-Theodor-Brugsch Str. 12  
08529 Plauen  
Sachsen  
Deutschland

Tel.: +49 (0) 176 557 647 48  
E-Mail: Anfrage@Michael-Gahn.de

**Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:**  
Steuernummer: 223/222/02451  
Ust-ID: DE288143343
