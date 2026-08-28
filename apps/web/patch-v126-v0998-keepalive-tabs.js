(() => {
'use strict';
if(window.__ct0998KeepAliveLoaded)return;
window.__ct0998KeepAliveLoaded=true;
window.__ct0998KeepAliveMarker='v126-main-tabs-dom-keepalive';
window.__ctWebBuild='0.99.8';

const ROUTES=['home','discover','profile','settings'];
const rawNav=typeof window.__ct0994Navigate==='function'?window.__ct0994Navigate.bind(window):null;
const app=document.getElementById('app');
if(!app||!rawNav)return;
const pages=new Map();
const scrolls=new Map();
let active=detectRoute();
let priming=false;
let primePromise=null;
let switching=false;
let observer=null;

const style=document.createElement('style');
style.id='ct0998-keepalive-style';
style.textContent=`
#ct0998-keepalive-bin{display:none!important}
.ct998-tab-fade{animation:ct998Fade 150ms ease-out both}
@keyframes ct998Fade{from{opacity:.72}to{opacity:1}}
.ct998-prime-cover{position:fixed;inset:0;z-index:2147482000;overflow:hidden;background:#050b10;pointer-events:none}
`;
document.getElementById(style.id)?.remove();document.head.appendChild(style);
const bin=document.createElement('div');bin.id='ct0998-keepalive-bin';bin.setAttribute('aria-hidden','true');document.body.appendChild(bin);

function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function detectRoute(){const p=document.querySelector('#ct120-page[data-ct120-route]');if(p?.dataset.ct120Route)return p.dataset.ct120Route;const h=norm(document.querySelector('.content h1')?.textContent||'');if(h.includes('descobrir'))return'discover';if(h.includes('perfil'))return'profile';if(h.includes('config'))return'settings';return'home'}
function root(){return app.firstElementChild}
function routeFromButton(el){const d=String(el?.dataset?.ct998Nav||el?.dataset?.ct120Nav||el?.dataset?.view||el?.dataset?.view99||el?.dataset?.view991||'').toLowerCase();if(ROUTES.includes(d))return d;const t=norm(el?.textContent||'');if(t.includes('descobrir'))return'discover';if(t.includes('perfil'))return'profile';if(t.includes('config'))return'settings';if(t.includes('home')||t.includes('inicio'))return'home';return''}
function syncVersion(scope=document){for(const el of scope.querySelectorAll('.ct120-version,[data-version],.version')){const t=String(el.textContent||'');if(/cine\s*tracker/i.test(t)&&/0\.99\.[0-9]/.test(t))el.textContent=t.replace(/0\.99\.[0-9]+(?:\.\d+)*/g,'0.99.8')}}
function normalizeNav(scope=document){for(const area of scope.querySelectorAll('.sidebar,.mobile-nav')){for(const el of [...area.querySelectorAll('button,a')]){const r=routeFromButton(el);if(!r)continue;el.dataset.ct998Nav=r;el.removeAttribute('data-ct120-nav');el.removeAttribute('data-view');el.removeAttribute('data-view99');el.removeAttribute('data-view991');el.onclick=null;el.classList.toggle('active',r===active)}}syncVersion(scope)}
function currentRoot(){const r=root();return r&&r!==bin?r:null}
function stash(route){if(!ROUTES.includes(route))return null;const node=currentRoot();if(!node)return pages.get(route)||null;scrolls.set(route,{windowY:window.scrollY,content:document.querySelector('.content')?.scrollTop||0});node.dataset.ct998KeptRoute=route;node.style.display='none';node.setAttribute('aria-hidden','true');bin.appendChild(node);pages.set(route,node);return node}
function restore(route,node){if(!node)return false;app.replaceChildren(node);node.style.display='';node.removeAttribute('aria-hidden');active=route;node.classList.remove('ct998-tab-fade');void node.offsetWidth;node.classList.add('ct998-tab-fade');normalizeNav(node);const pos=scrolls.get(route);requestAnimationFrame(()=>{if(pos){window.scrollTo({top:pos.windowY||0,left:0,behavior:'instant'});const c=node.querySelector('.content');if(c)c.scrollTop=pos.content||0}});return true}
function maskIds(node,route){const ids=route==='profile'?['ct120-profile']:route==='discover'?['ct120-discover']:[];const changed=[];for(const id of ids){const el=node.querySelector(`#${id}`);if(el){el.id=`ct998-hold-${id}`;changed.push([el,id])}}return()=>{for(const[el,id]of changed)if(el?.isConnected||bin.contains(el))el.id=id}}
function setGlobalRoute(route){try{window.view=route}catch{}try{view=route}catch{}}
function tempRemoveExcept(node){for(const child of [...app.children])if(child!==node)child.remove()}

async function firstVisit(route){stash(active);setGlobalRoute(route);const p=Promise.resolve(rawNav(route));await p;await new Promise(r=>setTimeout(r,26));active=route;const node=currentRoot();if(node){node.dataset.ct998KeptRoute=route;pages.set(route,node);normalizeNav(node)}return true}
async function instantRestore(route){const cached=pages.get(route);if(!cached)return firstVisit(route);const previous=active;stash(previous);const unmask=maskIds(cached,route);setGlobalRoute(route);let p;try{p=Promise.resolve(rawNav(route))}catch(e){p=Promise.reject(e)}tempRemoveExcept(null);restore(route,cached);p.catch(()=>{}).finally(()=>{unmask();normalizeNav(cached)});return true}
async function switchTo(route){route=String(route||'home').replace('history','profile');if(!ROUTES.includes(route)||switching)return false;if(route===active&&currentRoot())return true;if(priming&&primePromise){try{await primePromise}catch{}}switching=true;try{return pages.has(route)?await instantRestore(route):await firstVisit(route)}finally{switching=false}}

function cloneCover(){const cover=document.createElement('div');cover.className='ct998-prime-cover';const clone=app.cloneNode(true);clone.removeAttribute('id');for(const el of clone.querySelectorAll('[id]'))el.removeAttribute('id');cover.appendChild(clone);document.body.appendChild(cover);return cover}
async function primeAll(){if(priming||!rawNav||!currentRoot())return false;const original=active;if(original!=='home'&&original!=='profile'&&original!=='discover'&&original!=='settings')return false;priming=true;const cover=cloneCover();cover.style.opacity='1';try{
  if(!pages.has(original))stash(original);
  for(const route of ROUTES){if(route===original||pages.has(route))continue;setGlobalRoute(route);await Promise.resolve(rawNav(route));await new Promise(r=>setTimeout(r,28));const node=currentRoot();if(node){node.dataset.ct998KeptRoute=route;node.style.display='none';node.setAttribute('aria-hidden','true');bin.appendChild(node);pages.set(route,node)}}
  setGlobalRoute(original);const sync=Promise.resolve(rawNav(original));tempRemoveExcept(null);restore(original,pages.get(original));sync.catch(()=>{});
  normalizeNav(document);
  return true;
}finally{priming=false;cover.style.transition='opacity 150ms ease';cover.style.opacity='0';setTimeout(()=>cover.remove(),160)}}

function onNav(e){const el=e.target.closest?.('[data-ct998-nav]');if(!el)return;const route=routeFromButton(el);if(!route)return;e.preventDefault();e.stopImmediatePropagation();void switchTo(route)}
document.addEventListener('click',onNav,true);
function reconcile(){normalizeNav(document);const r=currentRoot();if(r&&!r.dataset.ct998KeptRoute)r.dataset.ct998KeptRoute=active;syncVersion(document)}
observer=new MutationObserver(()=>queueMicrotask(reconcile));observer.observe(app,{childList:true,subtree:true});
window.addEventListener('cinetracker:0998-prefetch-ready',()=>{if(!primePromise)primePromise=primeAll().finally(()=>primePromise=null)});
window.addEventListener('cinetracker:data-changed',()=>{const q=window.__ct0998QueryClient;void q?.prefetchBoot?.(true)});
window.__ct0998KeepAlive={version:'0.99.8',pages,scrolls,get active(){return active},switchTo,primeAll};
reconcile();
if(window.__ct0998QueryClient?.state?.boot==='ready')primePromise=primeAll().finally(()=>primePromise=null);
})();