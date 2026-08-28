import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const patchName='patch-v116-v0996-authoritative.js';
const patchSource=resolve(root,'apps/web',patchName);

function replaceRange(source,startMarker,endMarker,replacement,label){
  const start=source.indexOf(startMarker),end=source.indexOf(endMarker,start);
  if(start<0||end<0||end<=start)throw new Error(`0.99.6 v116: ${label} markers not found`);
  return source.slice(0,start)+replacement+'\n'+source.slice(end);
}

function mediaCard116(x){
  const id=effectiveId116(x),type=x.media_type==='movie'?'movie':'tv',meta=[x.release_year||year116(x)||null,type==='movie'?'Filme':isAnime116(x)?'Anime':'Série',progressText116(x)].filter(Boolean).join(' · ');
  const open=id>0?`data-open-media991="${type}:${id}"`:`data-ct116-local="${Number(x.media_id||0)}"`;
  return `<article class="ct116-card"><button type="button" class="ct116-card-open" data-ct115-heart-bound="1" ${open}><div class="ct116-poster"${x.poster_path?` style="background-image:url('${img116(x.poster_path)}')"`:''}></div><div class="ct116-body"><b>${esc116(x.title||'Sem título')}</b><small>${esc116(meta)}</small></div></button>${mediaHeart116(x)}</article>`;
}
function tmdbCard116(x){
  const type=x.media_type==='movie'?'movie':'tv',meta=[year116(x)||null,type==='movie'?'Filme':isAnime116(x)?'Anime':'Série',score116(x)>0?`★ ${score116(x).toFixed(1)}`:null].filter(Boolean).join(' · ');
  return `<article class="ct116-card"><button type="button" class="ct116-card-open" data-ct115-heart-bound="1" data-open-media991="${type}:${Number(x.id)}"><div class="ct116-poster"${x.poster_path?` style="background-image:url('${img116(x.poster_path)}')"`:''}></div><div class="ct116-body"><b>${esc116(x.title||x.name||'Sem título')}</b><small>${esc116(meta)}</small></div></button><button type="button" class="ct116-heart" data-ct116-tmdb-heart="${type}:${Number(x.id)}" aria-label="Favoritar">♡</button></article>`;
}
function bindOpen116(root){
  $$116('[data-ct116-local]',root).forEach(b=>b.onclick=e=>{if(e.target.closest('[data-ct116-heart],[data-ct116-tmdb-heart]'))return;const mediaId=Number(b.dataset.ct116Local);if(mediaId>0){e.preventDefault();void window.__ct0994OpenMediaById?.(mediaId)}});
  /* data-open-media991 is intentionally left to the universal v114 capture handler. */
}

for(const dir of dirs){
  const out=resolve(dir,patchName);
  await copyFile(patchSource,out);
  let layer=await readFile(out,'utf8');
  layer=replaceRange(layer,'function mediaCard116(x){','function tmdbCard116(x)',mediaCard116.toString(),'local media card');
  layer=replaceRange(layer,'function tmdbCard116(x){','async function ensureMedia116',tmdbCard116.toString(),'TMDB media card');
  layer=replaceRange(layer,'function bindOpen116(root){','function section116',bindOpen116.toString(),'card click binding');
  layer=layer.replace("const [dash,ex]=await Promise.all([rpc116('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rpc116('cinetracker_discovery_exclusions_v0994',{}).catch(()=>({movie_ids:[],tv_ids:[],aliases:[]}))])","const [dash,ex]=await Promise.all([rpc116('cinetracker_profile_media_dashboard_v0991',{}),rpc116('cinetracker_discovery_exclusions_v0994',{})])");
  layer=layer.replace("media?select=id& id=eq.${Number(mediaId)}&limit=1`.replace('& ', '&')","media?select=id&id=eq.${Number(mediaId)}&limit=1`");
  await writeFile(out,layer,'utf8');

  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  html=html.replace(new RegExp(`<script src="/${patchName.replaceAll('.','\\.')}"></script>`,'g'),'');
  const anchor='<script src="/patch-v115-v0995-favorites-profile-discover.js"></script>';
  if(!html.includes(anchor))throw new Error(`0.99.6 v116: v115 anchor missing in ${indexPath}`);
  html=html.replace(anchor,`${anchor}<script src="/${patchName}"></script>`);
  await writeFile(indexPath,html,'utf8');

  const swPath=resolve(dir,'service-worker.js');
  try{let sw=await readFile(swPath,'utf8');sw=sw.replaceAll('ct-web-0.99.5','ct-web-0.99.6').replaceAll('ct-web-0.99.4','ct-web-0.99.6');await writeFile(swPath,sw,'utf8')}catch{}
}
console.log('CineTracker 0.99.6: Perfil/Descobrir autoritativos, cache v1 e cards universais emitidos.');
