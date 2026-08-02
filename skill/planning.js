/**
 * Planning Phase: Recommend technology stack based on discovery
 * Explain choices in non-technical language
 */

const readline = require('readline');
const implementation = require('./implementation');

// Die Eingabe-Schnittstelle wird erst beim ersten Bedarf geoeffnet.
//
// Vorher entstand sie beim Laden des Moduls. Das hielt den Node-Prozess offen,
// sobald irgendetwas dieses Modul nur importierte -- die Testsuite lief dadurch
// zwar durch, beendete sich aber nicht mehr und musste abgewuergt werden.
let rl = null;

function getReadline() {
  if (!rl) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  }
  return rl;
}

function closeReadline() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    getReadline().question(prompt, resolve);
  });
}

/**
 * Generate technology recommendation based on discovery results
 * @param {object} discovery - Results from discovery phase
 */
async function recommend(discovery) {
  const { platformName, mainGoal, hasMarketplace, needsRealtime } = discovery;

  console.log(`
╔════════════════════════════════════════════════════════════╗
║    🔧 TECHNOLOGIE-EMPFEHLUNG                               ║
╚════════════════════════════════════════════════════════════╝
  `);

  const recommendation = buildRecommendation(discovery);

  console.log(`
✅ Ich habe verstanden! Du brauchst:
   - ${discovery.projects.length} verschiedene Editoren
   - ${hasMarketplace ? 'Ja, Marketplace zum Verkaufen' : 'Nein, nur interne Verwaltung'}
   - ${needsRealtime ? 'Ja, Realtime-Collaboration' : 'Nein, Solo-Editing'}

🔧 MEINE EMPFEHLUNG:

${recommendation.explanation}

💡 WARUM DIESE AUSWAHL?
${recommendation.rationale.map((r) => `   ✓ ${r}`).join('\n')}

📊 GESCHÄTZTE DAUER:
${recommendation.timeline}
  `);

  const approve = await question(`\n✅ Bereit? (j/n/ändern): `);

  if (approve.toLowerCase() === 'j') {
    console.log('\n🚀 Erstelle deine Platform...\n');
    await implementation.generate(discovery, recommendation);
    closeReadline();
  } else if (approve.toLowerCase() === 'n') {
    console.log('\n❌ Abgebrochen.');
    closeReadline();
  } else if (approve.toLowerCase() === 'ä') {
    console.log('\n🔄 Chat-Modus für Anpassungen (Phase 3)');
    closeReadline();
  }
}

/**
 * Build recommendation object
 * @param {object} discovery
 * @returns {object}
 */
function buildRecommendation(discovery) {
  const { mainGoal, hasMarketplace, needsRealtime } = discovery;
  const database = discovery.database || 'mariadb';

  const databaseLabels = {
    mariadb: 'MariaDB 11',
    mysql: 'MySQL 8',
    postgres: 'PostgreSQL 16',
  };
  const backendLabel = databaseLabels[database] || databaseLabels.mariadb;
  const apiLabel =
    database === 'postgres'
      ? 'PostgREST (auto-generiert)'
      : 'Directus (REST- & GraphQL-API + Admin-Oberfläche, auto-generiert)';

  const explanation = `
   ${backendLabel.toUpperCase()} (Das Gehirn)
   └─ Speichert Nutzerdaten, Logins, Inhalte
   └─ Wie ein sicheres Archiv für deine Platform
   └─ Du hostest es lokal (keine Cloud-Abhängigkeit)
   └─ Kostenlos & Open-Source (MIT Lizenz)

   GRAPESJS (Der Visual-Builder)
   └─ Drag-and-Drop Editor (wie Canva oder Figma)
   └─ User können ohne Coding designen
   └─ Kostenlos & Open-Source (MIT Lizenz)

   API-CLIENTS (Die Verbinder)
   └─ Automatisch generiert für:
      • Flutter (iOS/Android Apps)
      • Swift (native iOS)
      • PHP (Websites)
      • JavaScript/TypeScript (Web-Apps)

   ${hasMarketplace ? `
   MARKETPLACE (Bereits eingebaut)
   └─ User können Inhalte verkaufen
   └─ Käufer können kaufen
   └─ Seller bekommen Geld` : ''}

   ${needsRealtime ? `
   REALTIME (Live-Zusammenarbeit)
   └─ Mehrere User können zusammen editieren
   └─ Änderungen erscheinen sofort` : ''}
  `;

  const rationale = [
    `${backendLabel}: Flexibel, funktioniert für JEDES Projekt`,
    'GrapesJS: Anfänger-freundlich, visuell',
    'Selbstgehostet: Du behältst deine Daten',
    'Kostenlos: MIT Lizenz, kommerziell nutzbar',
    'Multi-Plattform: Apps auf jedem Device',
    mainGoal === 'marketplace'
      ? 'Optimiert für Monetisierung: Einfache Zahlungen'
      : 'Sicherheit: Deine Daten bleiben bei dir',
  ];

  const timeline = `
   - Setup: 30 Minuten
   - Erstes Projekt: 1-2 Stunden
   - Komplette Platform: 1 Tag (mit Docs)
  `;

  return {
    explanation,
    rationale,
    timeline,
    techStack: {
      backend: backendLabel,
      editor: 'GrapesJS',
      apis: apiLabel,
      sdks: ['flutter', 'swift', 'php', 'javascript'],
      realtime: needsRealtime,
      marketplace: hasMarketplace,
      database,
    },
  };
}

module.exports = { recommend, buildRecommendation };
