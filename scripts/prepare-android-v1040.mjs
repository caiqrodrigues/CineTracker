import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const root=resolve(process.cwd());
execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v1039.mjs')],{cwd:root,stdio:'inherit'});
const path=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
let html=await readFile(path,'utf8');
const old='<script data-ct-android="r281-android-js">';
const a=html.indexOf(old),b=a<0?-1:html.indexOf('</script>',a+old.length);
if(a<0||b<=a)throw new Error('r282 requires validated Android 1.0.39');
let js=html.slice(a+old.length,b);
function once(from,to,label){
 const n=js.split(from).length-1;
 if(n!==1)throw new Error('r282 '+label+' expected one anchor, found '+n);
 js=js.replace(from,to);
}
once("const REVISION='r281-android-official-1.0.39';","const REVISION='r282-android-official-1.0.40';",'revision');
once("window.__ctWebBuild='1.0.39';window.__ctOfficialVersion='1.0.39';window.__ctAndroidOfficialVersion='1.0.39';window.__ctAndroidOfficialCode=10081;",
"window.__ctWebBuild='1.0.40';window.__ctOfficialVersion='1.0.40';window.__ctAndroidOfficialVersion='1.0.40';window.__ctAndroidOfficialCode=10082;",'metadata');
js=js.replaceAll('CineTracker • v1.0.39','CineTracker • v1.0.40')
 .replaceAll("JSON.stringify({version:'1.0.39',revision:REVISION","JSON.stringify({version:'1.0.40',revision:REVISION")
 .replaceAll("window.__ctAndroidRelease='1.0.39'","window.__ctAndroidRelease='1.0.40'");
once('if(movieStamp271===key||now<movieRetryAt271)return;',
 'if(now<movieRetryAt271)return;',
 'do not suppress the entire day of Home film history refresh');
once('movieStamp271=key;','movieStamp271=key;movieRetryAt271=Date.now()+120000;',
 'bounded authenticated history refresh cooldown');
once("const dash=await rpc('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]);",
 "const dash=await rpc('cinetracker_profile_media_dashboard_v0991',{});if(!Array.isArray(dash))throw new Error('authenticated Watchlist unavailable');",
 'do not cache a failed profile query as empty Watchlist');
once('g.includes(10766)||g.includes(18)','g.includes(10766)',
 'drama is NOT a prohibited genre');
once("if(!d||typeof d!=='object'||!Number(d.id||0))return false;",
 "if(!d||typeof d!=='object'||!Number(d.id||0))return null;",
 'TMDB timeout is unknown, not a permanent exclusion');
once("const okay=contentDetailSafe(item,detail);\n  verified.set(ref,okay);\n  if(!okay)rejected.add(ref);\n  return okay;",
 "const okay=contentDetailSafe(item,detail);\n  if(okay===null)return null;\n  verified.set(ref,okay);\n  if(okay===false)rejected.add(ref);\n  return okay;",
 'never permanently reject candidate after transient TMDB timeout');
once("if(!ok&&isVisible()&&picked.get(key)===ref)",
 "if(ok===false&&isVisible()&&picked.get(key)===ref)",
 'only definitive TMDB rejection may remove card');
const patch=await readFile(resolve(root,'apps/android/runtime-r282-v1040-foryou-history.js'),'utf8');
for(const required of ['__ctR282AndroidV1040','watch_play_events_v0994','cinetracker_home_movie_history_v323',
 'window.__ctR279Audit','ct186RefreshVisible=async function','ct282-empty-slot'])
 if(!patch.includes(required))throw new Error('r282 missing feature: '+required);
for(const forbidden of ['window.location.reload(', 'router.refresh(', 'while(true)', 'new MutationObserver'])
 if(patch.includes(forbidden))throw new Error('Forbidden UI operation: '+forbidden);
if(!js.includes('\nboot();'))throw new Error('Android boot insertion point unavailable');
js=js.replace('\nboot();','\n'+patch+'\nboot();');
new Function(js);
html=html.slice(0,a)+'<script data-ct-android="r282-android-js">'+js+'</script>'+html.slice(b+'</script>'.length);
html=html.replaceAll('ct-android-v1039','ct-android-v1040').replaceAll('content="1.0.39"','content="1.0.40"');
await writeFile(path,html,'utf8');
console.log('ANDROID_1_0_40_READY real movie play events + no daily snapshot lock + server-verified 3-category Pra Voce + full-width empty layout; Web r541 frozen');
