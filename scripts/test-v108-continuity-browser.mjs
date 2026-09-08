import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd());
const runtime=await readFile(resolve(root,'apps/android/runtime-r198-mobile-performance.js'),'utf8');
for(const must of [
  "window.__ctAndroidHomeContinuity='background-refresh-no-passive-visible-repaint'",
  "window.__ctAndroidWarmPrimary='profile-foryou-top10-sports-sequential'",
  "await discoverRows('foryou')",
  "await discoverRows('top10')"
]) if(!runtime.includes(must)) throw new Error('1.0.8 continuity runtime missing '+must);
if(runtime.includes("if(seq===navSeq&&route()==='home')paintHome()")) throw new Error('passive visible Home repaint still present');

const dir=resolve('/tmp','cinetracker-v108-continuity');
await mkdir(dir,{recursive:true});
const file=resolve(dir,'index.html');
const runtimeSafe=runtime.replaceAll('</script>','<\\/script>');
const pre=`<script>
var user={id:'fixture-user'},session={user:{id:'fixture-user'}},navSeq=1;
var homeCache={marker:'cached'},profileCache=null,discoverCache=new Map(),sportsCache=null,sportsState={tab:'all',sport:'all',query:''},ct163PreloadStarted=false;
var calls=[],paintCount=0;
function route(){return 'home'}
function localDay(){return '2026-09-08'}
function shiftDays(){return '2026-09-08'}
function esc(v){return String(v)}
function shell(){return '<div class="page" data-home></div>'}
function setApp(html){document.getElementById('app').innerHTML=html}
function paintHome(){paintCount++;document.body.dataset.paintCount=String(paintCount);document.body.dataset.paintMarker=String(homeCache?.marker||'')}
async function renderHome(){calls.push('renderHomeBase');paintHome()}
async function pages(){return []}
function paintDiscover(x){return x}
async function discoverRows(tab){calls.push('discover:'+tab);return [{tab}]}
async function rpc(name){
  if(name==='cinetracker_home_live_v0997_r5'){calls.push('home:fresh');return {marker:'fresh'}}
  if(name==='cinetracker_profile_quick_stats_v1'){calls.push('profile:quick');return {activity:[]}}
  if(name==='cinetracker_profile_media_dashboard_v0997_fast'){calls.push('profile:dash');return []}
  calls.push('rpc:'+name);return [];
}
async function sportsPayload(){calls.push('sports');return {events:[]}}
function sportsFiltered(){return []}
function paintSports(){return null}
function ct166FavoriteBody(){return ''}
function ct163Read(k){return k==='home'?{marker:'cached'}:null}
function ct163Write(){}
function ct165OpenFavorite(){}
async function ct163PreloadAll(){}
function ct163WarmOnIdle(){}
function render(){}
function toast(){}
</script>`;
const post=`<script>
document.body.dataset.runtimeLoaded=String(window.__ctAndroidR198Loaded===true);
document.body.dataset.renderHomeType=typeof renderHome;
document.body.dataset.preloadType=typeof ct163PreloadAll;
(async()=>{
  try{
    await renderHome(1);
    document.body.dataset.afterRender='true';
    await new Promise(r=>setTimeout(r,250));
    document.body.dataset.paintAfterFresh=String(paintCount);
    document.body.dataset.homeAfterFresh=String(homeCache?.marker||'');
    ct163PreloadStarted=false;
    calls=[];
    await ct163PreloadAll();
    document.body.dataset.afterPreload='true';
    const iQuick=calls.indexOf('profile:quick'),iDash=calls.indexOf('profile:dash'),iForYou=calls.indexOf('discover:foryou'),iTop10=calls.indexOf('discover:top10'),iSports=calls.indexOf('sports');
    const profileBeforeForYou=iQuick>=0&&iDash>=0&&iForYou>iQuick&&iForYou>iDash;
    const sequential=profileBeforeForYou&&iTop10>iForYou&&iSports>iTop10;
    document.body.dataset.warmOrder=calls.join('|');
    document.body.dataset.warmSequential=String(sequential);
    document.body.dataset.profileCached=String(!!profileCache);
  }catch(err){
    document.body.dataset.testError=String(err?.stack||err?.message||err).slice(0,700);
  }finally{
    document.body.dataset.done='true';
  }
})();
</script>`;
const html=`<!doctype html><html><head></head><body><div id="app"><div class="page" data-home></div></div>${pre}<script>${runtimeSafe}</script>${post}</body></html>`;
await writeFile(file,html,'utf8');
let out='',stderr='';
for(const bin of ['google-chrome','chromium','chromium-browser']){
  try{
    out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=5000','--dump-dom','file://'+file],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
    if(out)break;
  }catch(err){stderr=String(err?.stderr||'')}
}
await rm(dir,{recursive:true,force:true});
if(!out)throw new Error('Chrome/Chromium unavailable '+stderr.slice(-1000));
if(out.includes('data-test-error=')) throw new Error('1.0.8 continuity runtime error\n'+out.match(/data-test-error="([^"]*)"/)?.[1]+'\n'+out.slice(-2500));
for(const must of [
  'data-runtime-loaded="true"',
  'data-render-home-type="function"',
  'data-preload-type="function"',
  'data-done="true"',
  'data-after-render="true"',
  'data-after-preload="true"',
  'data-paint-after-fresh="1"',
  'data-home-after-fresh="fresh"',
  'data-warm-sequential="true"',
  'data-profile-cached="true"'
]) if(!out.includes(must)) throw new Error('1.0.8 continuity behavior missing '+must+'\n'+out.slice(-3000));
if(!/data-warm-order="[^"]*profile:quick[^"]*profile:dash[^"]*discover:foryou[^"]*discover:top10[^"]*sports/.test(out)
   && !/data-warm-order="[^"]*profile:dash[^"]*profile:quick[^"]*discover:foryou[^"]*discover:top10[^"]*sports/.test(out))
  throw new Error('1.0.8 primary warm order is wrong\n'+out.slice(-2500));
console.log('V108_CONTINUITY_BROWSER_OK home=cached-single-paint fresh=stored-no-passive-repaint warm=profile>foryou>top10>sports');
