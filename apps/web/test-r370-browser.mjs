import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {createServer} from 'node:http';import {spawn,execFileSync} from 'node:child_process';
if(process.env.CT_R370_SKIP_BUILD!=='1')await import('./build-r370.mjs');
let bin='';for(const x of ['google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}if(!bin)throw new Error('Chromium unavailable');
const runtime=(await readFile(resolve('runtime-r370-prefilter-swap.js'),'utf8')).replaceAll('</script>','<\\/script>');
const html=`<!doctype html><html><head></head><body><div data-ct319-content><div data-ct336-foryou><div data-ct336-slot="fresh:movie"><article data-ct288-card="movie:1"></article><div class="ct336-actions"><button type="button" data-ct336-swap-only="fresh:movie">↻ Trocar</button></div></div></div></div><script>
window.route=()=> 'discover';window.toast=()=>{};const item=id=>({id,tmdb_id:id,media_type:'movie',title:'M'+id,poster_path:'/p.jpg',vote_average:8.4,release_date:'2025-01-01',genre_ids:[28]});const pool=Array.from({length:70},(_,i)=>item(i+1));window.__ctR309Test={state:{watchPools:{movie:[],series:[],anime:[]},freshPools:{movie:pool,series:[],anime:[]},watchIndex:{movie:0,series:0,anime:0},freshIndex:{movie:0,series:0,anime:0},dailyPool:[],dailyIndex:0},setForYouState(v){this.state=v}};window.__ctR359={renderSlot(name){const st=window.__ctR309Test.state,x=st.freshPools.movie[st.freshIndex.movie];document.querySelector('[data-ct336-slot="'+name+'"] [data-ct288-card]').dataset.ct288Card='movie:'+x.tmdb_id;return true},rememberSwap:()=>true};window.__ctR367={ensureAll:()=>true,handle:()=>true,meta(t){const b=t.closest('button'),slot=b?.closest('[data-ct336-slot]');if(!b||!slot)return null;return{btn:b,slot,name:'fresh:movie',key:slot.querySelector('[data-ct288-card]').dataset.ct288Card,action:'swap'}}};window.__ctR295Test={blocked:()=>false,authority:async()=>({})};window.__ctR296Test={strictEligible:()=>true};window.__ctR363={refill:async()=>0};
</script><script>${runtime}</script><script>
window.addEventListener('click',e=>{try{window.__ctR370?.early?.(e.target,e)}catch{}},true);
(async()=>{try{
 const ok=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms)),btn=document.querySelector('[data-ct336-swap-only]');
 window.__ctR370.resetExcluded();const seen=new Set(['movie:1']);let beats=0;const heartbeat=setInterval(()=>beats++,2);
 for(let i=0;i<35;i++){btn.click();for(let n=0;n<200&&window.__ctR370.isSwapping;n++)await sleep(1);const k=document.querySelector('[data-ct288-card]').dataset.ct288Card;ok(!seen.has(k),'repeat '+k+' at '+i);seen.add(k);ok(!window.__ctR370.isSwapping,'lock stuck '+i);ok(!btn.disabled,'button disabled '+i);await sleep(0)}
 const beforeRapid=window.__ctR370.acceptedSwaps;for(let i=0;i<40;i++)btn.click();for(let n=0;n<200&&window.__ctR370.isSwapping;n++)await sleep(1);
 clearInterval(heartbeat);
 ok(window.__ctR370.acceptedSwaps>=35,'sequential swaps missing');
 ok(window.__ctR370.acceptedSwaps<=beforeRapid+1,'rapid clicks bypassed synchronous lock');
 ok(window.__ctR370.rejectedLockedClicks>0,'no rapid clicks rejected by ref lock');
 ok(beats>=10,'main thread heartbeat stalled');
 ok(!window.__ctR370.isSwapping&&!btn.disabled,'final lock state stuck');
 document.documentElement.dataset.ct370done='1';
}catch(e){document.documentElement.dataset.ct370probe='fail:'+String(e?.stack||e)}})();
</script></body></html>`;
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html','cache-control':'no-store'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=6000','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);
const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},25000),code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1200));if(!/data-ct370done="1"/.test(out)){const m=out.match(/data-ct370probe="([^"]*)"/);throw new Error('R370_BROWSER '+(m?.[1]||'probe did not finish'))}
console.log('R370_BROWSER_OK 35 sequential swaps + 40 rapid clicks + main-thread heartbeat');