import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
 "Access-Control-Allow-Origin":"*",
 "Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info",
 "Access-Control-Allow-Methods":"POST, OPTIONS",
 "Cache-Control":"no-store",
};
const respond=(body:unknown,status=200)=>new Response(JSON.stringify(body),{
 status,headers:{...CORS,"content-type":"application/json"}
});
const targets=[
 {tmdbId:4656,name:"Raw",fallbackSeason:34},
 {tmdbId:1549,name:"WWE Friday Night SmackDown",fallbackSeason:28}
] as const;
const rows=(x:unknown):any[]=>Array.isArray(x)?x:[];
const isoDate=(x:unknown)=>typeof x==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(x)?x:"";
const localDate=()=>new Intl.DateTimeFormat("en-CA",{
 timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"
}).format(new Date());
const num=(x:unknown)=>Number.isFinite(Number(x))?Number(x):0;
const epoch=(x:unknown)=>{const d=Date.parse(String(x||""));return Number.isFinite(d)?d:0};
const bounded=async(url:string,auth:string)=>{
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),9000);
 try{
  const result=await fetch(url,{headers:{Authorization:`Bearer ${auth}`,Accept:"application/json"},signal:controller.signal});
  if(!result.ok)throw Error("TMDB HTTP "+result.status);
  const data=await result.json();
  if(!data||typeof data!=="object")throw Error("TMDB INVALID_RESPONSE");
  return data;
 }finally{clearTimeout(timer)}
};
function preferredLatest(candidates:any[],today:string){
 return rows(candidates)
  .filter(x=>isoDate(x?.air_date)&&x.air_date<=today&&num(x?.season_number)>0&&num(x?.episode_number)>0)
  .sort((a,b)=>String(b.air_date).localeCompare(String(a.air_date))||
   num(b.season_number)-num(a.season_number)||num(b.episode_number)-num(a.episode_number))[0]||null;
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:CORS});
 if(req.method!=="POST")return respond({error:"POST required"},405);
 try{
  const supaUrl=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),anon=Deno.env.get("SUPABASE_ANON_KEY");
  if(!supaUrl||!service||!anon)return respond({error:"CONFIG_UNAVAILABLE"},503);
  const bearer=req.headers.get("authorization")||"";
  if(!/^Bearer\s+\S+$/i.test(bearer))return respond({error:"AUTH_REQUIRED"},401);
  const userDb=createClient(supaUrl,anon,{global:{headers:{Authorization:bearer}}});
  const {data:verified,error:userError}=await userDb.auth.getUser();
  if(userError||!verified?.user?.id)return respond({error:"SESSION_INVALID"},401);
  const admin=createClient(supaUrl,service);
  const today=localDate(),now=new Date().toISOString();
  const {data:media,error:mediaError}=await admin.from("media")
   .select("id,tmdb_id,raw_tmdb,total_episodes,poster_path")
   .eq("media_type","tv").in("tmdb_id",targets.map(x=>x.tmdbId));
  if(mediaError)throw mediaError;
  const current=rows(media);
  const due=current.filter(m=>!epoch(m?.raw_tmdb?.ct_wwe_sync_checked_at)||
   Date.now()-epoch(m?.raw_tmdb?.ct_wwe_sync_checked_at)>75*60000);
  if(!due.length){
   const refs=current.map(m=>({
    tmdb_id:m.tmdb_id,last_episode_to_air:m.raw_tmdb?.last_episode_to_air||null
   }));
   return respond({ok:true,checked:false,cache:"75min",shows:refs,source:"tmdb+wwe-official-catalog",at:now});
  }
  const {data:accessToken,error:tokenError}=await admin.rpc("cinetracker_tmdb_token");
  if(tokenError||!accessToken)return respond({error:"TMDB_TOKEN_UNAVAILABLE"},503);
  const output=[] as any[];
  for(const m of due){
   const target=targets.find(x=>x.tmdbId===num(m.tmdb_id));
   if(!target)continue;
   try{
    const remote=await bounded(`https://api.themoviedb.org/3/tv/${target.tmdbId}?language=pt-BR`,accessToken);
    const season=num(remote.last_episode_to_air?.season_number)||
     Math.max(0,...rows(remote.seasons).map(s=>num(s.season_number)))||target.fallbackSeason;
    if(!(season>=1&&season<=100))throw Error("INVALID_SEASON");
    const seasonResult=await bounded(
     `https://api.themoviedb.org/3/tv/${target.tmdbId}/season/${season}?language=pt-BR`,accessToken);
    const candidate=rows(seasonResult.episodes).filter(x=>isoDate(x.air_date)&&
     x.air_date<=today&&num(x.episode_number)>0);
    const recent=candidate.filter(x=>epoch(x.air_date)>=Date.now()-75*86400000);
    if(recent.length){
     const inserts=recent.map(ep=>({
      show_tmdb_id:target.tmdbId,season_number:season,episode_number:num(ep.episode_number),
      episode_tmdb_id:num(ep.id)||null,
      show_name:String(remote.name||target.name),show_original_name:String(remote.original_name||target.name),
      name_local:String(ep.name||"").trim()||"Episódio "+num(ep.episode_number),
      name_en:String(ep.name||"").trim()||"Episode "+num(ep.episode_number),
      air_date:ep.air_date,vote_average:num(ep.vote_average),still_path:ep.still_path||null,
      poster_path:remote.poster_path||m.poster_path||null,updated_at:now
     }));
     // Preserve previously verified episodes from official WWE.com where
     // TMDB has not yet indexed the newest edition or name.
     const {error:insertError}=await admin.from("episode_catalog_v336")
      .upsert(inserts,{onConflict:"show_tmdb_id,season_number,episode_number",ignoreDuplicates:true});
     if(insertError)throw insertError;
    }
    const {data:catalog,error:catalogError}=await admin.from("episode_catalog_v336")
     .select("season_number,episode_number,air_date,name_local")
     .eq("show_tmdb_id",target.tmdbId).lte("air_date",today)
     .order("air_date",{ascending:false}).order("episode_number",{ascending:false}).limit(1);
    if(catalogError)throw catalogError;
    const latest=preferredLatest([
     ...rows(catalog),remote.last_episode_to_air,m.raw_tmdb?.last_episode_to_air
    ],today);
    const existing=m.raw_tmdb||{};
    const finalLast=latest?{
     ...(existing.last_episode_to_air||{}),
     ...((remote.last_episode_to_air?.air_date===latest.air_date)?remote.last_episode_to_air:{}),
     season_number:num(latest.season_number),episode_number:num(latest.episode_number),
     air_date:latest.air_date,name:String(latest.name_local||latest.name||"Episódio "+latest.episode_number)
    }:existing.last_episode_to_air||remote.last_episode_to_air||null;
    const raw={
     ...existing,...remote,
     source_tmdb_id:target.tmdbId,
     last_episode_to_air:finalLast,
     next_episode_to_air:isoDate(remote.next_episode_to_air?.air_date)&&
       remote.next_episode_to_air.air_date>today?remote.next_episode_to_air:null,
     ct_wwe_sync_checked_at:now
    };
    const total=Math.max(num(m.total_episodes),num(remote.number_of_episodes));
    const {error:updateError}=await admin.from("media")
     .update({raw_tmdb:raw,total_episodes:total||m.total_episodes,updated_at:now})
     .eq("id",m.id);
    if(updateError)throw updateError;
    output.push({tmdb_id:target.tmdbId,ok:true,
     last_episode_to_air:finalLast,episodes_discovered:recent.length});
   }catch(e){
    output.push({tmdb_id:target.tmdbId,ok:false,error:String(e).slice(0,130)});
   }
  }
  return respond({ok:output.some(x=>x.ok),checked:true,shows:output,
   source:"tmdb+wwe-official-catalog",at:now},output.some(x=>x.ok)?200:502);
 }catch(error){return respond({error:String(error).slice(0,300)},500)}
});