import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});
const norm=(v:any)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const sportSlug=(name:any)=>{
  const n=norm(name);
  if(n.includes('soccer')||n.includes('football'))return n.includes('american')?'american_football':'soccer';
  if(n.includes('basketball'))return'basketball';if(n.includes('ice hockey')||n==='hockey')return'ice_hockey';if(n.includes('baseball'))return'baseball';if(n.includes('tennis'))return'tennis';if(n.includes('volleyball'))return'volleyball';if(n.includes('handball'))return'handball';if(n.includes('rugby'))return'rugby';if(n.includes('motor'))return'formula_1';if(n.includes('mma')||n.includes('fighting'))return'mma';return'soccer';
};

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  if(req.method!=='POST')return json({error:'POST required'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,anonKey=Deno.env.get('SUPABASE_ANON_KEY')!,auth=req.headers.get('authorization')||'';
    if(!auth.toLowerCase().startsWith('bearer '))return json({error:'authorization required'},401);
    const admin=createClient(url,serviceKey),userSb=createClient(url,anonKey,{global:{headers:{Authorization:auth}}});
    const {data:userData,error:userError}=await userSb.auth.getUser();if(userError||!userData?.user?.id)return json({error:'invalid session'},401);
    const body=await req.json().catch(()=>({})),q=String(body?.query||'').trim(),limit=Math.max(5,Math.min(Number(body?.limit||24),40));
    if(q.length<2)return json({entities:[],query:q});

    async function local(){
      const [{data:byName},{data:byShort},{data:catalog}]=await Promise.all([
        admin.from('sport_entities').select('id,sport_slug,entity_type,provider,provider_id,name,short_name,country,logo_url,image_url').ilike('name',`%${q}%`).limit(limit),
        admin.from('sport_entities').select('id,sport_slug,entity_type,provider,provider_id,name,short_name,country,logo_url,image_url').ilike('short_name',`%${q}%`).limit(limit),
        admin.from('sports_catalog').select('slug,name_pt')
      ]);
      const labels=new Map((catalog||[]).map((x:any)=>[x.slug,x.name_pt]));
      const seen=new Set<number>(),rows=[...(byName||[]),...(byShort||[])].filter((x:any)=>{const id=Number(x.id);if(seen.has(id))return false;seen.add(id);return true});
      rows.sort((a:any,b:any)=>{const an=norm(a.name),bn=norm(b.name),nq=norm(q),ae=an===nq?1:0,be=bn===nq?1:0;if(be!==ae)return be-ae;const as=an.startsWith(nq)?1:0,bs=bn.startsWith(nq)?1:0;return bs-as||an.localeCompare(bn)});
      return rows.slice(0,limit).map((x:any)=>({...x,sport_label:labels.get(x.sport_slug)||x.sport_slug}));
    }
    async function upsert(row:any){
      await admin.from('sport_entities').upsert({...row,updated_at:new Date().toISOString()},{onConflict:'provider,entity_type,provider_id'});
    }
    async function fetchJson(target:string,headers:Record<string,string>={}){
      const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);try{const r=await fetch(target,{headers:{accept:'application/json','user-agent':'CineTracker/0.99.7',...headers},signal:c.signal});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(`HTTP ${r.status}`);return d}finally{clearTimeout(t)}
    }

    let rows=await local();
    const remoteTasks:Promise<any>[]=[];
    const apiKey=Deno.env.get('API_SPORTS_KEY')||'';
    if(apiKey){
      remoteTasks.push((async()=>{
        try{
          const d=await fetchJson(`https://v3.football.api-sports.io/teams?search=${encodeURIComponent(q)}`,{'x-apisports-key':apiKey});
          for(const x of (Array.isArray(d?.response)?d.response:[]).slice(0,15)){
            const t=x?.team;if(!t?.id||!t?.name)continue;
            await upsert({sport_slug:'soccer',entity_type:'team',provider:'api-sports:football',provider_id:String(t.id),name:String(t.name),short_name:t.code||null,country:x?.venue?.country||x?.country||null,logo_url:t.logo||null,image_url:t.logo||null,metadata:{venue:x?.venue||null,source:'search'}});
          }
        }catch{}
      })());
    }
    remoteTasks.push((async()=>{
      try{
        const key=Deno.env.get('THESPORTSDB_KEY')||'123',d=await fetchJson(`https://www.thesportsdb.com/api/v1/json/${encodeURIComponent(key)}/searchteams.php?t=${encodeURIComponent(q)}`);
        for(const t of (Array.isArray(d?.teams)?d.teams:[]).slice(0,20)){
          if(!t?.idTeam||!t?.strTeam)continue;const slug=sportSlug(t.strSport);
          await upsert({sport_slug:slug,entity_type:'team',provider:'thesportsdb',provider_id:String(t.idTeam),name:String(t.strTeam),short_name:t.strTeamShort||null,country:t.strCountry||null,logo_url:t.strBadge||t.strLogo||null,image_url:t.strFanart1||t.strBadge||null,metadata:{league:t.strLeague||null,stadium:t.strStadium||null,source:'search'}});
        }
      }catch{}
    })());
    await Promise.allSettled(remoteTasks);
    rows=await local();
    return json({ok:true,query:q,entities:rows,remote_searched:true,version:'sports-search-v1'});
  }catch(e){return json({error:String(e)},500)}
});
