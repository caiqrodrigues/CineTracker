import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const BASE='https://api.jolpi.ca/ergast/f1';
const jsonHeaders={'content-type':'application/json','cache-control':'public, max-age=120','access-control-allow-origin':'*','access-control-allow-headers':'content-type, authorization, apikey, x-client-info'};
async function get(path:string){const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),10000);try{const r=await fetch(`${BASE}/${path.replace(/^\/+|\/+$/g,'')}/`,{headers:{accept:'application/json'},signal:ctl.signal});if(!r.ok)throw new Error(`jolpica_${r.status}_${path}`);return await r.json()}finally{clearTimeout(t)}}
function racesOf(x:any){return x?.MRData?.RaceTable?.Races||[]}
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('',{status:204,headers:jsonHeaders});
 if(req.method!=='POST')return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers:jsonHeaders});
 try{
  const body=await req.json().catch(()=>({}));const season=String(body?.season||new Date().getUTCFullYear());
  if(!/^(20\d{2})$/.test(season))return new Response(JSON.stringify({error:'invalid_season'}),{status:400,headers:jsonHeaders});
  const races=await get(`${season}/races`);const all=racesOf(races);const now=Date.now();
  const raceTime=(r:any)=>Date.parse(`${r?.date||''}T${r?.time||'23:59:59Z'}`)||0;
  const next=[...all].find(r=>raceTime(r)>=now)||null;const completed=[...all].filter(r=>raceTime(r)<now);const last=completed.at(-1)||null;const round=String(last?.round||'');
  const [drivers,constructors,results,qualifying,sprint,pitstops,laps]=await Promise.all([
    get(`${season}/driverstandings`).catch(()=>null),get(`${season}/constructorstandings`).catch(()=>null),
    round?get(`${season}/${round}/results`).catch(()=>null):null,round?get(`${season}/${round}/qualifying`).catch(()=>null):null,
    round?get(`${season}/${round}/sprint`).catch(()=>null):null,round?get(`${season}/${round}/pitstops`).catch(()=>null):null,
    round?get(`${season}/${round}/laps`).catch(()=>null):null
  ]);
  return new Response(JSON.stringify({season:Number(season),generated_at:new Date().toISOString(),races:all,next,last,drivers,constructors,results,qualifying,sprint,pitstops,laps}),{headers:jsonHeaders});
 }catch(e){return new Response(JSON.stringify({error:'f1_unavailable',message:String(e)}),{status:502,headers:jsonHeaders})}
});
