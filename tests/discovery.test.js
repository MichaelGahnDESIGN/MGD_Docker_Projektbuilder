/**
 * Tests for discovery module
 */

const discovery = require('../skill/discovery');
const utils = require('../skill/utils');
const fs = require('fs');

describe('Discovery Module', () => {
  afterEach(() => {
    const testDirs = fs.readdirSync('.');
    testDirs
      .filter((d) => d.startsWith('.platform-'))
      .forEach((d) => {
        if (fs.existsSync(d)) {
          fs.rmSync(d, { recursive: true, force: true });
        }
      });
  });

  test('savePlatformConfig erstellt Struktur', () => {
    const config = {
      platformName: 'TestApp',
      mainGoal: 'quest-editor',
      projects: [{ name: 'Quests', description: 'Quest builder' }],
    };

    const path = utils.savePlatformConfig('TestApp', config);
    expect(fs.existsSync(path)).toBe(true);
  });

  test('loadPlatformConfig lädt gespeicherte Config', () => {
    const originalConfig = {
      platformName: 'TestApp',
      mainGoal: 'marketplace',
      projects: [],
    };

    utils.savePlatformConfig('TestApp', originalConfig);
    const loaded = utils.loadPlatformConfig('TestApp');

    expect(loaded.platformName).toBe('TestApp');
    expect(loaded.mainGoal).toBe('marketplace');
  });

  test('formatForNonTechnical konvertiert Jargon', () => {
    const text = 'Supabase uses PostgreSQL';
    const result = utils.formatForNonTechnical(text);

    expect(result).toContain('Datenbank');
  });
});
