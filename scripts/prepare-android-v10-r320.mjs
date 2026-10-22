import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android official 1.0 / r320 — Discover only. Explicit dependencies on
// the r319 published baseline, without changing functioning Home/Sports/F1.
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r319.mjs')],{cwd:root,stdio:'inherit'});
const file=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(file,'utf8');
const tag='<script data-ct-android="r319-android-stable-js">';
const begin=html.indexOf(tag),end=begin<0?-1:html.indexOf('</script>',begin+tag.length);
if(begin<0||end<=begin)throw Error('Missing certified 1.0/r319 baseline');
let js=html.slice(begin+tag.length,end);
function once(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw Error('r320 '+label+': expected one anchor, got '+n);
 js=js.replace(from,to);
}
once("const REVISION='r319-android-official-1.0';",
     "const REVISION='r320-android-official-1.0';",'revision');
once('window.__ctAndroidOfficialCode=10120;',
     'window.__ctAndroidOfficialCode=10121;','internal update number');

// Top 10 has its own working renderer. Remove six speculative background TMDB
// calls which compete against the two requests for the selected provider.
once("setTimeout(()=>{void Promise.allSettled(ct171ProviderList.slice(0,3).map(p=>ct171TopRows(Number(p.provider_id))))},0);",
     '/* r320: prioritize the selected provider, no speculative prefetch */',
     'retire Top 10 competing provider prefetch');
once("content.innerHTML=loading('Montando Top 10...');\n  try{\n    const data=await ct171TopRows(Number(provider));",
     "content.innerHTML=loading('Montando Top 10...');\n  try{\n    const data=await window.__ctR320Discover.topRows(Number(provider));",
     'selected-provider Top10 timeout');
once('ct171ProviderList=null;\n    const providers=await ct171Providers();',
     'ct171ProviderList=null;\n    const providers=await window.__ctR320Discover.providers();',
     'Top10 provider source timeout');
once("content.innerHTML=fail('Falha ao carregar Top 10: '+(e?.message||e),'discover');",
     "content.innerHTML='<div class=\"empty\">Falha ao carregar Top 10: '+esc(String(e?.message||e))+' <button type=\"button\" class=\"chip\" data-ct316-retry>Tentar novamente</button></div>';",
     'Top 10 explicit retry for provider rows');
once("h.innerHTML=fail('Falha ao carregar streamings: '+(e?.message||e),'discover');",
     "h.innerHTML='<div class=\"empty\">Falha ao carregar streamings: '+esc(String(e?.message||e))+' <button type=\"button\" class=\"chip\" data-ct316-retry>Tentar novamente</button></div>';",
     'Top10 explicit retry for providers');

// Seven ForYou slots are already authorized by v421 + v525. A 9.5-second
// profile dashboard call and 18-second generic context are OPTIONAL inputs
// to ranking, not permission checks. They MUST NOT block rendering or audit.
const oldWait=" const results=await Promise.allSettled([\n  ...keys.map(([group,kind])=>fetchPool(group,kind)),\n  timebox(ct186Context(true),18000),\n  timebox(taste()?.warm?.(true)||Promise.resolve(true),18000)\n ]);";
const newWait=" // Rank affinity and legacy context warm asynchronously; eligibility\n"+
" // is checked below by v525, which is the authenticated authority.\n"+
" try{void Promise.resolve(taste()?.warm?.(true)).catch(()=>{})}catch{}\n"+
" try{void timebox(ct186Context(true),18000).catch(()=>{})}catch{}\n"+
" const results=await Promise.allSettled([\n"+
"  ...keys.map(([group,kind])=>fetchPool(group,kind)),\n"+
"  Promise.resolve({dash:true}),\n"+
"  Promise.resolve(true)\n"+
" ]);";
once(oldWait,newWait,'optional user-profile waits removed from recommendation critical path');
const module=await readFile(resolve(root,'apps/android/runtime-r320-discover-loading.js'),'utf8');
for(const marker of [
 'window.__ctR320Discover={providers,topRows,stats:',
 "const timebox=(promise,ms,label)",
 'const topRows=provider=>timebox(',
 "const providers=()=>timebox(",
])if(!module.includes(marker))throw Error('Missing r320 timeout implementation: '+marker);
once('boot();\n})();',module+'\nboot();\n})();','install independent Top10 deadlines');
new Function(js);
html=html.slice(0,begin)+'<script data-ct-android="r320-android-stable-js">'+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(file,html,'utf8');
console.log('ANDROID_1_0_R320_READY: only Discover Top10 selected-provider source bounded with retry, removes competing prefetch; personalized ForYou audit still v525 but no longer blocks on optional dashboard/context. Other routes unchanged.');
