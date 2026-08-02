/**
 * Implementation Phase: Generate complete platform scaffold
 */

const engine = require('./template-engine');
const fs = require('fs');
const path = require('path');

async function generate(discovery, recommendation) {
  const { platformName } = discovery;
  const { backend, apis } = recommendation.techStack;
  const outputDir = `platform-${platformName.toLowerCase().replace(/\s+/g, '-')}`;

  console.log(`\n🚀 Erstelle Platform in: ${outputDir}\n`);

  try {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Build template context
    const context = engine.buildTemplateContext(discovery, recommendation);

    // Generate files
    console.log('✅ docker-compose.yml');
    await engine.renderToFile(
      'docker-compose.yml',
      context,
      path.join(outputDir, 'docker-compose.yml')
    );

    console.log('✅ .env.example');
    await engine.renderToFile(
      '.env.example',
      context,
      path.join(outputDir, '.env.example')
    );

    console.log('✅ schema.sql');
    await engine.renderToFile(
      'schema.sql',
      context,
      path.join(outputDir, 'schema.sql')
    );

    // Create README
    const readmeContent = `# ${platformName}

Generiert von MGD_Platform-Builder_TOOL am ${new Date().toISOString()}

## 🚀 Quick Start

\`\`\`bash
# 1. Starte Docker-Compose
docker-compose up

# 2. Öffne Admin-Panel
# http://localhost:8080

# 3. Erstelle .env Datei
cp .env.example .env

# 4. Initialisiere Datenbank
# Schema ist in schema.sql
\`\`\`

## 📁 Dateien

- \`docker-compose.yml\` — Docker-Setup (${backend} + ${apis})
- \`.env.example\` — Umgebungsvariablen Template
- \`schema.sql\` — Datenbankschema
- \`grapesjs-config/\` — Editor-Konfiguration (Phase 2)
- \`sdks/\` — Client-Bibliotheken (Phase 2)

## 🛠️ Tech Stack

- **Backend:** ${backend}
- **Editor:** GrapesJS
- **APIs:** ${apis}

## ❓ Fragen?

\`\`\`
/platform ask Wie integriere ich Flutter?
/platform docs
/platform status
\`\`\`

---

**MIT License | Open Source | Kostenlos**
`;

    fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);
    console.log('✅ README.md');

    console.log(`
✨ Platform erfolgreich erstellt!

📁 Verzeichnis: ${outputDir}
📄 Dateien:
   - docker-compose.yml
   - .env.example
   - schema.sql
   - README.md

🚀 Nächste Schritte:
   1. cd ${outputDir}
   2. docker-compose up
   3. Öffne: http://localhost:8080

❓ Fragen? → /platform ask
    `);

  } catch (error) {
    console.error(`❌ Fehler: ${error.message}`);
    throw error;
  }
}

async function extend() {
  console.log('📦 Projekt hinzufügen (Phase 2)');
}

module.exports = { generate, extend };
