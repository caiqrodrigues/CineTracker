import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const targets=[resolve(root,'dist'),resolve(root,'apps/web/dist')];

function patchRuntime(input,where){
  let out=input;
  if(!out.includes('r137-rpc-timeout-native-nav'))throw new Error(`r140: r137 runtime missing in ${where}`);
  if(!out.includes("window.__ct0997Primary133Hotfix = 'r133-nonblocking-home'"))throw new Error(`r140: nonblocking Home missing in ${where}`);

  const cacheNeedle='const tmdbCache=new Map(),discoverCache=new Map(),homeResolvedCache=new Map();';
  if(!out.includes(cacheNeedle))throw new Error(`r140: cache anchor missing in ${where}`);
  out=out.replace(cacheNeedle,'const tmdbCache=new Map(),discoverCache=new Map(),homeResolvedCache=new Map(),rpcInflight=new Map();');

  const rpcNeedle="async function rpcDirect(name,body={}){return rest(`rpc/${name}`,{method:'POST',body})}";
  if(!out.includes(rpcNeedle))throw new Error(`r140: rpcDirect anchor missing in ${where}`);
  out=out.replace(rpcNeedle,"async function rpcDirect(name,body={}){const key=name+'|'+JSON.stringify(body||{});if(rpcInflight.has(key))return rpcInflight.get(key);const p=rest(`rpc/${name}`,{method:'POST',body}).finally(()=>rpcInflight.delete(key));rpcInflight.set(key,p);return p}");

  const homeRe=/async function homeData\(\)\{const\[h0,d0\]=await Promise\.all\(\[rpcDirect\('cinetracker_profile_home_payload_v0994',\{\}\)\.catch\(\(\)=>null\),rpcDirect\('cinetracker_profile_media_dashboard_v0991',\{\}\)\.catch\(\(\)=>\[\]\)\]\);const home=unwrap\(h0\)\|\|\{\},du=unwrap\(d0\),dash=Array\.isArray\(du\)\?du:\[\],by=new Map\(dash\.map\(x=>\[mediaId\(x\),x\]\)\);/;
  if(!homeRe.test(out))throw new Error(`r140: Home duplicate-RPC block missing in ${where}`);
  out=out.replace(homeRe,"async function homeData(){const h0=await rpcDirect('cinetracker_profile_home_payload_v0994',{}).catch(()=>null),home=unwrap(h0)||{};let dash=[];if(!h0){const d0=await rpcDirect('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),du=unwrap(d0);dash=Array.isArray(du)?du:[]}const by=new Map(dash.map(x=>[mediaId(x),x]));");

  const libRe=/async function libraryContext\(force=false\)\{if\(!force&&libraryCache&&Date\.now\(\)-libraryAt<90000\)return libraryCache;const\[d0,e0,o0\]=await Promise\.all\(\[rpcDirect\('cinetracker_profile_media_dashboard_v0991',\{\}\)\.catch\(\(\)=>\[\]\),rpcDirect\('cinetracker_discovery_exclusions_v0994',\{\}\)\.catch\(\(\)=>\(\{\}\)\),rest\('media_overrides\?select=media_id,state&state=in\.\(AddedToWatchlist,WatchLater,Liked\)'\)\.catch\(\(\)=>\[\]\)\]\);const du=unwrap\(d0\),dash=Array\.isArray\(du\)\?du:\[\],ex=unwrap\(e0\)\|\|\{\},over=Array\.isArray\(o0\)\?o0:\[\],/;
  if(!libRe.test(out))throw new Error(`r140: Discover duplicate-RPC block missing in ${where}`);
  out=out.replace(libRe,"async function libraryContext(force=false){if(!force&&libraryCache&&Date.now()-libraryAt<90000)return libraryCache;const[d0,o0]=await Promise.all([rpcDirect('cinetracker_profile_media_dashboard_v0991',{}).catch(()=>[]),rest('media_overrides?select=media_id,state&state=in.(AddedToWatchlist,WatchLater,Liked)').catch(()=>[])]);const du=unwrap(d0),dash=Array.isArray(du)?du:[],ex={},over=Array.isArray(o0)?o0:[],");

  out=out.replace("window.__ct0997R137='r137-rpc-timeout-native-nav';","window.__ct0997R137='r137-rpc-timeout-native-nav';\nwindow.__ct0997R140='r140-rpc-dedupe-single-start';");
  if(!out.includes('rpcInflight=new Map()'))throw new Error(`r140: inflight cache missing after patch in ${where}`);
  if(out.includes("const[h0,d0]=await Promise.all([rpcDirect('cinetracker_profile_home_payload_v0994'"))throw new Error(`r140: duplicate Home RPC survived in ${where}`);
  return out;
}

for(const dir of targets){
  const source=resolve(dir,'primary-authority-r139.js');
  const input=await readFile(source,'utf8');
  const emitted=patchRuntime(input,source);
  await writeFile(resolve(dir,'primary-authority-r140.js'),emitted,'utf8');

  const htmlPath=resolve(dir,'primary.html');
  let html=await readFile(htmlPath,'utf8');
  if(!html.includes('/primary-authority-r139.js'))throw new Error(`r140: r139 runtime URL missing in ${htmlPath}`);
  html=html.replaceAll('/primary-authority-r139.js','/primary-authority-r140.js');
  const startNeedle="await loadPrimaryRuntime139();window.dispatchEvent(new Event('cinetracker:auth-state-change'));await window.__ct132Go?.(p);";
  if(!html.includes(startNeedle))throw new Error(`r140: duplicated startup route anchor missing in ${htmlPath}`);
  html=html.replace(startNeedle,"const firstLoad=!window.__ct0997Primary133Loaded;await loadPrimaryRuntime139();if(!firstLoad)await window.__ct132Go?.(p);");
  html=html.replace("window.__ctPrimaryR139='r139-auth-gated-runtime';","window.__ctPrimaryR139='r139-auth-gated-runtime';window.__ctPrimaryR140='r140-rpc-dedupe-single-start';");
  await writeFile(htmlPath,html,'utf8');
}

console.log('CineTracker Web 0.99.7 r140: single startup render, Home/Discover heavy RPC dedupe and in-flight coalescing.');
