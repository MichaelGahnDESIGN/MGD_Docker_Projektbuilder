/**
 * Tests for planning module
 */

const planning = require('../skill/planning');

describe('Planning Module', () => {
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
    expect(rec.explanation).toMatch(/mariadb/i); // Text schreibt die Datenbank als Ueberschrift
    expect(rec.techStack.backend).toContain('MariaDB');
  });

  test('buildRecommendation includes marketplace when needed', () => {
    const discovery = {
      platformName: 'TestApp',
      mainGoal: 'marketplace',
      projects: [{ name: 'Products', description: 'Product editor' }],
      hasMarketplace: true,
      needsRealtime: false,
    };

    const rec = planning.buildRecommendation(discovery);
    expect(rec.techStack.marketplace).toBe(true);
    expect(rec.explanation).toContain('MARKETPLACE');
  });

  test('buildRecommendation includes realtime when needed', () => {
    const discovery = {
      platformName: 'TestApp',
      mainGoal: 'community',
      projects: [{ name: 'Community', description: 'Collaborative space' }],
      hasMarketplace: false,
      needsRealtime: true,
    };

    const rec = planning.buildRecommendation(discovery);
    expect(rec.techStack.realtime).toBe(true);
    expect(rec.explanation).toContain('REALTIME');
  });

  test('recommendation includes all core SDKs', () => {
    const discovery = {
      platformName: 'TestApp',
      mainGoal: 'quest-editor',
      projects: [{ name: 'Quests', description: 'Quest builder' }],
      hasMarketplace: false,
      needsRealtime: false,
    };

    const rec = planning.buildRecommendation(discovery);
    expect(rec.techStack.sdks).toContain('flutter');
    expect(rec.techStack.sdks).toContain('swift');
    expect(rec.techStack.sdks).toContain('php');
    expect(rec.techStack.sdks).toContain('javascript');
  });

  describe('Datenbank-Auswahl', () => {
    const baseDiscovery = {
      platformName: 'TestApp',
      mainGoal: 'quest-editor',
      projects: [{ name: 'Quests', description: 'Quest builder' }],
      hasMarketplace: false,
      needsRealtime: false,
    };

    test('mariadb liefert korrekten techStack.backend und Directus als API', () => {
      const rec = planning.buildRecommendation({ ...baseDiscovery, database: 'mariadb' });
      expect(rec.techStack.backend).toBe('MariaDB 11');
      expect(rec.techStack.apis).toContain('Directus');
    });

    test('mysql liefert korrekten techStack.backend und Directus als API', () => {
      const rec = planning.buildRecommendation({ ...baseDiscovery, database: 'mysql' });
      expect(rec.techStack.backend).toBe('MySQL 8');
      expect(rec.techStack.apis).toContain('Directus');
    });

    test('postgres liefert korrekten techStack.backend und PostgREST als API', () => {
      const rec = planning.buildRecommendation({ ...baseDiscovery, database: 'postgres' });
      expect(rec.techStack.backend).toBe('PostgreSQL 16');
      expect(rec.techStack.apis).toContain('PostgREST');
    });
  });
});
