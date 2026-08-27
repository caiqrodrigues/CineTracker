import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const path='apps/android/app/src/main/assets/hotfix5/index.html';
const html=await readFile(path,'utf8');
if(!html.includes("window.__ctAndroidBundle = 'v0.99.2-fix-991-992-authoritative'"))throw new Error('Android 0.99.2 FIX bundle marker missing');
if(!html.includes("window.__ctP0SessionReset = 'hotfix7-once'"))throw new Error('P0 session reset missing');
const required=['patch-v067-v095.js','patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js'];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.2: ${name} missing`);
for(const name of ['patch-v081-hotfix12-nav-pre.js','patch-v084-hotfix14-real-device.js','patch-v086-hotfix15-import-retry.js','patch-v068-v097.js'])if(html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.2: obsolete ${name} remains`);
const order=['patch-v088-v098-nav-pre.js','patch-v085-hotfix15-import-transport.js','patch-v075-hotfix10-selective.js','patch-v082-hotfix12-picker-guard.js','patch-v083-hotfix13-bingers-semantics.js','patch-v087-hotfix16-import-resilience.js','patch-v074-hotfix1-version.js','patch-v089-v098.js','patch-v090-v098-compat.js','patch-v091-v099-profile-lru.js','patch-v092-v0991.js','patch-v093-v0992.js','patch-v094-v0992-compat.js','patch-v095-v0992-fix.js'];
const pos=order.map(x=>html.indexOf(`data-ct-inline="${x}"`));if(!pos.every((x,i)=>x>=0&&(i===0||x>pos[i-1])))throw new Error('Android 0.99.2 patch order invalid');
for(const marker of ['__ct0991Loaded','__ct0992Loaded','__ct0992Compat','__ct0992FixLoaded','authoritative-runtime-navigation-profile-writes','ct0992Navigate','cinetracker_profile_home_dashboard_v0992','Assistir a seguir','Juntando poeira','Em dia','Não Iniciadas / Watchlist','Concluídas','Escolha para Hoje','daily_movie_recommendations_v0992','profile_id','media_kind','CineTracker • v0.99.2'])if(!html.includes(marker))throw new Error(`Android 0.99.2 marker missing: ${marker}`);
if(!html.includes("window.ct0992Navigate=navigate;window.ct991Navigate=navigate;window.ct98Navigate=navigate"))throw new Error('Android 0.99.2 authoritative navigation rebinding missing');
if(!html.includes("window.addEventListener('click'"))throw new Error('Android 0.99.2 window-capture navigation gate missing');
if(html.includes('<script src="/'))throw new Error('Android 0.99.2 external root script remains');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
for(let i=0;i<scripts.length;i++){const source=scripts[i][1].replace(/<\\\/script/gi,'</script'),label=scripts[i][0].match(/data-ct-inline="([^"]+)"/i)?.[1]||`base-${i+1}`;try{new vm.Script(source,{filename:`android-inline-${i+1}-${label}.js`})}catch(error){throw new Error(`Android inline ${label} invalid: ${error.message}`)}}
console.log(`Android 0.99.2 FIX inline smoke OK: ${scripts.length} scripts; authoritative navigation/write/profile compatibility present.`);
