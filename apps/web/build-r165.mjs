import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r163.mjs');
const root=dirname(fileURLToPath(import.meta.url));
const dist=resolve(root,'dist');
let [html,js,css,sw]=await Promise.all([
  readFile(resolve(dist,'index.html'),'utf8'),
  readFile(resolve(dist,'app-v163.js'),'utf8'),
  readFile(resolve(dist,'app-v163.css'),'utf8'),
  readFile(resolve(dist,'service-worker.js'),'utf8')
]);
if(!js.includes("const REVISION='r163-instant-preload-stable-ui';"))throw new Error('r165 requires restored r163 base');
if(!js.includes("window.__ctRuntimeAuthority='single-clean-runtime';"))throw new Error('single runtime missing');
if(!js.includes("window.__ct163Preload='home+discover+profile+sports';"))throw new Error('r163 preload missing');
if(!js.includes("window.__ct163SportsHistory='extended-date-range';"))throw new Error('r163 sports history missing');

const patch=String.raw`
/* r165: restored r163 UX/performance + sports favorite drill-down */
window.__ctR165='r163-restored-plus-favorite-events';

async function ct165OpenFavorite(entityId){
 if(!(entityId>0))return;
 const modal=document.createElement('div');
 modal.className='ct165-modal';
 modal.innerHTML='<div class="ct165-modal-card"><div class="ct165-modal-head"><b>Carregando eventos...</b><button type="button" data-ct165-close>×</button></div><div class="ct165-modal-body"><div class="loader">Buscando jogos relacionados...</div></div></div>';
 document.body.appendChild(modal);
 try{
  const d=await rpc('cinetracker_sport_favorite_events_v2',{p_entity_id:Number(entityId),p_from:shiftDays(-30),p_to:shiftDays(14)});
  const f=d?.favorite||{},ev=Array.isArray(d?.events)?d.events:[];
  modal.querySelector('.ct165-modal-head b').textContent=(f.name||'Favorito')+' · eventos';
  modal.querySelector('.ct165-modal-body').innerHTML='<div class="ct165-fav-summary"><span>'+esc(f.entity_type||'Entidade')+'</span><span>'+esc(f.sport_slug||'')+'</span><span>Últimos 30 dias + próximos 14</span></div>'+(ev.length?'<div class="ct165-event-list">'+ev.map(e=>'<div class="ct165-event"><div><b>'+esc(e.home_name||e.title||'Evento')+'</b>'+(e.away_name?'<span> × '+esc(e.away_name)+'</span>':'')+'</div><small>'+new Date(e.starts_at).toLocaleString('pt-BR')+' · '+esc(e.competition_name||e.sport_slug||'')+'</small><strong>'+esc(e.status||'')+(e.home_score!=null?' · '+esc(e.home_score)+' : '+esc(e.away_score):'')+'</strong></div>').join('')+'</div>':'<div class="empty">Nenhum evento relacionado encontrado nesse período.</div>');
 }catch(e){
  modal.querySelector('.ct165-modal-body').innerHTML='<div class="error">Não foi possível carregar os eventos: '+esc(e?.message||e)+'</div>';
 }
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-ct165-close]'))modal.remove()});
}

const ct165PaintSports=paintSports;
paintSports=function(p=sportsCache||{}){
 ct165PaintSports(p);
 const root=document.querySelector('[data-sports]');if(!root)return;
 root.querySelectorAll('[data-sport-fav]').forEach(b=>{
  const card=b.closest('.favorite-card,.sport-favorite,.card,.media-row')||b.parentElement;
  if(!card||card.querySelector('[data-ct165-open-favorite]'))return;
  const open=document.createElement('button');
  open.type='button';open.className='btn ct165-open-favorite';open.dataset.ct165OpenFavorite=b.dataset.sportFav;open.textContent='Ver eventos';card.appendChild(open);
 });
};
document.addEventListener('click',e=>{
 const b=e.target.closest?.('[data-ct165-open-favorite]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();void ct165OpenFavorite(Number(b.dataset.ct165OpenFavorite));
},true);
`;

js=js.replace("const REVISION='r163-instant-preload-stable-ui';","const REVISION='r165-r163-restored-favorites';");
js=js.replace('\nasync function globalSearch',patch+'\nasync function globalSearch');
css+=String.raw`
/* r165 */
.ct165-modal{position:fixed;inset:0;background:#000b;z-index:9999;display:grid;place-items:center;padding:18px}
.ct165-modal-card{width:min(760px,96vw);max-height:88vh;overflow:hidden;border:1px solid #29485a;background:#071017;border-radius:16px}
.ct165-modal-head{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-bottom:1px solid #1d3440}
.ct165-modal-body{padding:14px;overflow:auto;max-height:calc(88vh - 58px)}
.ct165-event-list{display:grid;gap:8px}
.ct165-event{display:grid;grid-template-columns:1fr auto;gap:3px 12px;border:1px solid #203b49;background:#0b1820;border-radius:11px;padding:10px}
.ct165-fav-summary{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
.ct165-open-favorite{margin-top:6px}
`;
html=html.replaceAll('r163-instant-preload-stable-ui','r165-r163-restored-favorites').replaceAll('app-v163.js','app-v165.js').replaceAll('app-v163.css','app-v165.css');
sw=sw.replaceAll('r163-instant-preload-stable-ui','r165-r163-restored-favorites').replaceAll('app-v163.js','app-v165.js').replaceAll('app-v163.css','app-v165.css');
await Promise.all([
 writeFile(resolve(dist,'index.html'),html,'utf8'),
 writeFile(resolve(dist,'app-v165.js'),js,'utf8'),
 writeFile(resolve(dist,'app-v165.css'),css,'utf8'),
 writeFile(resolve(dist,'service-worker.js'),sw,'utf8'),
 writeFile(resolve(dist,'release.json'),JSON.stringify({version:'0.99.7',revision:'r165-r163-restored-favorites',runtime:'single-clean-runtime',generated_at:new Date().toISOString()}),'utf8')
]);
await Promise.all([rm(resolve(dist,'app-v163.js'),{force:true}),rm(resolve(dist,'app-v163.css'),{force:true})]);
console.log('WEB_R165_READY base=r163-restored preload=persistent discover=carousels sports=history-search favorites=events');
