import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r464.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,discover,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v464.js'),'utf8'),
 readFile(resolve(dist,'app-v464.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r464-discover-foryou.js'),'utf8'),
 readFile(resolve(root,'runtime-r471-closure-authority.js'),'utf8')
]);

const once=(source,needle,replacement,label)=>{
 const count=source.split(needle).length-1;
 if(count!==1)throw new Error('r471 expected one '+label+', found '+count);
 return source.replace(needle,replacement);
};

const r464Start=js.lastIndexOf('/* CineTracker Web 1.0.254 r464');
if(r464Start<0)throw new Error('r471 could not locate appended r464 runtime');
const r464Suffix=js.slice(r464Start);
if(!r464Suffix.includes("window.__ctR464Marker='discover-foryou-visible-owner-v421'"))throw new Error('r471 invalid r464 suffix');
js=js.slice(0,r464Start).trimEnd()+'\n';

const coreBridge=`window.__ctCoreR471=Object.freeze({
 route:()=>route(),
 authReady:()=>!!session?.access_token,
 rpc:(name,args={})=>rpc(name,args),
 tz:()=>tz(),
 image:(path,size='w342')=>img(path,size),
 profileData:()=>profileCache||{},
 profileRows:()=>profileRows(profileCache||{}),
 mediaCard:item=>mediaCard(item),
 setActivityOpen:fn=>{if(typeof fn!=='function')return false;try{ct171OpenActivityDay=fn;return true}catch{return false}},
 toast:message=>{try{if(typeof toast==='function')toast(message)}catch{}}
});`;
js=once(js,'boot();',coreBridge+'\nboot();','core closure bridge');

const r399Settle="if(isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}";
js=once(js,r399Settle,"if(false&&isForYou()&&(q('[data-ct319-content]')||q('[data-ct315-content]')||q('[data-ct263-discover-content]'))){const sig='discover:foryou';if(!force&&sig===lastRouteSig&&q('[data-ct399-foryou]'))return true;lastRouteSig=sig;return enterForYou399()}",'r399 automatic For You owner');

const r399Click="const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}";
js=once(js,r399Click,"const fy=t.closest('[data-ct319-tab=\"foryou\"]');if(false&&fy&&routeNow()==='discover'){e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();lastRouteSig='';enterForYou399();return}",'r399 For You click owner');

const r399Refresh="if(isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}";
js=once(js,r399Refresh,"if(false&&isForYou()){fyRun++;fyTask=null;setTimeout(()=>void loadForYou399(true),80)}",'r399 For You data refresh');

discover=once(
 discover,
 "const routeNow=()=>{try{if(typeof window.__ctR469Route==='function')return String(window.__ctR469Route()||'');return String(typeof route==='function'?route():'')}catch{return''}};",
 "const routeNow=()=>{try{return String(window.__ctCoreR471?.route?.()||'')}catch{return''}};",
 'r464 route bridge'
);
discover=once(
 discover,
 "const rpcCall=(name,args)=>{try{if(typeof window.__ctR469Rpc==='function')return Promise.resolve(window.__ctR469Rpc(name,args));if(typeof rpc==='function')return Promise.resolve(rpc(name,args))}catch(e){return Promise.reject(e)}return Promise.reject(new Error('rpc unavailable'))};",
 "const rpcCall=(name,args)=>{try{if(!window.__ctCoreR471?.authReady?.())return Promise.reject(new Error('auth-not-ready'));return Promise.resolve(window.__ctCoreR471.rpc(name,args))}catch(e){return Promise.reject(e)}};",
 'r464 rpc bridge'
);
discover=once(
 discover,
 "try{if(typeof ct288Card==='function'){const h=ct288Card(x,{watch:false,add:false,slot:true});if(typeof h==='string'&&h.trim())return h}}catch{}",
 "try{const h=window.__ctCoreR471?.mediaCard?.(x);if(typeof h==='string'&&h.trim())return h}catch{}",
 'r464 card bridge'
);
discover=once(
 discover,
 "const p=posterOf(x),src=p?(p.startsWith('http')?p:(typeof img==='function'?img(p,'w342'):p)):'';",
 "const p=posterOf(x),src=p?(p.startsWith('http')?p:(window.__ctCoreR471?.image?.(p,'w342')||p)):'';",
 'r464 image bridge'
);

new Function(discover);
new Function(runtime);
for(const bad of ['window.location.reload(','router.refresh(','while(true)','new MutationObserver','setInterval(']){
 if(runtime.includes(bad)||discover.includes(bad))throw new Error('r471 forbidden '+bad);
}

js+='\n'+discover+'\n'+runtime+'\n';

html=html.replace(/<script data-ct461-preboot>[\s\S]*?<\/script>/g,'');
html=html.replaceAll('app-v464.js','app-v471.js').replaceAll('app-v464.css','app-v471.css').replaceAll('v1.0.254','v1.0.261').replaceAll('r464-official-1.0.254','r471-official-1.0.261');
css=css.replace(/html\[data-ct461-series-gate="1"\]\s*\[data-home-view="series"\]\{visibility:hidden!important\}\s*/g,'');
css+='\n/* CineTracker Web 1.0.261 r471 — closure authority recovery, Profile 13+more, daily history undo. */\n';
sw=sw.replaceAll('app-v464.js','app-v471.js').replaceAll('app-v464.css','app-v471.css').replaceAll('ct-web-1.0.254-r464','ct-web-1.0.261-r471');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'1.0.261',
 revision:'r471-official-1.0.261',
 base:'r464+r471-closure-authority',
 scope:'home-series+home-movies-watchlist+discover-foryou+profile-five-lists+daily-history',
 runtime_authority:'narrow core bridge inside the original application closure; no global rpc/route/session replacement',
 home_series:'r461 broken visibility gate removed; in-closure r399 owns Home and loads cinetracker_home_series_v452',
 home_movies:'in-closure r399 owns the Filmes tab and paginates cinetracker_home_movies_v405',
 discover_foryou:'r464 reattached to the closure core for route/auth/rpc/card helpers; r399/r449/r461 visible re-entry disabled',
 profile_lists:'full dashboard + actors v465; exactly 13 cards plus one 14th Ver mais when total exceeds 13',
 history:'daily graph callback rebound inside the original closure to v426 detail RPC; compact same-row optimistic undo with rollback',
 f1:'r462 preserved',
 android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v471.js'),js),
 writeFile(resolve(dist,'app-v471.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([
 rm(resolve(dist,'app-v464.js'),{force:true}),
 rm(resolve(dist,'app-v464.css'),{force:true})
]);

for(const need of [
 'window.__ctCoreR471=Object.freeze',
 "window.__ctR471Marker='closure-core+home-r399-visible+discover-r464-core+profile-dashboard-13+history-v426'",
 "window.__ctR464Marker='discover-foryou-visible-owner-v421'",
 'cinetracker_home_series_v452',
 'cinetracker_home_movies_v405',
 'cinetracker_discover_watch_unseen_v421',
 'cinetracker_discover_fresh_v421',
 'cinetracker_profile_media_dashboard_v0991',
 'cinetracker_profile_actors_v465',
 'const PROFILE_LIMIT=13',
 'cinetracker_activity_items_by_day_v426',
 'cinetracker_unmark_history_item_v426',
 'cinetracker_unmark_sport_history_v426'
])if(!js.includes(need))throw new Error('r471 missing '+need);

if(html.includes('data-ct461-preboot'))throw new Error('r471 retained broken r461 preboot gate');
if(css.includes('data-ct461-series-gate'))throw new Error('r471 retained broken r461 visibility gate');
for(const retired of [
 "window.__ctR468Marker='canonical-ctSession-sbRpc-route-bridge'",
 "window.__ctR469Marker='direct-ctSession-sbRpc-owner-hooks+profile-dedupe'",
 'window.rpc=rpc468','window.rpc=rpc469'
])if(js.includes(retired))throw new Error('r471 retained retired bridge '+retired);

console.log('WEB_R471_READY closure authority + Home/PraVoce/Profile/history restored');
