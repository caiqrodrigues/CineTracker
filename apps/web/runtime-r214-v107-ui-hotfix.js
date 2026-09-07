/* CineTracker 1.0.7 UI regression hotfix.
 * - keeps exactly one visible F1 hub (the v107 aggregate hub)
 * - converts/creates replay controls against the canonical mark_watch RPC
 * - avoids legacy replay handlers by removing their data hooks
 */
(()=>{
'use strict';
window.__ctR214='v107-ui-regression-hotfix';
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>r?.querySelectorAll?[...r.querySelectorAll(s)]:[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const key=(kind,tmdb,s=0,e=0)=>kind==='episode'?`episode:${tmdb}:${s}:${e}`:`movie:${tmdb}`;
let counts=new Map(),countsAt=0,countsTask=null;
async function loadCounts(force=false){
 if(!force&&Date.now()-countsAt<10000)return counts;
 if(countsTask)return countsTask;
 countsTask=(async()=>{try{const rows=await rpc('cinetracker_rewatch_counts_v104',{}),m=new Map();for(const x of Array.isArray(rows)?rows:[])m.set(key(String(x.item_type),n(x.tmdb_id),n(x.season_number),n(x.episode_number)),Math.max(1,n(x.plays)||1));counts=m;countsAt=Date.now()}catch{}return counts})().finally(()=>countsTask=null);
 return countsTask;
}
function mediaId(el,kind){
 const raw=String(el?.closest?.('[data-media]')?.dataset?.media||'');const [t,id]=raw.split(':');
 if((kind==='movie'&&t==='movie')||(kind==='episode'&&t==='tv'))return n(id);
 try{if(kind==='episode'&&n(ct169DrawerState?.showId)>0)return n(ct169DrawerState.showId)}catch{}
 try{if(kind==='movie'){const id=n(ct169CurrentDetail?.tmdb_id||ct169CurrentDetail?.id||ct169CurrentDetail?.detail?.id);if(id>0)return id}}catch{}
 const p=String(location.pathname||'');return n(p.match(kind==='movie'?/\/movie\/(\d+)/:/\/(?:tv|series|show)\/(\d+)/)?.[1]);
}
function season(el){
 for(const k of ['season','seasonNumber','sn'])if(n(el?.dataset?.[k])>0)return n(el.dataset[k]);
 try{if(n(ct169DrawerState?.seasonNo)>0)return n(ct169DrawerState.seasonNo)}catch{}
 return n(String(el?.textContent||'').match(/(?:S|TEMPORADA)\s*0*(\d+)/i)?.[1])||n(q('[data-season].active,[data-season][aria-selected="true"]')?.dataset?.season)||1;
}
function episode(el){
 for(const k of ['episode','episodeNumber','ep','number'])if(n(el?.dataset?.[k])>0)return n(el.dataset[k]);
 return n(String(el?.textContent||'').match(/(?:E|EP\.?|EPIS[ÓO]DIO)\s*0*(\d+)/i)?.[1]);
}
function label(btn,plays){btn.dataset.plays=String(plays);btn.textContent=plays>1?`↻ Reassistir ${plays}x`:'↻ Reassistir'}
function configure(btn,kind,tmdb,s=0,e=0,title=''){
 if(!btn||!(tmdb>0))return false;
 for(const a of ['data-ct104-rewatch','data-ct171-rewatch-media','data-ct171-rewatch-episode','data-rewatch-episode','data-ct107-rewatch'])btn.removeAttribute(a);
 btn.type='button';btn.classList.add('ct214-rewatch');btn.dataset.ct214Rewatch=kind;btn.dataset.tmdb=String(tmdb);if(s)btn.dataset.season=String(s);if(e)btn.dataset.episode=String(e);if(title)btn.dataset.title=title;
 const plays=counts.get(key(kind,tmdb,s,e))||n(btn.dataset.plays)||1;label(btn,plays);btn.hidden=false;btn.removeAttribute('aria-hidden');btn.style.removeProperty('display');return true;
}
function replaceLegacy(old){
 if(!old||old.dataset.ct214Rewatch)return;
 const row=old.closest?.('[data-episode-number],[data-episode],.episode-row,.ct169-episode,.ct171-episode-row,.episode-item,.media-row,[data-detail],.ct169-detail,.detail-view,.detail-panel,.drawer,.modal-content')||old.parentElement;
 const attr=old.getAttribute('data-ct171-rewatch-episode')||old.getAttribute('data-rewatch-episode')||'';
 const isEpisode=old.dataset.ct104Kind==='episode'||!!attr||old.hasAttribute('data-ct171-rewatch-episode')||old.hasAttribute('data-rewatch-episode')||norm(row?.textContent).includes('episodio');
 const kind=isEpisode?'episode':'movie',tmdb=n(old.dataset.ct104Tmdb)||mediaId(row||old,kind);if(!(tmdb>0))return;
 let s=0,e=0;if(kind==='episode'){const nums=String(attr).split(':').map(n).filter(x=>x>0);s=n(old.dataset.ct104Season)||season(row||old);e=n(old.dataset.ct104Episode)||episode(row||old)||nums.at(-1)||0;if(!(s>0&&e>0))return}
 const b=old.cloneNode(true);if(configure(b,kind,tmdb,s,e,q('b,strong,.title',row)?.textContent||old.dataset.title||''))old.replaceWith(b);
}
function ensureButtons(){
 for(const old of qa('[data-ct104-rewatch],[data-ct171-rewatch-media],[data-ct171-rewatch-episode],[data-rewatch-episode],[data-ct107-rewatch]'))replaceLegacy(old);
 for(const row of qa('[data-episode-number],[data-episode],.episode-row,.ct169-episode,.ct171-episode-row,.episode-item')){
  if(q('[data-ct214-rewatch="episode"]',row))continue;const text=norm(row.textContent);if(!/(assistido|visto|reassistir)/.test(text))continue;
  const tmdb=mediaId(row,'episode'),s=season(row),e=episode(row);if(!(tmdb>0&&s>0&&e>0))continue;
  const b=document.createElement('button');b.className='btn btn-secondary';configure(b,'episode',tmdb,s,e,q('b,strong,.title',row)?.textContent||'');row.appendChild(b);
 }
 for(const root of qa('[data-detail],.ct169-detail,.detail-view,.detail-panel,.drawer,.modal-content')){
  if(q('[data-ct214-rewatch="movie"]',root))continue;const text=norm(root.textContent);if(!/(assistido|visto|reassistir)/.test(text))continue;
  const tmdb=mediaId(root,'movie');if(!(tmdb>0))continue;const anchor=qa('button',root).find(b=>/(assistido|visto)/.test(norm(b.textContent)));if(!anchor)continue;
  const b=document.createElement('button');b.className='btn btn-secondary';configure(b,'movie',tmdb);(anchor.parentElement||root).appendChild(b);
 }
}
async function act(btn){
 if(!btn||btn.dataset.ct214Busy==='1')return;const kind=btn.dataset.ct214Rewatch,tmdb=n(btn.dataset.tmdb),s=n(btn.dataset.season),e=n(btn.dataset.episode);if(!kind||!(tmdb>0)||(kind==='episode'&&!(s>0&&e>0)))return;
 const before=Math.max(1,n(btn.dataset.plays)||counts.get(key(kind,tmdb,s,e))||1);btn.dataset.ct214Busy='1';btn.disabled=true;btn.textContent='Salvando...';
 try{const m=await ensureMedia(kind==='episode'?'tv':'movie',tmdb);const payload={p_media_id:Number(m.id),p_item_type:kind,p_season_number:kind==='episode'?s:null,p_episode_number:kind==='episode'?e:null,p_title:btn.dataset.title||m.title||null,p_runtime_minutes:Number(btn.dataset.runtime||m.runtime_minutes||0)||null,p_released_episodes:null,p_watched_at:new Date().toISOString()};const r=await rpc('cinetracker_mark_watch_v0994',payload);await loadCounts(true);const plays=Math.max(before+1,n(r?.plays)||counts.get(key(kind,tmdb,s,e))||before+1);counts.set(key(kind,tmdb,s,e),plays);label(btn,plays);try{homeCache=null;profileCache=null;discoverCache?.clear?.()}catch{};window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'rewatch-r214',kind,tmdb,season:s,episode:e,plays}}));try{toast(`Registrado · ${plays}x`)}catch{}}
 catch(err){label(btn,before);try{toast(err?.message||String(err))}catch{}}
 finally{btn.disabled=false;delete btn.dataset.ct214Busy}
}
document.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-ct214-rewatch]');if(!b)return;ev.preventDefault();ev.stopImmediatePropagation();void act(b)},true);
const style=document.createElement('style');style.id='ct214-hotfix-css';style.textContent='#ct-f1-v104{display:none!important}.ct214-rewatch{margin-left:8px!important;white-space:nowrap!important;flex:0 0 auto!important}';document.getElementById(style.id)?.remove();document.head.appendChild(style);
let raf=0;const sync=()=>{if(raf)return;raf=requestAnimationFrame(async()=>{raf=0;await loadCounts(false);ensureButtons()})};new MutationObserver(sync).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('cinetracker:data-changed',sync);setTimeout(sync,0);setTimeout(sync,500);setTimeout(sync,1500);
})();