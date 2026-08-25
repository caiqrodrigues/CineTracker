import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'dist');
const target = resolve(root, 'apps/android/app/src/main/assets/hotfix1');

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });

const indexPath = resolve(target, 'index.html');
let html = await readFile(indexPath, 'utf8');
html = html.replaceAll('src="/', 'src="./').replaceAll('href="/', 'href="./');
await writeFile(indexPath, html, 'utf8');

if (!html.includes("window.__ctAuthRecovery = 'v97-base'")) throw new Error('Android HOTFIX 1 bundle missing auth recovery.');
if (!html.includes('patch-v074-hotfix1-version.js')) throw new Error('Android HOTFIX 1 bundle missing version patch.');
if (html.includes('patch-v073-v097-fix7.js') || html.includes('auth-preboot-fix7.js')) throw new Error('Legacy FIX 7 found in Android HOTFIX 1 bundle.');

console.log('Android HOTFIX 1 local Web bundle prepared from validated dist.');
