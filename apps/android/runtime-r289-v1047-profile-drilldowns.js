/* CineTracker Android r289/v1.0.47 — restore drilldowns for Profile counters. Web frozen. */
(()=>{'use strict';
if(window.__ctR289Profile)return;
window.__ctR289Profile='drilldowns-watchlist-history-sports-with-real-records';
const $=(s,r=document)=>r?.querySelector?.(s)||null;
const all=(s,r=document)=>Array.from(r?.querySelectorAll?.(s)||[]);
const rows=x=>Array.isArray(x)?x:Array.isArray(x?.rows)?x.rows:[];
const id=()=>String(session?.user?.id||user?.id||'');
const bounded=(job,ms=12000)=>Promise.race([Promise.resolve(job),new Promise((_,reject)=>setTimeout(()=>reject(Error('Tempo limite da consulta')),ms))]);
const clean=x=>String(x??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').trim();
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cfg={
 'series':'series-history','episodios':'episodes-history','filmes':'movies-history',
 'series watchlist':'series-watchlist','filmes watchlist':'movies-watchlist',
 'eventos assistidos':'sports-tv','na tv':'sports-tv','na televisao':'sports-tv',
 'em estadio':'sports-stadium','no estadio':'sports-stadium','jogos no estadio':'sports-stadium',
 'eventos no estadio':'sports-stadium','eventos na tv':'sports-tv'
};
const titles={'series-history':'Histórico de séries','episodes-history':'Histórico de episódios',
 'movies-history':'Histórico de filmes','series-watchlist':'Séries da Watchlist',
 'movies-watchlist':'Filmes da Watchlist','sports-tv':'Histórico de esportes na TV',
 'sports-stadium':'Histórico de esportes no estádio'};
let activeModal=null,sourceCache=new Map(),loadingSeq=0;
function keyOf(card){
 const text=clean($('small',card)?.textContent||'');
 if(cfg[text])return cfg[text];
 if(card.matches('[data-ct266-stadium-stat]'))return 'sports-stadium';
 return null;
}
function enhance(){
 if(route()!=='profile'||!id())return;
 const root=$('[data-profile]');if(!root)return;
 for(const card of all('.stat',root)){
  const kind=keyOf(card);
  if(!kind){delete card.dataset.ct289ProfileStat;continue}
  card.dataset.ct289ProfileStat=kind;card.setAttribute('role','button');
  card.setAttribute('tabindex','0');card.setAttribute('aria-label','Abrir '+titles[kind]);
  card.title='Toque para ver os registros';
 }
}
const prior=ct168PaintProfile;
ct168PaintProfile=function(...args){
 const result=prior.apply(this,args);
 requestAnimationFrame(enhance);
 setTimeout(enhance,100);
 return result;
};
function createModal(kind){
 close();
 const el=document.createElement('div');el.className='ct289-overlay';
 el.dataset.ct289Modal='1';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
 el.innerHTML='<section class="ct289-dialog"><header><div><small>PERFIL · REGISTROS</small><h2>'+escape(titles[kind])+'</h2></div>'+
 '<button type="button" class="btn" data-ct289-close aria-label="Fechar">✕ Fechar</button></header>'+
 '<div class="ct289-status">Consultando seus registros...</div><div class="ct289-results"></div>'+
 '<button type="button" class="btn ct289-more" data-ct289-more hidden>Mostrar mais</button></section>';
 document.body.appendChild(el);activeModal={el,kind,rows:[],offset:0};
 return activeModal;
}
function close(){if(activeModal){activeModal.el.remove();activeModal=null;loadingSeq++}}
function cardLine(x,kind){
 const type=String(x.media_type||x.item_type||'');
 const movie=kind.includes('movies')||type==='movie';
 const tmdb=Number(x.tmdb_id||x.source_tmdb_id||x.raw_tmdb?.source_tmdb_id||0);
 const title=String(x.media_title||x.title||x.name||x.raw_tmdb?.title||x.raw_tmdb?.name||(kind==='episodes-history'?'Episódio assistido':'Registro assistido'));
 const date=x.watched_at||x.last_watched_at||x.starts_at||'';
 const when=date&&!Number.isNaN(Date.parse(date))?new Date(date).toLocaleDateString('pt-BR'):'';
 const sn=Number(x.season_number||0),en=Number(x.episode_number||0);
 const episode=kind==='episodes-history'&&sn&&en?' · T'+sn+' E'+en:'';
 const place=kind.startsWith('sports')?(x.attended_in_person?' · Estádio':' · TV'):'';
 const poster=x.poster_path||x.raw_tmdb?.poster_path||'';
 const imgUrl=poster&&/^\/[A-Za-z0-9]/.test(poster)?'https://image.tmdb.org/t/p/w92'+poster:'';
 const content='<div class="ct289-thumb">'+(imgUrl?'<img loading="lazy" src="'+escape(imgUrl)+'" alt="">':'')+'</div>'+
 '<div class="ct289-info"><b>'+escape(title)+'</b><small>'+escape((when?when:'')+episode+place)+'</small></div>';
 const mediaType=movie?'movie':'series';
 return '<article class="ct289-item">'+(tmdb>0&&kind!=='sports-tv'&&kind!=='sports-stadium'?
 '<button type="button" data-media="'+mediaType+':'+tmdb+'">'+content+'<span>›</span></button>':
 '<div class="ct289-item-inner">'+content+'</div>')+'</article>';
}
function draw(mod){
 if(mod!==activeModal)return;
 const end=Math.min(mod.offset+60,mod.rows.length);
 const subset=mod.rows.slice(mod.offset,end);
 const box=$('.ct289-results',mod.el);
 if(!mod.offset)box.innerHTML='';
 box.insertAdjacentHTML('beforeend',subset.map(x=>cardLine(x,mod.kind)).join(''));
 mod.offset=end;
 const more=$('[data-ct289-more]',mod.el);
 more.hidden=end>=mod.rows.length;
 const status=$('.ct289-status',mod.el);
 status.textContent=mod.rows.length.toLocaleString('pt-BR')+' registros';
 if(!mod.rows.length)box.innerHTML='<div class="empty">Nenhum registro encontrado para esta categoria.</div>';
}
function unique(items){
 const seen=new Set(),output=[];
 for(const x of items){
  const key=[x?.id||'',x?.media_id||'',x?.tmdb_id||'',x?.season_number||'',x?.episode_number||'',x?.watched_at||''].join(':');
  if(seen.has(key))continue;
  seen.add(key);output.push(x);
 }
 return output;
}
async function dashboard(){
 const u=id();const key=u+':dashboard';
 if(sourceCache.has(key))return sourceCache.get(key);
 const promise=bounded(rpc('cinetracker_profile_media_dashboard_v0991',{}),16000).then(rows).catch(()=>rows(profileCache?.dashboard));
 sourceCache.set(key,promise);
 return promise;
}
async function historyPages(table,query,limit=200,max=18){
 const result=[];
 for(let offset=0;offset<max*limit;offset+=limit){
  const part=await bounded(api(table+'?'+query+'&limit='+limit+'&offset='+offset),12000);
  if(!Array.isArray(part))throw Error('Resposta inválida do histórico');
  result.push(...part);
  if(part.length<limit)break;
 }
 return result;
}
async function movieHistory(){
 const first=await bounded(rpc('cinetracker_home_movie_history_v542',{p_limit:200,p_offset:0}),16000);
 if(!first||!Array.isArray(first.rows))throw Error('Histórico de filmes indisponível');
 const total=Math.min(4800,Number(first.total)||first.rows.length),parts=[...first.rows];
 for(let off=200;off<total;off+=600){
  const jobs=[];for(let j=0;j<3&&off+j*200<total;j++)jobs.push(rpc('cinetracker_home_movie_history_v542',{p_limit:200,p_offset:off+j*200}));
  const responses=await Promise.allSettled(jobs.map(x=>bounded(x,14000)));
  for(const r of responses)if(r.status==='fulfilled')parts.push(...rows(r.value));
 }
 return unique(parts).sort((a,b)=>Date.parse(a.watched_at||a.last_watched_at||0)-Date.parse(b.watched_at||b.last_watched_at||0));
}
async function fetchItems(kind){
 const dash=kind.startsWith('sports')||kind==='episodes-history'||kind==='movies-history'?null:await dashboard();
 if(kind.endsWith('-watchlist'))return rows(dash).filter(x=>
  (x.is_watchlist||x.is_added_to_watchlist)&&
  String(x.media_type)===(kind.startsWith('movies')?'movie':'tv'))
  .sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'pt-BR'));
 if(kind==='series-history')return rows(dash).filter(x=>x.media_type==='tv'&&
  (x.is_completed||x.is_in_progress||x.is_up_to_date||Number(x.watched_episodes||0)>0||x.last_watched_at))
  .sort((a,b)=>Date.parse(a.last_watched_at||0)-Date.parse(b.last_watched_at||0));
 if(kind==='movies-history')return movieHistory();
 if(kind==='episodes-history'){
  const items=await historyPages('watch_history','select=id,media_id,item_type,season_number,episode_number,watched_at&item_type=eq.episode&order=watched_at.asc');
  const dashRows=await dashboard();
  const titles=new Map(rows(dashRows).map(x=>[Number(x.media_id),x]));
  return unique(items).map(x=>({...x,...(titles.get(Number(x.media_id))||{}),watched_at:x.watched_at,season_number:x.season_number,episode_number:x.episode_number}));
 }
 if(kind.startsWith('sports')){
  const list=rows(await bounded(rpc('cinetracker_sports_watch_history_v296',{}),16000));
  return list.filter(x=>kind==='sports-stadium'?Boolean(x.attended_in_person):!Boolean(x.attended_in_person))
   .sort((a,b)=>Date.parse(a.watched_at||a.starts_at||0)-Date.parse(b.watched_at||b.starts_at||0));
 }
 return [];
}
async function open(kind){
 if(!titles[kind]||!id())return;
 const mod=createModal(kind),run=++loadingSeq,userId=id();
 try{
  const found=await fetchItems(kind);
  if(activeModal!==mod||run!==loadingSeq||userId!==id())return;
  mod.rows=found;draw(mod);
 }catch(e){
  if(activeModal===mod&&run===loadingSeq){
   $('.ct289-status',mod.el).textContent='Não foi possível consultar o histórico: '+String(e?.message||e);
  }
 }
}
document.addEventListener('click',e=>{
 const closeButton=e.target.closest?.('[data-ct289-close]');
 if(closeButton||e.target.matches?.('[data-ct289-modal]')){e.preventDefault();e.stopImmediatePropagation();close();return}
 const more=e.target.closest?.('[data-ct289-more]');
 if(more&&activeModal){e.preventDefault();draw(activeModal);return}
 const stat=e.target.closest?.('[data-ct289-profile-stat]');
 if(!stat||route()!=='profile')return;
 e.preventDefault();e.stopImmediatePropagation();
 void open(stat.dataset.ct289ProfileStat);
},true);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&activeModal){close();return}
 if((e.key==='Enter'||e.key===' ')&&e.target.matches?.('[data-ct289-profile-stat]')){
  e.preventDefault();void open(e.target.dataset.ct289ProfileStat);
 }
});
window.__ctR289ProfileTest={keyOf,enhance,unique,fetchItems,open,close,titles};
const css=document.createElement('style');css.id='ct289-profile-drilldowns';
css.textContent=[
 '[data-profile] .stat[data-ct289-profile-stat]{cursor:pointer!important;touch-action:manipulation!important;outline-offset:2px!important}',
 '[data-profile] .stat[data-ct289-profile-stat]:focus-visible{outline:2px solid #54bbed!important}',
 '.ct289-overlay{position:fixed!important;inset:0!important;z-index:2147483000!important;background:#020a10e8!important;overflow:auto!important;padding:12px 12px calc(85px + env(safe-area-inset-bottom))!important;box-sizing:border-box!important}',
 '.ct289-dialog{width:min(600px,100%)!important;margin:0 auto!important;background:#061923!important;border:1px solid #32576b!important;border-radius:14px!important;padding:12px!important;box-sizing:border-box!important}',
 '.ct289-dialog>header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}',
 '.ct289-dialog h2{font-size:18px;margin:4px 0!important}',
 '.ct289-status{font-size:12px;color:#c4dce7;padding:8px 0}',
 '.ct289-item{border-bottom:1px solid #1e3b49!important;padding:0!important;margin:0!important}',
 '.ct289-item>button,.ct289-item-inner{width:100%!important;max-width:100%!important;min-height:65px!important;display:flex!important;align-items:center!important;gap:9px!important;padding:6px 2px!important;text-align:left!important;color:inherit!important;background:transparent!important;border:0!important;box-sizing:border-box!important}',
 '.ct289-thumb{width:39px;min-width:39px;height:56px;background:#152d3b;border-radius:6px;overflow:hidden}',
 '.ct289-thumb img{width:100%;height:100%;object-fit:cover}',
 '.ct289-info{min-width:0;flex:1}.ct289-info b,.ct289-info small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ct289-info small{font-size:11px;color:#afcbd8}',
 '.ct289-more{margin:12px auto!important}'
].join('\n');document.head.appendChild(css);
})();