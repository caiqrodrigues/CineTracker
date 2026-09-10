import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
let patch=(await readFile(resolve(process.cwd(),'apps/web/runtime-r240-user-video-semantics.js'),'utf8')).replaceAll('</script>','<\\/script>');
const dir='/tmp/ct-r240-semantics',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const html=`<!doctype html><html><body><div id="app">
<div data-home><section id="history"><div>↑ Histórico acima</div><div>Último assistido</div></section><section id="follow"><div class="panel-head"><h3>Assistir a seguir</h3></div><article data-media="tv:3">Raw S01E02</article></section></div>
<div data-page="discover" data-discover><div data-discover-content><section class="panel" id="stable"><article class="card" data-media="movie:777">Conteúdo anterior</article></section></div></div>
<div data-sports><input id="sportsSearch" data-sports-search type="search" value=""><div class="event-grid"></div></div>
</div><script>
let discoverState={tab:'top'};
function mediaType(x){return x.media_type==='movie'?'movie':'tv'}
async function exclusionContext158(){return {dash:[
 {id:10,media_type:'movie',title:'Duna',is_seen:true},
 {id:20,media_type:'tv',name:'Reacher',is_in_progress:true},
 {id:30,media_type:'movie',title:'Spider Man',is_watchlist:true},
 {id:40,media_type:'movie',title:'Permitido'}
 ],movieIds:new Set([10,30]),tvIds:new Set([20]),aliases:new Set(['movie:duna','tv:reacher','movie:spider man'])}}
async function discoverRows(){return {movies:[{id:10,media_type:'movie',title:'Duna'},{id:30,media_type:'movie',title:'Spider Man'},{id:40,media_type:'movie',title:'Permitido'}],series:[{id:20,media_type:'tv',name:'Reacher'},{id:50,media_type:'tv',name:'Nova Serie'}]}}
function paintDiscover(rows){const h=document.querySelector('[data-discover-content]');h.innerHTML='<section class="panel"><article class="card">'+((rows?.movies||[])[0]?.title||'novo')+'</article></section>'}
async function renderDiscover(){const h=document.querySelector('[data-discover-content]');h.innerHTML='<div class="loader">Carregando títulos...</div>';await new Promise(r=>setTimeout(r,80));paintDiscover({movies:[{title:'Resultado'}]})}
function paintHome(){}
function paintSports(){const root=document.querySelector('[data-sports]'),old=root.querySelector('[data-sports-search]');root.innerHTML='<input data-sports-search type="search" value=""><div class="event-grid"></div>'}
async function renderSports(){paintSports()}
</script><script>${patch}</script><script>
(async()=>{try{
 window.__ctR240HomeApply();document.body.dataset.homeHistoryHidden=String(document.querySelector('#history').hidden);document.body.dataset.homeMode=document.querySelector('[data-home]').dataset.ct240Home||'';
 const clean=await discoverRows('top');document.body.dataset.discoverMovies=clean.movies.map(x=>x.title).join('|');document.body.dataset.discoverSeries=clean.series.map(x=>x.name).join('|');
 window.__ctR240RestoreDiscover();const pending=renderDiscover();document.body.dataset.atomicImmediate=String(!document.querySelector('[data-discover-content]').textContent.includes('Carregando'));await pending;
 let input=document.querySelector('[data-sports-search]');input.focus();for(const ch of 'formula'){input=document.querySelector('[data-sports-search]');input.value+=ch;input.setSelectionRange(input.value.length,input.value.length);input.dispatchEvent(new Event('input',{bubbles:true}));paintSports()}
 input=document.querySelector('[data-sports-search]');document.body.dataset.searchValue=input.value;document.body.dataset.searchFocused=String(document.activeElement===input);document.body.dataset.searchCaret=String(input.selectionStart===input.value.length);
 document.body.dataset.done='1'}catch(e){document.body.dataset.err=String(e);document.body.dataset.done='1'}})();
</script></body></html>`;
await writeFile(file,html);let out='';for(const bin of ['google-chrome','chromium','chromium-browser'])try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--virtual-time-budget=2200','--dump-dom','file://'+file],{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']});if(out)break}catch{}await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium unavailable');
for(const x of ['data-done="1"','data-home-history-hidden="true"','data-home-mode="follow-first"','data-discover-movies="Permitido"','data-discover-series="Nova Serie"','data-atomic-immediate="true"','data-search-value="formula"','data-search-focused="true"','data-search-caret="true"'])if(!out.includes(x))throw new Error('R240 semantic browser missing '+x+'\n'+(out.match(/<body[^>]*>/)?.[0]||''));
if(out.includes('data-err='))throw new Error('R240 semantic browser runtime error '+(out.match(/data-err="[^"]*/)?.[0]||''));
console.log('R240_SEMANTIC_BROWSER_OK home=follow-first discover=excluded+atomic sports-search=focus+full-value');