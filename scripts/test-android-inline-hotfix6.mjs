import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(path,'utf8');
if(!html.includes("window.__ctAndroidBundle = 'v0.99.1-profile-discover-v95-core-inline-authoritative'"))throw new Error('Android 0.99.1 bundle marker missing');
if(!html.includes("window.__ctP0SessionReset = 'hotfix7-once'"))throw new Error('P0 session reset missing');
const required=['patch-v067-v095.js','patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js'];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.1: ${name} missing`);
for(const name of ['patch-v081-hotfix12-nav-pre.js','patch-v084-hotfix14-real-device.js','patch-v086-hotfix15-import-retry.js','patch-v068-v097.js'])if(html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.1: obsolete ${name} remains`);
const order=['patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js'];
const pos=order.map(x=>html.indexOf(`data-ct-inline="${x}"`));if(!pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1])))throw new Error('Android 0.99.1 patch order invalid');
for(const marker of ['__ct98NavPre','__ct98Loaded','__ct98Compat','__ct99ProfileLRU','__ct0991Loaded','ct98Navigate','cinetracker_profile_media_dashboard_v0991','Indicação geral da Watchlist','Não Iniciadas / Watchlist','Tempo p/ séries em dia','Tempo p/ filmes em dia','last_watched_at','CineTracker • v0.99.1'])if(!html.includes(marker))throw new Error(`Android 0.99.1 marker missing: ${marker}`);
if(!html.includes('ct991-import-menu'))throw new Error('Android 0.99.1 Bingers import submenu missing');
if(html.includes('<script src="/'))throw new Error('Android 0.99.1 external root script remains');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
for(let i=0;i<scripts.length;i++){const source=scripts[i][1].replace(/<\\\/script/gi,'</script'),label=scripts[i][0].match(/data-ct-inline="([^"]+)"/i)?.[1]||`base-${i+1}`;try{new vm.Script(source,{filename:`android-inline-${i+1}-${label}.js`})}catch(error){throw new Error(`Android inline ${label} invalid: ${error.message}`)}}
console.log(`Android 0.99.1 inline smoke OK: ${scripts.length} scripts; v0.99.1 profile/discover layer present.`);
