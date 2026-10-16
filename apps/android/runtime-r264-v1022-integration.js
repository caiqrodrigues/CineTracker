/* r264: wire Web r541 parity to authenticated Android r158/r262 DOM */
(()=>{
'use strict';
if(window.__ctR264AndroidV1022)return;
window.__ctR264AndroidV1022='auth+android-scroll+foryou-pools+native-preserved';
let generation264=0,load264=null;
function scroll264(kind){
 if(typeof route!=='function'||route()!=='home')return false;
 const k=kind==='movies'?'movies':'series',v=document.querySelector('[data-home-viewport="'+k+'"]');
 if(!v||v.closest('.hidden'))return false;
 const h=v.querySelector(':scope > .home-history'),s=v.querySelector(':scope > .home-start');
 if(!h||!s)return false;
 v.scrollTop=Math.max(0,s.offsetTop-h.offsetTop);v.dataset.ct264Home=k;return true;
}
function specials264(){
 if(typeof session==='undefined'||!session?.access_token||typeof route!=='function'||route()!=='home')return Promise.resolve(false);
 if(load264)return load264;
 const api=window.__ctAndroidV1021;
 if(!api)return Promise.resolve(false);
 load264=Promise.allSettled([api.loadCounts(false),api.loadSpecial(true)]).then(()=>{api.syncHome();return true}).finally(()=>{load264=null});
 return load264;
}
const render264=render;
render=async function(...args){
 const id=++generation264,result=await render264.apply(this,args);
 if(id===generation264&&typeof route==='function'&&route()==='home'){
  const k=typeof homeActiveTab158!=='undefined'&&homeActiveTab158==='movies'?'movies':'series';
  requestAnimationFrame(()=>scroll264(k));void specials264();
 }
 if(id===generation264&&typeof route==='function'&&route()==='profile')requestAnimationFrame(()=>window.__ctAndroidV1021?.syncProfile?.());
 return result;
};
const oldPaint264=paintHome;
paintHome=function(...args){const out=oldPaint264.apply(this,args);const k=typeof homeActiveTab158!=='undefined'&&homeActiveTab158==='movies'?'movies':'series';requestAnimationFrame(()=>scroll264(k));return out};
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-home-tab]');if(b)requestAnimationFrame(()=>scroll264(b.dataset.homeTab))});
const oldForYou264=typeof ct186LoadForYou==='function'?ct186LoadForYou:null;
if(oldForYou264)ct186LoadForYou=async function(...args){
 const data=await oldForYou264.apply(this,args);
 if(!data?.__ct263Audited||typeof ct186Select!=='function')return data;
 data._ct186_fallback={movie:[],series:[],anime:[]};
 const pick=ct186Select(data);
 Object.assign(data,{daily:pick.daily,movie:pick.fm,series:pick.fs,anime:pick.fa,watchlist_movie:pick.wm,watchlist_series:pick.ws,watchlist_anime:pick.wa,wmPool:pick.wmPool,wsPool:pick.wsPool,waPool:pick.waPool});
 try{ct186ForYouData=data}catch{}
 return data;
};
const oldProfile264=renderProfile;
renderProfile=async function(...args){const value=await oldProfile264.apply(this,args);requestAnimationFrame(()=>window.__ctAndroidV1021?.syncProfile?.());return value};
window.addEventListener('cinetracker:app-foreground',()=>{void specials264()});
window.__ctAndroidV1022={version:'1.0.22',scrollHome:scroll264,loadSpecials:specials264};
})();