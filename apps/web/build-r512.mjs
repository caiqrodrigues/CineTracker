import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r511.mjs');
const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),readFile(resolve(dist,'app-v511.js'),'utf8'),readFile(resolve(dist,'app-v511.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),readFile(resolve(dist,'release.json'),'utf8'),readFile(resolve(root,'runtime-r512-special-series.js'),'utf8')
]);
function bounds(source,anchor,label){const at=source.indexOf(anchor);if(at<0)throw new Error('r512 missing '+label+' anchor');const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);if(start<0||close<0)throw new Error('r512 invalid '+label+' bounds');return{start,end:close+6}}
function replaceNamed(source,anchor,name,replacement,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r512 missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}if(depth!==0)throw new Error('r512 unbalanced '+label+' '+name);return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end)}
function transformNamed(source,anchor,name,fn,label){const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);if(!m)throw new Error('r512 transform missing '+label+' '+name);const open=region.indexOf('{',m.index+m[0].length);let depth=0,mode='code',quote='',i=open;for(;i<region.length;i++){const c=region[i],n=region[i+1];if(mode==='line'){if(c==='\n')mode='code';continue}if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}if(c==='/'&&n==='/'){mode='line';i++;continue}if(c==='/'&&n==='*'){mode='block';i++;continue}if(c==="'"||c==='"'){mode='string';quote=c;continue}if(c.charCodeAt(0)===96){mode='template';continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0){i++;break}}}const old=region.slice(m.index,i),next=fn(old);return source.slice(0,b.start)+region.slice(0,m.index)+next+region.slice(i)+source.slice(b.end)}
function disableRuntime(marker,label){const at=js.indexOf(marker);if(at<0)throw new Error('r512 missing '+label+' marker');const start=js.lastIndexOf('(()=>{',at);if(start<0)throw new Error('r512 missing '+label+' IIFE');if(js.slice(start,start+18).includes('return;'))return;js=js.slice(0,start)+'(()=>{return;'+js.slice(start+6)}

disableRuntime("window.__ctR510Marker='ufc-special-series+sports-single-source+fight-night-ppv+optimistic-watch'",'r510 UFC owner');
disableRuntime("window.__ctR511Marker='f1-special-series+current-season+canonical-r462-three-way-sync+no-duplicate-row'",'r511 F1 owner');

const bridgeNeedle="rpc:(name,args={})=>rpc(name,args),\n tz:()=>tz(),";
if(!js.includes(bridgeNeedle))throw new Error('r512 core bridge rpc anchor missing');
js=js.replace(bridgeNeedle,"rpc:(name,args={})=>rpc(name,args),\n tmdb:(path,args={})=>tmdb(path,args),\n edge:async(slug,body={})=>{const r=await fetch(SUPABASE_URL+'/functions/v1/'+String(slug||''),{method:'POST',headers:{...authHeaders(),'content-type':'application/json'},body:JSON.stringify(body||{})});if(!r.ok)throw new Error('EDGE_'+String(slug)+'_'+r.status);return r.json()},\n tz:()=>tz(),");

const A388="window.__ctR388Marker='r393-hidden-history-anchor+lightweight-movies+foryou-db-first-bounded';";
js=replaceNamed(js,A388,'movieRow',`function movieRow(x){
 const y={...x,media_type:'movie',release_date:x?.release_date||x?.raw_tmdb?.release_date||null,runtime_minutes:Number(x?.runtime_minutes||x?.raw_tmdb?.runtime||0)||0,genres:rows(x?.genres).length?x.genres:rows(x?.raw_tmdb?.genres),vote_average:Number(x?.vote_average??x?.raw_tmdb?.vote_average??0)||0};
 try{return ct274Row(y,{meta:ct274MovieMeta(y),action:ct274MovieWatchAction(y),attrs:ct274MovieAttrs(y)})}catch{return '<div class="media-row"><b>'+esc(titleOf(y))+'</b></div>'}
}`,'r388');
js=replaceNamed(js,A388,'renderMoviesAll',`function renderMoviesAll(addRows=null){
 const sec=q('[data-ct388-movie-watch]'),stack=q('.ct388-movie-stack',sec);if(!sec||!stack)return false;
 stack.className='stack ct388-movie-stack ct512-movie-list';stack.style.display='flex';stack.style.flexDirection='column';stack.style.removeProperty('overflow-x');stack.style.removeProperty('grid-template-columns');
 const append=Array.isArray(addRows),list=append?addRows:hMovies;if(!append){stack.replaceChildren();movieNodes=new Map()}
 const frag=document.createDocumentFragment();
 for(const x of rows(list)){
  const id=mediaId(x);if(!id||movieNodes.has(id))continue;
  const t=document.createElement('template');t.innerHTML=movieRow(x).trim();const node=t.content.firstElementChild;if(!node)continue;
  node.classList.add('ct512-movie-watch-row');node.dataset.ct388MovieId=String(id);movieNodes.set(id,node);frag.appendChild(node)
 }
 if(frag.childNodes.length)stack.appendChild(frag);
 const ranks=new Map();sortedMovies().forEach((x,i)=>ranks.set(mediaId(x),i));for(const[id,node]of movieNodes)node.style.order=String(ranks.get(id)??999999);
 const total=Math.max(hMovies.length,Number(sec.dataset.ct492Total||0)),count=q('[data-ct388-movie-count]',sec);if(count)count.textContent=(hMovies.length<total?hMovies.length.toLocaleString('pt-BR')+' de ':'')+total.toLocaleString('pt-BR');
 let more=q('[data-ct492-movies-more]',sec);
 if(hMovies.length<total){
  if(!more){const wrap=document.createElement('div');wrap.className='ct492-more-wrap';wrap.innerHTML='<button type="button" class="chip ct492-more" data-ct492-movies-more>Carregar mais filmes</button>';stack.insertAdjacentElement('afterend',wrap);more=q('[data-ct492-movies-more]',sec)}
  if(more){more.disabled=false;more.textContent='Carregar mais filmes · '+hMovies.length.toLocaleString('pt-BR')+' de '+total.toLocaleString('pt-BR')}
 }else more?.closest?.('.ct492-more-wrap')?.remove();
 homeForceOrder500('movies');sec.dataset.ct388Rendered=String(movieNodes.size);document.documentElement.dataset.ct388Movies=String(movieNodes.size);document.documentElement.dataset.ct512Movies='standard-rows';
 if(activeKind()==='movies')requestAnimationFrame(()=>homeMarkMain507('movies'));return true
}`,'r388');
js=transformNamed(js,A388,'renderSeries',old=>{
 const idx=old.lastIndexOf('return true');if(idx<0)throw new Error('r512 renderSeries final return missing');
 return old.slice(0,idx)+"queueMicrotask(()=>window.__ctR512Special?.mountAll?.());"+old.slice(idx)
},'r388');

new Function(runtime);js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r512-official-0.3.39';");
js=js.replace(/CineTracker • v[^•<]+ • \$\{REVISION\}/g,'CineTracker • v0.3.39 • ${REVISION}');
html=html.replaceAll('app-v511.js?ct=r511-official-0.3.38','app-v512.js?ct=r512-official-0.3.39').replaceAll('app-v511.css?ct=r511-official-0.3.38','app-v512.css?ct=r512-official-0.3.39').replaceAll('r511-official-0.3.38','r512-official-0.3.39');
css+='\n/* CineTracker Web 0.3.39 r512 — standard movie rows + unified historical UFC/F1. */\n'+
'html body [data-home-view="movies"] .ct388-movie-stack.ct512-movie-list{display:flex!important;flex-direction:column!important;grid-template-columns:none!important;grid-auto-flow:unset!important;gap:8px!important;width:100%!important;overflow:visible!important;padding:0!important}\n'+
'html body [data-home-view="movies"] .ct512-movie-watch-row{display:grid!important;width:100%!important;min-width:0!important;max-width:none!important;height:auto!important;min-height:0!important;aspect-ratio:auto!important;margin:0!important}\n'+
'html body [data-home-view="movies"] .ct512-movie-watch-row .thumb{width:48px!important;height:64px!important;min-width:48px!important;aspect-ratio:3/4!important;background-size:cover!important}\n'+
'html body [data-home-view="movies"] .ct512-movie-watch-row .poster{width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;aspect-ratio:auto!important}\n';
sw=sw.replaceAll('ct-media-r511','ct-media-r512').replaceAll('app-v511.js','app-v512.js').replaceAll('app-v511.css','app-v512.css');
const release=JSON.parse(releaseRaw);Object.assign(release,{
 version:'0.3.39',revision:'r512-official-0.3.39',base:'r511+r512-special-history',
 scope:'home-movies-standard-rows+ufc-history-1993+f1-history-1950+stable-special-owner',
 home_movies:'Watchlist returns to the canonical vertical media-row pattern; v405 paging, sorting, hidden History and actions are preserved',
 ufc:'single r512 owner; seasons 1993-current, legacy UFC movies recognized as watched series events, current Fight Nights/PPVs stay sports-synchronized',
 f1:'single r512 owner; seasons 1950-current; mapped seasons keep canonical r462 three-way sync and unmapped historical seasons load races from Jolpica on demand',
 special_series:'old r510/r511 owners are inert; r512 remounts UFC/F1 idempotently after every Series repaint/tab return without observers or intervals',
 discover:'unchanged',profile:'unchanged',sports:'generic route unchanged',android:'unchanged-1.0.20/10062'
});
new Function(js);
await Promise.all([writeFile(resolve(dist,'app-v512.js'),js),writeFile(resolve(dist,'app-v512.css'),css),writeFile(resolve(dist,'index.html'),html),writeFile(resolve(dist,'service-worker.js'),sw),writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))]);
await Promise.all([rm(resolve(dist,'app-v511.js'),{force:true}),rm(resolve(dist,'app-v511.css'),{force:true})]);
for(const need of [
 "window.__ctR512Marker='historical-f1-1950+ufc-1993+single-special-owner+stable-remount+movies-standard-rows'",
 'cinetracker_f1_series_v512','cinetracker_f1_historical_watch_v512','cinetracker_ufc_series_v512','cinetracker_ufc_tmdb_status_v512','cinetracker_ufc_watch_v512',
 "className='stack ct388-movie-stack ct512-movie-list'","node.classList.add('ct512-movie-watch-row')",'r512-official-0.3.39'
])if(!js.includes(need))throw new Error('r512 missing '+need);
console.log('WEB_R512_READY historical UFC/F1 + standard movie rows');
