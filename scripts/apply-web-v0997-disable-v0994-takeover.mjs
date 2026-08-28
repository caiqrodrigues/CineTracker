import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const legacy = 'patch-v099-v0994-web.js';
const removeNames = [
  'patch-v101-v0994-nav-pre.js',
  'patch-v103-v0994-session-gate.js',
  'patch-v104-v0994-authority.js',
  'patch-v112-v0994-warm-boot.js',
  'patch-v113-v0994-fluidity.js'
];
const marker = "window.__ct0994PassiveCompatOnly='r135-no-auto-takeover';";

function passiveCompat(input, where) {
  let out = input;
  const build = "window.__ctWebBuild = '0.99.4';";
  if (!out.includes(build)) throw new Error(`r135: 0.99.4 build marker missing in ${where}`);
  out = out.replace(build, `${build}\n${marker}`);

  const dataChanged = /window\.addEventListener\('cinetracker:data-changed',\(\)=>\{\s*payload994=null;\s*if\(active994\(\)==='home'\)void renderHome994\(true\);\s*else if\(active994\(\)==='profile'\)void patchProfile994\(\);\s*\}\);/;
  if (!dataChanged.test(out)) throw new Error(`r135: legacy data-changed takeover block not found in ${where}`);
  out = out.replace(dataChanged, "/* r135: legacy data-changed renderer disabled; r133 owns primary routes. */");

  const startup = /\/\* Old 0\.99\.2 has one bounded late route call at startup\.[\s\S]*?for\(const delay of \[0,180,820,1100\]\)setTimeout\(\(\)=>\{[\s\S]*?\},delay\);/;
  if (!startup.test(out)) throw new Error(`r135: legacy startup takeover timers not found in ${where}`);
  out = out.replace(startup, "/* r135: legacy startup route reassertion disabled. */");

  if (out.includes("for(const delay of [0,180,820,1100])")) throw new Error(`r135: startup takeover survived in ${where}`);
  if (/cinetracker:data-changed[\s\S]{0,180}renderHome994\(true\)/.test(out)) throw new Error(`r135: data takeover survived in ${where}`);
  return out;
}

for (const dir of [resolve(root, 'dist'), resolve(root, 'apps/web/dist')]) {
  const indexPath = resolve(dir, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  for (const name of removeNames) {
    html = html.replaceAll(`<script src="/${name}"></script>`, '');
  }
  for (const name of removeNames) {
    if (html.includes(`<script src="/${name}"></script>`)) throw new Error(`r135: ${name} still executes in ${indexPath}`);
  }
  const r132 = html.indexOf('patch-v132-v0997-deeplink-pages.js');
  const r133 = html.indexOf('patch-v133-v0997-primary-authority.js');
  if (r132 < 0 || r133 < 0 || r133 < r132) throw new Error(`r135: r132/r133 authority order invalid in ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');

  const legacyPath = resolve(dir, legacy);
  const source = await readFile(legacyPath, 'utf8');
  await writeFile(legacyPath, passiveCompat(source, legacyPath), 'utf8');
}

console.log('CineTracker Web 0.99.7 r135: 0.99.4 kept compatibility-only; legacy auth/authority/warm-boot takeovers removed.');
