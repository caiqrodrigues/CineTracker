import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=resolve(process.cwd());
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v161.js'),'utf8'),
  readFile(resolve(dist,'app-v161.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
if(!js.includes("const REVISION='r161-release-guard';")) throw new Error('r164 requires r161 runtime');
if(!js.includes('function paintSports')) throw new Error('r164 sports renderer missing');
const patch=String.raw`
/* r164: real preload + sports favorite drill-down */
const CT164_REV='r164-preload-sports-favorites';
window.__ctWebRevision=CT164_REV;
window.__ct164Preload={home:false,discover:new Map(),sports:false,profile:false};

function ct164Schedule(fn,delay=0){
  const idle=window.requestIdleCallback;
  if(idle) idle(()=>fn(),{timeout:Math.max(1000,delay+1500)});
  else setTimeout(fn,delay);
}

async function ct164Prefetch(){
  if(!session?.access_token || window.__ct164Preload.running)return;
  window.__ct164Preload.running=true;
  try{
    const homeP=rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()}).then(d=>{homeCache=d||homeCache;window.__ct164Preload.home=true}).catch(()=>{});
    const sportsP=typeof sportsPayload==='function'?sportsPayload(false).then(d=>{sportsCache=d||sportsCache;window.__ct164Preload.sports=true}).catch(()=>{}):Promise.resolve();
    const profileP=rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}).then(d=>{profileCache=d||profileCache;window.__ct164Preload.profile=true}).catch(()=>{});
    await Promise.all([homeP,sportsP,profileP]);
    const tabs=['foryou','trending','popular','new','upcoming','toprated'];
    for(const tab of tabs){
      if(discoverCache.has(tab))continue;
      try{const d=await discoverRows(tab);discoverCache.set(tab,d);window.__ct164Preload.discover.set(tab,Date.now())}catch{}
    }
  }finally{window.__ct164Preload.running=false;window.__ct164Preload.completedAt=Date.now()}
}

let ct164BootTimer=0;
function ct164BootPreload(){
  if(ct164BootTimer)clearInterval(ct164BootTimer);
  let tries=0;
  const tick=()=>{
    tries++;
    if(session?.access_token){ct164Prefetch();return true}
    if(tries>=30)return true;
    return false;
  };
  if(tick())return;
  ct164BootTimer=setInterval(()=>{if(tick())clearInterval(ct164BootTimer)},500);
}

window.addEventListener('load',()=>ct164BootPreload(),{once:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&session?.access_token)ct164Prefetch()});
window.addEventListener('focus',()=>{if(session?.access_token)ct164Prefetch()});

/* Keep already rendered data visible while navigation requests refresh it. */
const ct164OriginalGo=go;
go=function(path,replace=false){
  const dest=path.startsWith('/')?path:pathFor(path);
  const key=route();
  if(key!==dest.replace(/^\//,'')){
    const cacheReady=(dest==='/home'&&homeCache)||(dest==='/profile'&&profileCache)||(dest==='/sports'&&sportsCache)||(dest==='/discover'&&discoverCache.size);
    if(cacheReady){
      try{history[replace?'replaceState':'pushState']({},'',dest);void render();}catch{return ct164OriginalGo(path,replace)}
      ct164Schedule(()=>ct164Prefetch(),0);
      return;
    }
  }
  return ct164OriginalGo(path,replace);
};

async function ct164OpenFavorite(entityId){
  const root=document.querySelector('[data-sports]');
  if(!root||!entityId)return;
  const modal=document.createElement('div');modal.className='ct164-modal';modal.innerHTML='<div class="ct164-modal-card"><div class="ct164-modal-head"><b>Carregando eventos...</b><button type="button" data-ct164-close>×</button></div><div class="ct164-modal-body"><div class="loader">Buscando jogos relacionados...</div></div></div>';
  document.body.appendChild(modal);
  try{
    const d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)});
    const f=d?.favorite||{};const ev=Array.isArray(d?.events)?d.events:[];
    const body=modal.querySelector('.ct164-modal-body');
    const head=modal.querySelector('.ct164-modal-head b');
    if(head)head.textContent=(f.name||'Favorito')+' · eventos';
    if(body)body.innerHTML='<div class="ct164-fav-summary"><span>'+esc(f.entity_type||'Entidade')+'</span><span>'+esc(f.sport_slug||'')+'</span><span>Últimos 30 dias + próximos 14</span></div>'+(ev.length?'<div class="ct164-event-list">'+ev.map(e=>'<button type="button" class="ct164-event" data-ct164-event="'+Number(e.id)+'"><div><b>'+esc(e.home_name||e.title||'Evento')+'</b>'+(e.away_name?'<span> × '+esc(e.away_name)+'</span>':'')+'</div><small>'+new Date(e.starts_at).toLocaleString('pt-BR')+' · '+esc(e.competition_name||e.sport_slug||'')+'</small><strong>'+esc(e.status||'')+(e.home_score!=null?' · '+esc(e.home_score)+' : '+esc(e.away_score):'')+'</strong></button>').join('')+'</div>':'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>');
  }catch(e){const body=modal.querySelector('.ct164-modal-body');if(body)body.innerHTML='<div class="error">Não foi possível carregar os eventos: '+esc(e?.message||e)+'</div>'}
  modal.addEventListener('click',ev=>{if(ev.target.closest('[data-ct164-close]')||ev.target===modal)modal.remove()});
}

const ct164PaintSports=paintSports;
paintSports=function(p=sportsCache||{}){
  ct164PaintSports(p);
  const root=document.querySelector('[data-sports]');if(!root)return;
  root.querySelectorAll('.favorite-card').forEach(card=>{
    const b=card.querySelector('[data-sport-fav]');if(!b)return;
    card.dataset.ct164FavoriteOpen=b.dataset.sportFav;
    if(!card.querySelector('[data-ct164-open-favorite]')){
      const open=document.createElement('button');open.type='button';open.className='btn btn-secondary ct164-open-favorite';open.dataset.ct164OpenFavorite=b.dataset.sportFav;open.textContent='Ver eventos';
      card.appendChild(open);
    }
  });
};

document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-ct164-open-favorite]');if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();void ct164OpenFavorite(Number(b.dataset.ct164OpenFavorite));
},true);
`;
js=js.replace("const REVISION='r161-release-guard';","const REVISION='r164-preload-sports-favorites';");
js=js.replace('\nasync function globalSearch',patch+'\nasync function globalSearch');
css+=String.raw`
/* r164 */
.ct164-modal{position:fixed;inset:0;background:#000b;z-index:9999;display:grid;place-items:center;padding:18px}.ct164-modal-card{width:min(760px,96vw);max-height:88vh;overflow:hidden;border:1px solid #29485a;background:#071017;border-radius:16px;box-shadow:0 24px 80px #000}.ct164-modal-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #1d3440}.ct164-modal-head button{border:1px solid #31556a;background:#0b1820;color:#fff;border-radius:9px;width:30px;height:30px}.ct164-modal-body{padding:14px;overflow:auto;max-height:calc(88vh - 58px)}.ct164-fav-summary{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.ct164-fav-summary span{border:1px solid #254a5d;border-radius:999px;padding:5px 8px;font-size:11px}.ct164-event-list{display:grid;gap:8px}.ct164-event{display:grid;grid-template-columns:1fr auto;gap:3px 12px;text-align:left;border:1px solid #203b49;background:#0b1820;color:#eee;border-radius:11px;padding:10px;cursor:pointer}.ct164-event:hover{border-color:#58a8d0}.ct164-event small{color:#8fa5b1}.ct164-event strong{grid-row:1/3;grid-column:2;align-self:center;font-size:11px}.ct164-open-favorite{margin-top:7px;width:100%;font-size:10px!important}@media(max-width:600px){.ct164-event{grid-template-columns:1fr}.ct164-event strong{grid-column:1;grid-row:auto}}
`;
html=html.replace('/app-v161.js?ct=r161-release-guard','/app-v164.js?ct=r164-preload-sports-favorites').replace('/app-v161.css?ct=r161-release-guard','/app-v164.css?ct=r164-preload-sports-favorites').replace('r161-release-guard','r164-preload-sports-favorites');
sw=sw.replaceAll('r161-release-guard','r164-preload-sports-favorites');
await Promise.all([
  writeFile(resolve(dist,'index.html'),html,'utf8'),
  writeFile(resolve(dist,'app-v164.js'),js,'utf8'),
  writeFile(resolve(dist,'app-v164.css'),css,'utf8'),
  writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
  writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r164-preload-sports-favorites',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v161.js'),{force:true}),rm(resolve(dist,'app-v161.css'),{force:true})]);
console.log('WEB_R164_READY preload=home+discover+profile+sports sports-favorites=related-events');
