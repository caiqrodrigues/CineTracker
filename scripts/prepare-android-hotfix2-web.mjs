import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix2');
const sourceIndex = resolve(source, 'index.html');

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });

let html = await readFile(sourceIndex, 'utf8');
const scriptPattern = /<script\s+src="(?:\.\/|\/)?([^"/?#]+)"\s*><\/script>/g;
const scripts = [...html.matchAll(scriptPattern)];

for (const match of scripts) {
  const file = basename(match[1]);
  const code = await readFile(resolve(source, file), 'utf8');
  if (code.toLowerCase().includes('</script')) throw new Error(`Cannot inline ${file}: contains </script>.`);
  html = html.replace(match[0], `<script data-ct-bundled="${file}">\n${code}\n</script>`);
}

html = html
  .replace(/<link\s+rel="icon"[^>]*>/i, '')
  .replace('<head>', '<head><meta name="cinetracker-android-bundle" content="hotfix2-inline">');

if (/<script\s+src=/i.test(html)) throw new Error('HOTFIX 2 still contains external script tags.');
if (!html.includes("window.__ctAuthRecovery = 'v97-base'")) throw new Error('HOTFIX 2 bundle missing auth recovery.');
if (!html.includes('patch-v075-hotfix2-version.js')) throw new Error('HOTFIX 2 bundle missing version patch.');
if (!html.includes('data-ct-bundled="patch-v068-v097.js"')) throw new Error('HOTFIX 2 did not inline v97 runtime.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX 7 found in HOTFIX 2 bundle.');

await writeFile(resolve(target, 'index.html'), html, 'utf8');
console.log(`Android HOTFIX 2 self-contained Web bundle prepared (${scripts.length} scripts inlined).`);
