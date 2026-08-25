import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix3');
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
  .replace('<head>', '<head><meta name="cinetracker-android-bundle" content="hotfix3-v95-inline">');

if (/<script\s+src=/i.test(html)) throw new Error('HOTFIX 3 still contains external runtime scripts.');
if (!html.includes('data-ct-bundled="patch-v067-v095.js"')) throw new Error('HOTFIX 3 bundle did not inline v95 runtime.');
if (html.includes('patch-v068-v097.js')) throw new Error('v97 runtime leaked into HOTFIX 3.');
if (html.includes('fix7') || html.includes('auth-preboot')) throw new Error('Legacy auth hotfix leaked into HOTFIX 3.');
if (!html.includes("authRequest('token?grant_type=password'")) throw new Error('Historical v95 password login missing from HOTFIX 3 bundle.');

await writeFile(resolve(target, 'index.html'), html, 'utf8');
console.log(`Android HOTFIX 3 v95 self-contained bundle prepared (${scripts.length} scripts inlined).`);
