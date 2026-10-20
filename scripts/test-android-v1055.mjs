import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile('apps/android/app/src/main/assets/hotfix5/index.html','utf8');
const tag='<script data-ct-android="r297-android-js">';
const a=html.indexOf(tag),b=a<0?-1:html.indexOf('</script>',a+tag.length);
assert.ok(a>=0&&b>a,'Embedded Android 1.0.55 runtime absent');
const js=html.slice(a+tag.length,b);
new Function(js);
assert.ok(html.includes('name="ct-official-version" content="1.0.55"'));
for(const marker of [
 "const REVISION='r297-android-official-1.0.55'",
 'window.__ctAndroidOfficialCode=10097',
 'const limit=group===\'watchlist\'?16:24',
 'function ct297Status(label)',
 "ct297Status('Não foi possível carregar as indicações agora.')",
 "ct297Status('Nenhuma indicação elegível foi recebida. Tente novamente.')",
 'data-ct297-retry',
 'if(!ct296Ready(target))',
 'window.__ctR296WweHome',
 'window.__ctR293Gate',
 'cinetracker_recommendation_filter_v525',
 'cinetracker_discover_fresh_v421',
 'cinetracker_discover_watch_unseen_v421'
])assert.ok(js.includes(marker),'Android r297 missing '+marker);
const start=js.indexOf('/* CineTracker Android 1.0.42 / r284');
const end=js.indexOf('/* CineTracker Android r285',start);
assert.ok(start>0&&end>start,'r284 recommendations module boundaries missing');
const mod=js.slice(start,end);
assert.ok(!mod.includes("const limit=group==='watchlist'?30:48"),'Old expensive initial candidate batch remains');
assert.ok(!mod.includes('if(found.length||attempt===1)return found'),'Empty Watchlist still needlessly retried');
assert.ok(mod.includes('await new Promise(resolve=>setTimeout(resolve,150))'),'Bounded transient retry missing');
assert.ok(mod.includes("if(!moreThanZero(next))"),'Empty eligible response has no visible failure');
assert.ok(mod.includes('void loadRecommendations(true)'),'Retry does not call only authenticated local fetch');
assert.ok(mod.includes('event.stopImmediatePropagation()'),'Legacy click handlers can hijack retry');
const executable=mod.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g,'');
assert.ok(!executable.includes('window.location.reload(')&&!executable.includes('router.refresh('),'A full-page reload is forbidden');

// Exercise the exact embedded failure view with the route/user/DOM gate.
const st=mod.indexOf('function ct297Status(label){');
const en=mod.indexOf('function moreThanZero(data){',st);
assert.ok(st>0&&en>st,'r297 visible recovery routine not found');
let active=true,account='owner-a',hasCard=false,writes=0,htmlWritten='';
const target={
 querySelector:()=>hasCard?{}:null,
 set innerHTML(value){writes++;htmlWritten=value}
};
const mock={querySelector:selector=>selector==='[data-discover-content]'?target:null};
const display=new Function('isForYou','owner','document',mod.slice(st,en)+'return ct297Status;')(
 ()=>active,()=>account,mock
);
display('Indicações indisponíveis');
assert.equal(writes,1);
assert.match(htmlWritten,/data-ct297-retry/);
hasCard=true;display('Não sobrescrever sete slots');
assert.equal(writes,1,'Valid interactive cards must never be replaced by an error');
hasCard=false;active=false;display('Off-route');assert.equal(writes,1);
active=true;account='';display('Other user');assert.equal(writes,1);

// Verify UI guard and event handling stay scoped to Pra Você.
assert.match(mod,/if\(!button\|\|!isForYou\(\)\|\|!owner\(\)\|\|button.disabled\)return/);
assert.match(mod,/panel.innerHTML='<section class="panel ct297-foryou-status"/);
console.log('ANDROID_1_0_55_TEST_OK: bounded 24+16 initial pools, 0 unnecessary empty-pool retries, no permanent spinner on backend error, interactive retry scoped to Pra Você; v525 audit and r296 WWE preserved.');
