/* CineTracker Web 0.3.47 r520 — F1 + UFC + WWE Pay-Per-View single Home owner. */
(()=>{
'use strict';
if(window.__ctR512Special?.version==='0.3.47')return;
const core=()=>window.__ctCoreR471||null,q=(s,r=document)=>r?.querySelector?.(s)||null,qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])],rows=v=>Array.isArray(v)?v:[],rpc=(n,a={})=>core()?.rpc?.(n,a);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),norm=v=>String(v??'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),route=()=>String(core()?.route?.()||''),currentYear=()=>new Date().getFullYear(),localDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
let current={f1:null,ufc:null,wwe:null},currentTask=null;
const cacheGet=k=>{try{const x=JSON.parse(sessionStorage.getItem(k)||'null');return x&&Date.now()-Number(x.at||0)<10*60*1000?x.data:null}catch{return null}},cacheSet=(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify({at:Date.now(),data:v}))}catch{}},cacheDrop=k=>{try{sessionStorage.removeItem(k)}catch{}};
function panelFor(bucket){
 const view=q('[data-home-view="series"]');if(!view)return null;
 const wants=bucket==='continue'?['continuar assistindo','assistir a seguir']:['em dia'];
 return qa(':scope > section',view).find(sec=>wants.includes(norm(q('.panel-head h3,h3',sec)?.textContent||'')))||null
}
function recount(sec){if(!sec)return;const small=q('.panel-head small',sec),n=qa(':scope > .stack > .media-row,:scope > .stack > [data-ct512-special]',sec).length;if(small)small.textContent=String(n)}
function removeExisting(key){
 const view=q('[data-home-view="series"]');if(!view)return;
 const titles={f1:new Set(['formula 1','formula one']),ufc:new Set(['ufc']),wwe:new Set(['wwe pay per view','wwe pay-per-view'])}[key]||new Set();
 for(const x of qa('[data-ct512-special="'+key+'"]',view)){const sec=x.closest('section');x.remove();recount(sec)}
 for(const row of qa('.media-row.ct274-media-card',view)){
  if(row.matches('[data-ct512-special]'))continue;
  const title=norm(q('.ct274-row-copy>b,b',row)?.textContent||'');if(!titles.has(title))continue;
  const sec=row.closest('section');row.remove();recount(sec)
 }
}
function cardHtml(key,p){
 const s=p?.series||{},g=window.__ctR516SpecialSummary?.get?.(key)||null,season=Number(s.season||currentYear()),watched=Number(s.watched_episodes||0),released=Number(s.released_episodes||s.total_episodes||0),pending=Number(s.available_episodes||0),poster=String(s.poster_url||'');
 const title=key==='f1'?'Fórmula 1':key==='ufc'?'UFC':'WWE Pay-Per-View',unit=key==='f1'?'sessões':'eventos';
 let meta='T'+season+' · '+watched.toLocaleString('pt-BR')+'/'+released.toLocaleString('pt-BR')+' '+unit;
 if(g?.total){meta=(key==='f1'?(Number(g.watched||0).toLocaleString('pt-BR')+' registros assistidos · '+Number(g.total).toLocaleString('pt-BR')+' GPs catalogados'):(Number(g.watched||0).toLocaleString('pt-BR')+'/'+Number(g.total).toLocaleString('pt-BR')+' eventos na série'))+' · '+meta}
 const sub=pending>0?(pending+' '+(key==='f1'?'sessão':'evento')+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(s.next_episode_title?' · '+s.next_episode_title:'')):('Em dia'+(s.upcoming_episode_title?' · Próximo: '+s.upcoming_episode_title:''));
 return '<div class="media-row ct274-media-card ct512-special-card" data-ct512-special="'+key+'" data-ct513-open="'+key+'" role="button" tabindex="0" aria-label="Abrir série '+esc(title)+'"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>'+esc(title)+'</b><small class="ct274-meta">'+esc(meta)+'</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>'
}
function mountOne(key){
 const p=current[key];if(route()!=='home'||!p?.series)return false;
 removeExisting(key);const bucket=p.series.home_bucket==='continue'?'continue':'up_to_date',target=panelFor(bucket),stack=q(':scope > .stack',target);if(!target||!stack)return false;
 q(':scope > .empty',stack)?.remove();stack.insertAdjacentHTML('afterbegin',cardHtml(key,p));recount(target);return true
}
function mountAll(){
 const a=mountOne('wwe'),b=mountOne('ufc'),c=mountOne('f1');
 document.documentElement.dataset.ct520SpecialHome=(a||b||c)?'f1+ufc+wwe':'pending';return a||b||c
}
async function loadCurrent(force=false){
 if(currentTask)return currentTask;
 if(!force){
  for(const k of ['f1','ufc','wwe'])current[k]=current[k]||cacheGet('ct520:'+k+':current');
  if(current.f1||current.ufc||current.wwe)mountAll();
  if(current.f1&&current.ufc&&current.wwe)return current
 }
 currentTask=(async()=>{try{
  const y=currentYear(),day=localDay(),got=await Promise.allSettled([
   rpc('cinetracker_f1_series_v512',{p_season:y,p_today:day,p_recent_days:21}),
   rpc('cinetracker_ufc_series_v518',{p_season:y,p_today:day,p_recent_days:21}),
   rpc('cinetracker_wwe_ppv_series_v519',{p_season:y,p_today:day,p_recent_days:30})
  ]);
  for(const [i,k] of ['f1','ufc','wwe'].entries())if(got[i].status==='fulfilled'&&got[i].value?.series){current[k]=got[i].value;cacheSet('ct520:'+k+':current',current[k])}
  mountAll();
  const catalog=window.__ctR520Catalog;
  if(catalog?.loadSeason){
   void Promise.allSettled(['ufc','wwe'].map(k=>catalog.loadSeason(k,y,!!force))).then(all=>{
    all.forEach((r,i)=>{if(r.status==='fulfilled'&&r.value?.series){const k=['ufc','wwe'][i];current[k]=r.value;cacheSet('ct520:'+k+':current',r.value)}});mountAll()
   })
  }
  return current
 }finally{currentTask=null}})();return currentTask
}
async function loadSeason(type,season){const api=window.__ctR520Catalog;if(!api?.loadSeason)throw new Error('SPECIAL_CATALOG_UNAVAILABLE');return api.loadSeason(type,Number(season),false)}
function open(type,season=currentYear()){return window.__ctR513SeriesScreen?.open?.(type,season)??false}
function remountSoon(){if(route()!=='home')return;queueMicrotask(mountAll);requestAnimationFrame(mountAll)}
for(const ev of ['cinetracker:f1-watched-changed','cinetracker:ufc-watched-changed','cinetracker:wwe-ppv-watched-changed'])window.addEventListener(ev,()=>{for(const k of ['f1','ufc','wwe']){current[k]=null;cacheDrop('ct520:'+k+':current')}void loadCurrent(true)});
document.addEventListener('cinetracker:data-changed',e=>{const t=String(e?.detail?.type||'');if(['f1','ufc','wwe'].includes(t)){current[t]=null;cacheDrop('ct520:'+t+':current');void loadCurrent(true)}});
window.addEventListener('popstate',()=>requestAnimationFrame(remountSoon));
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-nav="home"]'))requestAnimationFrame(()=>{void loadCurrent(false);remountSoon()})},true);
const style=document.createElement('style');style.id='ct520-special-style';style.textContent='.ct512-special-card{cursor:pointer!important}.ct512-special-card .thumb{background-size:contain!important;background-repeat:no-repeat!important;background-position:center!important;background-color:rgba(0,0,0,.42)!important}';if(!q('#ct520-special-style'))document.head.appendChild(style);
window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';
window.__ctR512Special={version:'0.3.47',loadCurrent,mountAll,open,loadSeason,get current(){return current}};
if(route()==='home'){void loadCurrent(false);remountSoon()}
})();