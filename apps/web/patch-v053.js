(() => {
'use strict';
if (window.__ct53WebLoaded) return;
window.__ct53WebLoaded = true;
const VERSION='0.5.3';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const detailCache=new Map(), searchCache=new Map();
let rowMap=new Map(), rowAt=0, reconciling=false, navAt=0;
const style=document.createElement('style');
style.id='ct53w-style';
style.textContent=`
.ct49w-series-progress,.ct50w-series-progress,.ct51w-series-progress,.ct52w-progress{display:none!important}
.ct53w-progress{display:block!important;font-size:11px;line-height:1.45;color:#92a4b2;margin-top:6px;white-space:normal}
.ct53w-version{margin:28px 0 8px;text-align:center;color:#71808b;font-size:11px}
.ct53w-cover-loading{background-image:linear-gradient(120deg,#10202c,#172b39,#10202c)!important;background-size:200% 100%!important}
`;
document.head.appendChild(style);
function mediaInfo(c){
  const raw=c?.dataset?.mediaId||'',m=raw.match(/^tmdb-(movie|tv)-(\d+)$/);
  let id=Number(c?.dataset?.tmdbId||c?.dataset?.id||c?.dataset?.ct29Id||c?.dataset?.ct30Id||0),type=String(c?.dataset?.apiType||c?.dataset?.type||'').toLowerCase();
  if(m){type=m[1];id=Number(m[2])}
  if(!type)type=/\bfilme\b/i.test(c?.textContent||'')?'movie':'tv';
  const title=(c?.querySelector?.('h1,h2,h3,.ct47-title,.ct48-home-title,.card-title,strong')?.textContent||c?.dataset?.title||'').trim();
  return {id,type:type.includes('movie')?'movie':'tv',title};
}
async function tmdb(path,params={}){
  const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language','pt-BR');
  for(const[k,v]of Object.entries(params))if(v!=null)u.searchParams.set(k,String(v));
  const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error('TMDB '+r.status);return r.json();
}
const imageUrl=(p,size='w500')=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=${size}`:'';
async function mediaDetail(type,id){const k=`${type}:${id}`;if(!detailCache.has(k))detailCache.set(k,tmdb(`/${type}/${id}`).catch(()=>null));return detailCache.get(k)}
async function mediaSearch(type,title){const k=`${type}:${norm(title)}`;if(!searchCache.has(k))searchCache.set(k,tmdb(`/search/${type}`,{query:title,page:1}).then(x=>x?.results?.[0]||null).catch(()=>null));return searchCache.get(k)}
async function resolveCover(card){
  if(!card||card.dataset.ct53Cover==='1'||card.dataset.ct53Cover==='loading')return;
  const el=$('.poster,.tmdb-poster,.ct47-poster,.ct47-hero-poster,.ct48-home-poster,.ct46w-poster,.ct49w-thumb',card);if(!el)return;
  const computed=getComputedStyle(el).backgroundImage||'';
  if(/url\(/i.test(computed)){card.dataset.ct53Cover='1';return}
  card.dataset.ct53Cover='loading';el.classList.add('ct53w-cover-loading');
  const i=mediaInfo(card);let d=i.id?await mediaDetail(i.type,i.id):null;if(!d&&i.title)d=await mediaSearch(i.type,i.title);
  const p=d?.poster_path||d?.backdrop_path;
  if(p){el.style.backgroundImage=`url('${imageUrl(p,'w500')}')`;card.dataset.ct53Cover='1'}else delete card.dataset.ct53Cover;
  el.classList.remove('ct53w-cover-loading');
}
function rebootCovers(){
  const cards=$$('.card,.feature,.ct47-card,.ct48-home-card,.ct46w-card,.list-item,[data-media-id],[data-tmdb-id]');
  let n=0;for(const c of cards){if(n>=36)break;const el=$('.poster,.tmdb-poster,.ct47-poster,.ct47-hero-poster,.ct48-home-poster,.ct46w-poster,.ct49w-thumb',c);if(!el)continue;const bg=getComputedStyle(el).backgroundImage||'';if(!/url\(/i.test(bg)){n++;void resolveCover(c)}}
}
async function ensureRows(force=false){if(!force&&Date.now()-rowAt<30000&&rowMap.size)return;try{const rs=await sbRpc('cinetracker_continue_items_v2',{})||[];rowMap=new Map(rs.filter(x=>x.tmdb_id).map(x=>[Number(x.tmdb_id),x]));rowAt=Date.now()}catch{}}
async function canonicalProgress(){
  if(typeof view!=='undefined'&&view==='history'){$$('.ct53w-progress,.ct49w-series-progress,.ct50w-series-progress,.ct52w-progress').forEach(x=>x.remove());return}
  await ensureRows();
  for(const c of $$('.card,.feature,.ct47-card,.ct48-home-card,[data-media-id],[data-tmdb-id]')){
    const i=mediaInfo(c);if(i.type!=='tv'||!i.id)continue;
    $$('.ct49w-series-progress,.ct50w-series-progress,.ct51w-series-progress,.ct52w-progress',c).forEach(x=>x.remove());
    const r=rowMap.get(i.id);if(!r)continue;
    const watched=Number(r.watched_episodes||0),total=Number(r.total_episodes||0),season=Number(r.season_number||r.current_season||r.last_season||1),episode=Number(r.episode_number||r.current_episode||r.last_episode||watched||0);
    const text=`Temporada ${season} • Episódio ${episode} • ${watched}/${total||'?'} • Faltam ${total?Math.max(0,total-watched):'?'} episódios`;
    let el=$('.ct53w-progress',c);
    if(!el){el=document.createElement('div');el.className='ct53w-progress';const host=$('.ct48-home-meta,.ct47-meta,.media-meta,.ct46w-meta,.card-body',c)||c;host.insertAdjacentElement(host.matches('.card-body')?'afterbegin':'afterend',el)}
    if(el.textContent!==text)el.textContent=text;
  }
}
function cleanNavigation(){
  for(const n of $$('.nav,.mobile-nav')){
    const cfg=$$('button',n).filter(b=>norm(b.textContent).includes('configur'));
    cfg.slice(1).forEach(x=>x.remove());if(cfg[0]){cfg[0].dataset.view='settings';cfg[0].disabled=false}
    for(const b of $$('button',n)){if(norm(b.textContent)==='importar')b.remove();if(b.dataset.view)b.disabled=false}
  }
}
function isSettingsPage(){
  if(typeof view!=='undefined'&&view==='settings')return true;
  const active=$('.nav button.active,.mobile-nav button.active');if(active&&norm(active.textContent).includes('configur'))return true;
  const text=norm(($('.content')||$('#app'))?.textContent||'');return text.includes('importar dados')||text.includes('configuracoes');
}
function versionFooter(){
  const host=$('.content')||$('#app');if(!host||!isSettingsPage())return;
  for(const x of $$('[id*=version],.ct-version-footer,.ct53w-version',host)){if(/CineTracker Web/i.test(x.textContent||''))x.remove()}
  for(const x of $$('*',host)){if(x.children.length===0&&/CineTracker Web\s*[•·-]?\s*(?:vers[aã]o|build)?\s*0\./i.test((x.textContent||'').trim()))x.remove()}
  const f=document.createElement('div');f.className='ct53w-version';f.textContent=`CineTracker Web • versão ${VERSION}`;host.appendChild(f);
}
function navigate(target){const now=Date.now();if(now-navAt<80)return;navAt=now;if(target==='import')target='settings';try{window.view=target;if(typeof render==='function')render();window.scrollTo(0,0)}catch{}setTimeout(()=>void reconcile(),0);setTimeout(()=>void reconcile(),250)}
document.addEventListener('click',e=>{const b=e.target.closest('.nav button[data-view],.mobile-nav button[data-view]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();navigate(b.dataset.view)},true);
async function reconcile(){if(reconciling)return;reconciling=true;try{cleanNavigation();versionFooter();await canonicalProgress();rebootCovers();try{window.ct47ResolveCovers?.()}catch{}}finally{reconciling=false}}
const previous=typeof render==='function'?render:null;if(previous&&!window.__ct53Render){window.__ct53Render=previous;render=function(){const out=window.__ct53Render();setTimeout(()=>void reconcile(),0);setTimeout(()=>void reconcile(),300);return out}}
setTimeout(()=>void reconcile(),50);setTimeout(()=>void reconcile(),700);
window.ct53RebootCovers=()=>{for(const c of $$('[data-ct53-cover]'))delete c.dataset.ct53Cover;rebootCovers()};
window.ct53Refresh=async()=>{rowAt=0;await ensureRows(true);await reconcile()};
})();
