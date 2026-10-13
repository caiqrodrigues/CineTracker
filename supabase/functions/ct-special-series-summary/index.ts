import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"private, max-age=60"}});
let publicCache:{at:number;f1Total:number|null;ufcTotal:number|null;f1Source:string;ufcSource:string}|null=null;
async function fetchText(url:string,ms=7000){const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),ms);try{const r=await fetch(url,{headers:{accept:"text/html,application/json;q=0.9,*/*;q=0.8","user-agent":"CineTracker/0.3.43"},signal:ctl.signal});if(!r.ok)throw new Error("HTTP_"+r.status);return await r.text()}finally{clearTimeout(timer)}}
async function publicTotals(progress:any){
 if(publicCache&&Date.now()-publicCache.at<6*60*60*1000)return publicCache;
 const fallbackF1=Math.max(Number(progress?.f1?.mapped_sessions||0),Number(progress?.f1?.mapped_races||0)),fallbackUfc=Math.max(Number(progress?.ufc?.known_events||0),0);
 let f1Total:number|null=null,ufcTotal:number|null=null,f1Source="db-fallback",ufcSource="db-fallback";
 const [f1,ufc]=await Promise.allSettled([fetchText("https://api.jolpi.ca/ergast/f1/races/?limit=1"),fetchText("http://ufcstats.com/statistics/events/completed?page=all")]);
 if(f1.status==="fulfilled")try{const body=JSON.parse(f1.value),allRaces=Number(body?.MRData?.total||0),mappedRaces=Number(progress?.f1?.mapped_races||0),mappedSessions=Number(progress?.f1?.mapped_sessions||0);if(allRaces>0){f1Total=Math.max(mappedSessions,allRaces-Math.min(allRaces,mappedRaces)+mappedSessions);f1Source="jolpica-all-races+mapped-sessions"}}catch{}
 if(ufc.status==="fulfilled"){const ids=new Set<string>(),re=/ufcstats\.com\/event-details\/([a-zA-Z0-9]+)/g;let m:RegExpExecArray|null;while((m=re.exec(ufc.value))!==null)ids.add(m[1]);if(ids.size>0){ufcTotal=Math.max(ids.size,fallbackUfc);ufcSource="ufcstats-completed-events"}}
 publicCache={at:Date.now(),f1Total:f1Total||fallbackF1,ufcTotal:ufcTotal||fallbackUfc,f1Source,ufcSource};return publicCache;
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405);
 try{
  const url=Deno.env.get("SUPABASE_URL")||"",anon=Deno.env.get("SUPABASE_ANON_KEY")||"",auth=req.headers.get("Authorization")||"";
  if(!url||!anon)return json({error:"SERVER_CONFIG"},500);if(!auth.toLowerCase().startsWith("bearer "))return json({error:"AUTH_REQUIRED"},401);
  const client=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}}),token=auth.replace(/^Bearer\s+/i,"");
  const {data:{user},error:userError}=await client.auth.getUser(token);if(userError||!user)return json({error:"AUTH_REQUIRED"},401);
  const {data:progress,error}=await client.rpc("cinetracker_special_series_progress_v516");if(error)throw error;
  const p=Array.isArray(progress)&&progress.length===1?progress[0]:progress||{},totals=await publicTotals(p),f1Watched=Number(p?.f1?.watched||0),ufcWatched=Number(p?.ufc?.watched||0);
  return json({ok:true,f1:{watched:f1Watched,total:Math.max(f1Watched,Number(totals.f1Total||0)),source:totals.f1Source},ufc:{watched:ufcWatched,total:Math.max(ufcWatched,Number(totals.ufcTotal||0)),source:totals.ufcSource},generated_at:new Date().toISOString()});
 }catch(e){console.error("ct-special-series-summary",e);return json({error:String((e as Error)?.message||e)},500)}
});
