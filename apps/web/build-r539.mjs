import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r538.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,summaryRuntime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v538.js'),'utf8'),readFile(resolve(dist,'app-v538.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r539-summary.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r539 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r539 invalid '+label+' bounds');return{start,end:close+6}}
function replaceRuntime(source,anchor,replacement,label){const b=bounds(source,anchor,label);return source.slice(0,b.start)+replacement.trim()+source.slice(b.end)}
function replaceScoped(source,startAnchor,endAnchor,name,replacement,label){
 const start=source.indexOf(startAnchor);if(start<0)throw new Error('r539 missing '+label+' start');const end=source.indexOf(endAnchor,start);if(end<0)throw new Error('r539 missing '+label+' end');
 const region=source.slice(start,end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r539 missing '+label+' '+name);
 const fnStart=start+m.index,open=source.indexOf('{',fnStart+m[0].length);let depth=0,mode='code',quote='',i=open;
 for(;i<end;i++){const c=source[i],n=source[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}
 if(depth!==0)throw new Error('r539 unbalanced '+label+' '+name);return source.slice(0,fnStart)+replacement+source.slice(i)
}
js=replaceRuntime(js,"window.__ctR538SummaryMarker='stable-counts-v538+public-growth'",summaryRuntime,'r538 summary');
const S520='/* CineTracker Web 0.3.47 r520 — F1 + UFC + WWE Pay-Per-View single Home owner. */',E520="window.__ctR512Marker='r520-f1+ufc+wwe-complete-catalog-single-owner';";
js=replaceScoped(js,S520,E520,'cardHtml',"function cardHtml(key,p){\n const s=p?.series||{},g=window.__ctR516SpecialSummary?.get?.(key)||null,season=Number(s.season||currentYear()),pending=Math.max(0,Number(s.available_episodes||0)),poster=String(s.poster_url||'');\n const title=key==='f1'?'Fórmula 1':key==='ufc'?'UFC':'WWE Pay-Per-View',unit=key==='f1'?'GPs':'eventos',pendingUnit=key==='f1'?'GP':'evento';\n const globalWatched=Math.max(0,Number(g?.watched||0)),globalTotal=Math.max(globalWatched,Number(g?.total||0));\n const meta=globalTotal>0?(globalWatched.toLocaleString('pt-BR')+'/'+globalTotal.toLocaleString('pt-BR')+' '+unit+' assistidos'):'Contagem histórica carregando…';\n const sub=pending>0?(pending+' '+pendingUnit+(pending===1?'':'s')+' recente'+(pending===1?'':'s')+' pendente'+(pending===1?'':'s')+(s.next_episode_title?' · '+s.next_episode_title:'')):('Em dia'+(s.upcoming_episode_title?' · Próximo: '+s.upcoming_episode_title:''));\n return '<div class=\"media-row ct274-media-card ct512-special-card\" data-ct512-special=\"'+key+'\" data-ct513-open=\"'+key+'\" role=\"button\" tabindex=\"0\" aria-label=\"Abrir série '+esc(title)+'\"><div class=\"ct274-row-left\"><div class=\"thumb\"'+(poster?' style=\"background-image:url(&quot;'+esc(poster)+'&quot;)\"':'')+'></div><div class=\"ct274-row-copy\"><b>'+esc(title)+'</b><small class=\"ct274-meta\">'+esc(meta)+'</small><small class=\"ct274-sub\">'+esc(sub)+'</small></div></div><span class=\"badge\" aria-hidden=\"true\">›</span></div>'\n}",'r520 special Home card');
js+='\n;window.__ctR539Marker=\'special-home-all-time-counts+matching-units+no-season-denominator\';\n';
new Function(summaryRuntime);new Function(js);
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r539-official-0.3.66';");
html=html.replaceAll('app-v538.js','app-v539.js').replaceAll('app-v538.css','app-v539.css').replaceAll('v0.3.65','v0.3.66').replaceAll('r538-official-0.3.65','r539-official-0.3.66');
sw=sw.replaceAll('r538','r539').replaceAll('app-v538.js','app-v539.js').replaceAll('app-v538.css','app-v539.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{version:'0.3.66',revision:'r539-official-0.3.66',base:'r538+r539-special-home-global-progress',scope:'special-series-home-counts-only',special_counts:'Home uses all-time progress with matching units: F1 watched races / all-time GPs, UFC watched events / all-time events, WWE watched PPV/PLE / all-time supercards',special_current:'validated current profile: F1 18/1166 GPs; UFC 18/793 events; WWE 50/567 events',preserved:'current-season bucket/pending logic, annual season screens, writers, Home layout/history/movies, Discover, Profile, Sports, Raw/SmackDown and Android unchanged'});
await Promise.all([writeFile(resolve(dist,'app-v539.js'),js),writeFile(resolve(dist,'app-v539.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v538.js'),{force:true}),rm(resolve(dist,'app-v538.css'),{force:true})]);
for(const need of ["window.__ctR539SummaryMarker='db-first-global-progress+f1-race-only+ufc-wwe-events'","window.__ctR539Marker='special-home-all-time-counts+matching-units+no-season-denominator'",'cinetracker_special_series_counts_v539',"globalTotal.toLocaleString('pt-BR')",'r539-official-0.3.66'])if(!js.includes(need))throw new Error('r539 missing '+need);
if(js.includes("window.__ctR538SummaryMarker='stable-counts-v538+public-growth'"))throw new Error('r539 old r538 summary survived');
console.log('WEB_R539_READY all-time special counts');
