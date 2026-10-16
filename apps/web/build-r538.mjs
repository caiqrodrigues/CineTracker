import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
await import('./build-r537.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v537.js'),'utf8'),
 readFile(resolve(dist,'app-v537.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r538-counts.js'),'utf8')
]);

function bounds(source,anchor,label){
 const at=source.indexOf(anchor);
 if(at<0)throw new Error('r538 missing '+label+' anchor');
 const start=source.lastIndexOf('(()=>{',at),close=source.indexOf('\n})();',at);
 if(start<0||close<0)throw new Error('r538 invalid '+label+' bounds');
 return{start,end:close+6};
}
function replaceNamed(source,anchor,name,replacement,label){
 const b=bounds(source,anchor,label),region=source.slice(b.start,b.end),m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(region);
 if(!m)throw new Error('r538 missing '+label+' '+name);
 const open=region.indexOf('{',m.index+m[0].length);
 let depth=0,mode='code',quote='',i=open;
 for(;i<region.length;i++){
  const c=region[i],n=region[i+1];
  if(mode==='line'){if(c==='\n')mode='code';continue}
  if(mode==='block'){if(c==='*'&&n==='/'){mode='code';i++}continue}
  if(mode==='string'){if(c==='\\'){i++;continue}if(c===quote)mode='code';continue}
  if(mode==='template'){if(c==='\\'){i++;continue}if(c.charCodeAt(0)===96)mode='code';continue}
  if(c==='/'&&n==='/'){mode='line';i++;continue}
  if(c==='/'&&n==='*'){mode='block';i++;continue}
  if(c==="'"||c==='"'){mode='string';quote=c;continue}
  if(c.charCodeAt(0)===96){mode='template';continue}
  if(c==='{')depth++;
  else if(c==='}'){depth--;if(depth===0){i++;break}}
 }
 if(depth!==0)throw new Error('r538 unbalanced '+label+' '+name);
 return source.slice(0,b.start)+region.slice(0,m.index)+replacement+region.slice(i)+source.slice(b.end);
}

const A520="if(window.__ctR516SpecialSummary?.version==='0.3.47')return;";
{
 const b=bounds(js,A520,'r520-summary');
 let region=js.slice(b.start,b.end);
 if(!region.includes("const cacheKey='ct520:special-summary'"))throw new Error('r538 old special cache key missing');
 region=region.replace("const cacheKey='ct520:special-summary'","const cacheKey='ct538:special-summary'");
 js=js.slice(0,b.start)+region+js.slice(b.end);
}
js=replaceNamed(js,A520,'load',`async function load(force=false){
 if(task)return task;
 if(!force&&!summary){summary=read();if(summary)repaint()}
 task=(async()=>{try{
  let d=null;
  try{d=await core()?.edge?.('ct-special-series-summary',{})}catch{}
  if(!d?.f1||!d?.ufc||!d?.wwe){
   const p=await core()?.rpc?.('cinetracker_special_series_counts_v538',{}),raw=Array.isArray(p)&&p.length===1?p[0]:p||{};
   d={
    f1:{watched:Number(raw?.f1?.watched||0),total:Number(raw?.f1?.total||0),source:'db-v538-stable-floor'},
    ufc:{watched:Number(raw?.ufc?.watched||0),total:Number(raw?.ufc?.total||0),source:'db-v538-stable-floor'},
    wwe:{watched:Number(raw?.wwe_ppv?.watched||0),total:Number(raw?.wwe_ppv?.total||0),source:'db-v538-stable-floor'}
   }
  }
  summary={
   f1:{watched:Number(d?.f1?.watched||0),total:Math.max(1166,Number(d?.f1?.total||0),Number(d?.f1?.watched||0)),source:String(d?.f1?.source||'')},
   ufc:{watched:Number(d?.ufc?.watched||0),total:Math.max(793,Number(d?.ufc?.total||0),Number(d?.ufc?.watched||0)),source:String(d?.ufc?.source||'')},
   wwe:{watched:Number(d?.wwe?.watched||0),total:Math.max(567,Number(d?.wwe?.total||0),Number(d?.wwe?.watched||0)),source:String(d?.wwe?.source||'')}
  };
  write(summary);
  document.documentElement.dataset.ct538SpecialSummary=[summary.f1.total,summary.ufc.total,summary.wwe.total].join('|');
  repaint();
  return summary
 }catch(e){
  document.documentElement.dataset.ct538SpecialSummaryError=String(e?.message||e);
  return summary
 }finally{task=null}})();
 return task
}`,'r520-summary');

new Function(runtime);
js+='\n'+runtime+'\n';
new Function(js);

html=html.replaceAll('app-v537.js','app-v538.js').replaceAll('app-v537.css','app-v538.css').replaceAll('v0.3.64','v0.3.65').replaceAll('r537-official-0.3.64','r538-official-0.3.65');
sw=sw.replaceAll('r537','r538').replaceAll('app-v537.js','app-v538.js').replaceAll('app-v537.css','app-v538.css');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.65',
 revision:'r538-official-0.3.65',
 base:'r537+r538-counts-only',
 scope:'counts-only-naruto-shippuuden-f1-ufc-wwe',
 counts:'Naruto 220 unchanged; Naruto Shippuuden 500; F1 1166 GPs; UFC 793 events; WWE PPV/PLE 567 supercards',
 special_summary:'Edge totals may grow above the verified floors; DB v538 is the stable fallback so partial local catalogs cannot reduce totals',
 preserved:'Home layout/order, movie list, Discover, Profile, Sports, F1/UFC/WWE event catalogs and watch writers, Raw/SmackDown and Android unchanged'
});

await Promise.all([
 writeFile(resolve(dist,'app-v538.js'),js),
 writeFile(resolve(dist,'app-v538.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v537.js'),{force:true}),rm(resolve(dist,'app-v537.css'),{force:true})]);

for(const need of [
 "window.__ctR538Marker='counts-only+naruto-shippuuden-500+f1-1166+ufc-793+wwe-567'",
 'cinetracker_special_series_counts_v538',
 'Math.max(1166','Math.max(793','Math.max(567',
 "const cacheKey='ct538:special-summary'",
 'r538-official-0.3.65'
])if(!js.includes(need))throw new Error('r538 missing '+need);

console.log('WEB_R538_READY counts-only');
