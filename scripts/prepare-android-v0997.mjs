import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const source=resolve(root,'dist');
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5');
const version='0.99.7.2';
const webVersion='0.99.7';
const bundle='android-v0.99.7.2-ui-polish-r3';

await rm(target,{recursive:true,force:true});
await mkdir(target,{recursive:true});
await cp(source,target,{recursive:true});

const indexPath=resolve(target,'index.html');
let html=await readFile(indexPath,'utf8');
const androidCss=`<style id="ct-android-09972-polish">
html,body,#app{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;-webkit-text-size-adjust:100%!important}
.sidebar,.mobile-nav,.cloud-bar{display:none!important}
.app{display:block!important;width:100%!important;min-width:0!important}
.content{box-sizing:border-box!important;width:100%!important;max-width:none!important;min-width:0!important;margin:0!important;padding:12px 10px calc(18px + env(safe-area-inset-bottom))!important;overflow-x:hidden!important}
#ct120-page[data-ct120-route="profile"] .content,#ct120-profile,#ct120-profile>.ct120-page,#ct118-profile,#ct118-profile>.ct118-page,.ct91-settings{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}
#ct120-profile .ct120-section,#ct118-profile .ct118-section{width:100%!important;max-width:none!important;min-width:0!important;box-sizing:border-box!important}
#ct120-profile .ct126-profile-grid,#ct118-profile .ct126-profile-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;width:100%!important;max-width:100%!important;overflow-x:hidden!important}
#ct120-profile .ct120-stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
#ct120-profile .ct120-stats>.ct120-stat:last-child:nth-child(odd){grid-column:1/-1!important}
#ct120-profile .ct120-stat b,#ct120-profile .ct120-stat em{white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important}
#ct120-profile .ct120-stat b{font-size:clamp(12px,3.45vw,16px)!important;letter-spacing:-.15px}
#ct120-profile .ct120-stat em{font-size:clamp(8px,2.25vw,10px)!important}
#ct120-profile .ct120-actors{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:calc((100% - 20px)/3)!important;grid-template-columns:none!important;gap:10px!important;width:100%!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;scroll-snap-type:x proximity!important;padding:1px 1px 8px!important}
#ct120-profile .ct120-actors>.ct120-actor,#ct120-profile .ct120-actors>.ct-android-actors-more{scroll-snap-align:start!important;min-width:0!important;width:auto!important}
#ct120-profile .ct120-actors>[hidden],.ct118-cast>[hidden]{display:none!important}
.ct-android-actors-more,.ct-android-cast-more{border:1px dashed #39708c!important;background:#071822!important;color:#dff7ff!important;border-radius:13px!important;min-height:145px!important;padding:10px!important;display:grid!important;place-items:center!important;text-align:center!important;font:inherit!important;cursor:pointer!important;touch-action:manipulation!important}
.ct-android-actors-more b,.ct-android-cast-more b{display:block;font-size:12px}.ct-android-actors-more small,.ct-android-cast-more small{display:block;margin-top:5px;color:#7892a4;font-size:9px}
.ct118-cast{display:grid!important;grid-auto-flow:column!important;grid-auto-columns:calc((100% - 16px)/3)!important;grid-template-columns:none!important;gap:8px!important;width:100%!important;max-width:100%!important;overflow-x:auto!important;overscroll-behavior-x:contain!important;scroll-snap-type:x proximity!important;padding:1px 1px 8px!important}
.ct118-cast>.ct118-person,.ct118-cast>.ct-android-cast-more{scroll-snap-align:start!important;min-width:0!important;width:auto!important}
.ct118-hero>.ct118-actions.ct-android-action-grid{grid-column:1/-1!important;display:grid!important;grid-template-columns:repeat(var(--ct-action-count,3),minmax(0,1fr))!important;gap:8px!important;width:100%!important;margin:4px 0 0!important}
.ct118-actions.ct-android-action-grid>.ct118-btn{box-sizing:border-box!important;width:100%!important;min-width:0!important;min-height:46px!important;margin:0!important;padding:8px 5px!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;white-space:normal!important;line-height:1.15!important;font-size:clamp(11px,3vw,14px)!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:2!important}
.ct91-settings.ct109-settings{grid-template-columns:1fr!important;width:100%!important;max-width:none!important}
.ct109-account,.ct109-maintenance,.ct109-data-management,.ct128-data-card{grid-column:1/-1!important;width:100%!important;max-width:none!important;box-sizing:border-box!important}
.ct128-modal{padding:max(10px,env(safe-area-inset-top)) 10px max(10px,env(safe-area-inset-bottom))!important}
.ct118-overlay,.ct120-overlay{padding:10px!important;padding-top:max(10px,env(safe-area-inset-top))!important;padding-bottom:max(10px,env(safe-area-inset-bottom))!important}
button,input,select{touch-action:manipulation}
</style>`;
html=html.replace('</head>',`${androidCss}<script>window.__ctAndroidBundle='${bundle}';window.__ctAndroidBuild='${version}';window.__ctAndroidWebBuild='${webVersion}';window.__ctAndroidEmbedded=true;</script></head>`);
const pattern=/<script src="\/([^"?#]+)"><\/script>/g;
const scripts=[...html.matchAll(pattern)];
let session=false;
for(const match of scripts){
  const name=match[1];
  let js=await readFile(resolve(source,name),'utf8');
  if(name==='patch-v103-v0994-session-gate.js'){
    js=js.replace('  await preloadRoute994(target);','  void preloadRoute994(target);');
    if(!js.includes('  void preloadRoute994(target);'))throw new Error('Android 0.99.7.2: nonblocking preload missing');
    session=true;
  }
  js=js.replace(/<\/script/gi,'<\\/script');
  html=html.replace(match[0],()=>`<script data-ct-inline="${name}">\n${js}\n</script>`);
}
html=html.replace("if (!('serviceWorker' in navigator)) return;","if (window.__ctAndroidBundle || !('serviceWorker' in navigator)) return;");
html=html.replace(/<link rel="icon"[^>]*>/g,'');
const bridge=`<script>
(() => {
  'use strict';
  window.__ctAndroidBuild='${version}';
  window.__ctAndroidWebBuild='${webVersion}';
  window.__ctAndroidBundle='${bundle}';
  window.__ctAndroidUiPolish='v09972-android-ui-polish-r3';
  const rawRpc=typeof window.sbRpc==='function'?window.sbRpc:null;
  if(rawRpc&&!rawRpc.__ctAndroid9972Timeout){
    const wrapped=async function(name,body={}){
      if(!['cinetracker_profile_home_payload_v0994','cinetracker_profile_payload_v0997'].includes(name))return rawRpc(name,body);
      return new Promise((resolve,reject)=>{
        let settled=false;
        const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Tempo limite ao sincronizar dados.'))}},10000);
        Promise.resolve(rawRpc(name,body)).then(v=>{if(!settled){settled=true;clearTimeout(timer);resolve(v)}},e=>{if(!settled){settled=true;clearTimeout(timer);reject(e)}});
      });
    };
    wrapped.__ctAndroid9972Timeout=true;
    try{sbRpc=wrapped}catch{}
    window.sbRpc=wrapped;
  }
  const navigate997=target=>{
    const nav=window.__ct0994Navigate||window.ct0994Navigate;
    if(typeof nav!=='function')return false;
    void nav(target==='history'?'profile':target);
    return true;
  };
  window.ct15Navigate=navigate997;
  window.ct14Navigate=navigate997;
  window.__ctAndroid997Navigate=navigate997;

  const $$=(s,r=document)=>r&&r.querySelectorAll?[...r.querySelectorAll(s)]:[];
  let dailyBusy=false,polishTimer=0;
  function compactTime(text){
    const t=String(text||'').trim();
    const m=t.match(/^(\\d+)\\s+(mês|meses)\\s+(\\d+)\\s+(dia|dias)\\s+(\\d+)\\s+(hora|horas)(\\s+faltantes)?$/i);
    return m?m[1]+' '+m[2]+', '+m[3]+' '+m[4]+' e '+m[5]+' H'+(m[7]||''):t;
  }
  function fixStats(){
    const root=document.querySelector('#ct120-profile');if(!root)return;
    for(const el of $$('.ct120-stat b,.ct120-stat em',root)){const next=compactTime(el.textContent);if(next!==el.textContent)el.textContent=next}
  }
  function makeMore(cls,label,count,onClick){
    const b=document.createElement('button');b.type='button';b.className=cls;b.innerHTML='<span><b>'+label+'</b><small>+'+count+'</small></span>';b.addEventListener('click',onClick);return b;
  }
  function fixFavoriteActors(){
    const box=document.querySelector('#ct120-profile [data-ct120-slot="actors"] .ct120-actors');if(!box||box.dataset.ctAndroidCarousel==='1')return;
    const cards=$$('.ct120-actor',box);if(!cards.length)return;box.dataset.ctAndroidCarousel='1';
    cards.forEach((c,i)=>{c.hidden=i>=4});
    if(cards.length<=4)return;
    let open=false;const more=makeMore('ct-android-actors-more','Ver mais',cards.length-4,()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=4});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':'+'+(cards.length-4);if(!open)box.scrollTo({left:0,behavior:'smooth'})});box.appendChild(more);
  }
  function fixCast(){
    for(const box of $$('.ct118-cast')){
      if(box.dataset.ctAndroidCarousel==='1')continue;const cards=$$('.ct118-person',box);if(!cards.length)continue;box.dataset.ctAndroidCarousel='1';cards.forEach((c,i)=>{c.hidden=i>=5});
      if(cards.length<=5)continue;let open=false;const more=makeMore('ct-android-cast-more','Ver mais',cards.length-5,()=>{open=!open;cards.forEach((c,i)=>{c.hidden=!open&&i>=5});more.querySelector('b').textContent=open?'Mostrar menos':'Ver mais';more.querySelector('small').textContent=open?'':'+'+(cards.length-5);if(!open)box.scrollTo({left:0,behavior:'smooth'})});box.appendChild(more);
    }
  }
  function fixDetailActions(){
    for(const hero of $$('.ct118-hero')){const actions=hero.querySelector('.ct118-actions');if(!actions)continue;if(actions.parentElement!==hero)hero.appendChild(actions);actions.classList.add('ct-android-action-grid');actions.style.setProperty('--ct-action-count',String(Math.max(1,actions.children.length)));for(const b of $$('.ct118-btn',actions)){b.style.pointerEvents='auto';b.style.touchAction='manipulation'}}
  }
  function dayKey(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  async function readDailyRows(path){try{const rows=await window.sbApi(path);return Array.isArray(rows)?rows:[]}catch{return[]}}
  async function repairDaily(){
    if(dailyBusy||typeof window.sbApi!=='function')return;const root=document.querySelector('#ct120-profile');if(!root)return;const days=$$('[data-ct120-day]',root);if(!days.length)return;
    const first=days[0].dataset.ct120Day,last=days[days.length-1].dataset.ct120Day;if(!first||!last)return;dailyBusy=true;
    try{
      const start=new Date(first+'T00:00:00'),end=new Date(last+'T00:00:00');end.setDate(end.getDate()+1);
      const lo=encodeURIComponent(start.toISOString()),hi=encodeURIComponent(end.toISOString());
      let rows=await readDailyRows('watch_history?select=watched_at,item_type&item_type=eq.episode&watched_at=gte.'+lo+'&watched_at=lt.'+hi+'&order=watched_at.asc');
      if(!rows.length)rows=await readDailyRows('episode_progress?select=watched_at,watched&watched=eq.true&watched_at=gte.'+lo+'&watched_at=lt.'+hi+'&order=watched_at.asc');
      const counts=new Map(days.map(b=>[b.dataset.ct120Day,0]));
      for(const row of rows){if(!row||!row.watched_at)continue;const d=new Date(row.watched_at);if(Number.isNaN(d.getTime()))continue;const k=dayKey(d);if(counts.has(k))counts.set(k,(counts.get(k)||0)+1)}
      const max=Math.max(1,...counts.values());
      for(const b of days){const n=counts.get(b.dataset.ct120Day)||0,num=b.querySelector('.n'),bar=b.querySelector('.ct120-bar');if(num)num.textContent=String(n);if(bar)bar.style.height=Math.max(4,Math.round(n/max*132))+'px'}
      root.dataset.ctAndroidDailySource=rows.length?'history':'empty';
    }finally{dailyBusy=false}
  }
  function polish(){fixStats();fixFavoriteActors();fixCast();fixDetailActions();void repairDaily()}
  function schedulePolish(delay=40){clearTimeout(polishTimer);polishTimer=setTimeout(polish,delay)}
  const obs=new MutationObserver(()=>schedulePolish(45));obs.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('cinetracker:data-changed',()=>schedulePolish(80));window.addEventListener('focus',()=>schedulePolish(60));document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedulePolish(60)});
  window.__ctAndroid9972Polish=polish;window.__ctAndroid9972RepairDaily=repairDaily;
  for(const d of [0,120,420,1000])setTimeout(polish,d);
  setTimeout(()=>void window.__ct0997WarmAll?.(),120);
})();
</script>`;
html=html.replace('</body>',`${bridge}</body>`);
await writeFile(indexPath,html,'utf8');
if(!session)throw new Error('Android 0.99.7.2 session gate missing');

const required=[
  'patch-v099-v0994-web.js','patch-v101-v0994-nav-pre.js','patch-v103-v0994-session-gate.js','patch-v104-v0994-authority.js',
  'patch-v105-v0994-preload-layout.js','patch-v106-v0994-refactor.js','patch-v107-v0994-data-ui-fix.js','patch-v108-v0994-pwa-resilience.js',
  'patch-v109-v0994-settings-web.js','patch-v110-v0994-episode-check.js','patch-v112-v0994-warm-boot.js','patch-v113-v0994-fluidity.js',
  'patch-v118-v0997-authoritative.js','patch-v119-v0997-real-smoke-hotfix.js','patch-v1195-v0997-route-preload-core.js',
  'patch-v1196-v0997-persistent-preload.js','patch-v120-v0997-structural-authority.js','patch-v121-v0997-functional-polish.js',
  'patch-v122-v0997-live-smoke-fixes.js','patch-v124-v0997-video-smoke-authority.js','patch-v125-v0997-restore-foryou-contract.js',
  'patch-v126-v0997-video3124-recovery.js','patch-v127-v0997-settings-unified-data-hub.js','patch-v128-v0997-settings-minimal-transfer.js',
  'patch-v129-v0997-settings-real-metadata-refresh.js','patch-v130-v0997-nav-footer-stability.js'
];
for(const name of required)if(!html.includes(`data-ct-inline="${name}"`))throw new Error(`Android 0.99.7.2 missing ${name}`);
for(const old of ['patch-v111-v0994-global-search.js','patch-v114-v0994-universal-detail.js','patch-v115-v0995-favorites-profile-discover.js','patch-v116-v0996-authoritative.js','patch-v117-v0996-final.js'])if(html.includes(`data-ct-inline="${old}"`))throw new Error(`Android 0.99.7.2 still embeds obsolete ${old}`);
for(const marker of [
  bundle,'v09972-android-ui-polish-r3','v118-single-authority-profile-discover-detail','v119-real-device-smoke-hotfix','v1196-persistent-rpc-stale-while-revalidate',
  'v120-structural-profile-discover-media-authority','v121-functional-polish-no-refactor','v124-video-smoke-production-authority',
  'v125-restore-foryou-only-no-other-tabs','v126-video3124-surgical-recovery','v128-settings-minimal-import-export-only',
  'v129-settings-real-metadata-refresh-only','v130-nav-footer-stability-only','cinetracker_profile_payload_v0997',
  'Populares','Lista','Carrossel','Grade','Avaliações dos episódios por temporada','favorite_actors','Episódios por Dia',
  "applyFourMore('Séries Favoritas')",'window.ct99RenderProfile=()=>false',"cont:s.filter(x=>x.home_bucket==='continue'&&!caught(x))",
  'media?select=id,tmdb_id,media_type,title,release_year,poster_path,raw_tmdb','matches(x)&&(!yr||cy(x)===yr)',
  '>Exportar<','>Importar<','Ignorados com segurança','ct-android-cast-more','ct-android-actors-more','ct-android-action-grid',
  'watch_history?select=watched_at,item_type','episode_progress?select=watched_at,watched',' e '+"'+m[5]+' H"
])if(!html.includes(marker))throw new Error(`Android 0.99.7.2 missing current marker: ${marker}`);
for(const forbidden of [
  "if(t==='profile')return renderProfile99()",
  "if(v==='profile'||v==='history')renderProfile99()",
  "function run(){if(!currentUser)return;insertProfileBlocks();",
  "function run(){if(!currentUser)return;enhanceProfile();",
  'priority=visible-posters'
])if(html.includes(forbidden))throw new Error(`Android 0.99.7.2 contains forbidden legacy/fuzzy behavior: ${forbidden}`);
if(html.includes('<script src="/'))throw new Error('Android 0.99.7.2 still depends on root JS assets');
console.log(`Android ${version} prepared with ${scripts.length} inlined scripts, Web ${webVersion} parity and R3 UI/activity polish.`);
