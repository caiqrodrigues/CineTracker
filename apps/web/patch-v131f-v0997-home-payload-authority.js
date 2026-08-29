(() => {
'use strict';
if(window.__ct0997R131fLoaded)return;
window.__ct0997R131fLoaded='v131f-home-payload-authority';
const HOME_OLD='cinetracker_profile_home_payload_v0994';
const HOME_LIVE='cinetracker_home_live_v0997';
const SUPA='https://pjmkxryboypluleuuupp.supabase.co';
const KEY='sb_publishable_UERbQXkZk4rnnu6Y8XJSgw_vcZd_V_Q';
const previous=typeof window.sbRpc==='function'?window.sbRpc.bind(window):null;
let cached=null,inflight=null,at=0,refreshing=false;
function session(){try{return JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{return null}}
function isHome(){const r=document.querySelector('#ct120-page')?.dataset?.ct120Route;if(r)return r==='home';const h=String(document.querySelector('.content h1')?.textContent||'').toLowerCase();return !h||h.includes('home')}
function clearOldHomeCaches(){try{localStorage.removeItem('ct0994_home_preload_v1')}catch{}try{for(let i=sessionStorage.length-1;i>=0;i--){const k=sessionStorage.key(i)||'';if(k.includes(HOME_OLD)||k.includes('ct0994_home_preload'))sessionStorage.removeItem(k)}}catch{}}
function publish(data){if(!data||typeof data!=='object')return data;cached=data;at=Date.now();const s=session();try{localStorage.setItem('ct0994_home_preload_v1',JSON.stringify({uid:s?.user?.id||'',at:Date.now(),data}))}catch{}window.__ct0994PreloadedHome=data;document.documentElement.dataset.ct131fPayload='live';return data}
async function fetchLive(force=false){if(!force&&cached&&Date.now()-at<45000)return cached;if(inflight)return inflight;const s=session(),jwt=s?.access_token||'';if(!jwt)throw new Error('auth-pending');const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);inflight=fetch(`${SUPA}/rest/v1/rpc/${HOME_LIVE}`,{method:'POST',headers:{apikey:KEY,Authorization:`Bearer ${jwt}`,'Content-Type':'application/json'},body:'{}',signal:ctrl.signal,cache:'no-store'}).then(async r=>{const text=await r.text();let data={};try{data=text?JSON.parse(text):{}}catch{}if(!r.ok)throw new Error(data?.message||`HOME ${r.status}`);return publish(data)}).finally(()=>{clearTimeout(timer);inflight=null});return inflight}
async function authority(name,body={}){if(name===HOME_OLD||name===HOME_LIVE)return fetchLive(false);if(!previous)throw new Error('RPC indisponível');return previous(name,body)}
authority.__ct131fHomeAuthority=true;window.sbRpc=authority;try{globalThis.sbRpc=authority}catch{}
async function prime(force=false,rerender=false){if(refreshing)return;refreshing=true;try{clearOldHomeCaches();const data=await fetchLive(force);publish(data);if(rerender&&isHome()&&typeof window.__ct0994Navigate==='function'){setTimeout(()=>{try{window.__ct0994Navigate('home')}catch(e){console.error('[r131f-nav]',e)}},30)}}catch(e){if(e?.message!=='auth-pending')console.error('[r131f-home]',e)}finally{refreshing=false}}
function boot(){void prime(true,true);setTimeout(()=>void prime(false,false),600);setTimeout(()=>void prime(false,false),1800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',()=>void prime(false,false),{once:true});
document.addEventListener('click',e=>{const t=e.target.closest?.('[data-view="home"],[data-view99="home"],[data-view991="home"],[data-ct120-nav="home"],.sidebar .nav button,.mobile-nav button');if(!t)return;const text=String(t.textContent||'').toLowerCase();const explicit=t.dataset?.view==='home'||t.dataset?.view99==='home'||t.dataset?.view991==='home'||t.dataset?.ct120Nav==='home'||text.includes('home');if(explicit)void prime(false,false)},true);
window.addEventListener('cinetracker:data-changed',()=>{cached=null;at=0;clearOldHomeCaches();void prime(true,isHome())});
})();
