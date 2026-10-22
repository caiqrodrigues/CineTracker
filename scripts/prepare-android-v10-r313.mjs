import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Official Android 1.0/r313: repair only account startup and failed
// refresh-token recovery. All Home/Discover/Sports/F1/Profiles remain r312.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r312.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const tag='<script data-ct-android="r312-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Android 1.0/r312 baseline unavailable');
let js=html.slice(a+tag.length,b);
function once(from,to,label){
 const count=js.split(from).length-1;
 if(count!==1)throw Error('r313 '+label+': expected one match, got '+count);
 js=js.replace(from,to);
}
once("const REVISION='r312-android-official-1.0';",
 "const REVISION='r313-android-official-1.0';",'revision only');
once('window.__ctAndroidOfficialCode=10113;',
 'window.__ctAndroidOfficialCode=10114;','code for 1.0 signed update');
// An old failed refresh must not keep blocking a newly signed-in token for
// 15 seconds, including new sessions that legitimately need another refresh.
once("let renewal=null, blockedUntil=0, blockedError=null;",
 "let renewal=null, blockedUntil=0, blockedError=null,blockedAccess='';",
 'bind cooldown to original access token');
once(" if(now()<blockedUntil)throw blockedError||Error('Sessão indisponível. Entre novamente.');",
 " if(now()<blockedUntil){if(String(session?.access_token||'')!==blockedAccess){blockedUntil=0;blockedError=null}else throw blockedError||Error('Sessão indisponível. Entre novamente.');}",
 'newly authenticated token does not inherit previous cooldown');
// Capture the auth token that was about to be refreshed before posting the
// one-use Supabase refresh token. A more recent session must never be erased.
once(' renewal=(async()=>{\n  // Never resend expired Authorization',
 ' const attemptedAccess=String(session?.access_token||stored()?.access_token||"");\n renewal=(async()=>{\n  // Never resend expired Authorization',
 'remember attempted access before refresh');
// Classify permanent refresh-token 400/401. Do NOT treat temporary network
// failures as a reason to sign out or delete persisted user information.
once("  if(!r.ok||!reply?.access_token||!reply?.refresh_token)\n   throw Error('Não foi possível renovar sua sessão ('+r.status+'). Faça login novamente se continuar.');",
 "  if(!r.ok||!reply?.access_token||!reply?.refresh_token){\n   const error=Error('Sua sessão precisa ser renovada. Entre novamente se necessário.');\n   error.ctAuthRejected=r.status===400||r.status===401;\n   error.ctAuthCode=String(reply?.error_code||reply?.code||'auth-refresh-'+r.status);\n   throw error;\n  }",
 'classify rotated refresh-token rejection');
once("  blockedError=error;blockedUntil=now()+15000;authFails++;\n  throw error;",
 "  blockedError=error;blockedUntil=now()+15000;authFails++;\n  if(error?.ctAuthRejected)window.__ctR313Session?.invalidate?.(attemptedAccess,String(error.ctAuthCode||'refresh-rejected'));\n  throw error;",
 'login recovery only on permanent auth failure');
const recovery=await readFile(resolve(root,'apps/android/runtime-r313-session-recovery.js'),'utf8');
if(!recovery.includes('restoreSession=async function restoreSession313')||!recovery.includes('window.__ctR313Session='))
 throw Error('Scoped r313 recovery module missing');
once("  blockedError=error;blockedUntil=now()+15000;authFails++;",
 "  blockedError=error;blockedAccess=attemptedAccess;blockedUntil=now()+15000;authFails++;",
 'cooldown is scoped to failed token');
once('boot();\n})();',recovery+'\nboot();\n})();','install session bootstrap before boot');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r313-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(path,html,'utf8');
console.log('CINETRACKER_1_0_R313_READY: one owner for refresh token, safe re-auth on genuine 400 and no stale-login startup; unchanged Home/Discover/Sports/F1/Profile/Web/DB.');
