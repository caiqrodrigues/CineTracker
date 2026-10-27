/* CineTracker Android 1.0 / r326 — media-only ZIP of CSV files, Bingers-style.
 * Configurações only; no Web changes and no sports-event data in this archive.
 */
(()=>{'use strict';
if(window.__ctR326MediaExport)return;
const n=v=>Math.max(0,Number(v)||0),list=v=>Array.isArray(v)?v:[];
const owner=()=>String(session?.user?.id||user?.id||'');
const eligible=m=>m&&['tv','movie'].includes(String(m.media_type||'').toLowerCase());
const csvCell=value=>{
 const str=value===null||value===undefined?'':String(value);
 return /[",\r\n]/.test(str)?'"'+str.replace(/"/g,'""')+'"':str;
};
const csv=(headers,records)=>'\uFEFF'+[headers.join(','),...records.map(x=>headers.map(h=>csvCell(x[h])).join(','))].join('\r\n')+'\r\n';
const encoder=new TextEncoder();
const crcTable=Uint32Array.from({length:256},(_,k)=>{
 let c=k;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;
 return c>>>0;
});
function crc32(bytes){let crc=0xffffffff;for(const b of bytes)crc=crcTable[(crc^b)&255]^(crc>>>8);return(crc^0xffffffff)>>>0}
function zipCsv(files){
 const local=[],central=[];let offset=0;
 const u16=(v,at)=>[v&255,v>>>8&255];
 const u32=v=>[v&255,v>>>8&255,v>>>16&255,v>>>24&255];
 const add=(parts,size)=>{const buf=new Uint8Array(size);let at=0;for(const p of parts){buf.set(p,at);at+=p.length}return buf};
 for(const [filename,contents] of files){
  const name=encoder.encode(filename),data=encoder.encode(contents),size=data.length;
  if(name.length>65535||size>0xffffffff||files.length>65535)throw Error('Arquivo ZIP excede o limite permitido');
  const crc=crc32(data);
  const localHeader=Uint8Array.from([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0,0,...u32(crc),...u32(size),...u32(size),...u16(name.length),0,0]);
  local.push(localHeader,name,data);
  const centralHeader=Uint8Array.from([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0,0,...u32(crc),...u32(size),...u32(size),...u16(name.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(offset)]);
  central.push(centralHeader,name);
  offset+=localHeader.length+name.length+size;
 }
 const directory=central.reduce((s,b)=>s+b.length,0);
 const end=Uint8Array.from([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(directory),...u32(offset),0,0]);
 return add([...local,...central,end],offset+directory+end.length);
}
function base64(bytes){
 const pieces=[];for(let i=0;i<bytes.length;i+=8192)
  pieces.push(String.fromCharCode(...bytes.subarray(i,i+8192)));
 return btoa(pieces.join(''));
}
async function allRows(table,profile){
 const maxPage=1000,maxPages=100;
 const out=[];
 for(let page=0;page<maxPages;page++){
  const rows=await api(table+'?select=*&profile_id=eq.'+encodeURIComponent(profile)+
   '&order=id.asc&limit='+maxPage+'&offset='+(page*maxPage));
  if(!Array.isArray(rows))throw Error('Resposta inválida ao exportar '+table);
  out.push(...rows);if(rows.length<maxPage)return out;
 }
 throw Error('A exportação de '+table+' excedeu 100.000 registros. Nenhum backup incompleto foi salvo.');
}
async function mediaByIds(ids){
 const map=new Map(),numbers=[...ids].filter(x=>Number.isSafeInteger(x)&&x>0);
 for(let i=0;i<numbers.length;i+=75){
  const batch=numbers.slice(i,i+75);
  const fetched=await api('media?select=id,tmdb_id,media_type,media_kind,title,release_year,total_episodes&'+
   'id=in.('+batch.join(',')+')&limit=1000');
  if(!Array.isArray(fetched))throw Error('Falha ao recuperar títulos do catálogo');
  for(const m of fetched)if(eligible(m))map.set(n(m.id),m);
 }
 return map;
}
function buildFiles(media,overrides,progress,history){
 const byId=media instanceof Map?media:new Map(list(media).filter(eligible).map(m=>[n(m.id),m]));
 const states=new Map(),watchedCount=new Map(),last=new Map(),watchedMovie=new Set();
 for(const entry of overrides){const id=n(entry.media_id);if(!byId.has(id))continue;
  const value=String(entry.state||'').toLowerCase();
  if(!states.has(id))states.set(id,new Set());states.get(id).add(value);
  if(entry.watched_at&&(!last.has(id)||String(entry.watched_at)>last.get(id)))last.set(id,String(entry.watched_at));
  if(['seen','watched'].includes(value)&&byId.get(id).media_type==='movie')watchedMovie.add(id);
 }
 const episodes=list(progress).filter(e=>byId.get(n(e.media_id))?.media_type==='tv')
  .map(e=>({...e,media:byId.get(n(e.media_id))}));
 for(const e of episodes){const id=n(e.media_id);if(!e.watched)continue;
  watchedCount.set(id,(watchedCount.get(id)||0)+1);
  if(e.watched_at&&(!last.has(id)||String(e.watched_at)>last.get(id)))last.set(id,String(e.watched_at));
 }
 const viewed=list(history).filter(e=>{
  const m=byId.get(n(e.media_id));return eligible(m)&&
   (m.media_type==='tv'||m.media_type==='movie');
 }).sort((a,b)=>String(a.watched_at||'').localeCompare(String(b.watched_at||'')));
 for(const e of viewed){const id=n(e.media_id),m=byId.get(id);
  if(m.media_type==='movie')watchedMovie.add(id);
  if(e.watched_at&&(!last.has(id)||String(e.watched_at)>last.get(id)))last.set(id,String(e.watched_at));
 }
 const watchedMedia=[...byId.values()].sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'pt-BR'));
 const listed=(m,key)=>states.get(n(m.id))?.has(key)||false;
 const favorites=m=>listed(m,'liked')||listed(m,'favorite')||listed(m,'favourite');
 const watchlist=m=>listed(m,'watchlist');
 const movies=watchedMedia.filter(m=>m.media_type==='movie').map(m=>({
  tmdb_id:m.tmdb_id,media_id:m.id,title:m.title,year:m.release_year,
  status:watchedMovie.has(n(m.id))?'watched':watchlist(m)?'watchlist':'library',
  watched:watchedMovie.has(n(m.id)),watchlist:watchlist(m),favorite:favorites(m),
  last_watched_at:last.get(n(m.id))||''
 }));
 const series=watchedMedia.filter(m=>m.media_type==='tv').map(m=>{
  const keys=states.get(n(m.id))||new Set();
  const status=keys.has('completed')?'completed':keys.has('uptodate')||keys.has('up_to_date')?'up_to_date':
   (watchedCount.get(n(m.id))||0)>0?'in_progress':watchlist(m)?'watchlist':'library';
  return{tmdb_id:m.tmdb_id,media_id:m.id,title:m.title,year:m.release_year,status,
   watched_episodes:watchedCount.get(n(m.id))||0,total_episodes:m.total_episodes,
   watchlist:watchlist(m),favorite:favorites(m),last_watched_at:last.get(n(m.id))||''};
 });
 const episodeRows=episodes.map(e=>({tmdb_id:e.media.tmdb_id,media_id:e.media_id,
  series_title:e.media.title,season_number:e.season_number,episode_number:e.episode_number,
  watched:!!e.watched,watched_at:e.watched_at||''}));
 const historyRows=viewed.map(e=>({tmdb_id:byId.get(n(e.media_id)).tmdb_id,
  media_id:e.media_id,media_type:byId.get(n(e.media_id)).media_type,
  title:byId.get(n(e.media_id)).title,item_type:e.item_type||
   (byId.get(n(e.media_id)).media_type==='movie'?'movie':'episode'),
  season_number:e.season_number||'',episode_number:e.episode_number||'',watched_at:e.watched_at||''}));
 const listRows=key=>watchedMedia.filter(m=>key==='favorite'?favorites(m):watchlist(m))
  .map(m=>({media_type:m.media_type,tmdb_id:m.tmdb_id,media_id:m.id,title:m.title,year:m.release_year}));
 const files=[
  ['filmes.csv',csv(['tmdb_id','media_id','title','year','status','watched','watchlist','favorite','last_watched_at'],movies)],
  ['series.csv',csv(['tmdb_id','media_id','title','year','status','watched_episodes','total_episodes','watchlist','favorite','last_watched_at'],series)],
  ['episodios.csv',csv(['tmdb_id','media_id','series_title','season_number','episode_number','watched','watched_at'],episodeRows)],
  ['historico.csv',csv(['tmdb_id','media_id','media_type','title','item_type','season_number','episode_number','watched_at'],historyRows)],
  ['watchlist.csv',csv(['media_type','tmdb_id','media_id','title','year'],listRows('watchlist'))],
  ['favoritos.csv',csv(['media_type','tmdb_id','media_id','title','year'],listRows('favorite'))]
 ];
 const manifest={format:'CineTracker media CSV ZIP',version:1,exported_at:new Date().toISOString(),
  contents:files.map(x=>x[0]),counts:{movies:movies.length,series:series.length,
   episodes:episodeRows.length,watch_events:historyRows.length},sports_included:false};
 files.push(['manifest.json',JSON.stringify(manifest,null,2)+'\n']);
 files.push(['LEIA-ME.txt','CineTracker - exportacao de series e filmes\r\nZIP de CSVs no estilo de exportacao do Bingers.\r\nContem series, filmes, episodios, historico com datas, watchlist e favoritos.\r\nNao contem eventos ou estatisticas esportivas.\r\nTMDB ID identifica os titulos.\r\nA importacao em aplicativos de terceiros depende do formato aceito por cada um.\r\n']);
 return{files,manifest};
}
let busy=false,successes=0,lastError='';
async function exportZip(){
 if(busy)return false;
 const id=owner();
 if(!id||!session?.access_token||typeof window.CineTrackerNative?.exportBackup!=='function'){
  const message=!id||!session?.access_token?'Entre na conta para exportar seus dados':'Exportação disponível somente no aplicativo Android';
  lastError=message;if(typeof toast==='function')toast(message);return false;
 }
 busy=true;const btn=document.querySelector('[data-ct326-export-media]');
 if(btn){btn.disabled=true;btn.textContent='Preparando ZIP de séries e filmes…'}
 try{
  const [overrides,progress,history]=await Promise.all([
   allRows('media_overrides',id),allRows('episode_progress',id),allRows('watch_history',id)
  ]);
  if(owner()!==id)throw Error('A conta mudou durante a exportação');
  const ids=new Set([...overrides,...progress,...history].map(x=>n(x.media_id)).filter(x=>x>0));
  const media=await mediaByIds(ids);
  if(owner()!==id)throw Error('A conta mudou durante a exportação');
  if(ids.size&&!media.size)throw Error('Nenhum título foi retornado pelo catálogo');
  const {files,manifest}=buildFiles(media,overrides,progress,history);
  const blob=zipCsv(files),name='CineTracker-series-filmes-'+localDay()+'.zip';
  window.CineTrackerNative.exportBackup(name,base64(blob),'application/zip');
  successes++;lastError='';
  if(typeof toast==='function')toast('ZIP preparado: '+manifest.counts.movies+' filmes, '+manifest.counts.series+' séries. Escolha onde salvar.');
  return true;
 }catch(error){lastError=String(error?.message||error);if(typeof toast==='function')toast('Falha ao exportar: '+lastError);return false}
 finally{busy=false;if(btn){btn.disabled=false;btn.textContent='Exportar séries e filmes (.ZIP)'}}
}
function attach(){
 if(route()!=='configs')return false;
 const root=document.querySelector('[data-configs]');if(!root||root.querySelector('[data-ct326-export-media]'))return false;
 const existing=root.querySelector('[data-export]');if(!existing)return false;
 existing.removeAttribute('data-export');
 existing.dataset.ct326ExportMedia='1';
 existing.textContent='Exportar séries e filmes (.ZIP)';
 return true;
}
const original=renderConfigs;
renderConfigs=async function(...args){const value=await original.apply(this,args);attach();return value};
document.addEventListener('click',event=>{
 if(!event.target?.closest?.('[data-ct326-export-media]'))return;
 event.preventDefault();event.stopImmediatePropagation();void exportZip();
},true);
window.__ctR326MediaExport={exportZip,buildFiles,zipCsv,attach,
 stats:()=>({busy,successes,error:lastError}),scope:'Android Configurações ZIP of movie/series CSVs only'};
})();
