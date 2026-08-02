/**
 * Discovery Phase: Understand what user wants to build
 * Guided flow with interactive questions (non-technical)
 */

const readline = require('readline');
const utils = require('./utils');
const planning = require('./planning');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

/**
 * Start discovery wizard
 */
async function start() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║    🎉 Willkommen bei MGD_Platform-Builder_TOOL             ║
║                                                            ║
║  Lass uns deine SaaS-Platform zusammen bauen!             ║
║  (Einfach ein paar Fragen beantworten)                    ║
╚════════════════════════════════════════════════════════════╝
  `);

  try {
    const platformName = await question(
      `\n📝 Wie heißt deine Platform?\n   (z.B. MyQuestApp, ArtistMarketplace)\n   > `
    );

    if (!platformName.trim()) {
      console.log('❌ Platform-Name erforderlich');
      return;
    }

    console.log(`
\n🎯 Was ist dein Hauptziel?

a) Quest/Story-Editor (wie D&D)
b) Produkt-Marketplace (Items, Skins, Plugins verkaufen)
c) Community/Collaboration App
d) Game-Backend
e) Etwas anderes
    `);
    const goalChoice = await question(`   Wähle (a-e): `);

    const goalMap = {
      a: 'quest-editor',
      b: 'marketplace',
      c: 'community',
      d: 'game-backend',
      e: 'other',
    };
    const mainGoal = goalMap[goalChoice] || 'other';

    console.log(`
\n📦 Wie viele verschiedene Projekte/Editoren brauchst du?

a) Ein Editor
b) 2-3 verschiedene Editoren
c) Viele Editoren (bin mir noch nicht sicher)
    `);
    const projectCountChoice = await question(`   Wähle (a-c): `);

    const projectCountMap = { a: 1, b: 3, c: 5 };
    const expectedProjectCount = projectCountMap[projectCountChoice] || 1;

    const projects = [];
    const projectsToAsk = Math.min(expectedProjectCount, 3);

    for (let i = 0; i < projectsToAsk; i++) {
      console.log(`\n📂 Projekt ${i + 1}:`);
      const projectName = await question(`   Name (z.B. Quest-Builder): `);
      const projectDesc = await question(`   Wofür nutzen es die User? `);
      projects.push({
        name: projectName,
        description: projectDesc,
      });
    }

    if (expectedProjectCount > 3) {
      console.log(`\n✅ Erste 3 erfasst, ${expectedProjectCount - 3} weitere später.`);
    }

    console.log(`
\n🛍️  Sollen User ihre Inhalte verkaufen können?

a) Ja, ich will einen Marketplace
b) Nein, nur interne Verwaltung
    `);
    const marketplaceChoice = await question(`   Wähle (a/b): `);
    const hasMarketplace = marketplaceChoice === 'a';

    console.log(`
\n⚡ Mehrere User gleichzeitig editieren?

a) Ja, Realtime-Collaboration ist wichtig
b) Nein, jeder arbeitet allein
    `);
    const realtimeChoice = await question(`   Wähle (a/b): `);
    const needsRealtime = realtimeChoice === 'a';

    console.log(`
\n🗄️  Welche Datenbank soll deine Platform nutzen?
   (Die Datenbank speichert alle deine Daten sicher ab)

a) mariadb    (Standard, empfohlen — kostenlos, weit verbreitet, gut für die meisten Projekte)
b) mysql      (ähnlich wie MariaDB, falls du das bereits kennst)
c) postgres   (leistungsstark, oft für komplexere/individuelle Anwendungen genutzt)
    `);
    const databaseChoice = await question(`   Wähle (a-c, Enter = mariadb): `);

    const databaseMap = { a: 'mariadb', b: 'mysql', c: 'postgres' };
    const database = databaseMap[databaseChoice.trim().toLowerCase()] || 'mariadb';

    const discoveryResult = {
      platformName: platformName.trim(),
      mainGoal,
      projects,
      hasMarketplace,
      needsRealtime,
      expectedProjectCount,
      database,
    };

    console.log(`\n✅ Danke! Lasse mich das analysieren...\n`);

    const configPath = utils.savePlatformConfig(
      platformName,
      discoveryResult
    );
    console.log(`📁 Config gespeichert: ${configPath}`);

    await planning.recommend(discoveryResult);
    rl.close();
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    rl.close();
  }
}

module.exports = { start };
