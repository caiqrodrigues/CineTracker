import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r162.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v162.js'),'utf8'),
  readFile(resolve(dist,'app-v162.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
if(!js.includes("const REVISION='r162-home-discover-sports';"))throw new Error('r164 requires r162 production base');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('single runtime missing');

const patch=String.raw`
/* r164 REAL: preload + sports favorite drill-down, layered on r162 */
window.__ct164Real='vercel-entry-preload-favorites';
window.__ct164Preload={home:false,discover:new Map(),sports:false,profile:false,running:false};
async function ct164Prefetch(){
 if(!session?.access_token||window.__ct164Preload.running)return;
 window.__ct164Preload.running=true;
 try{
  await Promise.all([
   rpc('cinetracker_home_live_v0997_r3',{p_today:localDay()}).then(d=>{if(d)homeCache=d;window.__ct164Preload.home=true}).catch(()=>{}),
   rpc('cinetracker_profile_payload_v0997',{p_tz:tz()}).then(d=>{if(d)profileCache=d;window.__ct164Preload.profile=true}).catch(()=>{}),
   sportsPayload(false).then(d=>{if(d)sportsCache=d;window.__ct164Preload.sports=true}).catch(()=>{})
  ]);
  for(const tab of ['foryou','trending','popular','new','upcoming','toprated']){
   if(discoverCache.has(tab))continue;
   try{const d=await discoverRows(tab);discoverCache.set(tab,d);window.__ct164Preload.discover.set(tab,Date.now())}catch{}
  }
 }finally{window.__ct164Preload.running=false;window.__ct164Preload.completedAt=Date.now()}
}
function ct164StartPreload(){if(session?.access_token){void ct164Prefetch();return}let n=0;const t=setInterval(()=>{if(session?.access_token||++n>30){clearInterval(t);if(session?.access_token)void ct164Prefetch()}},400)}
window.addEventListener('load',ct164StartPreload,{once:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void ct164Prefetch()});
window.addEventListener('focus',()=>void ct164Prefetch());

async function ct164OpenFavorite(entityId){
 if(!(entityId>0))return;
 const modal=document.createElement('div');modal.className='ct164-modal';modal.innerHTML='<div class="ct164-modal-card"><div class="ct164-modal-head"><b>Carregando eventos...</b><button type="button" data-ct164-close>×</button></div><div class="ct164-modal-body"><div class="loader">Buscando jogos relacionados...</div></div></div>';document.body.appendChild(modal);
 try{
  const d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)}),f=d?.favorite||{},ev=Array.isArray(d?.events)?d.events:[];
  modal.querySelector('.ct164-modal-head b').textContent=(f.name||'Favorito')+' · eventos';
  modal.querySelector('.ct164-modal-body').innerHTML='<div class="ct164-fav-summary"><span>'+esc(f.entity_type||'Entidade')+'</span><span>'+esc(f.sport_slug||'')+'</span><span>Últimos 30 dias + próximos 14</span></div>'+(ev.length?'<div class="ct164-event-list">'+ev.map(e=>'<div class="ct164-event"><div><b>'+esc(e.home_name||e.title||'Evento')+'</b>'+(e.away_name?'<span> × '+esc(e.away_name)+'</span>':'')+'</div><small>'+new Date(e.starts_at).toLocaleString('pt-BR')+' · '+esc(e.competition_name||e.sport_slug||'')+'</small><strong>'+esc(e.status||'')+(e.home_score!=null?' · '+esc(e.home_score)+' : '+esc(e.away_score):'')+'</strong></div>').join('')+'</div>':'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>');
 }catch(e){modal.querySelector('.ct164-modal-body').innerHTML='<div class="error">Não foi possível carregar os eventos: '+esc(e?.message||e)+'</div>'}
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-ct164-close]'))modal.remove()});
}
const ct164PaintSports=paintSports;
paintSports=function(p=sportsCache||{}){
 ct164PaintSports(p);const root=document.querySelector('[data-sports]');if(!root)return;
 root.querySelectorAll('[data-sport-fav]').forEach(b=>{const card=b.closest('.favorite-card,.sport-favorite,.card,.media-row')||b.parentElement;if(!card||card.querySelector('[data-ct164-open-favorite]'))return;const open=document.createElement('button');open.type='button';open.className='btn ct164-open-favorite';open.dataset.ct164OpenFavorite=b.dataset.sportFav;open.textContent='Ver eventos';card.appendChild(open)});
};
document.addEventListener('click',e=>{const b=e.target.closest?.('[data-ct164-open-favorite]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();void ct164OpenFavorite(Number(b.dataset.ct164OpenFavorite))},true);
`;
js=js.replace("const REVISION='r162-home-discover-sports';","const REVISION='r164-preload-sports-favorites';");
js=js.replace('\nasync function globalSearch',patch+'\nasync function globalSearch');
css+=String.raw`\n/* r164 */\n.ct164-modal{position:fixed;inset:0;background:#000b;z-index:9999;display:grid;place-items:center;padding:18px}.ct164-modal-card{width:min(760px,96vw);max-height:88vh;overflow:hidden;border:1px solid #29485a;background:#071017;border-radius:16px}.ct164-modal-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #1d3440}.ct164-modal-body{padding:14px;overflow:auto;max-height:calc(88vh - 58px)}.ct164-event-list{display:grid;gap:8px}.ct164-event{display:grid;grid-template-columns:1fr auto;gap:3px 12px;border:1px solid #203b49;background:#0b1820;border-radius:11px;padding:10px}.ct164-fav-summary{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}.ct164-open-favorite{margin-top:6px}\n`;
html=html.replaceAll('r162-home-discover-sports','r164-preload-sports-favorites').replaceAll('app-v162.js','app-v164.js').replaceAll('app-v162.css','app-v164.css');
sw=sw.replaceAll('r162-home-discover-sports','r164-preload-sports-favorites').replaceAll('app-v162.js','app-v164.js').replaceAll('app-v162.css','app-v164.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),writeFile(resolve(dist,'app-v164.js'),js,'utf8'),writeFile(resolve(dist,'app-v164.css'),css,'utf8'),writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r164-preload-sports-favorites',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v162.js'),{force:true}),rm(resolve(dist,'app-v162.css'),{force:true})]);
console.log('WEB_R164_REAL_READY source=apps/web r162-preserved preload=on favorites=events');
