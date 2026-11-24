<!-- MGD-HEADER -->
<p align="center"><a href="https://Michael-Gahn.de"><img src="assets/mgd-logo.png" alt="Michael Gahn DESIGN" width="48"></a></p>

<p align="center"><img src="assets/banner.svg" alt="MGD Platform Builder" width="100%"></p>

<p align="center">
  <img alt="Lizenz" src="https://img.shields.io/github/license/MichaelGahnDESIGN/MGD_Platform-Builder_TOOL?label=Lizenz">
  <img alt="Sprache" src="https://img.shields.io/badge/Sprache-JavaScript-2f6fed">
  <a href="https://Michael-Gahn.de"><img alt="by Michael Gahn DESIGN" src="https://img.shields.io/badge/by-Michael%20Gahn%20DESIGN-cd1616"></a>
</p>
<!-- /MGD-HEADER -->

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

<!-- MGD-RELATED:START -->
## Skill-Empfehlungen

Passt gut dazu:

| Skill | Befehl | Wofür |
|---|---|---|
| [MGD_DEV_SKILL](https://github.com/MichaelGahnDESIGN/MGD_DEV_SKILL) | `/dev` | Release, Sync, Backup, Cleanup, Tests und Wissensdokumentation |
| [MGD_Backup_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Backup_SKILL) | `/backup` | Backups lokal, NAS und Cloud mit Prüfsummen |
| [MGD_Software-Updater_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Software-Updater_SKILL) | `/software-updater` | Update-Systeme planen und umsetzen |

## Verwandte MGD Projekte

<details><summary>Alle MGD-Skills und Werkzeuge anzeigen</summary>

| Projekt | Befehl | Wofür |
|---|---|---|
| [MGD_Todo_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Todo_SKILL) | `/todo` | Aufgabenliste in einer HTML-Datei, dazu /board, /wissen, /fragenkatalog, /prozesse |
| [MGD_DEV_SKILL](https://github.com/MichaelGahnDESIGN/MGD_DEV_SKILL) | `/dev` | Release, Sync, Backup, Cleanup, Tests und Wissensdokumentation |
| [MGD_Autopilot_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Autopilot_SKILL) | `/autopilot` | Projektziele sicher unbeaufsichtigt abarbeiten |
| [MGD_Backup_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Backup_SKILL) | `/backup` | Backups lokal, NAS und Cloud mit Prüfsummen |
| [MGD_AI-Thread](https://github.com/MichaelGahnDESIGN/MGD_AI-Thread) | `/thread` | Ehrliche Übergabe, bevor das Kontextfenster voll ist |
| [MGD_ProjectClean_SKILL](https://github.com/MichaelGahnDESIGN/MGD_ProjectClean_SKILL) | `/projectclean` | Abschluss und Aufräumen: Version, Tests, Commit, Doku, Backup |
| [MGD_Living-Documentation](https://github.com/MichaelGahnDESIGN/MGD_Living-Documentation) | `/doku` | Lebendige Dokumentation: keine Entscheidung geht verloren |
| [MGD_BugReport_SKILL](https://github.com/MichaelGahnDESIGN/MGD_BugReport_SKILL) | `/bugreport` | Handbuch für Bug-Reports, Feedback und QA in Apps |
| [MGD_AI-PlayTest_SKILL](https://github.com/MichaelGahnDESIGN/MGD_AI-PlayTest_SKILL) | `/playtest` | Test aus Nutzerperspektive für KI-gebaute Funktionen |
| [MGD_AI-Testaccount_SKILL](https://github.com/MichaelGahnDESIGN/MGD_AI-Testaccount_SKILL) | `/testaccount` | Testkonten per Plus-Adresse mit klaren Sicherheitsregeln |
| [MGD_Software-Updater_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Software-Updater_SKILL) | `/software-updater` | Update-Systeme planen und umsetzen |
| [MGD_Divi5-Dev_SKILL](https://github.com/MichaelGahnDESIGN/MGD_Divi5-Dev_SKILL) | `/divi` | WordPress und Divi 5: Animationen, Plugins, Child-Themes |
| [MGD_JTL-OPC_SKILL](https://github.com/MichaelGahnDESIGN/MGD_JTL-OPC_SKILL) | `/jtl-opc` | JTL-Shop-5-Seiten im OnPage Composer automatisch befüllen |
| [MGD-SEO](https://github.com/MichaelGahnDESIGN/MGD-SEO) | `/seo` | SEO-Skill mit lokalem Prüfkern |
| [MGD-Motion-Graphics-Video-Skill](https://github.com/MichaelGahnDESIGN/MGD-Motion-Graphics-Video-Skill) | `/mgd-video` | Reels, YouTube, Werbefilme und Animationen |
| [MGD-Foundry-VTT_Skill](https://github.com/MichaelGahnDESIGN/MGD-Foundry-VTT_Skill) | `/vttl-notizbuch` | Foundry VTT und D&D-Notizbücher |
| [MGD_AI-Basic-Projektordner_TOOL](https://github.com/MichaelGahnDESIGN/MGD_AI-Basic-Projektordner_TOOL) | `Vorlage` | Projektordner für ChatGPT Codex, Cowork und Claude Code |
| [MGD_Claude-Codex_MCP](https://github.com/MichaelGahnDESIGN/MGD_Claude-Codex_MCP) | `MCP` | Lokales MCP für Aufgaben, Chat und Übergaben zwischen KI-Agenten |

</details>

Mit `/skill-update` (im Todo-Skill) holst du alle lokal installierten MGD-Skills auf den neuesten Stand.
<!-- MGD-RELATED:END -->

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

Tel.: +49 (0) 151 59156639<br>
E-Mail: Anfrage@Michael-Gahn.de

**Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:**  
Steuernummer: 223/222/02451  
Ust-ID: DE288143343

<!-- MGD-LEGAL -->
---

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](https://opensource.org/license/mit). Den vollständigen Text enthält die Datei [LICENSE](LICENSE).

## Impressum

**Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)**

Michael Gahn DESIGN  
Michael Gahn  
Dr.-Theodor-Brugsch Str. 12  
08529 Plauen  
Sachsen  
Deutschland

Tel.: +49 (0) 151 59156639  
E-Mail: Anfrage@Michael-Gahn.de

Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:  
Steuernummer: 223/222/02451  
Ust-ID: DE288143343

Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.

**Redaktionell verantwortlich:**

Michael Gahn DESIGN  
Michael Gahn  
Dr.-Theodor-Brugsch Str. 12  
08529 Plauen  
Sachsen  
Deutschland

Tel.: +49 (0) 151 59156639  
E-Mail: Anfrage@Michael-Gahn.de
<!-- /MGD-LEGAL -->
