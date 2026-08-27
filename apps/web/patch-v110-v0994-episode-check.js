(() => {
'use strict';
if (window.__ct0994EpisodeCheckLoaded) return;
window.__ct0994EpisodeCheckLoaded = true;
window.__ct0994EpisodeCheck = 'v110-canonical-episode-check';

const $110=(s,r=document)=>r.querySelector(s);
const $$110=(s,r=document)=>[...r.querySelectorAll(s)];
const cache110=new Map();

const css=document.createElement('style');
css.id='ct0994-episode-check-v110-style';
css.textContent=`
.ct91-episode [data-ep91]{
  position:relative!important;display:grid!important;place-items:center!important;flex:0 0 auto!important;
  width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;
  padding:0!important;border-radius:50%!important;border:1px solid #356b86!important;background:#0b1d28!important;
  color:transparent!important;font-size:0!important;line-height:0!important;cursor:pointer!important;overflow:hidden!important;
  box-shadow:inset 0 1px 0 #ffffff10,0 0 0 0 #41caff00!important;transition:.15s ease!important;
}
.ct91-episode [data-ep91]::before{content:'✓';display:block;color:#dff8ff;font-size:19px!important;line-height:1!important;font-weight:900!important}
.ct91-episode [data-ep91]:hover:not(:disabled){border-color:#59cff9!important;background:#0d2b3b!important;box-shadow:0 0 18px #3bc8ff38!important;transform:translateY(-1px)}
.ct91-episode [data-ep91]:disabled,.ct91-episode [data-ep91].ct110-seen{opacity:1!important;border-color:#3c9d77!important;background:#0b2d23!important;cursor:default!important;box-shadow:0 0 15px #39d99126!important}
.ct91-episode [data-ep91]:disabled::before,.ct91-episode [data-ep91].ct110-seen::before{color:#82ffc6!important}
.ct91-episode [data-ep91].ct110-busy{pointer-events:none!important;opacity:.72!important}
.ct91-episode [data-ep91].ct110-busy::before{content:'…';color:#8edfff!important}
@media(max-width:700px){.ct91-episode [data-ep91]{justify-self:end!important;width:42px!important;min-width:42px!important;height:42px!important;min-height:42px!important}}
`;
document.getElementById(css.id)?.remove();document.head.appendChild(css);

function toast110(msg){
  if(typeof window.toast91==='function'){try{return window.toast91(msg)}catch{}}
  const t=document.createElement('div');t.className='ct90-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
}
async function tmdb110(path){
  const hit=cache110.get(path);if(hit&&Date.now()-hit.t<5*60*1000)return hit.p;
  const p=(async()=>{const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language',localStorage.getItem('cinetracker_locale')==='en-US'?'en-US':'pt-BR');const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{}});if(!r.ok)throw new Error(`TMDB ${r.status}`);return r.json()})();
  cache110.set(path,{t:Date.now(),p});p.catch(()=>cache110.delete(path));return p;
}
function detailTvId110(){
  const o=$110('#ct91-overlay');if(!o)return 0;
  const m=String(o.dataset.ct106Detail||'').match(/^tv:(\d+)$/);return m?Number(m[1]):0;
}
function releasedCount110(show){
  const lastSeason=Number(show?.last_episode_to_air?.season_number||0),lastEpisode=Number(show?.last_episode_to_air?.episode_number||0);
  if(lastSeason<=0||lastEpisode<=0)return null;
  let total=lastEpisode;
  for(const s of show?.seasons||[]){const n=Number(s?.season_number||0);if(n>0&&n<lastSeason)total+=Math.max(0,Number(s?.episode_count||0))}
  return total>0?total:null;
}
async function media110(tvId,show){
  let rows=await sbApi(`media?select=id,tmdb_id,media_type,title,runtime_minutes&tmdb_id=eq.${tvId}&media_type=eq.tv&limit=1`).catch(()=>[]);
  if(rows?.[0])return rows[0];
  const body={tmdb_id:tvId,media_type:'tv',title:show?.name||show?.title||`TMDB #${tvId}`,poster_path:show?.poster_path||null,release_year:Number(String(show?.first_air_date||'').slice(0,4))||null,runtime_minutes:Number((show?.episode_run_time||[])[0]||0)||null,raw_tmdb:show||{}};
  rows=await sbApi('media',{method:'POST',body:JSON.stringify(body)}).catch(()=>[]);return rows?.[0]||null;
}
async function seenSet110(mediaId,season){
  const [h,p]=await Promise.all([
    sbApi(`watch_history?select=episode_number&media_id=eq.${encodeURIComponent(mediaId)}&item_type=eq.episode&season_number=eq.${season}`).catch(()=>[]),
    sbApi(`episode_progress?select=episode_number&media_id=eq.${encodeURIComponent(mediaId)}&watched=eq.true&season_number=eq.${season}`).catch(()=>[])
  ]);
  return new Set([...(h||[]),...(p||[])].map(x=>Number(x.episode_number)).filter(Number.isFinite));
}
async function syncButtons110(){
  const tvId=detailTvId110(),buttons=$$110('#ct91-overlay .ct91-episode [data-ep91]');if(!tvId||!buttons.length)return false;
  const show=await tmdb110(`/tv/${tvId}`).catch(()=>null);if(!show)return false;const m=await media110(tvId,show);if(!m)return false;
  const seasons=[...new Set(buttons.map(b=>Number(b.dataset.season||0)).filter(x=>x>0))];
  for(const season of seasons){const seen=await seenSet110(m.id,season);buttons.filter(b=>Number(b.dataset.season)===season).forEach(b=>{const on=seen.has(Number(b.dataset.episode));b.disabled=on;b.classList.toggle('ct110-seen',on);b.title=on?'Episódio já assistido':'Marcar episódio como visto';b.setAttribute('aria-label',b.title)})}
  return true;
}
function scheduleSync110(){for(const d of [80,220,520,950])setTimeout(()=>void syncButtons110(),d)}
async function markEpisode110(button){
  const tvId=detailTvId110(),season=Number(button.dataset.season||0),episode=Number(button.dataset.episode||0);if(!tvId||!season||!episode)return false;
  button.classList.add('ct110-busy');button.disabled=true;
  try{
    const [show,seasonData]=await Promise.all([tmdb110(`/tv/${tvId}`),tmdb110(`/tv/${tvId}/season/${season}`)]),m=await media110(tvId,show);if(!m)throw new Error('Mídia não encontrada');
    const ep=(seasonData?.episodes||[]).find(x=>Number(x.episode_number)===episode)||{},released=releasedCount110(show),runtime=Number(ep.runtime||show?.episode_run_time?.[0]||m.runtime_minutes||0)||null,title=`${show?.name||m.title||'Série'} — T${season}E${episode}${ep.name?` ${ep.name}`:''}`;
    const result=await sbRpc('cinetracker_mark_episode_v0994',{p_media_id:m.id,p_season_number:season,p_episode_number:episode,p_title:title,p_runtime_minutes:runtime,p_released_episodes:released,p_series_status:show?.status||null,p_watched_at:new Date().toISOString()});
    button.classList.remove('ct110-busy');button.classList.add('ct110-seen');button.disabled=true;button.title='Episódio já assistido';button.setAttribute('aria-label',button.title);
    try{window.__ct0994PreloadedHome=null;localStorage.removeItem('ct0994_home_preload_v1')}catch{}
    window.dispatchEvent(new CustomEvent('cinetracker:data-changed',{detail:{source:'web-0.99.4-episode-check',media_id:m.id,season,episode,home_bucket:result?.home_bucket||null,state:result?.state||null}}));
    const bucket=String(result?.home_bucket||'');
    if(bucket==='completed')toast110('Episódio marcado. Série movida para Concluídas.');
    else if(bucket==='up_to_date')toast110('Episódio marcado. Série agora está Em dia.');
    else toast110('Episódio marcado. Série movida para o topo de Continuar assistindo.');
    return true;
  }catch(error){console.error('[CineTracker 0.99.4] check de episódio',error);button.classList.remove('ct110-busy');button.disabled=false;toast110('Não foi possível marcar o episódio agora.');return false}
}

document.addEventListener('click',event=>{
  const button=event.target?.closest?.('#ct91-overlay .ct91-episode [data-ep91]');
  if(button){if(button.disabled)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();void markEpisode110(button);return}
  if(event.target?.closest?.('#ct91-overlay [data-season91]'))scheduleSync110();
},true);

const rawOpen110=window.__ct0994OpenDetail;
if(typeof rawOpen110==='function'&&!rawOpen110.__ct110Wrapped){const fn=function(type,id){const r=rawOpen110.apply(this,arguments);if(String(type)==='tv')scheduleSync110();return r};fn.__ct110Wrapped=true;window.__ct0994OpenDetail=fn}
const raw91=window.ct91OpenMedia;if(typeof raw91==='function'&&!raw91.__ct110Wrapped){const fn=function(type,id){const r=raw91.apply(this,arguments);if(String(type)==='tv')scheduleSync110();return r};fn.__ct110Wrapped=true;window.ct91OpenMedia=fn}
const raw92=window.ct92OpenMedia;if(typeof raw92==='function'&&!raw92.__ct110Wrapped){const fn=function(type,id){const r=raw92.apply(this,arguments);if(String(type)==='tv')scheduleSync110();return r};fn.__ct110Wrapped=true;window.ct92OpenMedia=fn}
window.__ct0994SyncEpisodeChecks=syncButtons110;
})();
