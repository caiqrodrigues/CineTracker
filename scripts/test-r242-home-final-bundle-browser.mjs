import {readFile,writeFile,rm,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';

const root=resolve(process.cwd()),dist=resolve(root,'apps/web/dist');
const [bundle,css]=await Promise.all([readFile(resolve(dist,'app-v242.js'),'utf8'),readFile(resolve(dist,'app-v242.css'),'utf8')]);
const dir='/tmp/ct-r242-home-final',file=resolve(dir,'index.html');await mkdir(dir,{recursive:true});
const preview={preview:true,series:[],movie_watchlist:[{media_id:1,tmdb_id:101,title:'Filme Teste',poster_path:null,release_year:2024,runtime_minutes:111,genres:[]}],history_episodes:[],history_movies:[],seen_movie_tmdb_ids:[]};
const full={...preview,preview:false};
const stub=`
window.__ctR242Errors=[];window.__ctR242FullResolved=false;
addEventListener('error',e=>window.__ctR242Errors.push('error:'+String(e.message||e.error||e)));
addEventListener('unhandledrejection',e=>window.__ctR242Errors.push('rejection:'+String(e.reason||e)));
localStorage.clear();
localStorage.setItem('cinetracker_session',JSON.stringify({access_token:'test-token',refresh_token:'test-refresh',expires_at:Math.floor(Date.now()/1000)+3600,user:{id:'test-user',email:'teste@local'}}));
const __preview=${JSON.stringify(preview)},__full=${JSON.stringify(full)};
const __json=(x,status=200)=>Promise.resolve(new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json'}}));
window.fetch=(input)=>{const u=String(input?.url||input||'');
 if(u.includes('/auth/v1/user'))return __json({id:'test-user',email:'teste@local'});
 if(u.includes('/rest/v1/rpc/cinetracker_home_live_v0997_r3'))return new Promise(r=>setTimeout(()=>{window.__ctR242FullResolved=true;r(new Response(JSON.stringify(__full),{status:200,headers:{'Content-Type':'application/json'}}))},5000));
 if(u.includes('/rest/v1/rpc/cinetracker_home_preview_v1'))return new Promise(r=>setTimeout(()=>r(new Response(JSON.stringify(__preview),{status:200,headers:{'Content-Type':'application/json'}})),80));
 if(u.includes('/functions/v1/tmdb-proxy'))return __json({id:101,title:'Filme Teste',release_date:'2024-05-10',runtime:111,genres:[{id:28,name:'Ação'},{id:12,name:'Aventura'}]});
 return __json({});
};
setTimeout(()=>{try{
 const home=document.querySelector('[data-home]'),row=document.querySelector('[data-media="movie:101"]'),small=row?.querySelector('small');
 document.body.dataset.done='1';
 document.body.dataset.homeVisible=String(Boolean(home&&!home.querySelector('.loader')&&home.textContent.trim()));
 document.body.dataset.fast=String(home?.dataset.ct242Fast||'');
 document.body.dataset.movieMeta=String(small?.textContent||'');
 document.body.dataset.errors=String(window.__ctR242Errors.join(' | '));
 document.body.dataset.appChars=String(document.querySelector('#app')?.textContent?.trim().length||0);
 document.body.dataset.fullResolvedAtSnapshot=String(window.__ctR242FullResolved);
}catch(e){document.body.dataset.done='1';document.body.dataset.harnessError=String(e)}} ,1400);
setTimeout(()=>{document.body.dataset.fullResolvedFinal=String(window.__ctR242FullResolved);document.body.dataset.finalErrors=String(window.__ctR242Errors.join(' | '))},6200);
`;
const safe=s=>s.replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>${safe(css)}</style></head><body><div id="app"></div><script>${safe(stub)}</script><script>${safe(bundle)}</script></body></html>`;
await writeFile(file,html,'utf8');
let bin='';for(const c of ['google-chrome','chromium','chromium-browser'])try{execFileSync('which',[c],{stdio:'ignore'});bin=c;break}catch{}
if(!bin){await rm(dir,{recursive:true,force:true});throw new Error('Chromium unavailable: no browser binary');}
let out='';try{out=execFileSync(bin,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--virtual-time-budget=7600','--dump-dom','file://'+file],{encoding:'utf8',timeout:20000,stdio:['ignore','pipe','pipe']})}catch(e){await rm(dir,{recursive:true,force:true});throw new Error('Chromium execution failed '+String(e?.stderr||e).slice(0,500))}
await rm(dir,{recursive:true,force:true});if(!out)throw new Error('Chromium produced no DOM');
const body=out.match(/<body[^>]*>/)?.[0]||'';
for(const x of ['data-done="1"','data-home-visible="true"','data-fast="preview"','data-full-resolved-at-snapshot="false"','data-full-resolved-final="true"'])if(!out.includes(x))throw new Error('R242 final-bundle Home failed '+x+' '+body);
if(!/data-app-chars="(?:[1-9][0-9]{1,}|[1-9])"/.test(out))throw new Error('R242 app root blank '+body);
const meta=(out.match(/data-movie-meta="([^"]*)"/)||[])[1]||'';
if(!meta.includes('2024')||!meta.includes('111 min')||!meta.includes('Ação')||!meta.includes('Aventura'))throw new Error('R242 incomplete movie metadata: '+meta+' '+body);
const errors=(out.match(/data-errors="([^"]*)"/)||[])[1]||'',finalErrors=(out.match(/data-final-errors="([^"]*)"/)||[])[1]||'';
if(errors||finalErrors)throw new Error('R242 page error: '+(errors||finalErrors));
if(out.includes('data-harness-error='))throw new Error('R242 harness error '+body);
console.log('R242_FINAL_BUNDLE_BROWSER_OK full-rpc=delayed preview=visible-before-full movie=year+runtime+genres errors=0');
