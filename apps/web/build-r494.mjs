import {readFile,writeFile,rm} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

await import('./build-r493.mjs');

const root=dirname(fileURLToPath(import.meta.url)),dist=resolve(root,'dist');
let [html,js,css,sw,releaseRaw,runtime]=await Promise.all([
 readFile(resolve(dist,'index.html'),'utf8'),
 readFile(resolve(dist,'app-v493.js'),'utf8'),
 readFile(resolve(dist,'app-v493.css'),'utf8'),
 readFile(resolve(dist,'service-worker.js'),'utf8'),
 readFile(resolve(dist,'release.json'),'utf8'),
 readFile(resolve(root,'runtime-r494-clean-boot.js'),'utf8')
]);

function replaceFirstNamed(source,name,replacement){
 const m=new RegExp('(?:async\\s+)?function\\s+'+name+'\\s*\\(').exec(source);
 if(!m)throw new Error('r494 missing function '+name);
 const open=source.indexOf('{',m.index+m[0].length);
 let depth=0,mode='code',quote='',i=open;
 for(;i<source.length;i++){
  const c=source[i],n=source[i+1];
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
 if(depth!==0)throw new Error('r494 unbalanced function '+name);
 return source.slice(0,m.index)+replacement+source.slice(i);
}
function stripDisabledIifes(source){
 let stripped=0;
 while(true){
  const start=source.indexOf('(()=>{return;');
  if(start<0)break;
  const close=source.indexOf('\n})();',start);
  if(close<0)throw new Error('r494 disabled IIFE boundary missing at '+start);
  source=source.slice(0,start)+source.slice(close+6);
  stripped++;
 }
 try{new Function(source)}catch(e){throw new Error('r494 JS invalid after dead-runtime strip: '+(e?.message||e))}
 return{source,stripped};
}

const authHelpers=String.raw`
/* r494: local-first auth. Remote validation can never block first paint. */
let ct494AuthRefreshTask=null;
const ct494Deadline=(promise,ms)=>Promise.race([Promise.resolve(promise),new Promise((_,reject)=>setTimeout(()=>reject(new Error('auth timeout')),ms))]);
async function ct494RefreshAuth(){
 if(!session?.refresh_token)return false;
 if(ct494AuthRefreshTask)return ct494AuthRefreshTask;
 ct494AuthRefreshTask=(async()=>{
  const d=await ct494Deadline(authRequest('token?grant_type=refresh_token',{refresh_token:session.refresh_token}),3500);
  saveSession(d);user=d.user||user;return true;
 })().finally(()=>{ct494AuthRefreshTask=null});
 return ct494AuthRefreshTask;
}
function ct494ValidateSessionAsync(){
 const token=session?.access_token;if(!token)return;
 queueMicrotask(()=>{void(async()=>{
  const c=new AbortController(),timer=setTimeout(()=>c.abort(),2500);
  try{
   const r=await fetch(\`\${SUPABASE_URL}/auth/v1/user\`,{headers:headers(),signal:c.signal});
   if(r.ok){user=await r.json();return}
   if(r.status===401&&session?.refresh_token){try{if(await ct494RefreshAuth())return}catch{}}
   if(r.status===401&&token===session?.access_token){
    localStorage.removeItem('cinetracker_session');session=null;user=null;
    if(route()!=='auth'){history.replaceState({},'','/');void render()}
   }
  }catch{}finally{clearTimeout(timer)}
 })()});
}
`;
const restoreSession=String.raw`async function restoreSession(){
 try{session=JSON.parse(localStorage.getItem('cinetracker_session')||'null')}catch{session=null}
 if(!session?.access_token){session=null;user=null;return false}
 user=session.user||user;
 ct494ValidateSessionAsync();
 return true;
}`;
const api=String.raw`async function api(path,options={}){
 if(!session?.access_token)throw new Error('Sessão necessária');
 const request=async()=>{
  const own=!options.signal,c=own?new AbortController():null,t=own?setTimeout(()=>c.abort(),15000):null;
  try{
   const r=await fetch(\`\${SUPABASE_URL}/rest/v1/\${path}\`,{...options,signal:options.signal||c?.signal,headers:headers({'Content-Type':'application/json',Prefer:'return=representation',...(options.headers||{})})});
   const text=await r.text();let d=null;if(text)try{d=JSON.parse(text)}catch{d=text}
   return{r,d};
  }finally{if(t)clearTimeout(t)}
 };
 let out=await request();
 if(out.r.status===401&&session?.refresh_token){
  try{if(await ct494RefreshAuth())out=await request()}catch{}
 }
 if(!out.r.ok)throw new Error(out.d?.message||out.d?.hint||out.d?.details||\`Banco \${out.r.status}\`);
 return out.d;
}`;

const restoreAt=js.indexOf('async function restoreSession');
if(restoreAt<0)throw new Error('r494 restoreSession anchor missing');
js=js.slice(0,restoreAt)+authHelpers+'\n'+js.slice(restoreAt);
js=replaceFirstNamed(js,'restoreSession',restoreSession);
js=replaceFirstNamed(js,'api',api);

const stripped=stripDisabledIifes(js);
js=stripped.source;
if(!stripped.stripped)throw new Error('r494 expected inert historical runtimes to strip');

const prebootRe=/<script\b[^>]*data-ct\d+-preboot[^>]*>[\s\S]*?<\/script>/gi;
const preboots=[...html.matchAll(prebootRe)].length;
html=html.replace(prebootRe,'');
if(preboots<2)throw new Error('r494 expected legacy preboots');
html=html.replace(/<meta name="ct-revision" content="[^"]*">/,'<meta name="ct-revision" content="r494-official-0.3.21">');
html=html.replace(/href="\/app-v493\.css[^"]*"/,'href="/app-v494.css?ct=r494-official-0.3.21"');
html=html.replace(/src="\/app-v493\.js[^"]*"/,'src="/app-v494.js?ct=r494-official-0.3.21"');
html=html.replaceAll('v0.3.20','v0.3.21').replaceAll('r493-official-0.3.20','r494-official-0.3.21');

css=css
 .replaceAll('html[data-ct461-series-gate="1"] [data-home-view="series"]{visibility:hidden!important}','')
 .replaceAll('html[data-ct461-series-gate="1"] [data-home-view="series"] {visibility:hidden!important}','');
css+='\n/* CineTracker Web 0.3.21 r494 — clean boot; historical preboots removed. */\n';

new Function(runtime);
js+='\n'+runtime+'\n';
js=js.replace(/const REVISION='[^']+';/,"const REVISION='r494-official-0.3.21';");
js=js.replace(/CineTracker • v[^•<]+ • \${REVISION}/g,'CineTracker • v0.3.21 • ${REVISION}');

sw=sw.replaceAll('app-v493.js','app-v494.js').replaceAll('app-v493.css','app-v494.css').replaceAll('r493','r494');

const release=JSON.parse(releaseRaw);
Object.assign(release,{
 version:'0.3.21',
 revision:'r494-official-0.3.21',
 base:'r493+r494-clean-boot',
 scope:'remove-gold-preboot+local-first-auth+strip-inert-runtime-code+preserve-r493-features',
 boot:'local session renders immediately; remote auth validation runs in background with a 2.5s abort guard',
 legacy_preboots_removed:preboots,
 inert_iifes_stripped:stripped.stripped,
 home:'r493 direct progressive Home preserved; r461/r479 preboot gates removed from final HTML',
 profile:'r493 split fast Profile preserved; profile_screen_v491 stays off critical path',
 discover:'r493 For You snapshot and progressive Top 10 preserved',
 service_worker:'network-owned HTML/JS; TMDB image cache only',
 f1:'preserved',sports:'preserved',history:'preserved',android:'unchanged-1.0.20/10062'
});

await Promise.all([
 writeFile(resolve(dist,'app-v494.js'),js),
 writeFile(resolve(dist,'app-v494.css'),css),
 writeFile(resolve(dist,'index.html'),html),
 writeFile(resolve(dist,'service-worker.js'),sw),
 writeFile(resolve(dist,'release.json'),JSON.stringify(release,null,2))
]);
await Promise.all([rm(resolve(dist,'app-v493.js'),{force:true}),rm(resolve(dist,'app-v493.css'),{force:true})]);

for(const bad of ['data-ct479-preboot','data-ct461-preboot','Carregando Home…','Carregando Home...'])if(html.includes(bad))throw new Error('r494 legacy boot survived: '+bad);
if(js.includes('(()=>{return;'))throw new Error('r494 inert runtime code survived');
for(const need of ["window.__ctR494Marker='clean-current-ui+local-first-auth+no-gold-preboot+dead-runtime-strip'",'ct494ValidateSessionAsync','cinetracker_home_series_v492','cinetracker_profile_summary_v489','ct493:foryou','r494-official-0.3.21'])if(!js.includes(need))throw new Error('r494 missing '+need);

console.log('WEB_R494_READY clean-boot preboots='+preboots+' inert='+stripped.stripped);
