import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(process.cwd());
const source = resolve(root, 'apps/web/index.html');
const target = resolve(root, 'apps/android/app/src/androidTest/assets/v95/index.html');

const html = await readFile(source, 'utf8');
if (!html.includes("const SUPABASE_URL = 'https://pjmkxryboypluleuuupp.supabase.co'")) {
  throw new Error('Arquivo base não corresponde ao CineTracker v95 esperado.');
}
if (!html.includes('Entrar no CineTracker') || !html.includes("async function signIn(email, password)")) {
  throw new Error('Fluxo de login v95 não encontrado.');
}
await mkdir(dirname(target), { recursive: true });
await writeFile(target, html, 'utf8');
console.log('CineTracker v95 login baseline HTML prepared for Android instrumentation.');
