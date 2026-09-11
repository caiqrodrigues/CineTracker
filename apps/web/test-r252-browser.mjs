import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const runtime=await readFile(new URL('./runtime-r252-source-ui-recovery.js',import.meta.url),'utf8');
const movie=(id,title,extra={})=>({id,title,media_type:'movie',poster_path:'/p.jpg',vote_average:8.4,release_date:'2024-01-01',genre_ids:[28],...extra});
const tv=(id,name,extra={})=>({id,name,media_type:'tv',poster_path:'/p.jpg',vote_average:8.4,first_air_date:'2024-01-01',genre_ids:[10759],...extra});
const dash=[
 {...movie(401,'Watch Filme'),tmdb_id:401,is_watchlist:true},
 {...tv(402,'Watch Série'),tmdb_id:402,is_watchlist:true},
 {...tv(403,'Watch Anime',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'}),tmdb_id:403,is_watchlist:true}
];
const movies=[movie(101,'Filme Diário'),movie(102,'Filme Extra'),movie(103,'WWE WrestleMania'),movie(104,'Drama puro',{genre_ids:[18]})];
const tvs=[tv(201,'Série Pública'),tv(202,'Série Extra')];
const anime=[tv(301,'Anime Novo',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'}),tv(302,'Anime Extra',{genre_ids:[16,35],origin_country:['JP'],original_language:'ja'})];
const fresh=[movie(501,'Novo Filme',{release_date:'2026-09-05'}),tv(502,'Nova Série',{first_air_date:'2026-09-04'}),tv(503,'Novo Anime',{first_air_date:'2026-09-03',genre_ids:[16,35],origin_country:['JP'],original_language:'ja'})];
const tabs=[['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],['new','Novidades'],['anticipated','Mais Aguardados'],['top','Mais bem avaliados'],['calendar','Calendário']];
const harness=`<!doctype html><meta charset="utf-8"><body><div id="app"></div><script>
let homeCache=null,user={id:'u',email:'teste@example.com',user_metadata:{display_name:'Caique'}},navSeq=1,discoverState={tab:'foryou',type:'all'},sportsState={};
function route(){return location.hash==='#configs'?'configs':'discover'}
function localDay(d=new Date()){return d.toISOString().slice(0,10)}function tz(){return'America/Sao_Paulo'}
function shell(t,s,a,b){return '<main data-page="'+a+'">'+b+'</main>'}function setApp(h){document.querySelector('#app').innerHTML=h}
function mediaCard(x){return '<article class="card" data-native-card="1"><button data-media="'+(x.media_type==='movie'?'movie':'tv')+':'+(x.tmdb_id||x.id)+'"><div class="poster"></div><div class="card-body"><b>'+(x.title||x.name)+'</b></div></button></article>'}
async function rpc(name){if(name==='cinetracker_profile_media_dashboard_v0991')return ${JSON.stringify(dash)};if(name==='cinetracker_sports_payload_v1')return{events:[],watch_history:[]};return[]}
const apiCalls=[];async function api(path,opt={}){apiCalls.push({path,opt});if(path.startsWith('shown_recommendations?')&&(!opt.method||opt.method==='GET'))return[];if(path.startsWith('profiles?'))return[{display_name:'Caique'}];return[]}
async function pages(path,params,type){if(params&&params['primary_release_date.gte'])return ${JSON.stringify(fresh.filter(x=>x.media_type==='movie'))};if(params&&params['first_air_date.gte'])return ${JSON.stringify(fresh.filter(x=>x.media_type==='tv'))};if(params&&params.with_origin_country==='JP')return ${JSON.stringify(anime)};if(type==='movie')return ${JSON.stringify(movies)};if(type==='tv')return ${JSON.stringify(tvs)};return[]}
async function safeTmdb(){return{results:[...${JSON.stringify(movies.slice(0,2))},...${JSON.stringify(tvs.slice(0,2))}]}}
async function discoverRows(tab){if(tab==='calendar')return[];return[]}
function paintDiscover(rows){const h=document.querySelector('[data-discover-content]');if(h)h.innerHTML='<div class="row">'+(rows||[]).map(mediaCard).join('')+'</div>'}
async function renderConfigs(){}function paintHome(){}function ct176CanonicalPair(r){return r?._pair||null}
${runtime.replaceAll('</script>','<\\/script>')}
(async()=>{const A=(c,m)=>{if(!c)throw new Error(m)};try{
 document.querySelector('#app').innerHTML='<div data-discover><div class="tabs">${tabs.map(([k,l])=>`<button class="chip" data-discover-tab="${k}">${l}</button>`).join('')}</div><div data-discover-content></div></div>';
 const fy=await discoverRows('foryou');paintDiscover(fy);await new Promise(r=>setTimeout(r,20));
 A(document.querySelectorAll('[data-discover-tab]').length===9,'nine tabs');A(document.querySelectorAll('[data-ct252-foryou] .panel').length===3,'three blocks');
 const cards=[...document.querySelectorAll('[data-ct252-foryou] .card')];A(cards.length===7,'seven recommendations');A(cards.every(x=>x.dataset.nativeCard==='1'),'native mediaCard preserved');
 const text=document.querySelector('[data-ct252-foryou]').textContent;A(text.includes('Indicação do Dia')&&text.includes('Da sua Watchlist')&&text.includes('100% Novos'),'block labels');A(!text.includes('WWE')&&!text.includes('Drama puro'),'strict exclusions');
 const keys=cards.map(x=>x.querySelector('[data-media]').dataset.media);A(keys.length===new Set(keys).size,'no duplicates');A(apiCalls.some(x=>x.path.startsWith('shown_recommendations?on_conflict=')),'shown history persisted');
 const before=keys[0];document.querySelector('[data-ct252-refresh]').click();await new Promise(r=>setTimeout(r,50));const after=document.querySelector('[data-ct252-foryou] .card [data-media]')?.dataset.media;A(before!==after,'refresh swaps without reload');
 location.hash='#configs';const started=performance.now();await renderConfigs(navSeq);const elapsed=performance.now()-started;A(elapsed<50,'configs render immediate');A(!document.querySelector('.loader'),'configs has no blocking loader');A(document.body.textContent.includes('Manutenção e sincronização'),'configs content ready');
 A(window.__ctR252UI==='r248-native-structure-preserved','source UI marker');A(typeof window.__ctR251==='undefined','no r251 runtime authority');
 document.body.dataset.test='PASS';document.body.insertAdjacentHTML('beforeend','<pre id="result">R252_BROWSER_PASS</pre>');
 }catch(e){document.body.dataset.test='FAIL';document.body.insertAdjacentHTML('beforeend','<pre id="result">R252_BROWSER_FAIL '+String(e&&e.stack||e)+'</pre>')}})();
</script></body>`;
const dir=await mkdtemp(join(tmpdir(),'ct-r252-browser-')),html=join(dir,'index.html');await writeFile(html,harness,'utf8');
let chrome=process.env.CHROME_BIN||'';if(!chrome){for(const c of['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[c],{stdio:'ignore'});chrome=c;break}catch{}}}
if(!chrome)throw new Error('Chromium unavailable');const args=['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run','--no-default-browser-check',`--user-data-dir=${join(dir,'profile')}`,'--virtual-time-budget=3000','--dump-dom','file://'+html];
let out='';try{out=execFileSync(chrome,args,{encoding:'utf8',timeout:30000,stdio:['ignore','pipe','pipe']})}catch(e){out=String(e.stdout||'');console.error(String(e.stderr||''))}
await rm(dir,{recursive:true,force:true});if(!out.includes('R252_BROWSER_PASS')){console.error(out.slice(-10000));process.exit(1)}console.log('R252_BROWSER_PASS');
