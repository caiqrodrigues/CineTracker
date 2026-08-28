import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, GET, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const norm=(v:string)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const baseTitle=(v:string)=>norm(String(v||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,''));
const yearOf=(d:any)=>Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||0;
const titleKeys=(x:any)=>[x?.title,x?.name,x?.original_title,x?.original_name].filter(Boolean);
const titleMatch=(x:any,want:string,baseWant:string)=>titleKeys(x).some((v:any)=>norm(v)===want||baseTitle(v)===baseWant);
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:CORS});
  try{
    const url=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,anonKey=Deno.env.get('SUPABASE_ANON_KEY')!;
    const auth=req.headers.get('authorization')||'';
    if(!auth) return json({error:'authorization required'},401);
    const sb=createClient(url,serviceKey);
    const userSb=createClient(url,anonKey,{global:{headers:{Authorization:auth}}});
    const {data:dashboard,error:dashboardError}=await userSb.rpc('cinetracker_profile_media_dashboard_v0991');
    if(dashboardError) return json({error:'user dashboard unavailable'},401);
    const {data:token,error:te}=await sb.rpc('cinetracker_tmdb_token');
    if(te||!token) return json({error:'tmdb token unavailable'},500);
    const u=new URL(req.url);
    const limit=Math.min(Math.max(Number(u.searchParams.get('limit')||80),1),120);
    const priority=String(u.searchParams.get('priority')||'current-user');
    let body:any={};
    if(req.method==='POST'){try{body=await req.json()}catch{body={}}}
    const requestedIds=[...new Set((Array.isArray(body?.requested_media_ids)?body.requested_media_ids:[]).map(Number).filter((x:number)=>Number.isFinite(x)&&x>0))].slice(0,60);
    const requestedSet=new Set(requestedIds);
    const rowsDash=Array.isArray(dashboard)?dashboard:[];
    const needs=(x:any)=>Number(x.tmdb_id||0)<=0||!x.poster_path||(x.media_type==='tv'&&(!x.raw_tmdb?.last_episode_to_air||Number(x.total_episodes||0)<=0));
    const score=(x:any)=>{
      if(priority==='visible-posters') return (!x.poster_path?5000:0)+(Number(x.tmdb_id||0)<=0?4000:0)+(x.is_in_progress?1000:0)+(x.is_up_to_date?800:0)+(Number(x.watched_episodes||0)>0?500:0)+(x.is_watchlist?250:0);
      return (x.is_in_progress?1000:0)+(x.is_up_to_date?700:0)+(Number(x.watched_episodes||0)>0?500:0)+(x.is_watchlist?250:0)+(Number(x.tmdb_id||0)<=0?180:0)+(!x.poster_path?120:0)+(x.media_type==='tv'&&!x.raw_tmdb?.last_episode_to_air?80:0)+Math.min(50,Math.max(0,(Date.parse(x.last_watched_at||'')||0)/1e12));
    };
    let candidates=rowsDash.filter(needs);
    if(requestedSet.size)candidates=candidates.filter((x:any)=>requestedSet.has(Number(x.media_id)));
    const ids=candidates.sort((a:any,b:any)=>score(b)-score(a)).slice(0,limit).map((x:any)=>Number(x.media_id)).filter(Boolean);
    if(!ids.length) return json({processed:0,ok:0,fail:0,resolved_surrogates:0,official_refreshed:0,remaining:0,priority,requested:requestedIds.length});
    const {data:selected,error}=await sb.from('media')
      .select('id,tmdb_id,media_type,title,release_year,poster_path,runtime_minutes,total_episodes,raw_tmdb,updated_at')
      .in('id',ids);
    if(error) throw error;
    const order=new Map(ids.map((id:number,i:number)=>[id,i]));
    const rows=(selected||[]).sort((a:any,b:any)=>(order.get(a.id)??9999)-(order.get(b.id)??9999));
    let ok=0,fail=0,resolvedSurrogates=0,officialRefreshed=0;
    for(let i=0;i<rows.length;i+=6){
      await Promise.all(rows.slice(i,i+6).map(async(m:any)=>{
        try{
          let tmdbId=Number(m.tmdb_id||0),detail:any=null;
          const effective=Number(m.raw_tmdb?.source_tmdb_id||0);
          if(tmdbId<=0&&effective>0)tmdbId=effective;
          if(tmdbId>0){
            const r=await fetch(`https://api.themoviedb.org/3/${m.media_type}/${tmdbId}?language=pt-BR`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!r.ok) throw new Error(`detail ${r.status}`);
            detail=await r.json();officialRefreshed++;
          }else{
            const query=String(m.title||'').replace(/\s*\((?:19|20)\d{2}\)\s*$/,'').trim();
            if(!query) throw new Error('empty title');
            const qp=new URLSearchParams({query,language:'pt-BR',include_adult:'false'});
            if(Number(m.release_year)>0) qp.set(m.media_type==='movie'?'year':'first_air_date_year',String(m.release_year));
            const sr=await fetch(`https://api.themoviedb.org/3/search/${m.media_type}?${qp}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!sr.ok) throw new Error(`search ${sr.status}`);
            const sd=await sr.json();
            const want=norm(m.title),baseWant=baseTitle(m.title),sourceYear=Number(m.release_year||0);
            let candidates=(sd.results||[]).map((x:any)=>({x,y:yearOf(x)})).filter((z:any)=>titleMatch(z.x,want,baseWant)&&(!sourceYear||!z.y||Math.abs(z.y-sourceYear)<=1));
            if(!candidates.length&&sourceYear){
              const qp2=new URLSearchParams({query,language:'pt-BR',include_adult:'false'});
              const sr2=await fetch(`https://api.themoviedb.org/3/search/${m.media_type}?${qp2}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
              if(sr2.ok){const sd2=await sr2.json();candidates=(sd2.results||[]).map((x:any)=>({x,y:yearOf(x)})).filter((z:any)=>titleMatch(z.x,want,baseWant)&&(!z.y||Math.abs(z.y-sourceYear)<=2))}
            }
            if(!candidates.length) throw new Error('no exact localized/original title-year match');
            candidates.sort((a:any,b:any)=>{const ay=sourceYear&&a.y===sourceYear?1:0,by=sourceYear&&b.y===sourceYear?1:0;if(by!==ay)return by-ay;return Number(b.x.popularity||0)-Number(a.x.popularity||0)});
            tmdbId=Number(candidates[0].x.id||0);
            if(!tmdbId) throw new Error('invalid resolved id');
            const dr=await fetch(`https://api.themoviedb.org/3/${m.media_type}/${tmdbId}?language=pt-BR`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!dr.ok) throw new Error(`detail resolved ${dr.status}`);
            detail=await dr.json();resolvedSurrogates++;
          }
          const genres=(detail.genres||[]).map((g:any)=>g.name).filter(Boolean);
          const countries=(detail.origin_country||detail.production_countries?.map((x:any)=>x.iso_3166_1)||[]);
          const anime=m.media_type==='tv'&&countries.includes('JP')&&genres.some((g:string)=>/anima/i.test(g));
          const raw={...(m.raw_tmdb||{}),...(detail||{}),source_tmdb_id:tmdbId,original_surrogate_tmdb_id:Number(m.tmdb_id)<0?Number(m.tmdb_id):m.raw_tmdb?.original_surrogate_tmdb_id,enriched_at:new Date().toISOString()};
          const patch:any={title:detail.title||detail.name||m.title,original_title:detail.original_title||detail.original_name||null,release_year:yearOf(detail)||m.release_year||null,poster_path:detail.poster_path||m.poster_path||null,runtime_minutes:m.media_type==='movie'?(Number(detail.runtime)||m.runtime_minutes||null):((detail.episode_run_time||[])[0]||m.runtime_minutes||null),total_seasons:detail.number_of_seasons||null,total_episodes:detail.number_of_episodes||m.total_episodes||null,genres,media_kind:anime?'anime':(m.media_type==='movie'?'movie':'series'),raw_tmdb:raw,updated_at:new Date().toISOString()};
          const {error:ue}=await sb.from('media').update(patch).eq('id',m.id);
          if(ue) throw ue;ok++;
        }catch(e){fail++;try{await sb.from('media').update({raw_tmdb:{...(m.raw_tmdb||{}),enrichment_attempted_at:new Date().toISOString(),enrichment_error:String(e).slice(0,180)},updated_at:new Date().toISOString()}).eq('id',m.id)}catch{}}
      }));
    }
    return json({processed:rows.length,ok,fail,resolved_surrogates:resolvedSurrogates,official_refreshed:officialRefreshed,remaining:Math.max(0,candidates.length-rows.length),effective_tmdb_ids:true,priority,requested:requestedIds.length});
  }catch(e){return json({error:String(e)},500)}
});
