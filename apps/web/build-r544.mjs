import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r543.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all(
 ['index.html','app-v543.js','app-v543.css','service-worker.js','release.json','runtime-r544-home.js']
 .map((x,i)=>readFile(resolve(i===5?root:dist,x),'utf8')));
function change(before,after,label){
 const count=js.split(before).length-1;
 if(count!==1)throw Error(label+': expected exactly one anchor, got '+count);
 js=js.replace(before,after);
}
change('if(final&&s.finalDone)return true;if(!final&&s.initialDone)return true;',
 'if(s.initialDone){homeAnchorPending507=false;return true}if(final&&s.finalDone)return true;',
 'Home initial scroll');
change("if(!items.length){stack.innerHTML='<div class=\"empty\">Carregando Watchlist…</div>';return false}",
 "if(!items.length){stack.innerHTML='<div class=\"empty\">Watchlist não carregada. <button type=\"button\" class=\"chip\" data-ct544-retry>Recarregar filmes</button></div>';return false}",
 'Watchlist infinite loading');
const specialReplacement=[
 "const template=document.createElement('template');template.innerHTML=cardHtml(key,p);",
 "const card=template.content.firstElementChild;if(!card)return false;",
 "const events=rows(p?.events).filter(x=>x?.released!==false&&x?.starts_at&&Number.isFinite(Date.parse(x.starts_at)));",
 "const latest=events.sort((a,b)=>Date.parse(b.starts_at)-Date.parse(a.starts_at))[0];",
 "const stamp=latest?.starts_at||p?.series?.last_event_at||p?.series?.last_watched_at||'';",
 "const date=stamp?Date.parse(stamp):NaN;",
 "if(Number.isFinite(date)){",
 " card.dataset.ct544EventAt=stamp;",
 " const sub=card.querySelector('.ct274-sub');",
 " if(sub)sub.textContent+=' · Último evento: '+new Date(date).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});",
 "}",
 "const siblings=Array.from(stack.children).filter(x=>x.matches?.('.media-row,.card'));",
 "const before=Number.isFinite(date)?siblings.find(x=>{",
 " const raw=x.dataset.ct544EventAt||x.dataset.lastWatchedAt||x.dataset.lastAirDate||x.dataset.releaseDate||'';",
 " const other=raw?Date.parse(raw):NaN;",
 " return Number.isFinite(other)&&other<date;",
 "}):null;",
 "if(before)stack.insertBefore(card,before);else stack.appendChild(card);",
 "recount(target);"
].join('\n');
change("stack.insertAdjacentHTML('afterbegin',cardHtml(key,p));recount(target);",specialReplacement,'UFC pinned first');
new Function(runtime);js+='\n'+runtime+'\n';
change("const REVISION='r543-official-0.3.70';","const REVISION='r544-official-0.3.71';",'revision');
html=html.replaceAll('app-v543.js','app-v544.js').replaceAll('app-v543.css','app-v544.css')
 .replaceAll('r543-official-0.3.70','r544-official-0.3.71').replaceAll('v0.3.70','v0.3.71');
sw=sw.replaceAll('r543','r544').replaceAll('app-v543.js','app-v544.js').replaceAll('app-v543.css','app-v544.css');
css+='\n/* r544: web-only Home stability */\n';
const release=JSON.parse(releaseRaw);
Object.assign(release,{version:'0.3.71',revision:'r544-official-0.3.71',
 scope:'Web Home only; Android unchanged',
 home_movies:'Bounded Watchlist loading and manual retry without page reload',
 home_series:'One initial scroll anchor; asynchronous painters cannot jump repeatedly',
 ufc:'No forced-first placement; show latest dated event when data exists'});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v544.js'),js),writeFile(resolve(dist,'app-v544.css'),css),
 writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v543.js'),{force:true}),rm(resolve(dist,'app-v543.css'),{force:true})]);
console.log('WEB_R544_READY');