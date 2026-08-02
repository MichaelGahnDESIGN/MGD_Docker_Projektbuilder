#!/usr/bin/env node

/**
 * Manual Phase 1 Test Runner
 * Testet Discovery, Planning, Template-Engine ohne Jest
 */

const utils = require('./skill/utils');
const planning = require('./skill/planning');
const engine = require('./skill/template-engine');
const fs = require('fs');
const path = require('path');

let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Fehler: ${error.message}`);
    failedTests++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cleanup() {
  const dirs = fs.readdirSync('.');
  dirs
    .filter((d) => d.startsWith('.platform-'))
    .forEach((d) => {
      if (fs.existsSync(d)) {
        fs.rmSync(d, { recursive: true, force: true });
      }
    });
  ['test-docker-compose.yml', 'test-.env', 'test-schema.sql'].forEach((f) => {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  });
}

console.log(`
╔════════════════════════════════════════════════════════════╗
║    🧪 MGD_Platform-Builder_TOOL — Phase 1 Test Suite       ║
╚════════════════════════════════════════════════════════════╝
`);

// ============ UTILS TESTS ============
console.log('\n📦 Utils Module:');

test('savePlatformConfig speichert Config', () => {
  cleanup();
  const config = {
    platformName: 'TestApp',
    mainGoal: 'quest-editor',
    projects: [{ name: 'Quests', description: 'Quest builder' }],
  };
  const configPath = utils.savePlatformConfig('TestApp', config);
  assert(fs.existsSync(configPath), 'Config-Datei nicht erstellt');
  assert(configPath.includes('.platform-testapp'), 'Falsches Verzeichnis');
  cleanup();
});

test('loadPlatformConfig lädt gespeicherte Config', () => {
  cleanup();
  const originalConfig = {
    platformName: 'TestApp',
    mainGoal: 'marketplace',
    projects: [],
  };
  utils.savePlatformConfig('TestApp', originalConfig);
  const loaded = utils.loadPlatformConfig('TestApp');
  assert(loaded.platformName === 'TestApp', 'platformName falsch');
  assert(loaded.mainGoal === 'marketplace', 'mainGoal falsch');
  cleanup();
});

test('formatForNonTechnical konvertiert Jargon', () => {
  const text = 'Supabase uses PostgreSQL';
  const result = utils.formatForNonTechnical(text);
  assert(result.includes('Datenbank'), 'Supabase nicht konvertiert');
  assert(result.includes('Login'), 'PostgreSQL nicht konvertiert');
});

// ============ PLANNING TESTS ============
console.log('\n🎯 Planning Module:');

test('buildRecommendation nutzt MariaDB als Standard-Datenbank', () => {
  const discovery = {
    platformName: 'TestApp',
    mainGoal: 'quest-editor',
    projects: [{ name: 'Quests', description: 'Quest builder' }],
    hasMarketplace: false,
    needsRealtime: false,
    // database bewusst nicht gesetzt -> Standard mariadb
  };
  const rec = planning.buildRecommendation(discovery);
  assert(rec.explanation.includes('MARIADB'), 'MariaDB nicht in Erklärung');
  assert(rec.techStack.backend.includes('MariaDB'), 'MariaDB nicht im Stack');
});

test('buildRecommendation liefert korrekten techStack.backend je Datenbank', () => {
  const base = {
    platformName: 'TestApp',
    mainGoal: 'quest-editor',
    projects: [{ name: 'Quests', description: 'Quest builder' }],
    hasMarketplace: false,
    needsRealtime: false,
  };
  const mariadb = planning.buildRecommendation({ ...base, database: 'mariadb' });
  const mysql = planning.buildRecommendation({ ...base, database: 'mysql' });
  const postgres = planning.buildRecommendation({ ...base, database: 'postgres' });

  assert(mariadb.techStack.backend === 'MariaDB 11', 'mariadb backend falsch');
  assert(mariadb.techStack.apis.includes('Directus'), 'mariadb sollte Directus nutzen');
  assert(mysql.techStack.backend === 'MySQL 8', 'mysql backend falsch');
  assert(mysql.techStack.apis.includes('Directus'), 'mysql sollte Directus nutzen');
  assert(postgres.techStack.backend === 'PostgreSQL 16', 'postgres backend falsch');
  assert(postgres.techStack.apis.includes('PostgREST'), 'postgres sollte PostgREST nutzen');
});

test('buildRecommendation includes Marketplace-Tabelle wenn nötig', () => {
  const discovery = {
    platformName: 'TestApp',
    mainGoal: 'marketplace',
    projects: [{ name: 'Products', description: 'Product editor' }],
    hasMarketplace: true,
    needsRealtime: false,
  };
  const rec = planning.buildRecommendation(discovery);
  assert(rec.techStack.marketplace === true, 'Marketplace nicht aktiviert');
  assert(rec.explanation.includes('MARKETPLACE'), 'MARKETPLACE nicht erwähnt');
});

test('buildRecommendation includes Realtime wenn nötig', () => {
  const discovery = {
    platformName: 'TestApp',
    mainGoal: 'community',
    projects: [{ name: 'Community', description: 'Collaborative space' }],
    hasMarketplace: false,
    needsRealtime: true,
  };
  const rec = planning.buildRecommendation(discovery);
  assert(rec.techStack.realtime === true, 'Realtime nicht aktiviert');
  assert(rec.explanation.includes('REALTIME'), 'REALTIME nicht erwähnt');
});

test('buildRecommendation includes alle Core-SDKs', () => {
  const discovery = {
    platformName: 'TestApp',
    mainGoal: 'quest-editor',
    projects: [{ name: 'Quests', description: 'Quest builder' }],
    hasMarketplace: false,
    needsRealtime: false,
  };
  const rec = planning.buildRecommendation(discovery);
  assert(rec.techStack.sdks.includes('flutter'), 'Flutter SDK fehlt');
  assert(rec.techStack.sdks.includes('swift'), 'Swift SDK fehlt');
  assert(rec.techStack.sdks.includes('php'), 'PHP SDK fehlt');
  assert(rec.techStack.sdks.includes('javascript'), 'JavaScript SDK fehlt');
});

// ============ TEMPLATE ENGINE TESTS ============
console.log('\n📄 Template Engine Module:');

test('buildTemplateContext erstellt Struktur', () => {
  const discovery = {
    platformName: 'TestApp',
    projects: [{ name: 'Q1', description: 'Quest builder' }],
    hasMarketplace: true,
    needsRealtime: false,
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);
  assert(ctx.platformName === 'TestApp', 'platformName falsch');
  assert(ctx.platformNameKebab === 'testapp', 'platformNameKebab falsch');
  assert(ctx.platformNameSnake === 'testapp', 'platformNameSnake falsch');
  assert(ctx.hasMarketplace === true, 'hasMarketplace falsch');
  assert(ctx.needsRealtime === false, 'needsRealtime falsch');
});

test('buildTemplateContext konvertiert Spaces zu Kebab-Case', () => {
  const discovery = {
    platformName: 'My Quest App',
    projects: [],
    hasMarketplace: false,
    needsRealtime: false,
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);
  assert(ctx.platformNameKebab === 'my-quest-app', 'Kebab-Case falsch');
  assert(ctx.platformNameSnake === 'my_quest_app', 'Snake-Case falsch');
});

test('renderToFile erstellt docker-compose.yml (postgres)', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: false,
    needsRealtime: false,
    database: 'postgres',
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    'docker-compose.yml',
    ctx,
    'test-docker-compose.yml'
  );

  assert(fs.existsSync('test-docker-compose.yml'), 'Datei nicht erstellt');
  const content = fs.readFileSync('test-docker-compose.yml', 'utf8');
  assert(content.includes('postgres'), 'postgres nicht im Content');
  assert(content.includes('postgrest'), 'postgrest nicht im Content');
  assert(content.includes('testapp_postgres'), 'Container-Name falsch');
  cleanup();
});

test('renderToFile erstellt docker-compose.yml ohne postgres/postgrest bei mariadb (Standard)', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: false,
    needsRealtime: false,
    // database bewusst nicht gesetzt -> Standard mariadb
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    'docker-compose.yml',
    ctx,
    'test-docker-compose.yml'
  );

  const content = fs.readFileSync('test-docker-compose.yml', 'utf8');
  assert(!content.includes('postgres:'), 'postgres: sollte bei mariadb nicht vorkommen');
  assert(!content.includes('postgrest'), 'postgrest sollte bei mariadb nicht vorkommen');
  assert(content.includes('directus'), 'directus fehlt bei mariadb');
  assert(content.includes('testapp_mariadb'), 'Container-Name falsch');
  cleanup();
});

test('renderToFile erstellt .env mit Marketplace-Flag', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: true,
    needsRealtime: false,
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    '.env.example',
    ctx,
    'test-.env'
  );

  const content = fs.readFileSync('test-.env', 'utf8');
  assert(content.includes('ENABLE_MARKETPLACE=true'), 'Marketplace-Flag falsch');
  assert(content.includes('ENABLE_REALTIME=false'), 'Realtime-Flag falsch');
  cleanup();
});

test('renderToFile erstellt Schema mit Marketplace-Tabellen', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: true,
    needsRealtime: false,
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    'schema.sql',
    ctx,
    'test-schema.sql'
  );

  const content = fs.readFileSync('test-schema.sql', 'utf8');
  assert(content.includes('transactions'), 'transactions-Tabelle fehlt');
  assert(content.includes('reviews'), 'reviews-Tabelle fehlt');
  cleanup();
});

test('renderToFile erstellt Schema mit Realtime-Tabellen', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: false,
    needsRealtime: true,
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    'schema.sql',
    ctx,
    'test-schema.sql'
  );

  const content = fs.readFileSync('test-schema.sql', 'utf8');
  assert(content.includes('active_editors'), 'active_editors-Tabelle fehlt');
  cleanup();
});

test('Schema fuer mariadb (Standard) enthaelt kein SERIAL und kein JSONB', async () => {
  cleanup();
  const discovery = {
    platformName: 'TestApp',
    projects: [],
    hasMarketplace: true,
    needsRealtime: true,
    // database bewusst nicht gesetzt -> Standard mariadb
  };
  const rec = { techStack: {} };
  const ctx = engine.buildTemplateContext(discovery, rec);

  await engine.renderToFile(
    'schema.sql',
    ctx,
    'test-schema.sql'
  );

  const content = fs.readFileSync('test-schema.sql', 'utf8');
  assert(!content.includes('SERIAL'), 'SERIAL sollte bei mariadb nicht vorkommen');
  assert(!content.includes('JSONB'), 'JSONB sollte bei mariadb nicht vorkommen');
  assert(content.includes('AUTO_INCREMENT'), 'AUTO_INCREMENT fehlt bei mariadb');
  assert(content.includes('ENGINE=InnoDB'), 'ENGINE=InnoDB fehlt bei mariadb');
  cleanup();
});

// ============ RESULT ============
console.log(`
╔════════════════════════════════════════════════════════════╗
║    📊 TEST RESULTS                                         ║
╚════════════════════════════════════════════════════════════╝

✅ Bestandene Tests:  ${passedTests}
❌ Fehlgeschlagene:   ${failedTests}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:               ${passedTests + failedTests}

${failedTests === 0 ? '🎉 ALLE TESTS BESTANDEN!' : '⚠️  Einige Tests fehlgeschlagen'}
`);

process.exit(failedTests > 0 ? 1 : 0);
