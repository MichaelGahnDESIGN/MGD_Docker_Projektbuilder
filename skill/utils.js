/**
 * Shared utilities for platform-builder skill
 */

const fs = require('fs');
const path = require('path');

/**
 * Format text for non-technical user
 * @param {string} text
 * @returns {string}
 */
function formatForNonTechnical(text) {
  return text
    .replace(/Supabase/g, 'Supabase (Datenbank & Login-System)')
    .replace(/PostgreSQL/g, 'PostgreSQL (Datenbank)')
    .replace(/GrapesJS/g, 'GrapesJS (visueller Drag-and-Drop Editor)')
    .replace(/REST API/g, 'API (wie Apps mit Platform kommunizieren)')
    .replace(/webhook/g, 'automatischer Trigger')
    .replace(/schema/g, 'Datenstruktur');
}

/**
 * Save platform config to JSON
 * @param {string} platformName
 * @param {object} config
 * @returns {string} configPath
 */
function savePlatformConfig(platformName, config) {
  const configDir = `.platform-${platformName.toLowerCase()}`;
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configPath = path.join(configDir, 'platform.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  return configPath;
}

/**
 * Load platform config from JSON
 * @param {string} platformName
 * @returns {object|null}
 */
function loadPlatformConfig(platformName) {
  const configPath = `.platform-${platformName.toLowerCase()}/platform.json`;
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return null;
}

module.exports = {
  formatForNonTechnical,
  savePlatformConfig,
  loadPlatformConfig,
};
