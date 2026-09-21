import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});
const n=(v:any)=>{const x=Number(v);return Number.isFinite(x)?x:0};
const today=()=>new Date().toISOString().slice(0,10);
const stale=(m:any)=>{
  const next=String(m?.raw_tmdb?.next_episode_to_air?.air_date||'').slice(0,10);
  if(next&&next<=today())return true;
  const ts=Date.parse(m?.updated_at||m?.raw_tmdb?.enriched_at||'')||0;
  return !ts||Date.now()-ts>=6*60*60*1000;
};

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  if(req.method!=='POST')return json({error:'POST required'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!, serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, anonKey=Deno.env.get('SUPABASE_ANON_KEY')!;
    const auth=req.headers.get('authorization')||'';
    if(!auth.toLowerCase().startsWith('bearer '))return json({error:'authorization required'},401);
    const admin=createClient(url,serviceKey), userSb=createClient(url,anonKey,{global:{headers:{Authorization:auth}}});
    const {data:userData,error:userError}=await userSb.auth.getUser();
    if(userError||!userData?.user?.id)return json({error:'invalid session'},401);
    const {data:dashboard,error:de}=await userSb.rpc('cinetracker_profile_media_dashboard_v0991');
    if(de)return json({error:'dashboard unavailable'},500);
    const dash=(Array.isArray(dashboard)?dashboard:[]).filter((x:any)=>String(x.media_type)==='tv'&&n(x.watched_episodes)>0);
    const ids=[...new Set(dash.map((x:any)=>n(x.media_id)).filter((x:number)=>x>0))];
    if(!ids.length)return json({ok:true,processed:0,refreshed:0,skipped:0});
    const {data:token,error:te}=await admin.rpc('cinetracker_tmdb_token');
    if(te||!token)return json({error:'tmdb token unavailable'},500);
    const {data:media,error:me}=await admin.from('media').select('id,tmdb_id,media_type,title,poster_path,runtime_minutes,total_episodes,raw_tmdb,updated_at').in('id',ids);
    if(me)throw me;
    const priority=new Map(dash.map((x:any)=>[n(x.media_id),(x.is_up_to_date?1000:0)+(x.is_in_progress?500:0)+n(x.watched_episodes)]));
    const work=(media||[]).filter((m:any)=>stale(m)).sort((a:any,b:any)=>(priority.get(b.id)||0)-(priority.get(a.id)||0)).slice(0,80);
    let refreshed=0,failed=0;
    for(let i=0;i<work.length;i+=8){
      await Promise.all(work.slice(i,i+8).map(async(m:any)=>{
        try{
          const tmdbId=n(m.tmdb_id)>0?n(m.tmdb_id):n(m.raw_tmdb?.source_tmdb_id);
          if(!(tmdbId>0))return;
          const r=await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?language=pt-BR`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
          if(!r.ok)throw new Error(`TMDB ${r.status}`);
          const d=await r.json();
          const genres=(d.genres||[]).map((g:any)=>g.name).filter(Boolean);
          const countries=d.origin_country||[];
          const anime=countries.includes('JP')&&genres.some((g:string)=>/anima/i.test(g));
          const raw={...(m.raw_tmdb||{}),...d,source_tmdb_id:tmdbId,enriched_at:new Date().toISOString()};
          const patch={
            title:d.name||m.title,
            original_title:d.original_name||null,
            release_year:Number(String(d.first_air_date||'').slice(0,4))||null,
            poster_path:d.poster_path||m.poster_path||null,
            runtime_minutes:(d.episode_run_time||[])[0]||m.runtime_minutes||null,
            total_seasons:d.number_of_seasons||null,
            total_episodes:d.number_of_episodes||m.total_episodes||null,
            genres,
            media_kind:anime?'anime':'series',
            raw_tmdb:raw,
            updated_at:new Date().toISOString()
          };
          const {error:ue}=await admin.from('media').update(patch).eq('id',m.id);
          if(ue)throw ue;
          refreshed++;
        }catch{failed++}
      }));
    }
    return json({ok:true,processed:work.length,refreshed,failed,skipped:Math.max(0,(media||[]).length-work.length),version:'tv-state-refresh-v1'});
  }catch(e){return json({error:String(e)},500)}
});
