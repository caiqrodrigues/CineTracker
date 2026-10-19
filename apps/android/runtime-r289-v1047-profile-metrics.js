/* CineTracker Android r289 / 1.0.47: clickable Profile metrics and histories. */
(()=>{'use strict';
if(window.__ctR289ProfileV1047)return;
window.__ctR289ProfileV1047='profile-watchlist-and-history-metric-navigation';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;'}[c]));
const norm=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const n=x=>Number(x)||0;
const uid=()=>String(session?.user?.id||user?.id||'');
const live=()=>!!uid()&&route()==='profile'&&!!q('[data-profile]');
const rows=x=>Array.isArray(x)?x:Array.isArray(x?.rows)?x.rows:[];
const defs={
 'series watchlist':{id:'watch_tv',title:'Séries na Watchlist'},
 'filmes watchlist':{id:'watch_movie',title:'Filmes na Watchlist'},
 'episodios vistos':{id:'history_tv',title:'Histórico de séries'},
 'filmes vistos':{id:'history_movie',title:'Histórico de filmes'},
 'eventos assistidos':{id:'sports_all',title:'Histórico de esportes'},
 'jogos no estadio':{id:'sports_stadium',title:'Esportes assistidos no estádio'},
 'eventos na tv':{id:'sports_tv',title:'Esportes assistidos na televisão'}
};
let modalToken=0,cache={owner:'',sports:null,media:null};
function normalizeMedia(x){return{
 type:String(x.media_type||x.item_type||'')==='movie'?'movie':'tv',
 id:n(x.tmdb_id||x.raw_tmdb?.source_tmdb_id||x.raw_tmdb?.id||0),
 title:String(x.title||x.media_title||x.raw_tmdb?.title||x.raw_tmdb?.name||'Título sem nome'),
 poster:String(x.poster_path||x.raw_tmdb?.poster_path||''),
 played:String(x.last_watched_at||x.watched_at||''),
 seen:Boolean(x.is_seen||x.is_completed||x.is_in_progress||x.is_up_to_date||n(x.watched_episodes)>0||n(x.plays)>0)
}}
function statHtml(kind,stat){
 stat.dataset.ct289Metric=kind;
 stat.setAttribute('role','button');stat.setAttribute('tabindex','0');
 stat.setAttribute('aria-label','Abrir '+defs[Object.keys(defs).find(k=>defs[k].id===kind)]?.title);
 stat.classList.add('ct289-metric');
 if(!q('.ct289-chevron',stat)){
  const arrow=document.createElement('span');arrow.className='ct289-chevron';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');stat.appendChild(arrow)
 }
}
function decorate(){
 if(!live())return;
 const root=q('[data-profile]');
 for(const stat of all('.stat',root)){
  const label=norm(q('small',stat)?.textContent||'');
  const entry=defs[label];if(!entry)continue;
  if(entry.id.startsWith('watch_')){
   const kind=entry.id==='watch_movie'?'movie':'series';
   stat.dataset.ct120Watchlist=kind;
   stat.setAttribute('role','button');stat.setAttribute('tabindex','0');
   stat.setAttribute('aria-label','Abrir '+entry.title);
   stat.classList.add('ct289-metric');
  }else statHtml(entry.id,stat);
 }
 const sports=q('[data-profile-sports-panel]',root),stats=q('.stats',sports);
 if(sports&&stats&&!q('[data-ct289-metric="sports_tv"]',stats)){
  const node=document.createElement('div');node.className='stat';node.dataset.ct289Metric='sports_tv';
  node.innerHTML='<small>Eventos na TV</small><b>—</b>';stats.appendChild(node);statHtml('sports_tv',node);
 }
}
const previous=ct168PaintProfile;
ct168PaintProfile=function(...args){const out=previous.apply(this,args);decorate();return out};
const before=renderProfile;
renderProfile=function(...args){
 const out=before.apply(this,args);
 queueMicrotask(decorate);
 setTimeout(decorate,500);setTimeout(decorate,1700);
 return out;
};
function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation?.()}
function close(){q('[data-ct289-modal]')?.remove();modalToken++}
function show(kind){
 close();const key=Object.keys(defs).find(k=>defs[k].id===kind);if(!key)return null;
 const overlay=document.createElement('div');overlay.className='ct289-modal';overlay.dataset.ct289Modal=kind;
 overlay.innerHTML='<section class="ct289-sheet" role="dialog" aria-modal="true" aria-label="'+esc(defs[key].title)+'">'+
 '<header><div><small>PERFIL</small><h2>'+esc(defs[key].title)+'</h2></div>'+
 '<button type="button" class="ct289-close" data-ct289-close aria-label="Fechar">×</button></header>'+
 '<div class="ct289-list" data-ct289-list><div class="loader">Carregando histórico…</div></div></section>';
 document.body.appendChild(overlay);return overlay;
}
const deadline=(task,ms)=>Promise.race([Promise.resolve(task),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Tempo limite da consulta')),ms))]);
async function history(kind){
 if(cache.owner!==uid())cache={owner:uid(),sports:null,media:null};
 if(kind.startsWith('sports_')){
  if(!cache.sports)cache.sports=deadline(rpc('cinetracker_sports_watch_history_v296',{}),16000).then(rows).catch(e=>{cache.sports=null;throw e});
  const allRows=await cache.sports;
  const stadium=x=>Boolean(x.attended_in_person||x.is_stadium||x.at_stadium||x.stadium_name||x.is_in_person||x.location_type==='stadium');
  if(kind==='sports_stadium')return allRows.filter(stadium);
  if(kind==='sports_tv')return allRows.filter(x=>!stadium(x));
  return allRows;
 }
 if(!cache.media)cache.media=deadline(rpc('cinetracker_profile_media_dashboard_v0991',{}),21000).then(rows).catch(e=>{cache.media=null;throw e});
 const data=await cache.media;
 return data.map(normalizeMedia).filter(x=>x.seen&&x.type===(kind==='history_movie'?'movie':'tv'))
  .sort((a,b)=>Date.parse(b.played||0)-Date.parse(a.played||0));
}
function mediaRow(x){
 const thumb=x.poster&&x.poster.startsWith('/')?'https://image.tmdb.org/t/p/w92'+x.poster:x.poster;
 return '<div class="ct289-item"'+(x.id?' data-ct289-title="'+x.type+':'+x.id+'" role="button" tabindex="0"':'')+'>'+
  (thumb?'<img src="'+esc(thumb)+'" loading="lazy" alt="">':'<div class="ct289-empty-poster"></div>')+
  '<span><b>'+esc(x.title)+'</b><small>'+esc(x.played?new Date(x.played).toLocaleDateString('pt-BR'):'Histórico registrado')+'</small></span><span>›</span></div>';
}
function sportRow(x){
 const name=String(x.title||x.event_title||x.name||x.competition_name||x.event_name||'Evento esportivo');
 const when=String(x.watched_at||x.sport_watched_at||x.starts_at||'');
 const date=when&&!Number.isNaN(Date.parse(when))?new Date(when).toLocaleDateString('pt-BR'):'';
 return '<div class="ct289-item"><div class="ct289-sport-icon">🏆</div><span><b>'+esc(name)+'</b><small>'+
  esc([date,x.stadium_name||x.competition_name||x.sport_slug||''].filter(Boolean).join(' · '))+'</small></span></div>';
}
async function open(kind){
 const overlay=show(kind);if(!overlay)return;
 const token=++modalToken,account=uid();
 try{
  const entries=await history(kind);
  if(token!==modalToken||uid()!==account||!overlay.isConnected)return;
  const body=q('[data-ct289-list]',overlay);if(!body)return;
  body.innerHTML='<div class="ct289-count">'+entries.length.toLocaleString('pt-BR')+' registros</div>'+
   (entries.length?entries.map(kind.startsWith('sports_')?sportRow:mediaRow).join(''):
    '<div class="empty">Não há registros nesta categoria.</div>');
 }catch(e){
  if(token!==modalToken||!overlay.isConnected)return;
  q('[data-ct289-list]',overlay).innerHTML='<div class="error">'+esc(String(e?.message||e))+
   '<button type="button" data-ct289-retry="'+kind+'">Tentar novamente</button></div>';
 }
}
document.addEventListener('click',e=>{
 const metric=e.target.closest?.('[data-ct289-metric]');
 if(metric&&live()){stop(e);void open(metric.dataset.ct289Metric);return}
 const retry=e.target.closest?.('[data-ct289-retry]');
 if(retry){stop(e);void open(retry.dataset.ct289Retry);return}
 const item=e.target.closest?.('[data-ct289-title]');
 if(item){stop(e);const [type,id]=String(item.dataset.ct289Title).split(':');close();if(+id>0)go('/'+(type==='movie'?'movie':'series')+'/'+(+id));return}
 if(e.target.closest?.('[data-ct289-close]')||e.target.matches?.('[data-ct289-modal]')){stop(e);close()}
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&q('[data-ct289-modal]')){stop(e);close();return}
 if((e.key==='Enter'||e.key===' ')&&e.target.closest?.('[data-ct289-metric]')){
  stop(e);void open(e.target.closest('[data-ct289-metric]').dataset.ct289Metric);
 }
},true);
let summaryLoad=null;
function tvCount(){
 if(!live())return;
 if(summaryLoad)return;
 summaryLoad=deadline(rpc('cinetracker_sports_stadium_summary_v296',{}),12000).then(s=>{
  const tv=q('[data-ct289-metric="sports_tv"] b');
  if(tv&&s&&Number.isFinite(n(s.watched_events))&&Number.isFinite(n(s.stadium_events)))
   tv.textContent=Math.max(0,n(s.watched_events)-n(s.stadium_events)).toLocaleString('pt-BR');
 }).finally(()=>{summaryLoad=null});
}
const previous2=ct168PaintProfile;
ct168PaintProfile=function(...args){const v=previous2.apply(this,args);decorate();void tvCount();return v};
const css=document.createElement('style');css.id='ct289-profile-modals';
css.textContent=[
 '[data-profile] .ct289-metric{position:relative!important;cursor:pointer!important;padding-right:22px!important;touch-action:manipulation!important}',
 '[data-profile] .ct289-metric .ct289-chevron{position:absolute;right:7px;top:50%;transform:translateY(-50%);font-size:17px;color:#9abdd0}',
 '.ct289-modal{position:fixed;inset:0;z-index:999999;display:grid;align-items:end;background:#000b;padding:0}',
 '.ct289-sheet{width:100%;max-width:680px;margin:0 auto;border:1px solid #386077;background:#081c27;border-radius:18px 18px 0 0;max-height:88dvh;display:flex;flex-direction:column;box-sizing:border-box}',
 '.ct289-sheet header{display:flex;justify-content:space-between;align-items:center;padding:15px;gap:12px}',
 '.ct289-sheet header h2{font-size:18px;margin:4px 0}',
 '.ct289-close{height:36px;min-width:38px;border:1px solid #52748a;border-radius:9px;background:#123247;color:white;font-size:23px}',
 '.ct289-list{overflow:auto;padding:8px 12px 28px;overscroll-behavior:contain}',
 '.ct289-count{font-size:12px;color:#9bb7c8;padding:6px 3px}',
 '.ct289-item{display:grid;grid-template-columns:43px minmax(0,1fr) auto;gap:10px;align-items:center;min-height:65px;padding:8px 3px;border-bottom:1px solid #274257}',
 '.ct289-item>img,.ct289-empty-poster,.ct289-sport-icon{width:43px;height:57px;border-radius:5px;object-fit:cover;background:#153144;display:grid;place-items:center}',
 '.ct289-item span:nth-child(2){min-width:0}.ct289-item b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
 '.ct289-item small{display:block;font-size:10px;color:#9fb4c2;margin-top:4px}'
].join('\n');
document.head.appendChild(css);
window.__ctR289ProfileTest={decorate,history,normalizeMedia,open,close};
})();