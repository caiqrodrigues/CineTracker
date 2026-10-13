import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS",
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}});

function norm(v:unknown){
  return String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
}
function eventKey(title:unknown){
  const n=norm(title);
  let m=n.match(/^ufc\s+(\d+(?:\.\d+)?)/);
  if(m)return "ppv:"+m[1];
  m=n.match(/^ufc\s+fight\s+night\s+(\d+)/);
  if(m)return "fn:"+m[1];
  m=n.match(/^ufc\s+on\s+(espn|abc|fox)\s+(\d+)/);
  if(m)return "on:"+m[1]+":"+m[2];
  return n;
}
function statusOf(e:any){
  const t=e?.status?.type||e?.competitions?.[0]?.status?.type||{};
  if(t?.completed===true||String(t?.state||"").toLowerCase()==="post")return "finished";
  if(String(t?.state||"").toLowerCase()==="in")return "live";
  return "scheduled";
}
function venueOf(e:any){
  return String(e?.competitions?.[0]?.venue?.fullName||e?.venue?.fullName||"").trim()||null;
}
function imageOf(e:any){
  const c=e?.competitions?.[0];
  return String(e?.image||e?.logo||c?.image||"").trim()||null;
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
  if(req.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405);
  try{
    const url=Deno.env.get("SUPABASE_URL");
    const anon=Deno.env.get("SUPABASE_ANON_KEY");
    const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const auth=req.headers.get("Authorization")||"";
    if(!url||!anon||!service)return json({error:"SERVER_CONFIG"},500);
    if(!auth.toLowerCase().startsWith("bearer "))return json({error:"AUTH_REQUIRED"},401);

    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
    const {data:{user},error:userError}=await userClient.auth.getUser();
    if(userError||!user)return json({error:"AUTH_REQUIRED"},401);

    const body=await req.json().catch(()=>({}));
    const now=new Date();
    const season=Number(body?.season||now.getUTCFullYear());
    const current=now.getUTCFullYear();
    if(!Number.isInteger(season)||season<1993||season>current+1)return json({error:"INVALID_SEASON"},400);

    const start=String(season)+"0101",end=String(season)+"1231";
    const espnUrl="https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard?dates="+start+"-"+end+"&limit=500";
    const remoteRes=await fetch(espnUrl,{headers:{"accept":"application/json","user-agent":"CineTracker/0.3.40"}});
    if(!remoteRes.ok)return json({error:"UFC_SOURCE_"+remoteRes.status},502);
    const remote=await remoteRes.json();
    const events=(Array.isArray(remote?.events)?remote.events:[])
      .filter((e:any)=>/^UFC\b/i.test(String(e?.name||e?.shortName||"")))
      .filter((e:any)=>{const d=new Date(e?.date||0);return Number.isFinite(d.getTime())&&d.getUTCFullYear()===season;});

    const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:comp,error:compError}=await admin.from("sport_entities")
      .select("id,logo_url").eq("sport_slug","mma").eq("entity_type","competition").ilike("name","UFC").order("id").limit(1).maybeSingle();
    if(compError||!comp?.id)return json({error:"UFC_COMPETITION_MISSING"},500);

    const from=season+"-01-01T00:00:00Z",to=(season+1)+"-01-01T00:00:00Z";
    const {data:existing,error:existingError}=await admin.from("sport_events")
      .select("id,title,provider,provider_event_id,starts_at")
      .eq("sport_slug","mma").eq("competition_entity_id",comp.id).gte("starts_at",from).lt("starts_at",to).limit(1000);
    if(existingError)throw existingError;

    const existingByKey=new Map<string,any>();
    for(const row of existing||[]){
      const k=eventKey(row.title);
      if(k&&!existingByKey.has(k))existingByKey.set(k,row);
    }

    const missing:any[]=[];
    let matched=0;
    for(const e of events){
      const title=String(e?.name||e?.shortName||"UFC").trim();
      const k=eventKey(title);
      if(k&&existingByKey.has(k)){matched++;continue}
      const id=String(e?.id||"").trim();
      if(!id)continue;
      const starts=new Date(e.date);
      const ends=new Date(starts.getTime()+3*60*60*1000);
      missing.push({
        sport_slug:"mma",
        provider:"espn:mma",
        provider_event_id:"ufc:"+id,
        competition_entity_id:comp.id,
        home_entity_id:null,
        away_entity_id:null,
        title,
        starts_at:starts.toISOString(),
        ends_at:ends.toISOString(),
        status:statusOf(e),
        season:String(season),
        round:null,
        venue:venueOf(e),
        home_score:null,
        away_score:null,
        image_url:imageOf(e),
        participants:[],
        raw:{...e,ct_source:"espn-full-season",ct_ufc_event_key:k},
        last_synced_at:new Date().toISOString(),
        updated_at:new Date().toISOString(),
      });
    }
    if(missing.length){
      const {error}=await admin.from("sport_events").upsert(missing,{onConflict:"provider,provider_event_id",ignoreDuplicates:false});
      if(error)throw error;
    }

    const {data:all,error:allError}=await admin.from("sport_events")
      .select("id,title,provider,provider_event_id,starts_at,status,season,venue,image_url")
      .eq("sport_slug","mma").eq("competition_entity_id",comp.id).gte("starts_at",from).lt("starts_at",to)
      .order("starts_at",{ascending:true}).limit(1000);
    if(allError)throw allError;

    const seen=new Set<string>(),deduped:any[]=[];
    for(const row of all||[]){
      if(!/^UFC\b/i.test(String(row.title||"")))continue;
      const k=eventKey(row.title);
      if(!k||seen.has(k))continue;
      seen.add(k);deduped.push(row);
    }
    return json({
      ok:true,season,source:"espn-full-season",
      remote_count:events.length,matched_existing:matched,inserted:missing.length,
      total_events:deduped.length,events:deduped,
    });
  }catch(e){
    console.error("ct-ufc-series-sync",e);
    return json({error:String((e as Error)?.message||e)},500);
  }
});