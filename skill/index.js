/**
 * MGD_Platform-Builder_TOOL
 * Main entry point for the platform-builder skill
 */

const discovery = require('./discovery');
const planning = require('./planning');
const implementation = require('./implementation');
const chatAssistant = require('./chat-assistant');

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  try {
    switch (command) {
      case 'start':
        return await discovery.start();

      case 'ask':
        return await chatAssistant.ask(args.join(' '));

      case 'status':
        return await showStatus();

      case 'extend':
        return await implementation.extend();

      case 'docs':
        return await showDocs(args[0]);

      case 'reset':
        return await reset();

      default:
        console.log(`
Verfügbare Commands:
  /platform start           Geführter Setup-Wizard
  /platform ask [frage]     Chat mit Assistent
  /platform status          Platform-Config zeigen
  /platform extend          Neues Projekt hinzufügen
  /platform docs [sektion]  Dokumentation anzeigen
  /platform reset           Zurücksetzen
        `);
        return;
    }
  } catch (error) {
    console.error(`❌ Fehler: ${error.message}`);
    process.exit(1);
  }
}

async function showStatus() {
  console.log(`📊 Platform Status (Phase 2)`);
}

async function showDocs(section) {
  console.log(`📚 Dokumentation: ${section || 'alle'} (Phase 3)`);
}

async function reset() {
  console.log(`⚠️  Platform zurücksetzen? (Phase 3)`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
