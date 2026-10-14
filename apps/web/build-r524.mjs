import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r523.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v523.js'),'utf8'),
 readFile(resolve(dist,'app-v523.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r524-home-special.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r524 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r524 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r524 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r524 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function replaceBeforeAnchorNamed(source,anchor,name,replacement,label){
 const at=source.indexOf(anchor);if(at<0)throw new Error('r524 missing '+label+' anchor');
 const prefix=source.slice(0,at),sig='function '+name+'(',start=prefix.lastIndexOf(sig);if(start<0)throw new Error('r524 missing '+label+' '+name);
 const open=source.indexOf('{',start+sig.length);let depth=0,mode='code',quote='',i=open;
 for(;i<source.length;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}
 if(depth!==0)throw new Error('r524 unbalanced '+label+' '+name);
 return source.slice(0,start)+replacement+source.slice(i)
}

const A512="window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';";
js=replaceBeforeAnchorNamed(js,A512,'cardHtml',`function cardHtml(key,p){
 const s=p?.series||{},season=Number(s.season||currentYear()),watched=Math.max(0,Number(s.watched_episodes||0)),total=Math.max(watched,Number(s.total_episodes||s.released_episodes||0)),pending=Math.max(0,Number(s.available_episodes||0)),poster=String(s.poster_url||'');
 const title=key==='f1'?'Fórmula 1':key==='ufc'?'UFC':'WWE Pay-Per-View',unit=key==='f1'?'sessões':'eventos';
 const meta='T'+season+' · '+watched.toLocaleString('pt-BR')+'/'+total.toLocaleString('pt-BR')+' '+unit+' assistidos';
 const sub=pending>0?(pending+' '+(key==='f1'?'sessão':'evento')+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(s.next_episode_title?' · '+s.next_episode_title:'')):('Em dia'+(s.upcoming_episode_title?' · Próximo: '+s.upcoming_episode_title:''));
 return '<div class="media-row ct274-media-card ct512-special-card" data-ct512-special="'+key+'" data-ct512-open="'+key+'" data-ct513-open="'+key+'" role="button" tabindex="0" aria-label="Abrir série '+esc(title)+'"><div class="ct274-row-left"><div class="thumb"'+(poster?' style="background-image:url(&quot;'+esc(poster)+'&quot;)"':'')+'></div><div class="ct274-row-copy"><b>'+esc(title)+'</b><small class="ct274-meta">'+esc(meta)+'</small><small class="ct274-sub">'+esc(sub)+'</small></div></div><span class="badge" aria-hidden="true">›</span></div>'
}`,'special card');

const A522="window.__ctR522SpecialOpenMarker='pointerup-owner-f1-ufc-wwe';";
js=replaceBeforeAnchorNamed(js,A522,'openType',`function openType(type){
 if(!type)return false;
 const now=performance.now();if(last.type===type&&now-last.at<500)return true;last={type,at:now};
 const screen=window.__ctR513SeriesScreen;if(typeof screen?.open!=='function'){document.documentElement.dataset.ct524SpecialOpenError='SCREEN_UNAVAILABLE:'+type;return false}
 document.documentElement.dataset.ct524SpecialOpening=type;
 opening=Promise.resolve(screen.open(type,new Date().getFullYear())).then(ok=>{if(ok!==false)document.documentElement.dataset.ct524SpecialOpened=type;else document.documentElement.dataset.ct524SpecialOpenError='OPEN_FALSE:'+type;return ok}).catch(e=>{document.documentElement.dataset.ct524SpecialOpenError=type+':'+String(e?.message||e);return false}).finally(()=>{opening=null});
 return true
}`,'special opener');
js=replaceBeforeAnchorNamed(js,A522,'intercept',`function intercept(e){const card=e.target?.closest?.('[data-ct512-special]');if(!card)return;const type=typeOf(card);if(!type)return;stop(e);openType(type)}`,'special opener');

new Function(runtime);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r524-official-0.3.51';").replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.51 • ${REVISION}');
html=html.replaceAll('app-v523.js','app-v524.js').replaceAll('app-v523.css','app-v524.css').replaceAll('r523-official-0.3.50','r524-official-0.3.51').replaceAll('v0.3.50','v0.3.51');
css+='\n/* r524 — Home controls locked on one row; functionality remains with r523/r388. */\n'
 +'html body [data-page="home"] .search-global{position:sticky!important;top:8px!important;z-index:180!important;margin-left:calc(var(--ct524-tabs-width,112px) + 12px)!important;width:calc(100% - var(--ct524-tabs-width,112px) - 12px)!important;max-width:none!important;box-sizing:border-box!important;background:rgba(3,10,15,.97)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important;box-shadow:0 8px 20px rgba(0,0,0,.24)!important}\n'
 +'html body [data-page="home"] .search-global input{min-width:0!important;width:100%!important}\n'
 +'html body [data-home]>.home-tabs,html body [data-home] .home-tabs{position:fixed!important;top:8px!important;left:var(--ct524-home-left,var(--ct505-tabs-left,164px))!important;z-index:185!important;margin:0!important;display:flex!important;gap:6px!important;width:auto!important;max-width:var(--ct524-tabs-width,112px)!important;background:rgba(3,10,15,.97)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}\n'
 +'html body [data-home] .home-tabs [data-home-tab]{pointer-events:auto!important;touch-action:manipulation!important;user-select:none!important}\n'
 +'html body [data-page="home"] [data-global-results],html body [data-page="home"] .global-results{z-index:190!important}\n'
 +'@media(max-width:700px){html body [data-page="home"] .search-global{top:6px!important;margin-left:calc(var(--ct524-tabs-width,112px) + 8px)!important;width:calc(100% - var(--ct524-tabs-width,112px) - 8px)!important}html body [data-home]>.home-tabs,html body [data-home] .home-tabs{top:6px!important;left:var(--ct524-home-left,11px)!important;max-width:var(--ct524-tabs-width,112px)!important}}\n';
sw=sw.replaceAll('r523','r524').replaceAll('app-v523.js','app-v524.js').replaceAll('app-v523.css','app-v524.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.51',revision:'r524-official-0.3.51',base:'r523+r524-home-special-only',
 scope:'special-season-total+direct-open+same-row-sticky-home-controls',
 home:'r523 hidden-history anchor and r514 movie rail preserved; only Search + Series/Movies geometry is restored to one sticky/fixed top row',
 special_series:'Home cards show watched/total-season (F1 sessions; UFC/WWE events), preserve recent-pending bucket logic, and open directly through r520 series screen without route gate',
 discover:'r523 ForYou/Top10 preserved unchanged',profile:'unchanged',sports:'unchanged',raw_smackdown:'unchanged',android:'unchanged-1.0.20/10062'
});
await Promise.all([
 writeFile(resolve(dist,'app-v524.js'),js),writeFile(resolve(dist,'app-v524.css'),css),writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v523.js'),{force:true}),rm(resolve(dist,'app-v523.css'),{force:true})]);
for(const need of [
 "window.__ctR524Marker='home-toolbar-same-row+special-total-season+direct-special-open'",
 "window.__ctR523Marker='home-r509-hidden+movies-r514-rail+foryou-v517-audit+top10-strict-retry'",
 "window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner'",
 "data-ct512-open",
 "total=Math.max(watched,Number(s.total_episodes||s.released_episodes||0))",
 "screen.open(type,new Date().getFullYear())",
 'r524-official-0.3.51'
])if(!js.includes(need))throw new Error('r524 missing '+need);
new Function(js);
console.log('WEB_R524_READY scoped Home special fix');
