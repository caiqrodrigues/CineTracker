import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r495.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v495.js'),'utf8'),
 readFile(resolve(dist,'app-v495.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8')
]);

function ct497GlobalFunctionBounds(source,name){
 const asyncSig='async function '+name+'(',syncSig='function '+name+'(';
 let start=source.indexOf(asyncSig),sig=asyncSig;
 if(start<0){start=source.indexOf(syncSig);sig=syncSig}
 if(start<0)throw new Error('r497 global function missing '+name);
 const open=source.indexOf('{',start+sig.length);let depth=0,mode='code',quote='',i=open;
 for(;i<source.length;i++){const c=source[i],n=source[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r497 global function unbalanced '+name);
 return{start,end:i};
}
const legacyProfileBounds=ct497GlobalFunctionBounds(js,'renderProfile');
const legacyProfileRegion=js.slice(legacyProfileBounds.start,legacyProfileBounds.end);
if(!legacyProfileRegion.includes('cinetracker_profile_payload_v0997'))throw new Error('r497 expected legacy profile payload missing');
js=js.slice(0,legacyProfileBounds.start)+"async function renderProfile(seq){return renderProfile491(seq)}"+js.slice(legacyProfileBounds.end);
if(!js.includes('async function renderProfile491(seq)'))throw new Error('r497 fast profile renderer missing');
if(!js.includes('async function sportsPayload(force=false)'))throw new Error('r497 Sports authority was removed while replacing Profile');

const ct497NavAuthority=String.raw`
window.addEventListener('click',function ct497SingleNavOwner(e){
 const nav=e.target?.closest?.('[data-nav]');
 if(!nav)return;
 const key=String(nav.dataset.nav||''),path=key==='home'?'/home':key==='discover'?'/discover':key==='sports'?'/sports':key==='profile'?'/profile':key==='configs'?'/configs':'';
 if(!path)return;
 e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();
 try{window.__ctCoreR471?.navigate?.(path,false)}catch{}
},true);
`;
js=ct497NavAuthority+"\n"+js;

js=js.replace(/const REVISION='[^']+';/,"const REVISION='r497-official-0.3.24';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.24 • ${REVISION}');
js+='\nwindow.__ctR497Marker="stable-r495-exact-runtime+broken-release-sources-removed+modern-blue+full-browser-gate";\n';
js+='window.__ctR497={version:"0.3.24",base:"r495-exact-runtime"};\n';

html='<!doctype html><html lang="pt-BR"><head><meta name="ct-revision" content="r497-official-0.3.24"><meta charset="UTF-8"><meta name="viewport" content="width=1280,initial-scale=1"><meta name="theme-color" content="#041017"><meta name="color-scheme" content="dark"><title>CineTracker</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/app-v497.css?ct=r497-official-0.3.24"></head><body><div id="app"><div class="ct497-boot" aria-live="polite"><div class="ct497-boot-mark">CT</div><div><b>CineTracker</b><small>Carregando sua biblioteca…</small></div></div></div><script defer src="/app-v497.js?ct=r497-official-0.3.24"></script></body></html>';

css+='\n/* CineTracker Web 0.3.24 r497 — exact green r495 runtime, clean release path. */\n'+
'.ct497-boot{min-height:100vh;display:flex;align-items:center;justify-content:center;gap:12px;background:#041017;color:#d8edf8;font:14px/1.35 Inter,system-ui,sans-serif}.ct497-boot-mark{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;border:1px solid rgba(88,175,224,.42);background:rgba(88,175,224,.12);color:#7bc7f2;font-weight:800;animation:ct497Pulse 1.1s ease-in-out infinite}.ct497-boot b,.ct497-boot small{display:block}.ct497-boot small{margin-top:2px;color:#8ca9b8}@keyframes ct497Pulse{0%,100%{opacity:.55}50%{opacity:1}}\n'+
':root{--gold:#58afe0!important}\n';


function ct497Bounds(source,anchor,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r497 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r497 invalid '+label+' bounds');
 return{start,end:close+6};
}
function ct497ReplaceNamed(source,anchor,name,replacement,label){
 const b=ct497Bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);
 if(!m)throw new Error('r497 missing '+label+' '+name);
 const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r497 unbalanced '+label+' '+name);
 return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end);
}
const r240Unsafe='sportsPayload=async function(){';
const r240At=js.indexOf(r240Unsafe);
if(r240At>=0){
 const r240StartRaw=js.lastIndexOf('\n(()=>{',r240At),r240Close=js.indexOf('\n})();',r240At);
 const r240Start=r240StartRaw>=0?r240StartRaw+1:(js.startsWith('(()=>{')?0:-1);
 if(r240Start<0||r240Close<0)throw new Error('r497 invalid unsafe r240 bounds');
 const r240End=r240Close+6,r240Region=js.slice(r240Start,r240End);
 if(!r240Region.includes('LEGACY_WATCHED_KEY_240'))throw new Error('r497 unsafe Sports writer did not match r240 contract');
 js=js.slice(0,r240Start)+js.slice(r240End);
}
if(js.includes(r240Unsafe)||js.includes('LEGACY_WATCHED_KEY_240'))throw new Error('r497 r240 legacy Sports writer survived');
if(!js.includes('cinetracker_sports_payload_v479'))throw new Error('r497 current Sports v479 authority missing after r240 removal');

const r379ProfileOwner='try{renderProfile=renderProfile379}catch{}';
if(js.includes(r379ProfileOwner))js=js.replace(r379ProfileOwner,"try{window.__ctR379ProfileRetired=true}catch{}");

const navLegacy="const nav=e.target.closest('[data-nav]');if(nav){e.preventDefault();go(pathFor(nav.dataset.nav));return}";
const navSingle="const nav=e.target.closest('[data-nav]');if(nav){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();go(pathFor(nav.dataset.nav));return}";
if(!js.includes(navLegacy))throw new Error('r497 base navigation owner missing');
js=js.replace(navLegacy,navSingle);

const A464="window.__ctR464Marker='discover-foryou-visible-owner-v421';";
const oldState=`const stateSaysForYou=()=>{
 try{const t=String(window.__ctR288R263?.discover263?.tab||'');if(t)return t==='foryou'}catch{}
 const active=qa('[data-ct319-tab].active,[data-ct315-tab].active,[data-ct263-discover-tab].active,[data-discover-tab].active').find(Boolean);
 return active?isForYouControl(active):false;
};`;
const newState=`const stateSaysForYou=()=>{
 try{const t=String(window.__ctR288R263?.discover263?.tab||'');if(t)return t==='foryou'}catch{}
 return qa('[data-ct319-tab].active,[data-ct315-tab].active,[data-ct263-discover-tab].active,[data-discover-tab].active').some(isForYouControl);
};`;
if(!js.includes(oldState))throw new Error('r497 missing r464 stateSaysForYou');
js=js.replace(oldState,newState);
js=ct497ReplaceNamed(js,A464,'activate',`function activate(){
 setForYouState();
 const controls=qa('[data-ct319-tab],[data-ct315-tab],[data-ct263-discover-tab],[data-discover-tab]');
 controls.forEach(b=>{const on=isForYouControl(b);b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false')});
 if(document.documentElement.dataset.ct490ForYouReady==='1'){render();return true}
 if(!q('[data-ct464-foryou]',root464()))renderLoading();void load(false);return true;
}`,'r464');

sw=sw.replaceAll('ct-media-r495','ct-media-r497');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.24',
 revision:'r497-official-0.3.24',
 base:'r495-green-exact-runtime',
 scope:'modern-blue-r495-functional-base+contract-pruning+foryou-active-owner-fix+r240-removed+sports-v479+broken-release-source-removal+full-browser-gate',
 boot:'clean modern boot placeholder; no legacy yellow/gold bootstrap and no r496 early global owner',
 home:'r495 progressive Home preserved byte-for-byte except release identity',
 discover:'r495 v490 owner preserved; active-tab ambiguity fixed at build source so render always owns the selected Pra Você tab',
 profile:'r495 fast profile contract preserved; exactly 12 cards per summary',
 removed_release_sources:['r493','r494','r496'],
 legacy_runtime_policy:'r492 retirement guards preserved exactly because aggressive physical pruning changed movie rendering',
 f1:'preserved',sports:'v479 preserved; broken r240 writer physically removed',history:'daily/undo preserved',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v497.js'),js),
 writeFile(resolve(dist,'app-v497.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v495.js'),{force:true}),rm(resolve(dist,'app-v495.css'),{force:true})]);
console.log('WEB_R497_READY exact-green-r495-runtime');
