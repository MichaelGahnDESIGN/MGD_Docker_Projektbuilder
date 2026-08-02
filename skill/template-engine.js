/**
 * Template Engine: Render EJS templates with context
 * Generates Docker files, schema, SDKs, etc.
 */

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

/**
 * Render a template file with context
 * @param {string} templateName - Name of .ejs template (without extension)
 * @param {object} context - Data to pass to template
 * @returns {string} Rendered content
 */
async function render(templateName, context) {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.ejs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template nicht gefunden: ${templateName}`);
  }

  const template = fs.readFileSync(templatePath, 'utf8');
  return ejs.render(template, context);
}

/**
 * Render and save template to file
 * @param {string} templateName
 * @param {object} context
 * @param {string} outputPath
 */
async function renderToFile(templateName, context, outputPath) {
  const content = await render(templateName, context);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content);
}

/**
 * Build context for templates
 * @param {object} discovery - Discovery results
 * @param {object} recommendation - Tech recommendation
 * @returns {object}
 */
/**
 * Macht aus einem beliebigen Plattformnamen einen gueltigen Datenbank- und
 * Containernamen.
 *
 * Frueher wurden nur Leerzeichen ersetzt. Ein Name wie "Probe-App" ergab
 * dadurch die Datenbank `probe-app` -- in MariaDB und MySQL zwar erlaubt, aber
 * nur mit Backticks ansprechbar, was in jedem handgeschriebenen SQL zur Falle
 * wird. Umlaute, Punkte und andere Sonderzeichen brachen es ganz.
 *
 * @param {string} name
 * @param {string} trenner  '_' fuer snake_case, '-' fuer kebab-case
 * @returns {string}
 */
function toSafeIdentifier(name, trenner) {
  const umlaute = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
  let s = String(name).toLowerCase().replace(/[äöüß]/g, (z) => umlaute[z]);
  s = s.replace(/[^a-z0-9]+/g, trenner);                 // alles Unerlaubte ersetzen
  s = s.replace(new RegExp(`\\${trenner}{2,}`, 'g'), trenner); // Wiederholungen zusammenziehen
  s = s.replace(new RegExp(`^\\${trenner}|\\${trenner}$`, 'g'), ''); // Raender trimmen
  if (/^[0-9]/.test(s)) s = `p${trenner}${s}`;           // darf nicht mit Ziffer beginnen
  return s || 'platform';                                 // Notnagel bei leerem Ergebnis
}

function buildTemplateContext(discovery, recommendation) {
  const { platformName, projects } = discovery;

  return {
    platformName,
    platformNameKebab: toSafeIdentifier(platformName, '-'),
    platformNameSnake: toSafeIdentifier(platformName, '_'),
    projects,
    hasMarketplace: discovery.hasMarketplace,
    needsRealtime: discovery.needsRealtime,
    database: discovery.database || 'mariadb',
    timestamp: new Date().toISOString(),
    year: new Date().getFullYear(),
    techStack: recommendation.techStack,
  };
}

module.exports = {
  render,
  renderToFile,
  buildTemplateContext,
  toSafeIdentifier,
};
