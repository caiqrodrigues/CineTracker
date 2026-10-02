import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r464.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,...runtimeParts]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v464.js'),'utf8'),readFile(resolve(dist,'app-v464.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),
 ...Array.from({length:7},(_,i)=>readFile(resolve(root,`runtime-r465-part${i+1}.inc`),'utf8'))
]);
let runtime=runtimeParts.join('');
const once=(from,to,label,required=true)=>{if(!js.includes(from)){if(required)throw new Error('r466 missing '+label);return 0}js=js.replace(from,to);return 1};
const all=(from,to,label,required=true)=>{if(!js.includes(from)){if(required)throw new Error('r466 missing '+label);return 0}js=js.replaceAll(from,to);return 1};

// Home: retire the old capture owner that can swallow the real tab click before auth is ready.
once(
 "const home=t.closest('[data-home-tab],.home-tabs button');if(home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}",
 "const home=t.closest('[data-home-tab],.home-tabs button');if(false&&home&&routeNow()==='home'){const k=homeKind461(home);if(k){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();k==='movies'?enterMovies461():enterSeries461();return}}",
 'r461 home click owner'
);
once(
 "const hb=t.closest('[data-home-tab]');if(hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{}lastRouteSig='';setTimeout(()=>settleRoute399(true),0);return}",
 "const hb=t.closest('[data-home-tab]');if(false&&hb&&routeNow()==='home'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();const kind=String(hb.dataset.homeTab||'series')==='movies'?'movies':'series';try{window.__ctR371?.applyTab?.(kind)}catch{}lastRouteSig='';setTimeout(()=>settleRoute399(true),0);return}",
 'r399 home click owner',
 false
);

// Pra Você: r466 owns the visible host. Older capture/timer/data owners cannot repaint over it.
once(
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 "const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",
 'r399 foryou click owner',false
);
once(
 "if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 "if(false&&isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",
 'r399 foryou route settle',false
);
once(
 "if(isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 "if(false&&isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",
 'r399 foryou data owner',false
);
once(
 "if(n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);",
 "if(false&&n==='discover')setTimeout(()=>{if(fyActive461())enterFY461()},0);",
 'r461 discover nav owner',false
);
once(
 "if(routeNow()==='discover'&&isForYouControl(t)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();activate()}",
 "if(false&&routeNow()==='discover'&&isForYouControl(t)){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();activate()}",
 'r464 foryou click owner'
);
once(
 "for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>{if(routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},{capture:true,passive:true});",
 "for(const ev of ['pointerdown','touchstart'])window.addEventListener(ev,e=>{if(false&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},{capture:true,passive:true});",
 'r464 foryou pointer owner'
);
once(
 "window.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},true);",
 "window.addEventListener('keydown',e=>{if(false&&(e.key==='Enter'||e.key===' ')&&routeNow()==='discover'&&isForYouControl(e.target))setTimeout(()=>activate(),0)},true);",
 'r464 foryou key owner'
);
once(
 "window.addEventListener('popstate',()=>setTimeout(()=>{if(isForYou())activate()},0));",
 "window.addEventListener('popstate',()=>setTimeout(()=>{if(false&&isForYou())activate()},0));",
 'r464 foryou popstate owner'
);
once(
 "window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(isForYou())void load(true)},0));",
 "window.addEventListener('cinetracker:data-changed',()=>setTimeout(()=>{if(false&&isForYou())void load(true)},0));",
 'r464 foryou data owner'
);
once(
 "for(const ms of [0,250,800,1800])setTimeout(()=>{if(isForYou())activate()},ms);",
 "for(const ms of [0,250,800,1800])setTimeout(()=>{if(false&&isForYou())activate()},ms);",
 'r464 foryou auto owner'
);

// Histórico: media_id is UUID in production. Never coerce it with Number().
if(!runtime.includes("id=num(x?.media_id)"))throw new Error('r466 missing history media id source');
runtime=runtime.replace("id=num(x?.media_id)","id=String(x?.media_id||'')");
if(!runtime.includes("const mediaId=num(btn.dataset.mediaId),itemType=kind;"))throw new Error('r466 missing history undo media id');
runtime=runtime.replace("const mediaId=num(btn.dataset.mediaId),itemType=kind;","const mediaId=String(btn.dataset.mediaId||'').trim(),itemType=kind;");

js+='\n'+runtime+"\nwindow.__ctR466Marker='r465-recovery-build-fixed+uuid-history-undo';\nwindow.__ctR466={version:'1.0.256',delegate:window.__ctR465};\n";
html=html.replaceAll('app-v464.js','app-v466.js').replaceAll('app-v464.css','app-v466.css').replaceAll('v1.0.254','v1.0.256').replaceAll('r464-official-1.0.254','r466-official-1.0.256');
sw=sw.replaceAll('app-v464.js','app-v466.js').replaceAll('app-v464.css','app-v466.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.256-r466');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'1.0.256',revision:'r466-official-1.0.256',base:'r464+r465-runtime-build-repair+uuid-history-undo',
 scope:'home-series+home-movies+discover-foryou+profile-lists+daily-history-undo',
 home_series:'authenticated finite owner from r465 runtime; initial and return loads cannot be swallowed by r461 tab capture',
 home_movies:'authenticated v405 paged Watchlist owner from r465 runtime',
 discover_foryou:'visible-host v421 owner from r465 runtime; legacy r399/r461/r464 re-entry is neutralized and all populated slots expose active actions including Trocar',
 profile:'13-card summary plus 14th Ver mais; actors use cinetracker_profile_actors_v465',
 history:'minimal per-row undo; UUID media_id is preserved as text instead of being coerced through Number()',
 f1:'unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v466.js'),js),writeFile(resolve(dist,'app-v466.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v464.js'),{force:true}),rm(resolve(dist,'app-v464.css'),{force:true})]);
for(const need of [
 "window.__ctR466Marker='r465-recovery-build-fixed+uuid-history-undo'",'cinetracker_home_movies_v405','cinetracker_home_series_v452',
 'cinetracker_discover_watch_unseen_v421','cinetracker_discover_fresh_v421','cinetracker_profile_actors_v465',
 'cinetracker_unmark_history_item_v426','cinetracker_unmark_sport_history_v426','data-ct465-fy-action="swap"','data-ct465-undo="1"',
 "const mediaId=String(btn.dataset.mediaId||'').trim(),itemType=kind;"
])if(!js.includes(need))throw new Error('r466 missing '+need);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval('])if(runtime.includes(bad))throw new Error('r466 forbidden '+bad);
console.log('WEB_R466_READY');
