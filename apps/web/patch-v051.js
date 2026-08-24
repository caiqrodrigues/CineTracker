(() => {
'use strict';
if(window.__ct51WebLoaded)return;window.__ct51WebLoaded=true;
const VERSION='0.5.1',$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let booted=false,syncing=false,lastSync=0,navAt=0;const CORE_TTL=45000;
const cache={continueRows:[],overrides:[],timeline:null};
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function coreSync(force=false){if(syncing)return;if(!force&&Date.now()-lastSync<CORE_TTL)return;syncing=true;try{const jobs=[sbRpc('cinetracker_continue_items_v2',{}).catch(()=>[]),sbApi('media_overrides?select=state,media:media(tmdb_id,media_type,title)&limit=5000').catch(()=>[]),sbRpc('cinetracker_watch_daily_timeline',{p_days_back:15,p_days_forward:3}).catch(()=>null)];const [cont,over,time]=await Promise.all(jobs);cache.continueRows=cont||[];cache.overrides=over||[];cache.timeline=time;lastSync=Date.now()}finally{syncing=false}}
function versionFooter(){if(typeof view==='undefined'||view!=='settings')return;const host=$('.content')||$('#app');if(!host)return;for(const x of $$('*',host)){if(x.children.length===0&&/CineTracker Web\s*[•·-]?\s*(?:vers[aã]o|build)\s+0\./i.test((x.textContent||'').trim()))x.remove()}let f=$('#ct51w-version',host);if(!f){f=document.createElement('div');f.id='ct51w-version';f.style.cssText='margin:28px 0 8px;text-align:center;color:#71808b;font-size:11px';host.appendChild(f)}f.textContent=`CineTracker Web • versão ${VERSION}`}
function nav(target){const now=Date.now();if(now-navAt<90)return;navAt=now;if(target==='import')target='settings';try{view=target;render();window.scrollTo(0,0);requestAnimationFrame(()=>{versionFooter();try{window.ct50WebRefresh?.()}catch{}})}catch{}}
document.addEventListener('click',e=>{const b=e.target.closest('.nav button[data-view],.mobile-nav button[data-view]');if(b){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();nav(b.dataset.view);return}if(e.target.closest('.js-seen,.ct47-seen,#ct47-toggle'))setTimeout(async()=>{lastSync=0;await coreSync(true);try{await loadCloudState?.()}catch{};try{window.ct50WebRefresh?.()}catch{}},450)},true);
async function preload(){if(booted)return;booted=true;const ready=async()=>{for(let i=0;i<15;i++){if(currentUser&&ctSession?.access_token)return true;await sleep(60)}return false};await ready();await Promise.race([coreSync(true),sleep(1200)]);try{await loadCloudState?.()}catch{};versionFooter()}
window.ctStableNavigate=nav;window.ctStableSync=async()=>{lastSync=0;await coreSync(true);try{await loadCloudState?.()}catch{};versionFooter()};
setTimeout(()=>void preload(),30);
})();
