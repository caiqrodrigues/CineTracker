(()=>{
'use strict'
const R306='r306-final-canonical'
const $=(s,r=document)=>r?.querySelector?.(s)||null
const $$=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[]
const txt=v=>String(v??'').trim()
const norm=v=>txt(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
const esc=v=>txt(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const routeNow=()=>{try{return typeof route==='function'?route():location.pathname}catch{return location.pathname}}
const mediaRoute=(type,id)=>`/${type==='movie'?'movie':'series'}/${id}`
const parseMediaToken=v=>{const m=txt(v).match(/^(movie|tv|series):(\d+)$/);return m?{type:m[1]==='movie'?'movie':'tv',id:Number(m[2])}:null}
function mediaFrom306(el){
  if(!el)return null
  const direct=parseMediaToken(el.dataset?.media||el.dataset?.ctMedia||el.dataset?.ct169RelatedCard||el.dataset?.ct169RelatedWatch||el.dataset?.ct169RelatedSeen||el.dataset?.relatedWatch||el.dataset?.relatedSeen||el.dataset?.detailWatchlist||el.dataset?.detailSeen||el.getAttribute?.('data-media'))
  if(direct)return direct
  const id=Number(el.dataset?.tmdbId||el.dataset?.id||el.getAttribute?.('data-tmdb-id')||el.getAttribute?.('data-id')||0)
  let type=txt(el.dataset?.mediaType||el.dataset?.type||el.getAttribute?.('data-media-type')).toLowerCase()
  if(type==='series')type='tv'
  if(id>0&&['movie','tv'].includes(type))return{type,id}
  const a=el.matches?.('a[href]')?el:el.querySelector?.('a[href]')
  const href=a?.getAttribute?.('href')||''
  const hm=href.match(/\/(movie|series|tv)\/(\d+)/)
  if(hm)return{type:hm[1]==='movie'?'movie':'tv',id:Number(hm[2])}
  const p=location.pathname.match(/\/(movie|series|tv)\/(\d+)/)
  if(p&&el.closest?.('#modalBackdrop,.modal-backdrop,[data-detail],.detail-modal,.ct-related,.related,.similar,.recommend'))return{type:p[1]==='movie'?'movie':'tv',id:Number(p[2])}
  return null
}
function personFrom306(el){
  if(!el)return 0
  const direct=Number(el.dataset?.person||el.dataset?.personId||el.getAttribute?.('data-person')||el.getAttribute?.('data-person-id')||0)
  if(direct>0)return direct
  const a=el.matches?.('a[href]')?el:el.querySelector?.('a[href]')
  const m=(a?.getAttribute?.('href')||'').match(/\/person\/(\d+)/)
  return m?Number(m[1]):0
}
function isAction306(el){
  const v=norm([el?.dataset?.action,el?.getAttribute?.('aria-label'),el?.title,el?.textContent].filter(Boolean).join(' '))
  if(/watchlist|playlist|salvar|adicionar/.test(v))return'watchlist'
  if(/visto|assistid|seen|watched/.test(v))return'seen'
  return''
}
function relatedCard306(target){return target?.closest?.('[data-media],.poster-card,.media-card,.related-card,.similar-card,.recommendation-card,.ct169-related-card,.ct170-related-card,[data-related-card],[data-similar-card],.ct286-related-card,.ct292-related-card')||null}
function personCard306(target){return target?.closest?.('[data-person],[data-person-id],.cast-card,.person-card,.profile-person,.actor-card')||null}
function openMedia306(card){
  const m=mediaFrom306(card);if(!m)return false
  try{
    if(typeof go==='function'){go(mediaRoute(m.type,m.id));return true}
    history.pushState({},'',mediaRoute(m.type,m.id));window.dispatchEvent(new PopStateEvent('popstate'));return true
  }catch{return false}
}
function openPerson306(card){
  const id=personFrom306(card);if(!(id>0))return false
  try{if(typeof go==='function'){go(`/person/${id}`);return true}history.pushState({},'',`/person/${id}`);window.dispatchEvent(new PopStateEvent('popstate'));return true}catch{return false}
}
async function persistAction306(kind,card,button){
  const m=mediaFrom306(card)||mediaFrom306(button);if(!m)return false
  const original=button?.textContent||''
  if(button){button.disabled=true;button.dataset.ct306Busy='1'}
  try{
    if(kind==='watchlist'){
      if(typeof addWatchlist==='function')await addWatchlist(m.type,m.id)
      else if(typeof window.__ctR295AddWatchlist==='function')await window.__ctR295AddWatchlist(m.type,m.id)
      else throw new Error('Ação de Watchlist indisponível')
      if(button){button.textContent='✓ Watchlist';button.dataset.saved='1'}
    }else{
      if(typeof markSeen==='function')await markSeen(m.type,m.id)
      else if(typeof window.__ctR295MarkSeen==='function')await window.__ctR295MarkSeen(m.type,m.id)
      else throw new Error('Ação de Visto indisponível')
      if(button){button.textContent='✓ Visto';button.dataset.seen='1'}
    }
    return true
  }catch(err){if(button)button.textContent=original;try{if(typeof toast==='function')toast(err?.message||String(err))}catch{}return false}
  finally{if(button){button.disabled=false;delete button.dataset.ct306Busy}}
}
function compactTop10306(){
  if(!['discover','descobrir'].includes(routeNow())&&!['/discover','/descobrir'].includes(location.pathname))return false
  const active=$('[data-discover-tab].active,[data-discover-tab][aria-selected="true"]')
  const isTop=norm(active?.textContent).includes('top 10')||txt(active?.dataset?.discoverTab)==='top10'||!!$('.ct288-top10,.ct294-top10,[data-top10],.top10-grid,.top10-row')
  const content=$('.content');if(!content||!isTop)return false
  content.classList.add('ct306-top10')
  return true
}
function removeDrivers306(){
  let changed=false
  try{if(typeof F1_TABS255!=='undefined'&&Array.isArray(F1_TABS255)){const next=F1_TABS255.filter(x=>txt(x?.[0])!=='drivers');changed=next.length!==F1_TABS255.length;F1_TABS255.splice(0,F1_TABS255.length,...next)}}catch{}
  $$('[data-f1-tab],.ct255-f1-tabs button,.ct301-f1-tabs button').forEach(b=>{if(txt(b.dataset?.f1Tab)==='drivers'||norm(b.textContent)==='pilotos'){b.remove();changed=true}})
  return changed
}
function normalizeSportTabs306(){
  try{if(typeof SPORT_TABS255!=='undefined'&&Array.isArray(SPORT_TABS255)){
    const desired=['next','previous','favorites','watched'];const map=new Map(SPORT_TABS255.map(x=>[txt(x?.[0]),x]));const next=desired.map(k=>map.get(k)).filter(Boolean);if(next.length)SPORT_TABS255.splice(0,SPORT_TABS255.length,...next)
  }}catch{}
  const tabs=$('.ct255-sports-tabs,[data-sports-tabs],.sports-tabs');if(!tabs)return false
  const order=['next','previous','favorites','watched'];const buttons=$$('[data-sports-tab]',tabs);buttons.sort((a,b)=>order.indexOf(txt(a.dataset.sportsTab))-order.indexOf(txt(b.dataset.sportsTab))).forEach(b=>tabs.appendChild(b))
  return true
}
function sportsBlocks306(){
  const content=$('.content');if(!content||(!['sports','esportes'].includes(routeNow())&&!['/sports','/esportes'].includes(location.pathname)))return null
  const f1=$('[data-f1-hub],[data-ct255-f1],.ct255-f1hub,.ct255-f1-hub,.ct301-f1-wrap,.f1-hub',content)
  const tabs=$('.ct255-sports-tabs,[data-sports-tabs],.sports-tabs',content)
  if(f1&&tabs&&f1.nextElementSibling!==tabs)f1.insertAdjacentElement('afterend',tabs)
  const header=$(':scope > .header',content)||$('.header',content);if(header)header.classList.add('ct306-sports-header')
  return{content,f1,tabs,header}
}
async function syncSports306(button){
  if(button.disabled)return
  const label=button.innerHTML;button.disabled=true;button.innerHTML='↻ Sincronizando…'
  try{
    let synced=false
    if(typeof edge==='function'){await edge('ct-sports-sync',{action:'sync',sport:'all',force:true},50000);synced=true}
    if(typeof loadSports255==='function'){await loadSports255(true);synced=true}
    else if(typeof sportsPayload==='function'){await sportsPayload(true);synced=true}
    if(typeof renderSports==='function')await renderSports()
    else if(typeof paintSports==='function')paintSports()
    if(!synced)throw new Error('Sincronização esportiva indisponível')
    try{if(typeof toast==='function')toast('Jogos e eventos sincronizados.')}catch{}
  }catch(err){try{if(typeof toast==='function')toast(err?.message||String(err))}catch{}}
  finally{button.disabled=false;button.innerHTML=label;queueMicrotask(stabilize306)}
}
function ensureSportsRefresh306(){
  const b=sportsBlocks306();if(!b?.header)return false
  let btn=$('.ct306-sports-sync',b.header)
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='btn ct306-sports-sync';btn.setAttribute('aria-label','Rebuscar e sincronizar jogos');btn.innerHTML='↻ Rebuscar / Sincronizar';b.header.appendChild(btn)}
  if(b.tabs?.contains(btn)){b.header.appendChild(btn)}
  return true
}
function schedule306(){try{return typeof f1255!=='undefined'&&Array.isArray(f1255?.data?.schedule)?f1255.data.schedule:[]}catch{return[]}}
function raceFromButton306(btn){
  const season=Number(btn.dataset?.season||new Date().getFullYear())
  const eventId=txt(btn.dataset?.ct301F1Event||btn.getAttribute?.('data-ct301-f1-event'))
  const explicitRound=Number(btn.dataset?.round||eventId.match(/-(\d+)$/)?.[1]||0)
  const rows=schedule306()
  const found=rows.find((ev,i)=>{
    const round=Number(ev?.round||ev?.week||i+1);const id=txt(ev?.id||ev?.event_id||ev?.race_id||`${season}-${round}`)
    return (eventId&&id===eventId)||(explicitRound&&round===explicitRound)
  })
  const round=Number(found?.round||found?.week||explicitRound||1)
  return{...(found||{}),season,round,eventId,title:found?.raceName||found?.name||found?.title||txt(btn.querySelector?.('b,strong,h3,h4')?.textContent)||txt(btn.textContent).split('\n')[0]||`GP ${round}`}
}
function f1ResultRows306(data){
  const race=data?.MRData?.RaceTable?.Races?.[0]||data?.RaceTable?.Races?.[0]||data?.races?.[0]||null
  const rows=race?.Results||race?.results||[]
  return Array.isArray(rows)?rows:[]
}
async function loadF1Result306(race){
  const local=race?.Results||race?.results||race?.classification||[]
  if(Array.isArray(local)&&local.length)return local
  const url=`https://api.jolpi.ca/ergast/f1/${encodeURIComponent(race.season)}/${encodeURIComponent(race.round)}/results.json?limit=100`
  const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error(`F1 ${r.status}`);return f1ResultRows306(await r.json())
}
function driverName306(r){const d=r?.Driver||r?.driver||{};return [d.givenName||d.given_name,d.familyName||d.family_name].filter(Boolean).join(' ')||d.code||d.driverId||'Piloto'}
function constructor306(r){return r?.Constructor?.name||r?.constructor?.name||r?.team||'—'}
function resultTable306(rows,mode){
  const copy=[...rows].sort((a,b)=>Number(mode==='grid'?a.grid:a.position)-Number(mode==='grid'?b.grid:b.position))
  return `<div class="ct306-f1-table">${copy.map((r,i)=>{const pos=mode==='grid'?Number(r.grid||i+1):Number(r.position||i+1);const extra=mode==='grid'?constructor306(r):(r.Time?.time||r.time||r.status||'—');return `<div class="ct306-f1-row"><b>${Number.isFinite(pos)&&pos>0?pos:'—'}</b><span>${esc(driverName306(r))}</span><small>${esc(extra)}</small></div>`}).join('')||'<div class="empty">Dados ainda não disponíveis.</div>'}</div>`
}
function openF1Race306(race){
  document.querySelector('.ct306-f1-modal')?.remove()
  const wrap=document.createElement('div');wrap.className='ct306-f1-modal';wrap.innerHTML=`<div class="ct306-f1-dialog" role="dialog" aria-modal="true" aria-label="Detalhes da corrida"><button type="button" class="ct306-f1-close" aria-label="Fechar">×</button><div class="eyebrow">F1 Hub · ${esc(race.season)}</div><h2>${esc(race.title||`GP ${race.round}`)}</h2><div class="ct306-f1-columns"><section><h3>Grid de Largada</h3><div data-ct306-grid class="loader">Carregando grid…</div></section><section><h3>Resultado de Chegada</h3><div data-ct306-result class="loader">Carregando resultado…</div></section></div></div>`
  document.body.appendChild(wrap)
  const close=()=>wrap.remove();$('.ct306-f1-close',wrap)?.addEventListener('click',close);wrap.addEventListener('click',e=>{if(e.target===wrap)close()})
  void loadF1Result306(race).then(rows=>{const g=$('[data-ct306-grid]',wrap),r=$('[data-ct306-result]',wrap);if(g)g.innerHTML=resultTable306(rows,'grid');if(r)r.innerHTML=resultTable306(rows,'result')}).catch(err=>{const msg=`<div class="error">${esc(err?.message||'Falha ao carregar dados da corrida.')}</div>`;const g=$('[data-ct306-grid]',wrap),r=$('[data-ct306-result]',wrap);if(g)g.innerHTML=msg;if(r)r.innerHTML=msg})
  return true
}
function stableProfile306(){
  if(!['profile','perfil'].includes(routeNow())&&!['/profile','/perfil'].includes(location.pathname))return false
  const root=$('[data-profile]')||$('.content');if(!root)return false
  root.classList.add('ct306-profile-stable')
  $$('.stat-link-icon,.stat-arrow,.open-arrow,[data-open-arrow]',root).forEach(x=>x.remove())
  $$('[data-stat],.stat-card,.profile-stat',root).forEach(card=>{const label=norm(card.textContent);if(label.includes('series watchlist')||label.includes('filmes watchlist'))$$('span,i,small',card).filter(x=>txt(x.textContent)==='>'||txt(x.textContent)==='›'||norm(x.textContent)==='abrir').forEach(x=>x.remove())})
  const rails=$$('.row,.row-scroll,.profile-actors,.actors-row,[data-profile-actors]',root)
  rails.forEach(rail=>{
    const actors=$$('[data-person],[data-person-id],.cast-card,.person-card,.actor-card',rail)
    if(!actors.length)return
    rail.classList.add('ct306-actor-rail')
    actors.forEach(card=>{card.classList.add('ct306-actor-card');const image=$('.poster,img,.avatar',card);if(image)image.classList.add('ct306-actor-image')})
  })
  return true
}
function stabilize306(){
  removeDrivers306();compactTop10306();normalizeSportTabs306();sportsBlocks306();ensureSportsRefresh306();stableProfile306()
  document.documentElement.dataset.ct306=R306
}
const css=document.createElement('style');css.id='ct306-style';css.textContent=`
html,body{max-width:100%;overflow-x:hidden!important}
.content.ct306-top10{padding-top:4px!important;margin-top:0!important;gap:6px!important}
.content.ct306-top10>.header{margin:0!important;padding-top:0!important;padding-bottom:2px!important;min-height:0!important}
.content.ct306-top10 .hero249,.content.ct306-top10 [data-discover-tabs],.content.ct306-top10 .discover-tabs{margin-top:0!important;margin-bottom:4px!important;padding-top:0!important;padding-bottom:0!important;min-height:0!important}
.content.ct306-top10 .page,.content.ct306-top10 [data-discover]{padding-top:0!important;margin-top:0!important}
.content.ct306-top10 .section-title,.content.ct306-top10 h2,.content.ct306-top10 h3{margin-top:3px!important;margin-bottom:3px!important}
.ct306-sports-header{position:relative}.ct306-sports-sync{margin-left:auto!important;white-space:nowrap;align-self:flex-start}
.content>.header:has(.ct306-sports-sync){display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important}
.ct255-sports-tabs .ct306-sports-sync,[data-sports-tabs] .ct306-sports-sync,.sports-tabs .ct306-sports-sync{display:none!important}
.ct306-profile-stable .stat-link-icon,.ct306-profile-stable .stat-arrow,.ct306-profile-stable .open-arrow,.ct306-profile-stable [data-open-arrow]{display:none!important}
.ct306-profile-stable .ct306-actor-rail{display:flex!important;flex-wrap:nowrap!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;padding-bottom:10px!important;scrollbar-gutter:stable!important;max-width:100%!important}
.ct306-profile-stable .ct306-actor-card{box-sizing:border-box!important;flex:0 0 132px!important;width:132px!important;min-width:132px!important;max-width:132px!important;height:178px!important;min-height:178px!important;max-height:178px!important;overflow:hidden!important}
.ct306-profile-stable .ct306-actor-image{box-sizing:border-box!important;width:112px!important;min-width:112px!important;max-width:112px!important;height:112px!important;min-height:112px!important;max-height:112px!important;aspect-ratio:1/1!important;object-fit:cover!important;background-size:cover!important;background-position:center!important;border-radius:999px!important;margin-inline:auto!important}
.ct306-f1-modal{position:fixed;inset:0;z-index:10050;background:#000b;display:flex;align-items:center;justify-content:center;padding:18px;overflow-y:auto}.ct306-f1-dialog{position:relative;width:min(980px,100%);max-height:min(90vh,900px);overflow:auto;background:#0b1016;border:1px solid #ffffff24;border-radius:16px;padding:20px;box-shadow:0 24px 80px #000a}.ct306-f1-close{position:absolute;right:14px;top:10px;border:0;background:transparent;color:inherit;font-size:28px;cursor:pointer}.ct306-f1-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.ct306-f1-columns section{min-width:0}.ct306-f1-table{display:grid;gap:6px}.ct306-f1-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:8px;align-items:center;padding:8px 10px;border:1px solid #ffffff14;border-radius:10px}.ct306-f1-row small{opacity:.72;text-align:right}@media(max-width:720px){.ct306-f1-columns{grid-template-columns:1fr}.ct306-sports-sync{font-size:12px;padding-inline:10px}}
`;document.head.appendChild(css)

document.addEventListener('click',e=>{
  const target=e.target
  const sync=target.closest?.('.ct306-sports-sync');if(sync){e.preventDefault();e.stopImmediatePropagation();void syncSports306(sync);return}
  const raceBtn=target.closest?.('[data-ct301-f1-event],.ct301-f1-event[data-season]');if(raceBtn&&!raceBtn.disabled){e.preventDefault();e.stopImmediatePropagation();openF1Race306(raceFromButton306(raceBtn));return}
  const detailAction=target.closest?.('[data-detail-watchlist],[data-detail-seen]');if(detailAction){const kind=detailAction.hasAttribute('data-detail-watchlist')?'watchlist':'seen';e.preventDefault();e.stopImmediatePropagation();void persistAction306(kind,detailAction,detailAction);return}
  const person=personCard306(target);if(person&&!target.closest?.('button[data-action],button[data-ct-action]')){if(openPerson306(person)){e.preventDefault();e.stopImmediatePropagation()}return}
  const card=relatedCard306(target);if(!card)return
  const button=target.closest?.('button,a,[role="button"]');const action=button?isAction306(button):''
  if(action){e.preventDefault();e.stopImmediatePropagation();void persistAction306(action,card,button);return}
  if(button&&button!==card&&!button.matches?.('[data-media]')&&!button.closest?.('[data-media]'))return
  if(openMedia306(card)){e.preventDefault();e.stopImmediatePropagation()}
},true)

removeDrivers306();normalizeSportTabs306();
try{if(typeof renderProfile==='function'){const base=renderProfile;renderProfile=async function(){const out=await base.apply(this,arguments);stableProfile306();return out}}}catch{}
try{if(typeof renderDiscover==='function'){const base=renderDiscover;renderDiscover=async function(){const out=await base.apply(this,arguments);compactTop10306();return out}}}catch{}
try{if(typeof paintSports255==='function'){const base=paintSports255;paintSports255=function(){removeDrivers306();normalizeSportTabs306();const out=base.apply(this,arguments);sportsBlocks306();ensureSportsRefresh306();return out}}}catch{}
try{if(typeof renderSports==='function'){const base=renderSports;renderSports=async function(){removeDrivers306();normalizeSportTabs306();const out=await base.apply(this,arguments);sportsBlocks306();ensureSportsRefresh306();return out}}}catch{}
try{if(typeof setApp==='function'){const base=setApp;setApp=function(){const out=base.apply(this,arguments);queueMicrotask(stabilize306);return out}}}catch{}
window.__ctR306={stabilize:stabilize306,openRace:openF1Race306,syncSports:syncSports306,version:'1.0.97',lifecycle:'pre-boot-renderer-hooks-no-delayed-reconcile'}
queueMicrotask(stabilize306)
})();
