/* CineTracker Web 1.0.258 r468 — canonical runtime bridge for authenticated Home, Discover, Profile and History owners. */
(()=>{'use strict';
if(window.__ctR468?.version==='1.0.258')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

function route468(){
 const active=q('[data-nav].active,[data-nav][aria-current="page"]');
 const nav=String(active?.dataset?.nav||'');
 if(q('[data-home]')||nav==='home')return'home';
 if(q('[data-profile]')||nav==='profile')return'profile';
 if(q('[data-discover],[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]')||nav==='discover')return'discover';
 if(q('[data-sports]')||nav==='sports')return'sports';
 try{const v=String(typeof view!=='undefined'?view:'');if(v)return v}catch{}
 return'';
}
function session468(){try{return typeof ctSession!=='undefined'?ctSession:null}catch{return null}}
async function rpc468(name,args={}){
 if(typeof sbRpc!=='function')throw new Error('SB_RPC_UNAVAILABLE');
 return sbRpc(name,args);
}
function installBridge468(){
 try{Object.defineProperty(window,'session',{configurable:true,get:session468,set(v){try{ctSession=v}catch{}}})}catch{try{window.session=session468()}catch{}}
 window.rpc=rpc468;
 window.route=route468;
 document.documentElement.dataset.ct468Bridge='ctSession+sbRpc+route';
 return true;
}
function forYouActive468(){
 if(route468()!=='discover')return false;
 const active=qa('[data-ct319-tab].active,[data-ct315-tab].active,[data-ct263-discover-tab].active,[data-discover-tab].active,[data-tab].active').find(Boolean);
 if(!active)return!!q('[data-ct464-foryou]');
 const values=[active.dataset?.ct319Tab,active.dataset?.ct315Tab,active.dataset?.ct263DiscoverTab,active.dataset?.discoverTab,active.getAttribute?.('data-tab'),active.textContent];
 return values.some(v=>{const s=norm(v);return s==='foryou'||s==='pra voce'||s==='para voce'});
}
function hideProfileHeaderMore468(){
 if(route468()!=='profile')return false;
 const root=q('[data-profile]');if(!root)return false;
 const allowed=new Set(['series','filmes','series favoritas','filmes favoritos','atores','atores favoritos','series watchlist','series da watchlist','filmes watchlist','filmes da watchlist']);
 for(const panel of qa('section.panel,.panel',root)){
  const title=norm(q('.panel-head h2,.panel-head h3,:scope>h2,:scope>h3,h2,h3',panel)?.textContent||'');if(!allowed.has(title))continue;
  for(const b of qa('.panel-head button',panel))if(norm(b.textContent).includes('ver mais'))b.style.display='none';
 }
 return true;
}
function wake468(){
 installBridge468();const r=route468();
 if(r==='home'){try{window.__ctR399?.settle?.(true)}catch{}}
 else if(r==='discover'&&forYouActive468()){try{window.__ctR464?.activate?.()}catch{}}
 else if(r==='profile'){try{window.__ctR467?.applyProfile?.()}catch{}hideProfileHeaderMore468()}
 return r;
}
async function authWake468(){
 for(const ms of[0,120,300,700,1400,2600,4200,6500,9000]){if(ms)await sleep(ms);wake468();if(session468()?.access_token){wake468();return true}}
 return false;
}

installBridge468();
void authWake468();
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 if(t.closest('[data-nav],[data-home-tab],[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab],[data-tab]')){
  for(const ms of[0,80,220,500])setTimeout(wake468,ms);
 }
},true);
window.addEventListener('popstate',()=>setTimeout(wake468,0));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(wake468,80));
window.__ctR468={version:'1.0.258',scope:'canonical-ctSession-sbRpc-route-bridge',route:route468,wake:wake468,session:session468,rpc:rpc468};
window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge';
})();
