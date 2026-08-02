/**
 * Tests for template engine
 */

const engine = require('../skill/template-engine');
const fs = require('fs');
const path = require('path');

describe('Template Engine', () => {
  afterEach(() => {
    const testOutputs = [
      'test-docker-compose.yml',
      'test-.env',
      'test-schema.sql',
      'test-dir',
    ];
    testOutputs.forEach((file) => {
      if (fs.existsSync(file)) {
        if (fs.statSync(file).isDirectory()) {
          fs.rmSync(file, { recursive: true, force: true });
        } else {
          fs.unlinkSync(file);
        }
      }
    });
  });

  test('buildTemplateContext creates proper structure', () => {
    const discovery = {
      platformName: 'TestApp',
      projects: [{ name: 'Q1', description: 'Quest builder' }],
      hasMarketplace: true,
      needsRealtime: false,
    };
    const rec = { techStack: {} };

    const ctx = engine.buildTemplateContext(discovery, rec);

    expect(ctx.platformName).toBe('TestApp');
    expect(ctx.platformNameKebab).toBe('testapp');
    expect(ctx.platformNameSnake).toBe('testapp');
    expect(ctx.hasMarketplace).toBe(true);
    expect(ctx.needsRealtime).toBe(false);
  });

  test('buildTemplateContext converts space to kebab-case', () => {
    const discovery = {
      platformName: 'My Quest App',
      projects: [],
      hasMarketplace: false,
      needsRealtime: false,
    };
    const rec = { techStack: {} };

    const ctx = engine.buildTemplateContext(discovery, rec);
    expect(ctx.platformNameKebab).toBe('my-quest-app');
    expect(ctx.platformNameSnake).toBe('my_quest_app');
  });

  test('renderToFile creates docker-compose.yml (postgres)', async () => {
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

    expect(fs.existsSync('test-docker-compose.yml')).toBe(true);
    const content = fs.readFileSync('test-docker-compose.yml', 'utf8');
    expect(content).toContain('postgres');
    expect(content).toContain('postgrest');
  });

  test('renderToFile creates docker-compose.yml ohne postgres/postgrest bei mariadb (Standard)', async () => {
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
    expect(content).not.toContain('postgres:');
    expect(content).not.toContain('postgrest');
    expect(content).toContain('mariadb');
    expect(content).toContain('directus');
  });

  test('renderToFile creates nested directories', async () => {
    const discovery = {
      platformName: 'TestApp',
      projects: [],
      hasMarketplace: false,
      needsRealtime: false,
    };
    const rec = { techStack: {} };

    const ctx = engine.buildTemplateContext(discovery, rec);
    await engine.renderToFile(
      'docker-compose.yml',
      ctx,
      'test-dir/nested/docker-compose.yml'
    );

    expect(fs.existsSync('test-dir/nested/docker-compose.yml')).toBe(true);
  });

  test('renderToFile includes marketplace table when hasMarketplace=true', async () => {
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
    expect(content).toContain('transactions');
    expect(content).toContain('reviews');
  });

  test('renderToFile includes realtime table when needsRealtime=true', async () => {
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
    expect(content).toContain('active_editors');
  });

  test('Schema fuer mariadb (Standard) enthaelt kein SERIAL und kein JSONB', async () => {
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
    expect(content).not.toContain('SERIAL');
    expect(content).not.toContain('JSONB');
    expect(content).not.toContain('uuid_generate_v4');
    expect(content).toContain('AUTO_INCREMENT');
    expect(content).toContain('JSON');
    expect(content).toContain('ENGINE=InnoDB');
  });
});

describe('toSafeIdentifier', () => {
  const { toSafeIdentifier } = require('../skill/template-engine');

  // Regression: Frueher wurden nur Leerzeichen ersetzt. "Probe-App" ergab
  // dadurch die Datenbank `probe-app`, die in MariaDB/MySQL nur mit Backticks
  // ansprechbar ist -- eine Falle in jedem handgeschriebenen SQL.
  test('ersetzt Bindestriche im Snake-Case', () => {
    expect(toSafeIdentifier('Probe-App', '_')).toBe('probe_app');
  });

  test('ersetzt Leerzeichen', () => {
    expect(toSafeIdentifier('Mein Tolles Projekt', '_')).toBe('mein_tolles_projekt');
  });

  test('loest deutsche Umlaute auf', () => {
    expect(toSafeIdentifier('Grün Über', '_')).toBe('gruen_ueber');
  });

  test('zieht Wiederholungen zusammen und trimmt Raender', () => {
    expect(toSafeIdentifier('--Test...App--', '_')).toBe('test_app');
  });

  test('erlaubt keinen Namen, der mit einer Ziffer beginnt', () => {
    expect(toSafeIdentifier('2026 Plattform', '_')).toBe('p_2026_plattform');
  });

  test('faellt bei leerem Ergebnis auf einen gueltigen Namen zurueck', () => {
    expect(toSafeIdentifier('---', '_')).toBe('platform');
  });

  test('erzeugt nur erlaubte Zeichen', () => {
    for (const name of ['Café Münster!', 'A/B & C', '  ', '99 Bottles']) {
      expect(toSafeIdentifier(name, '_')).toMatch(/^[a-z][a-z0-9_]*$/);
      expect(toSafeIdentifier(name, '-')).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});
