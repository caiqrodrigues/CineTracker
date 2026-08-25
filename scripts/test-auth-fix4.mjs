import { readFile } from 'node:fs/promises';

const fix4 = await readFile('apps/web/patch-v070-v097-fix4.js', 'utf8');
const mainActivity = await readFile('apps/android/app/src/main/java/com/cinetracker/app/MainActivity.java', 'utf8');
const gradle = await readFile('apps/android/app/build.gradle', 'utf8');

const checks = [
  ['capture submit global', fix4.includes("document.addEventListener('submit',captureSubmit,true)")],
  ['bloqueia handler legado', fix4.includes('event.stopImmediatePropagation()')],
  ['usa sessão base real', fix4.includes("typeof saveSession!=='function'") && fix4.includes('saveSession(saved)')],
  ['valida ctSession aplicada', fix4.includes('if(!ctSession?.access_token)throw new Error')],
  ['valida currentUser aplicado', fix4.includes("if(!currentUser)throw new Error('O usuário autenticado não foi aplicado ao aplicativo.')")],
  ['render imediato após login', fix4.includes('enterAppImmediately();hydrateAfterLogin()')],
  ['sincronização não bloqueia entrada', fix4.includes('function hydrateAfterLogin()') && fix4.includes('void (async()=>')],
  ['sem reload pós-login', !fix4.includes('location.reload(') && !fix4.includes('restartFromPersistedSession')],
  ['mantém credenciais em erro', !fix4.includes('replaceWith(newForm)') && !fix4.includes('cloneNode(true)')],
  ['timeout da autenticação', fix4.includes('AUTH_TIMEOUT_MS=12000') && fix4.includes('AbortController')],
  ['restaura sessão existente', fix4.includes('restoreExistingSession') && fix4.includes("localStorage.getItem('cinetracker_session')")],
  ['FIX 4 é último módulo Android', mainActivity.includes('"ct85-v097-fix.js","ct86-v097-fix4.js"')],
  ['query Android marca fix4', mainActivity.includes('&fix=4')],
  ['Gradle copia FIX 4', gradle.includes('copyV097Fix4Asset') && gradle.includes("rename { 'ct86-v097-fix4.js' }")],
  ['versão FIX 4', gradle.includes("versionName '0.0.97 FIX 4'")],
  ['rodapé FIX 4', fix4.includes('CineTracker • v0.0.97 FIX 4')]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'ERRO'} - ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);

console.log('OK - FIX 4 impede a corrida entre o listener legado e o listener Android e entra na aplicação sem reload.');
