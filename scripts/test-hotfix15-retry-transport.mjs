import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source=await readFile('apps/web/patch-v086-hotfix15-import-retry.js','utf8');
const endpoint='https://pjmkxryboypluleuuupp.supabase.co/functions/v1/ct-import-bingers-user';
const fail=m=>{throw new Error(`HOTFIX15 retry test: ${m}`)};

async function makeRuntime(fakeFetch,{timeout=20000,delays=[1,1,1,1,1]}={}){
  const window={fetch:fakeFetch,__ctHotfix15RetryTimeoutMs:timeout,__ctHotfix15RetryDelays:delays};
  const context=vm.createContext({window,document:{querySelector:()=>null},console,setTimeout,clearTimeout,AbortController,DOMException,Request});
  vm.runInContext(source,context,{filename:'patch-v086-hotfix15-import-retry.js'});
  if(window.__ctHotfix15ImportRetry!==true)fail('runtime marker missing');
  return window;
}

let calls503=0;
const retry503=await makeRuntime(async()=>{
  calls503++;
  return {status:calls503===1?503:200,ok:calls503!==1};
});
const ok503=await retry503.fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'watches_batch',import_id:77,rows:[{id:1}]})});
if(ok503.status!==200||calls503!==2)fail(`503 was not recovered, status=${ok503.status} calls=${calls503}`);

let callsNetwork=0;
const retryNetwork=await makeRuntime(async()=>{
  callsNetwork++;
  if(callsNetwork===1)throw new TypeError('Failed to fetch');
  return {status:200,ok:true};
});
const okNetwork=await retryNetwork.fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'library_batch',import_id:78,rows:[{id:1}]})});
if(okNetwork.status!==200||callsNetwork!==2)fail(`network failure was not recovered, status=${okNetwork.status} calls=${callsNetwork}`);

let callsHung=0;
const retryHung=await makeRuntime(async(_input,init)=>{
  callsHung++;
  if(callsHung>1)return {status:200,ok:true};
  return await new Promise((resolve,reject)=>{
    const signal=init?.signal;
    if(signal?.aborted)return reject(signal.reason);
    signal?.addEventListener('abort',()=>reject(signal.reason||new DOMException('aborted','AbortError')),{once:true});
  });
},{timeout:25,delays:[1,1,1,1,1]});
const okHung=await retryHung.fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'finish',import_id:79,summary:{}})});
if(okHung.status!==200||callsHung!==2)fail(`hung request was not recovered by timeout, status=${okHung.status} calls=${callsHung}`);

let beginCalls=0;
const beginRuntime=await makeRuntime(async()=>{beginCalls++;throw new TypeError('begin response lost')});
let beginFailed=false;
try{await beginRuntime.fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'begin'})})}catch{beginFailed=true}
if(!beginFailed||beginCalls!==1)fail(`begin must remain single-shot, failed=${beginFailed} calls=${beginCalls}`);

if(!source.includes("['library_batch', 'watches_batch', 'finish']"))fail('retry scope no longer explicitly limits idempotent actions');
if(!source.includes("action === 'begin'"))fail('begin single-shot protection missing');
if(!source.includes('requestTimeout15'))fail('request timeout missing');

console.log(`HOTFIX15_RETRY_TRANSPORT_OK transient503=${calls503}; failed_fetch=${callsNetwork}; hung_timeout=${callsHung}; begin_single_shot=${beginCalls}`);
