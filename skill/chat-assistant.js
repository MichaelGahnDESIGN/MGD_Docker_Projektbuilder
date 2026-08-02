/**
 * Chat Assistant: Handle user questions and provide help
 * Phase 1: Basic structure, expanded in Phase 3
 */

async function ask(question) {
  if (!question) {
    console.log(`
❓ Chat Assistant - Stell eine Frage!

Beispiele:
  /platform ask Wie integriere ich Flutter?
  /platform ask Wie starte ich Docker?
  /platform ask Wie füge ich ein neues Projekt hinzu?
    `);
    return;
  }

  console.log(`
💬 Chat Assistant (Phase 3)

Deine Frage: "${question}"

✅ Vollständiger Chat-Modus mit:
   - Code-Beispiele
   - Troubleshooting
   - Projekt-Erweiterungen

wird in Phase 3 implementiert!

📖 Für jetzt: Siehe README.md im Platform-Verzeichnis
    `);
}

module.exports = { ask };
