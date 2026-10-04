/* CineTracker Web 1.0.259 r469 — direct current-runtime owners for Home, Pra Você, Profile and daily-history undo. */
(()=>{'use strict';
if(window.__ctR469?.version==='1.0.259')return;
const q=(s,r=document)=>r?.querySelector?.(s)||null;
const qa=(s,r=document)=>[...(r?.querySelectorAll?.(s)||[])];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const visible=el=>{if(!el)return false;try{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&!el.hidden}catch{return true}};
function route469(){
 const active=q('[data-nav].active,[data-nav][aria-current="page"],[data-route].active,[data-view].active');
 if(active){
  const raw=active.dataset?.nav||active.dataset?.route||active.dataset?.view||active.getAttribute?.('data-page')||active.textContent||'';
  const n=norm(raw);if(n.includes('perfil'))return'profile';if(n.includes('descob'))return'discover';if(n.includes('esporte'))return'sports';if(n.includes('home')||n.includes('inicio'))return'home';
 }
 const pages=[['profile','[data-profile]'],['discover','[data-discover],[data-ct319-content],[data-ct315-content],[data-ct263-discover-content],[data-discover-content]'],['sports','[data-sports]'],['home','[data-home]']];
 for(const [name,sel] of pages){const el=q(sel);if(visible(el))return name}
 try{const v=String(typeof view!=='undefined'?view:'');if(v==='home'||v==='discover'||v==='profile'||v==='sports')return v}catch{}
 return'';
}
function session469(){try{return typeof ctSession!=='undefined'?ctSession:null}catch{return null}}
function rpc469(name,args={}){if(typeof sbRpc!=='function')return Promise.reject(new Error('SB_RPC_UNAVAILABLE'));return Promise.resolve(sbRpc(name,args))}
function forYou469(){
 if(route469()!=='discover')return false;
 try{const s=String(window.__ctR288R263?.discover263?.tab||'');if(s)return s==='foryou'}catch{}
 const active=qa('[data-ct319-tab].active,[data-ct315-tab].active,[data-ct263-discover-tab].active,[data-discover-tab].active,[data-tab].active').find(Boolean);
 if(!active)return!!q('[data-ct464-foryou]');
 return [active.dataset?.ct319Tab,active.dataset?.ct315Tab,active.dataset?.ct263DiscoverTab,active.dataset?.discoverTab,active.getAttribute?.('data-tab'),active.textContent].some(v=>['foryou','pra voce','para voce'].includes(norm(v)));
}
function install469(){
 window.__ctR469Route=route469;window.__ctR469Session=session469;window.__ctR469Rpc=rpc469;
 try{Object.defineProperty(window,'session',{configurable:true,get:session469})}catch{}
 try{window.rpc=rpc469;window.route=route469}catch{}
 document.documentElement.dataset.ct469Runtime='ctSession+sbRpc+direct-owner-hooks';
}
function wake469(){
 install469();const r=route469();
 if(r==='home'){try{window.__ctR399?.settle?.(true)}catch{}}
 if(r==='discover'&&forYou469()){try{window.__ctR464?.activate?.()}catch{}}
 if(r==='profile'){try{window.__ctR467?.applyProfile?.()}catch{}}
 return r;
}
async function authWake469(){
 for(const ms of[0,80,180,420,900,1800,3200,5200,7600]){
  if(ms)await new Promise(r=>setTimeout(r,ms));wake469();
  if(session469()?.access_token){wake469();return true}
 }
 return false;
}
install469();void authWake469();
window.addEventListener('click',e=>{const t=e.target;if(!t?.closest)return;
 if(t.closest('[data-nav],[data-route],[data-view],[data-home-tab],[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab],[data-tab]')){
  for(const ms of[0,70,180,420,900])setTimeout(wake469,ms);
 }
},true);
window.addEventListener('popstate',()=>setTimeout(wake469,0));
window.addEventListener('cinetracker:data-changed',()=>setTimeout(wake469,60));
window.__ctR469={version:'1.0.259',scope:'current-runtime-direct-home-foryou-profile-history',route:route469,session:session469,rpc:rpc469,wake:wake469};
window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe';
})();