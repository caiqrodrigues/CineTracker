import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const saoPauloDay=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
const shiftDay=(day:string,n:number)=>{const d=new Date(`${day}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)};
const sessionDefs=[
  ['qualifying','Classificação','Qualifying',120],
  ['sprint_qualifying','Sprint Qualifying','SprintQualifying',90],
  ['sprint','Sprint','Sprint',120],
  ['race','Corrida',null,180]
] as const;
function startIso(o:any){if(!o?.date)return null;const d=new Date(`${o.date}T${o.time||'00:00:00Z'}`);return Number.isNaN(d.getTime())?null:d.toISOString()}
function statusFor(start:string,duration:number){const a=Date.parse(start),now=Date.now();if(now<a)return'scheduled';if(now<=a+duration*60000)return'live';return'finished'}

Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
 if(req.method!=='POST')return json({error:'POST required'},405);
 try{
  const url=Deno.env.get('SUPABASE_URL')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,auth=req.headers.get('authorization')||'';
  if(!auth.toLowerCase().startsWith('bearer '))return json({error:'authorization required'},401);
  const admin=createClient(url,service),userSb=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:u,error:ue}=await userSb.auth.getUser();if(ue||!u?.user?.id)return json({error:'invalid session'},401);
  let body:any={};try{body=await req.json()}catch{}
  const today=saoPauloDay(),from=DAY.test(String(body?.date_from||''))?String(body.date_from):shiftDay(today,-1),to=DAY.test(String(body?.date_to||''))?String(body.date_to):shiftDay(today,1);
  const min=from<shiftDay(today,-7)?shiftDay(today,-7):from,max=to>shiftDay(today,14)?shiftDay(today,14):to,years=[...new Set([min.slice(0,4),max.slice(0,4)])];
  const {data:comp}=await admin.from('sport_entities').select('id').eq('sport_slug','formula_1').eq('entity_type','competition').ilike('name','Formula 1').order('id').limit(1).maybeSingle();
  let competitionId=comp?.id||null;
  if(!competitionId){const {data:c,error:ce}=await admin.from('sport_entities').upsert({sport_slug:'formula_1',entity_type:'competition',provider:'jolpica:f1',provider_id:'formula-1',name:'Formula 1',metadata:{source:'jolpica'},updated_at:new Date().toISOString()},{onConflict:'provider,entity_type,provider_id'}).select('id').single();if(ce)throw ce;competitionId=c.id}
  const rows:any[]=[];
  for(const year of years){
   const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),7000);let data:any;
   try{const r=await fetch(`https://api.jolpi.ca/ergast/f1/${year}/races/`,{headers:{accept:'application/json','user-agent':'CineTracker/1.0.54'},signal:ctl.signal});if(!r.ok)throw new Error(`jolpica_${r.status}`);data=await r.json()}finally{clearTimeout(timer)}
   for(const race of data?.MRData?.RaceTable?.Races||[]){
    for(const [key,label,prop,duration] of sessionDefs){const src=prop?race?.[prop]:race,iso=startIso(src);if(!iso)continue;const localDay=saoPauloDay(new Date(iso));if(localDay<min||localDay>max)continue;const end=new Date(Date.parse(iso)+duration*60000).toISOString();rows.push({sport_slug:'formula_1',provider:'jolpica:f1',provider_event_id:`${race.season}:${race.round}:${key}`,competition_entity_id:competitionId,title:`${race.raceName} · ${label}`,starts_at:iso,ends_at:end,status:statusFor(iso,duration),season:String(race.season),round:String(race.round),venue:race?.Circuit?.circuitName||null,participants:[],raw:{source:'jolpica',session:key,race_name:race.raceName,circuit:race.Circuit||null},last_synced_at:new Date().toISOString(),updated_at:new Date().toISOString()})}
   }
  }
  if(rows.length){const {error}=await admin.from('sport_events').upsert(rows,{onConflict:'provider,provider_event_id'});if(error)throw error}
  return json({ok:true,version:'f1-sports-r263-v1',date_from:min,date_to:max,events_upserted:rows.length,events:rows.map(x=>({provider_event_id:x.provider_event_id,title:x.title,starts_at:x.starts_at,status:x.status}))});
 }catch(e){return json({error:String(e)},500)}
});
