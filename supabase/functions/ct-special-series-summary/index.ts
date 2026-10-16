import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"private, max-age=300"}});
let publicCache:{at:number;f1Total:number;ufcTotal:number;wweTotal:number;f1Source:string;ufcSource:string;wweSource:string}|null=null;
async function fetchText(url:string,ms=10000){const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),ms);try{const r=await fetch(url,{headers:{accept:"text/html,application/json;q=0.9,*/*;q=0.8","user-agent":"CineTracker/0.3.65"},signal:ctl.signal});if(!r.ok)throw new Error("HTTP_"+r.status);return await r.text()}finally{clearTimeout(timer)}}
async function fetchFirst(urls:string[]){let last:unknown=null;for(const url of urls){try{return await fetchText(url)}catch(e){last=e}}throw last||new Error("FETCH_FAILED")}
async function publicTotals(counts:any){
 if(publicCache&&Date.now()-publicCache.at<6*60*60*1000)return publicCache;
 const fallbackF1=Math.max(Number(counts?.f1?.total||0),1166),fallbackUfc=Math.max(Number(counts?.ufc?.total||0),793),fallbackWwe=Math.max(Number(counts?.wwe_ppv?.total||0),567);
 let f1Total=fallbackF1,ufcTotal=fallbackUfc,wweTotal=fallbackWwe,f1Source="db-v538-floor",ufcSource="db-v538-floor",wweSource="db-v538-floor";
 const wiki="https://en.wikipedia.org/w/api.php?action=parse&page=List_of_WWE_pay-per-view_and_livestreaming_supercards&prop=text&format=json&origin=*";
 const[f1,ufc,wwe]=await Promise.allSettled([fetchText("https://api.jolpi.ca/ergast/f1/races/?limit=1"),fetchFirst(["https://ufcstats.com/statistics/events/completed?page=all","http://ufcstats.com/statistics/events/completed?page=all"]),fetchText(wiki)]);
 if(f1.status==="fulfilled")try{const body=JSON.parse(f1.value),n=Number(body?.MRData?.total||0);if(n>0){f1Total=Math.max(fallbackF1,n);f1Source="jolpica-all-grands-prix"}}catch{}
 if(ufc.status==="fulfilled"){const ids=new Set<string>(),re=/ufcstats\.com\/event-details\/([a-zA-Z0-9]+)/g;let m:RegExpExecArray|null;while((m=re.exec(ufc.value))!==null)ids.add(m[1]);if(ids.size){ufcTotal=Math.max(fallbackUfc,ids.size);ufcSource="ufcstats-completed-events"}}
 if(wwe.status==="fulfilled")try{const body=JSON.parse(wwe.value),html=String(body?.parse?.text?.["*"]||""),plain=html.replace(/<[^>]+>/g," ").replace(/&ndash;|&#8211;/g,"–").replace(/&mdash;|&#8212;/g,"—").replace(/\s+/g," "),m=plain.match(/Overall total\s*[–—-]\s*([\d,]+)/i),n=Number(String(m?.[1]||"").replace(/,/g,""));if(n>0){wweTotal=Math.max(fallbackWwe,n);wweSource="wikipedia-wwe-supercards"}}catch{}
 publicCache={at:Date.now(),f1Total,ufcTotal,wweTotal,f1Source,ufcSource,wweSource};return publicCache
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({error:"METHOD_NOT_ALLOWED"},405);
 try{
  const url=Deno.env.get("SUPABASE_URL")||"",anon=Deno.env.get("SUPABASE_ANON_KEY")||"",auth=req.headers.get("Authorization")||"";if(!url||!anon)return json({error:"SERVER_CONFIG"},500);if(!auth.toLowerCase().startsWith("bearer "))return json({error:"AUTH_REQUIRED"},401);
  const client=createClient(url,anon,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}}),token=auth.replace(/^Bearer\s+/i,"");const{data:{user},error:userError}=await client.auth.getUser(token);if(userError||!user)return json({error:"AUTH_REQUIRED"},401);
  const{data:counts,error}=await client.rpc("cinetracker_special_series_counts_v538");if(error)throw error;const c=Array.isArray(counts)&&counts.length===1?counts[0]:counts||{},totals=await publicTotals(c),f1Watched=Number(c?.f1?.watched||0),ufcWatched=Number(c?.ufc?.watched||0),wweWatched=Number(c?.wwe_ppv?.watched||0);
  return json({ok:true,f1:{watched:f1Watched,total:Math.max(f1Watched,totals.f1Total),source:totals.f1Source},ufc:{watched:ufcWatched,total:Math.max(ufcWatched,totals.ufcTotal),source:totals.ufcSource},wwe:{watched:wweWatched,total:Math.max(wweWatched,totals.wweTotal),source:totals.wweSource},verified_at:"2026-10-16",generated_at:new Date().toISOString()})
 }catch(e){console.error("ct-special-series-summary",e);return json({error:String((e as Error)?.message||e)},500)}
});
