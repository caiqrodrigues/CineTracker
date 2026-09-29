import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
if(process.env.CT_R396_SKIP_BUILD!=='1')await import('./build-r396.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r396-discover-foryou-fast.js'),'utf8')).replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><body><div data-ct319-content></div><script>
window.currentRoute='discover';window.route=()=>window.currentRoute;var route=window.route;window.__ctR288R263={discover263:{tab:'foryou'}};
let calls=0;window.rpc=async(name,args)=>{calls++;if(name!=='cinetracker_discover_foryou_v396')throw new Error('wrong rpc '+name);return {
 watch:{movie:[{media_type:'movie',tmdb_id:10,title:'Watch Movie',poster_path:'/w.jpg'}],series:[{media_type:'tv',tmdb_id:11,name:'Watch Series',poster_path:'/s.jpg'}],anime:[{media_type:'tv',media_kind:'anime',tmdb_id:12,name:'Watch Anime',poster_path:'/a.jpg'}]},
 fresh:{movie:[{media_type:'movie',tmdb_id:20,title:'Fresh Movie',poster_path:'/fm.jpg'}],series:[{media_type:'tv',tmdb_id:21,name:'Fresh Series',poster_path:'/fs.jpg'}],anime:[{media_type:'tv',media_kind:'anime',tmdb_id:22,name:'Fresh Anime',poster_path:'/fa.jpg'}]}
}};
const validated=new Set(),fy={dailyPool:[],dailyIndex:0,watchPools:{movie:[],series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshPools:{movie:[],series:[],anime:[]},freshIndex:{movie:0,series:0,anime:0}};
const key=x=>(x.media_type==='movie'?'movie':'tv')+':'+x.tmdb_id;
const slot=(name,x)=>'<div data-ct388-slot="'+name+'">'+(x&&validated.has(key(x))?'<article data-media="'+key(x)+'">'+(x.title||x.name)+'</article>':'<div class="ct388-placeholder"><b>Buscando indicação…</b></div>')+'</div>';
const paint=()=>{const h=document.querySelector('[data-ct319-content]');h.innerHTML='<div data-ct388-foryou>'+slot('daily',fy.dailyPool[0])+slot('watch:movie',fy.watchPools.movie[0])+slot('watch:series',fy.watchPools.series[0])+slot('watch:anime',fy.watchPools.anime[0])+slot('fresh:movie',fy.freshPools.movie[0])+slot('fresh:series',fy.freshPools.series[0])+slot('fresh:anime',fy.freshPools.anime[0])+'</div>';return true};
window.__ctR388={version:'1.0.184',renderForYou:paint,loadForYou:async()=>{throw new Error('legacy loader ran')},get fy(){return fy}};
window.__ctR388Test={clearValidated:()=>validated.clear(),validateKey:k=>validated.add(k)};
</script><script>${runtime}</script><script>(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)};await window.__ctR396.loadForYou(false);
 ok(calls===1,'rpc count '+calls);ok(document.querySelectorAll('[data-ct388-foryou] [data-media]').length===7,'cards not fully painted');
 ok(document.documentElement.dataset.ct396ForYou==='ready','not ready');ok(window.__ctR388.loadForYou===window.__ctR396.loadForYou,'r388 loader not replaced');
 document.documentElement.dataset.ct396done='1';
}catch(e){document.documentElement.dataset.ct396probe='fail:'+String(e?.stack||e)}})();</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=5000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},20000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));if(!/data-ct396done="1"/.test(out)){const m=out.match(/data-ct396probe="([^"]*)"/);throw new Error('R396_BROWSER '+(m?.[1]||'probe did not finish'))}console.log('R396_BROWSER_OK single canonical payload');
