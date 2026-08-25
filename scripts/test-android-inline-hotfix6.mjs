import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path = 'apps/android/app/src/main/assets/hotfix5/index.html';
const html = await readFile(path, 'utf8');

if (!html.includes("window.__ctAndroidBundle = 'hotfix6-startup-inline-authoritative'")) {
  throw new Error('Android inline smoke: HOTFIX 6 bundle marker missing');
}
if (!html.includes('const media = [')) {
  throw new Error('Android inline smoke: const media block missing');
}
if (!html.includes('$$=(s,r=document)=>')) {
  throw new Error('Android inline smoke: $$ selector helper was corrupted');
}
if (html.includes('<script src="/')) {
  throw new Error('Android inline smoke: external root script remains');
}

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
if (!scripts.length) throw new Error('Android inline smoke: no inline scripts found');

for (let i = 0; i < scripts.length; i += 1) {
  const source = scripts[i][1].replace(/<\\\/script/gi, '</script');
  try {
    new vm.Script(source, { filename: `android-inline-${i + 1}.js` });
  } catch (error) {
    throw new Error(`Android inline smoke: script ${i + 1}/${scripts.length} has invalid JavaScript: ${error.message}`);
  }
}

console.log(`Android inline smoke OK: ${scripts.length} scripts preserved and syntactically valid.`);
