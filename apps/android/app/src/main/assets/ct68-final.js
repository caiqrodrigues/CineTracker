(() => {
'use strict';
if(window.__ct68Loaded)return;window.__ct68Loaded=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const metaCache=new Map();
async function tmdb(path){if(metaCache.has(path))return metaCache.get(path);const p=(async()=>{const u=new URL(`${SUPABASE_URL}/functions/v1/tmdb-proxy`);u.searchParams.set('path',path);u.searchParams.set('language','pt-BR');const r=await fetch(u,{headers:typeof authHeaders==='function'?authHeaders():{},cache:'force-cache'});if(!r.ok)throw new Error('TMDB '+r.status);return r.json()})();metaCache.set(path,p);try{return await p}catch(e){metaCache.delete(path);throw e}}
const image=p=>p?`${SUPABASE_URL}/functions/v1/tmdb-image?path=${encodeURIComponent(p)}&size=w500`:'';
async function preload(){const cards=$$('.card,.feature,.ct47-card,.ct48-home-card,[data-media-id],[data-tmdb-id]').slice(0,28);await Promise.allSettled(cards.map(async c=>{const raw=c.dataset.mediaId||'',m=raw.match(/^tmdb-(movie|tv)-(\d+)$/),id=Number(c.dataset.tmdbId||c.dataset.id||(m&&m[2])||0);if(!id)return;const type=m?m[1]:(String(c.dataset.apiType||c.dataset.type||'').includes('movie')?'movie':'tv');const d=await tmdb(`/${type}/${id}`);if(d?.poster_path){const im=new Image();im.decoding='async';im.loading='eager';im.src=image(d.poster_path)}}));try{await sbRpc('cinetracker_continue_items_v2',{})}catch{}try{await sbApi('watch_history?select=id,item_type,season_number,episode_number,watched_at,title,media:media(id,tmdb_id,media_type,title,poster_path)&order=watched_at.desc&limit=500')}catch{}}
function smooth(){document.documentElement.style.scrollBehavior='auto';$$('button,[role=button]').forEach(b=>b.style.touchAction='manipulation')}
const old=window.render;if(typeof old==='function'&&!window.__ct68Render){window.__ct68Render=old;window.render=function(){const out=window.__ct68Render();smooth();return out}}
setTimeout(()=>{smooth();void preload()},0);
window.ct68FullRefresh=async()=>{metaCache.clear();try{window.ct66RebootCovers?.()}catch{};try{await window.ct66Refresh?.()}catch{};await preload();if(typeof render==='function')render()};
})();
