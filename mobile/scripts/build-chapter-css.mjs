/**
 * Regenerates src/data/chapter-tailwind-css.ts.
 *
 * chapters.json holds web markup styled with Tailwind utility classes. Rather
 * than loading the Tailwind Play CDN inside the reader WebView - which would
 * make every chapter depend on the network - this script compiles exactly the
 * utilities the chapter content uses into a static CSS string.
 *
 * Usage: npm run build:chapter-css
 * Requires tailwindcss to be installed (devDependency).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const chaptersPath = join(projectRoot, 'src/data/chapters.json');
const outputPath = join(projectRoot, 'src/data/chapter-tailwind-css.ts');

const workDir = mkdtempSync(join(tmpdir(), 'limes-chapter-css-'));

try {
  const configPath = join(workDir, 'tailwind.config.cjs');
  const inputPath = join(workDir, 'input.css');
  const cssPath = join(workDir, 'chapters.css');

  writeFileSync(
    configPath,
    `module.exports = {
  content: [${JSON.stringify(chaptersPath)}],
  theme: { extend: {} },
  // The reader supplies its own base typography; only utilities are needed.
  corePlugins: { preflight: false },
};
`,
  );
  writeFileSync(inputPath, '@tailwind utilities;\n');

  execFileSync(
    'npx',
    ['tailwindcss', '-c', configPath, '-i', inputPath, '-o', cssPath, '--minify'],
    { cwd: projectRoot, stdio: 'inherit' },
  );

  const css = readFileSync(cssPath, 'utf8').trim();
  const escaped = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  writeFileSync(
    outputPath,
    `/**
 * Tailwind utilities used by the bundled chapter HTML, pre-compiled to static CSS.
 *
 * chapters.json is web markup styled with Tailwind classes. Loading the Tailwind
 * Play CDN inside the reader WebView would make every chapter depend on the
 * network, which is wrong for an offline-first reader - so the utilities the
 * content actually uses are compiled ahead of time into the string below.
 *
 * GENERATED FILE - do not edit by hand.
 * Regenerate with: npm run build:chapter-css   (see scripts/build-chapter-css.mjs)
 */

export const CHAPTER_TAILWIND_CSS = \`${escaped}\`;
`,
  );

  process.stdout.write(`Wrote ${outputPath} (${css.length} bytes of CSS)\n`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
