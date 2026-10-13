import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});
const norm=(v:unknown)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
function eventKey(title:unknown){
  const n=norm(title);let m=n.match(/^ufc\s+(\d+(?:\.\d+)?)/);if(m)return "ppv:"+m[1];
  m=n.match(/^ufc\s+fight\s+night\s+(\d+)/);if(m)return "fn:"+m[1];
  m=n.match(/^ufc\s+on\s+(espn|abc|fox)\s+(\d+)/);if(m)return "on:"+m[1]+":"+m[2];
  return n;
}
const decode=(v:string)=>v.replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
function statusOf(e:any){const t=e?.status?.type||e?.competitions?.[0]?.status?.type||{};if(t?.completed===true||String(t?.state||"").toLowerCase()==="post")return "finished";if(String(t?.state||"").toLowerCase()==="in")return "live";return "scheduled"}
const venueOf=(e:any)=>String(e?.competitions?.[0]?.venue?.fullName||e?.venue?.fullName||"").trim()||null;
const imageOf=(e:any)=>String(e?.image||e?.logo||e?.competitions?.[0]?.image||"").trim()||null;

async function espnSeason(season:number){
  const start=String(season)+"0101",end=String(season)+"1231";
  const url="https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?dates="+start+"-"+end+"&limit=500";
  try{
    const r=await fetch(url,{headers:{accept:"application/json","user-agent":"CineTracker/0.3.44"}});
    if(!r.ok)return [];
    const d=await r.json();
    return (Array.isArray(d?.events)?d.events:[]).filter((e:any)=>/^UFC\b/i.test(String(e?.name||e?.shortName||""))).filter((e:any)=>{const dt=new Date(e?.date||0);return Number.isFinite(dt.getTime())&&dt.getUTCFullYear()===season}).map((e:any)=>{
      const title=String(e?.name||e?.shortName||"UFC").trim(),id=String(e?.id||"").trim(),starts=new Date(e.date);
      return {key:eventKey(title),provider:"espn:mma",provider_event_id:"ufc:"+id,title,starts_at:starts.toISOString(),ends_at:new Date(starts.getTime()+3*60*60*1000).toISOString(),status:statusOf(e),venue:venueOf(e),image_url:imageOf(e),raw:{...e,ct_source:"espn-full-season"}};
    }).filter((x:any)=>x.provider_event_id!=="ufc:");
  }catch{return []}
}
async function statsSeason(season:number){
  let html="";
  for(const url of ["https://ufcstats.com/statistics/events/completed?page=all","http://ufcstats.com/statistics/events/completed?page=all"]){
    try{const r=await fetch(url,{headers:{accept:"text/html","user-agent":"Mozilla/5.0 CineTracker/0.3.44"}});if(r.ok){html=await r.text();if(html.length>1000)break}}catch{}
  }
  if(!html)return [];
  const out:any[]=[];
  const re=/<tr[^>]*data-link=["'][^"']*event-details\/([^"']+)["'][^>]*>([\s\S]*?)<\/tr>/gi;
  for(const m of html.matchAll(re)){
    const id=String(m[1]||"").trim(),row=String(m[2]||"");
    const am=row.match(/<a[^>]*class=["'][^"']*b-link[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
    const dm=row.match(/<span[^>]*class=["'][^"']*b-statistics__date[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const title=decode(am?.[1]||""),dateText=decode(dm?.[1]||"");
    if(!id||!/^UFC\b/i.test(title)||!dateText)continue;
    const starts=new Date(dateText+" 12:00:00 UTC");if(!Number.isFinite(starts.getTime())||starts.getUTCFullYear()!==season)continue;
    out.push({key:eventKey(title),provider:"ufcstats",provider_event_id:"ufcstats:"+id,title,starts_at:starts.toISOString(),ends_at:new Date(starts.getTime()+3*60*60*1000).toISOString(),status:"finished",venue:null,image_url:null,raw:{ct_source:"ufcstats-completed",ufcstats_event_id:id}});
  }
  return out;
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405);
  try{
    const url=Deno.env.get("SUPABASE_URL"),anon=Deno.env.get("SUPABASE_ANON_KEY"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),auth=req.headers.get("Authorization")||"";
    if(!url||!anon||!service)return json({error:"SERVER_CONFIG"},500);
    if(!auth.toLowerCase().startsWith("bearer "))return json({error:"AUTH_REQUIRED"},401);
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
    const {data:{user},error:userError}=await userClient.auth.getUser();if(userError||!user)return json({error:"AUTH_REQUIRED"},401);

    const body=await req.json().catch(()=>({})),now=new Date(),season=Number(body?.season||now.getUTCFullYear()),current=now.getUTCFullYear();
    if(!Number.isInteger(season)||season<1993||season>current+1)return json({error:"INVALID_SEASON"},400);

    const [espn,stats]=await Promise.all([espnSeason(season),statsSeason(season)]);
    const remoteByKey=new Map<string,any>();
    for(const x of stats)if(x.key&&!remoteByKey.has(x.key))remoteByKey.set(x.key,x);
    for(const x of espn)if(x.key)remoteByKey.set(x.key,{...(remoteByKey.get(x.key)||{}),...x});
    const remote=[...remoteByKey.values()];

    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:comp,error:compError}=await admin.from("sport_entities").select("id,logo_url").eq("sport_slug","mma").eq("entity_type","competition").ilike("name","UFC").order("id").limit(1).maybeSingle();
    if(compError||!comp?.id)return json({error:"UFC_COMPETITION_MISSING"},500);

    const from=season+"-01-01T00:00:00Z",to=(season+1)+"-01-01T00:00:00Z";
    const {data:existing,error:existingError}=await admin.from("sport_events").select("id,title,provider,provider_event_id,starts_at").eq("sport_slug","mma").eq("competition_entity_id",comp.id).gte("starts_at",from).lt("starts_at",to).limit(2000);
    if(existingError)throw existingError;
    const existingByKey=new Map<string,any>();for(const row of existing||[]){const k=eventKey(row.title);if(k&&!existingByKey.has(k))existingByKey.set(k,row)}

    const missing:any[]=[];
    for(const e of remote){
      if(!e.key||existingByKey.has(e.key))continue;
      missing.push({sport_slug:"mma",provider:e.provider,provider_event_id:e.provider_event_id,competition_entity_id:comp.id,home_entity_id:null,away_entity_id:null,title:e.title,starts_at:e.starts_at,ends_at:e.ends_at,status:e.status,season:String(season),round:null,venue:e.venue,home_score:null,away_score:null,image_url:e.image_url,participants:[],raw:{...e.raw,ct_ufc_event_key:e.key},last_synced_at:new Date().toISOString(),updated_at:new Date().toISOString()});
    }
    if(missing.length){const {error}=await admin.from("sport_events").upsert(missing,{onConflict:"provider,provider_event_id",ignoreDuplicates:false});if(error)throw error}

    const {data:all,error:allError}=await admin.from("sport_events").select("id,title,provider,provider_event_id,starts_at,status,season,venue,image_url").eq("sport_slug","mma").eq("competition_entity_id",comp.id).gte("starts_at",from).lt("starts_at",to).order("starts_at",{ascending:true}).limit(2000);
    if(allError)throw allError;
    const seen=new Set<string>(),deduped:any[]=[];for(const row of all||[]){if(!/^UFC\b/i.test(String(row.title||"")))continue;const k=eventKey(row.title);if(!k||seen.has(k))continue;seen.add(k);deduped.push(row)}
    return json({ok:true,season,source:"espn+ufcstats-full-season",espn_count:espn.length,ufcstats_count:stats.length,remote_count:remote.length,inserted:missing.length,total_events:deduped.length,events:deduped});
  }catch(e){console.error("ct-ufc-series-sync",e);return json({error:String((e as Error)?.message||e)},500)}
});
