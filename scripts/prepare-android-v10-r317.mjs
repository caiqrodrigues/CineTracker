import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Official 1.0/r317. Surgical fix: stop blocking ForYou on legacy dashboard
// enrichment chains; v525 remains mandatory for every candidate.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r316.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r316-android-stable-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
if(a<0||b<=a)throw Error('Official 1.0/r316 runtime missing');
let js=html.slice(a+tag.length,b),prior=js;
function once(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('r317 '+label+': expected exactly one anchor, found '+n);
 js=js.replace(from,to);
}
once("const REVISION='r316-android-official-1.0';",
     "const REVISION='r317-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10117;',
     'window.__ctAndroidOfficialCode=10118;','version code');

// The previous r314 loader waited for ct186Context(true). That wrapper,
// unfortunately, calls r114/r115 legacy TMDB enrichment (hundreds of detail
// requests) before returning the dashboard, even though the seven-slot
// controller never uses the enriched rows for eligibility. The 18s timeout
// therefore failed with "Não foi possível confirmar sua biblioteca" despite
// six authenticated v421 pools and the safer canonical v525 audit working.
// Remove this *unnecessary* prerequisite. Each displayed candidate still
// MUST pass the authenticated canonical v525 check, with a failed or partial
// audit blocking the recommendation. Keep taste learning best-effort.
once(`const results=await Promise.allSettled([
  ...keys.map(([group,kind])=>fetchPool(group,kind)),
  timebox(ct186Context(true),18000),
  timebox(taste()?.warm?.(true)||Promise.resolve(true),18000)
 ]);
 if(id!==userId())throw Error('Usuário alterado durante a consulta');
 if(results[6].status!=='fulfilled'||!results[6].value?.dash)
  throw Error('Não foi possível confirmar sua biblioteca para filtrar as indicações');`,
`const results=await Promise.allSettled(keys.map(([group,kind])=>fetchPool(group,kind)));
 // Personal taste learning is independent from user-state exclusion.
 // A failed/slow dashboard may not prevent server-audited cards from loading.
 void Promise.resolve().then(()=>taste()?.warm?.(false)).catch(()=>{});
 if(id!==userId())throw Error('Usuário alterado durante a consulta');`,
 'remove blocking legacy context/enrichment chain');

// Preserve a strict v525 audit: fail closed, never show a recommendation from
// a partial audit, unknown account, blocked/watched or unknown media state.
for(const marker of [
 "const audited=await timebox(window.__ctR279Audit.auditData(raw),20000);",
 "if(!verifyData(audited))throw Error('O servidor não conseguiu confirmar a elegibilidade dos itens');",
 "window.__ctR279Audit?.permitted?.(x,watch)===true",
 "x?.__ct421_eligible===true",
 "window.__ctR314ForYou={load,mount,swap,action,choose,paint,poolFor,stats:",
 "window.__ctR316Discover={show,ensureTop10,restore,detailVisible,"
])if(!js.includes(marker))throw Error('Required strict audit or working Discover controller missing: '+marker);
new Function(js);
let reversed=js.replace("const REVISION='r317-android-official-1.0';","const REVISION='r316-android-official-1.0';")
  .replace('window.__ctAndroidOfficialCode=10118;','window.__ctAndroidOfficialCode=10117;');
reversed=reversed.replace(`const results=await Promise.allSettled(keys.map(([group,kind])=>fetchPool(group,kind)));
 // Personal taste learning is independent from user-state exclusion.
 // A failed/slow dashboard may not prevent server-audited cards from loading.
 void Promise.resolve().then(()=>taste()?.warm?.(false)).catch(()=>{});
 if(id!==userId())throw Error('Usuário alterado durante a consulta');`,
`const results=await Promise.allSettled([
  ...keys.map(([group,kind])=>fetchPool(group,kind)),
  timebox(ct186Context(true),18000),
  timebox(taste()?.warm?.(true)||Promise.resolve(true),18000)
 ]);
 if(id!==userId())throw Error('Usuário alterado durante a consulta');
 if(results[6].status!=='fulfilled'||!results[6].value?.dash)
  throw Error('Não foi possível confirmar sua biblioteca para filtrar as indicações');`);
if(reversed!==prior)throw Error('Out-of-scope r316 code modification detected');
html=html.slice(0,a)+'<script data-ct-android="r317-android-stable-js">'+js+'</script>'+html.slice(b+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R317_READY: ForYou awaits six authenticated v421 pools and mandatory v525 validation, not slow legacy dashboard; other Discover tabs and whole APK stable.');
