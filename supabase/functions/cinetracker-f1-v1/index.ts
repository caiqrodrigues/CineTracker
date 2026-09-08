import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const BASE='https://api.jolpi.ca/ergast/f1';
const headers={
  'content-type':'application/json',
  'cache-control':'public, max-age=120',
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'access-control-allow-headers':'authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage'
};
const cache=new Map<string,{at:number,data:any}>();
const sleep=(ms:number)=>new Promise(r=>setTimeout(r,ms));
async function get(path:string,tries=2){let last:any=null;for(let i=0;i<tries;i++){const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),8000);try{const r=await fetch(`${BASE}/${path.replace(/^\/+|\/+$/g,'')}/`,{headers:{accept:'application/json','user-agent':'CineTracker/1.0.13'},signal:ctl.signal});if(!r.ok)throw new Error(`jolpica_${r.status}_${path}`);return await r.json()}catch(e){last=e;if(i+1<tries)await sleep(250*(i+1))}finally{clearTimeout(t)}}throw last||new Error(`jolpica_failed_${path}`)}
function racesOf(x:any){return x?.MRData?.RaceTable?.Races||[]}
async function opt(path:string){try{return await get(path,2)}catch{return null}}
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response(JSON.stringify({ok:true}),{status:200,headers});
 if(req.method!=='POST')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers});
 try{
  const body=await req.json().catch(()=>({}));const season=String(body?.season||new Date().getUTCFullYear());if(!/^(20\d{2})$/.test(season))return new Response(JSON.stringify({error:'invalid_season'}),{status:400,headers});
  const hit=cache.get(season);if(hit&&Date.now()-hit.at<120000)return new Response(JSON.stringify({...hit.data,cached:true}),{headers});
  let races:any=null;try{races=await get(`${season}/races`,3)}catch(e){if(hit)return new Response(JSON.stringify({...hit.data,cached:true,stale:true,warning:String(e)}),{headers});throw e}
  const all=racesOf(races),now=Date.now();const raceTime=(r:any)=>Date.parse(`${r?.date||''}T${r?.time||'23:59:59Z'}`)||0;const next=[...all].find(r=>raceTime(r)>=now)||null,completed=[...all].filter(r=>raceTime(r)<now),last=completed.at(-1)||null,lastRound=String(last?.round||''),nextRound=String(next?.round||'');
  const [drivers,constructors,results,qualifying,sprint,pitstops,laps,nextQualifying]=await Promise.all([opt(`${season}/driverstandings`),opt(`${season}/constructorstandings`),lastRound?opt(`${season}/${lastRound}/results`):null,lastRound?opt(`${season}/${lastRound}/qualifying`):null,lastRound?opt(`${season}/${lastRound}/sprint`):null,lastRound?opt(`${season}/${lastRound}/pitstops`):null,lastRound?opt(`${season}/${lastRound}/laps`):null,nextRound?opt(`${season}/${nextRound}/qualifying`):null]);
  const data={season:Number(season),generated_at:new Date().toISOString(),races:all,next,last,drivers,constructors,results,qualifying,sprint,pitstops,laps,nextQualifying,partial:[drivers,constructors,results,qualifying,sprint,pitstops,laps].some(x=>x==null)};cache.set(season,{at:Date.now(),data});return new Response(JSON.stringify(data),{headers});
 }catch(e){return new Response(JSON.stringify({error:'f1_unavailable',message:String(e)}),{status:502,headers})}
});
