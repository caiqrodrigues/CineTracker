/* Android 1.0.48 / r290 — NFL Super Bowl season-by-year, recorded episodes unchanged. */
(()=>{
'use strict';
if(window.__ctR290NFL)return;
window.__ctR290NFL='synthetic-media-seasons-by-year-preserve-history';
const alias='nfl super bowls',startYear=1967,sourceId=-1895884984;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const safe=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=t=>String(t??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const row=x=>Array.isArray(x)?x:[];
const userId=()=>session?.user?.id||user?.id||null;
const keys=x=>String(x.season_number)+':'+String(x.episode_number);
const iso=()=>new Date().toISOString();
let overlay=null,mediaId=0,watched=new Set(),busy=new Set(),generation=0;
function roman(n){
 const s=[[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
 let x=n,v='';for(const [a,b] of s)while(x>=a){v+=b;x-=a}return v;
}
function titleFor(year,season){return season===1?'Super Bowl '+roman(year-startYear+1):'NFL Super Bowl — episódio complementar '+roman(year-startYear+1)}
function page(){
 if(overlay?.isConnected)return overlay;
 const root=document.createElement('div');root.className='ct290-nfl-screen';root.dataset.ct290NflScreen='1';
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','NFL Super Bowl');
 root.innerHTML='<div class="ct290-nfl-page"><button class="btn" type="button" data-ct290-nfl-close>← Voltar à Home</button>'+
 '<header><small>SÉRIE · NFL</small><h1>NFL Super Bowl</h1><p>Todos os Super Bowls desde 1967. Episódios e progresso existentes preservados.</p></header>'+
 '<section class="panel"><div class="ct290-nfl-toolbar"><label for="ct290-nfl-year">Temporada / Ano</label><select id="ct290-nfl-year" data-ct290-nfl-year></select>'+
 '<span data-ct290-nfl-count></span></div><div data-ct290-nfl-list><div class="loader">Carregando episódios...</div></div></section></div>';
 document.body.appendChild(root);return overlay=root;
}
function readYear(){
 const select=q('[data-ct290-nfl-year]',overlay);
 return Number(select?.value)||new Date().getFullYear();
}
function paint(year){
 if(!overlay?.isConnected)return;
 const y=Math.min(new Date().getFullYear(),Math.max(startYear,Number(year)||new Date().getFullYear()));
 const select=q('[data-ct290-nfl-year]',overlay);
 if(!select.options.length){
  for(let x=new Date().getFullYear();x>=startYear;x--){
   const opt=document.createElement('option');opt.value=String(x);opt.textContent=String(x);
   select.appendChild(opt);
  }
 }
 select.value=String(y);
 const ep=y-startYear+1;
 const count=[1,2].filter(season=>watched.has(season+':'+ep)).length;
 q('[data-ct290-nfl-count]',overlay).textContent=count+'/2 episódios assistidos';
 q('[data-ct290-nfl-list]',overlay).innerHTML=[1,2].map(season=>{
  const id=season+':'+ep,seen=watched.has(id),pending=busy.has(id);
  return '<div class="ct290-nfl-episode"><div class="ct290-nfl-cover">🏈</div>'+
   '<div class="ct290-nfl-info"><b>'+safe(titleFor(y,season))+'</b>'+
   '<small>'+safe('Ano '+y+' · Temporada '+season+' · Episódio '+ep)+'</small></div>'+
   '<button type="button" class="ct290-nfl-watch" data-ct290-nfl-watch="'+season+':'+ep+
   '" '+(pending?'disabled':'')+' aria-label="'+(seen?'Desmarcar':'Marcar')+' episódio '+season+' como assistido">'+
   (pending?'Salvando...':seen?'✓ Assistido':'+ Assistido')+'</button></div>';
 }).join('');
}
async function initialize(){
 const id=userId();if(!id)throw Error('Faça login para consultar seus episódios.');
 const existing=await api('media?select=id,title,tmdb_id&tmdb_id=eq.'+sourceId+'&media_type=eq.tv&limit=1');
 const media=row(existing)[0];
 if(!media?.id)throw Error('Série NFL Super Bowls não encontrada na sua biblioteca.');
 const data=await api('episode_progress?select=season_number,episode_number,watched&media_id=eq.'+media.id+'&profile_id=eq.'+encodeURIComponent(id)+'&limit=500');
 mediaId=Number(media.id);watched=new Set(row(data).filter(v=>v.watched).map(keys));
}
async function open(){
 const token=++generation;
 page();
 const list=q('[data-ct290-nfl-list]',overlay);list.innerHTML='<div class="loader">Carregando episódios existentes...</div>';
 try{await initialize();if(token===generation&&overlay?.isConnected)paint(new Date().getFullYear())}
 catch(e){if(token===generation&&overlay?.isConnected)list.innerHTML='<div class="notice">'+safe(e?.message||e)+'</div>'}
}
function close(){generation++;overlay?.remove();overlay=null;busy.clear()}
async function toggle(key){
 if(!overlay?.isConnected||!mediaId||busy.has(key)||!userId())return;
 const [season,episode]=String(key).split(':').map(Number);
 if(![1,2].includes(season)||episode<1||episode>new Date().getFullYear()-startYear+1)return;
 const seen=watched.has(key),token=generation,year=readYear();busy.add(key);
 if(seen)watched.delete(key);else watched.add(key);paint(year);
 try{
  if(seen)await rpc('cinetracker_unmark_history_item_v426',{
   p_media_id:mediaId,p_item_type:'episode',p_season_number:season,p_episode_number:episode});
  else await rpc('cinetracker_mark_episode_v0994',{
   p_media_id:mediaId,p_season_number:season,p_episode_number:episode,
   p_title:titleFor(startYear+episode-1,season),p_runtime_minutes:null,
   p_released_episodes:120,p_series_status:null,p_watched_at:iso()});
  // Does not reload Home, invalidate all user recommendations, or refetch the page.
  document.dispatchEvent(new CustomEvent('cinetracker:nfl-super-bowl-episode',{detail:{season,episode,watched:!seen}}));
 }catch(e){
  if(seen)watched.add(key);else watched.delete(key);
  if(token===generation)try{toast('Não foi possível salvar: '+String(e?.message||e))}catch{}
 }finally{busy.delete(key);if(token===generation&&overlay?.isConnected)paint(readYear())}
}
document.addEventListener('click',e=>{
 if(e.target?.closest?.('[data-ct290-nfl-close]')){e.preventDefault();e.stopImmediatePropagation();close();return}
 const btn=e.target?.closest?.('[data-ct290-nfl-watch]');
 if(btn){e.preventDefault();e.stopImmediatePropagation();void toggle(btn.dataset.ct290NflWatch);return}
 const hit=e.target?.closest?.('.media-row[data-media],.media-row[data-ct263-special]');
 if(!hit||route()!=='home')return;
 const text=norm(q('b',hit)?.textContent||'');
 if(text!==alias&&text!=='nfl super bowl'&&Number(hit.dataset.media?.split(':')[1])!==sourceId)return;
 e.preventDefault();e.stopImmediatePropagation();void open();
},true);
document.addEventListener('change',e=>{
 const el=e.target?.closest?.('[data-ct290-nfl-year]');
 if(el&&overlay?.isConnected)paint(Number(el.value));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay?.isConnected)close()});
const css=document.createElement('style');css.id='ct290-nfl-ui';
css.textContent=[
 '.ct290-nfl-screen{position:fixed!important;inset:0!important;z-index:2147482500!important;background:#05121bed!important;overflow:auto!important;overscroll-behavior:contain!important;padding:14px 10px 80px!important;box-sizing:border-box!important}',
 '.ct290-nfl-page{width:min(650px,100%)!important;margin:auto!important;color:#e4f2fc!important}',
 '.ct290-nfl-page>header{padding:18px 5px}.ct290-nfl-page h1{font-size:24px;margin:5px 0}.ct290-nfl-page p{font-size:12px;opacity:.8}',
 '.ct290-nfl-toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0 15px}.ct290-nfl-toolbar select{background:#122733;color:#fff;border:1px solid #50738c;padding:9px;border-radius:9px}',
 '.ct290-nfl-episode{display:grid!important;grid-template-columns:38px minmax(0,1fr) auto!important;align-items:center!important;gap:8px!important;padding:12px 4px!important;border-top:1px solid #314759!important}',
 '.ct290-nfl-cover{font-size:24px}.ct290-nfl-info{min-width:0!important}.ct290-nfl-info b,.ct290-nfl-info small{display:block!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.ct290-nfl-info small{font-size:11px;opacity:.8}',
 '.ct290-nfl-watch{width:auto!important;max-width:120px!important;min-width:90px!important;font-size:12px!important;padding:10px 6px!important;line-height:1.2!important;border:1px solid #4e8bac!important;background:#143b52!important;border-radius:9px!important;color:#fff!important}'
].join('\n');document.head.appendChild(css);
window.__ctR290NFLTest={roman,titleFor,toggle,open,close,paint,getWatched:()=>watched};
})();