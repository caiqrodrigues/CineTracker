import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const BASE='https://api.jolpi.ca/ergast/f1';
const allowed=/^(current|current\/driverstandings|current\/constructorstandings|current\/last\/(results|qualifying|sprint|pitstops|laps))$/;
Deno.serve(async(req:Request)=>{
  if(req.method!=='POST') return new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers:{'content-type':'application/json'}});
  try{
    const body=await req.json().catch(()=>({}));
    const path=String(body?.path||'').replace(/^\/+|\/+$/g,'');
    if(!allowed.test(path)) return new Response(JSON.stringify({error:'invalid_path'}),{status:400,headers:{'content-type':'application/json'}});
    const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),12000);
    try{
      const r=await fetch(`${BASE}/${path}.json`,{headers:{accept:'application/json'},signal:ctl.signal});
      const text=await r.text();
      return new Response(text,{status:r.status,headers:{'content-type':'application/json','cache-control':'public, max-age=300, s-maxage=600','access-control-allow-origin':'*'}});
    }finally{clearTimeout(t)}
  }catch(e){return new Response(JSON.stringify({error:'f1_unavailable',message:String(e)}),{status:502,headers:{'content-type':'application/json'}})}
});
