import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createServer} from 'node:http';
import {spawn,execFileSync} from 'node:child_process';
await import('./build-r538.mjs');
const js=await readFile(resolve('dist/app-v538.js'),'utf8');
const anchor="if(window.__ctR516SpecialSummary?.version==='0.3.47')return;",at=js.indexOf(anchor),start=js.lastIndexOf('(()=>{',at),end=js.indexOf('\n})();',at);
if(at<0||start<0||end<0)throw new Error('r520 summary region missing');
const summary=js.slice(start,end+6);
const prelude=`
window.__ctCoreR471={
 edge:async()=>{throw new Error('offline')},
 rpc:async(name)=>{
  if(name!=='cinetracker_special_series_counts_v538')throw new Error(name);
  return {f1:{watched:87,total:1166},ufc:{watched:18,total:793},wwe_ppv:{watched:50,total:567}}
 }
};
window.__ctR512Special={mountAll(){}};
window.__ctR513SeriesScreen={rerender(){}};
`;
const probe=`
(async()=>{
 const yes=(v,m)=>{if(!v)throw new Error(m)},sleep=ms=>new Promise(r=>setTimeout(r,ms));
 try{
  await sleep(80);
  let d=window.__ctR516SpecialSummary?.data;
  yes(d?.f1?.total===1166,'F1 '+d?.f1?.total);
  yes(d?.ufc?.total===793,'UFC '+d?.ufc?.total);
  yes(d?.wwe?.total===567,'WWE '+d?.wwe?.total);
  window.__ctCoreR471.edge=async()=>({f1:{watched:87,total:66},ufc:{watched:18,total:380},wwe:{watched:50,total:61}});
  await window.__ctR516SpecialSummary.load(true);
  d=window.__ctR516SpecialSummary.data;
  yes(d.f1.total===1166,'F1 floor '+d.f1.total);
  yes(d.ufc.total===793,'UFC floor '+d.ufc.total);
  yes(d.wwe.total===567,'WWE floor '+d.wwe.total);
  document.documentElement.dataset.ct538browser='ok'
 }catch(e){document.documentElement.dataset.ct538browser='fail:'+String(e?.stack||e)}
})();
`;
const html='<!doctype html><html><head><meta charset="utf-8"></head><body><script>'+prelude+'</script><script>'+summary+'</script><script>'+probe+'</script></body></html>';
const server=createServer((req,res)=>{res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
let bin='';for(const x of ['google-chrome-stable','google-chrome','chromium','chromium-browser']){try{execFileSync('which',[x],{stdio:'ignore'});bin=x;break}catch{}}
if(!bin)throw new Error('Chromium unavailable');
const child=spawn(bin,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--virtual-time-budget=900','--dump-dom','http://127.0.0.1:'+port+'/'],{stdio:['ignore','pipe','pipe']});
let out='',err='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d);const killer=setTimeout(()=>{try{child.kill('SIGTERM')}catch{}},20000);
const code=await new Promise(r=>child.on('close',r));clearTimeout(killer);await new Promise(r=>server.close(r));
if(code!==0)throw new Error('Chromium '+code+' '+err.slice(-1000));
const m=out.match(/data-ct538browser="([^"]*)"/),state=m?.[1]||'';
if(state!=='ok')throw new Error('R538_BROWSER '+state+' DOM='+out.slice(-5000));
console.log('R538_BROWSER_OK stable-count-fallbacks');
