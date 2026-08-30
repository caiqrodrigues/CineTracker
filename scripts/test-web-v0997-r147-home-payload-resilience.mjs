import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const must=(ok,msg)=>{if(!ok)throw new Error('r147 test: '+msg)};

function normalize(value){
  let x=value;
  for(let i=0;i<4;i++){
    if(Array.isArray(x)&&x.length===1&&x[0]&&typeof x[0]==='object'){x=x[0];continue}
    if(x&&typeof x==='object'&&!Array.isArray(x)){
      if(x.data&&typeof x.data==='object'&&!Array.isArray(x.series)){x=x.data;continue}
      if(x.result&&typeof x.result==='object'&&!Array.isArray(x.series)){x=x.result;continue}
      if(x.payload&&typeof x.payload==='object'&&!Array.isArray(x.series)){x=x.payload;continue}
    }
    break;
  }
  return x;
}
function valid(value){
  const x=normalize(value);
  return Boolean(x&&typeof x==='object'&&!Array.isArray(x)&&Array.isArray(x.series)&&Array.isArray(x.movie_watchlist)&&Array.isArray(x.history_episodes)&&Array.isArray(x.history_movies)&&!x._ct138LegacySuppressed);
}
const fixture={series:[],movie_watchlist:[],history_episodes:[],history_movies:[]};
must(valid(fixture),'direct current Home contract must be valid');
must(valid({data:fixture}),'data-wrapped Home contract must normalize');
must(valid([{result:fixture}]),'single-array/result wrapped Home contract must normalize');
must(!valid({series:[],movie_watchlist:[]}), 'partial Home payload must remain invalid');
must(!valid({_ct138LegacySuppressed:true,...fixture}), 'legacy-suppressed Home payload must remain invalid');

for(const dir of dirs){
  const primary=await readFile(resolve(dir,'patch-v143-v0997-primary-router.js'),'utf8');
  const preload=await readFile(resolve(dir,'patch-v1196-v0997-persistent-preload.js'),'utf8');
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  must(primary.includes('normalizeHomePayload147'),'primary router normalizer missing');
  must(primary.includes("const rawHome=loadHome?.__ct0997Raw||rpcDirect"),'raw RPC fallback missing');
  must(primary.includes("else if(!validHomePayload(homeData))throw new Error('Home retornou payload incompleto')"),'last-valid Home preservation missing');
  must(!primary.includes("function validHomePayload(v){return Boolean(v&&Array.isArray(v.series)&&Array.isArray(v.movie_watchlist)"),'strict r139 validator survived');
  must(preload.includes('validHomeLive147'),'persistent preload Home validator missing');
  must(preload.includes("if(name===HOME_LIVE_RPC&&!validHomeLive147(clean))throw new Error('Home retornou payload incompleto')"),'invalid network payload rejection missing');
  must(preload.includes("mem=(name===HOME_LIVE_RPC&&memRaw&&!validHomeLive147(memRaw.value))?null:memRaw"),'invalid memory snapshot rejection missing');
  must(preload.includes("snap=validHomeLive147(clean)?{...snap,value:clean}:null"),'invalid IndexedDB snapshot rejection missing');
  must(!html.includes('?r146"'),'r146 cache key survived');
}

console.log('WEB_R147_TEST_OK home=direct+wrapped-valid partial=invalid cache=validated raw-fallback=present');
