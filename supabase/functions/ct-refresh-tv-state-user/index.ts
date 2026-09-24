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
const rows=(v:any)=>Array.isArray(v)?v:[];
const today=()=>new Date().toISOString().slice(0,10);
const epKey=(s:any,e:any)=>n(s)+':'+n(e);
const stale=(m:any)=>{
  const next=String(m?.raw_tmdb?.next_episode_to_air?.air_date||'').slice(0,10);
  if(next&&next<=today())return true;
  const ts=Date.parse(m?.updated_at||m?.raw_tmdb?.enriched_at||'')||0;
  return !ts||Date.now()-ts>=6*60*60*1000;
};
const releasedLimit=(show:any,sn:number)=>{
  const last=show?.last_episode_to_air,ls=n(last?.season_number),le=n(last?.episode_number);
  if(!(ls>0&&le>0))return 0;
  const season=rows(show?.seasons).find((s:any)=>n(s?.season_number)===sn);
  const declared=Math.max(0,n(season?.episode_count));
  if(sn<ls)return declared;
  if(sn===ls)return declared>0?Math.min(declared,le):le;
  return 0;
};
const firstNeededSeason=(show:any,watched:Set<string>)=>{
  const seasons=rows(show?.seasons).filter((s:any)=>n(s?.season_number)>0).sort((a:any,b:any)=>n(a.season_number)-n(b.season_number));
  for(const s of seasons){
    const sn=n(s?.season_number),limit=releasedLimit(show,sn);if(limit<=0)continue;
    let wc=0;for(let e=1;e<=limit;e++)if(watched.has(epKey(sn,e)))wc++;
    if(wc<limit)return sn;
  }
  return 0;
};
const cachedCandidate=(catalog:any[],show:any,watched:Set<string>)=>{
  const last=show?.last_episode_to_air,ls=n(last?.season_number),le=n(last?.episode_number);
  if(!(ls>0&&le>0))return null;
  return rows(catalog).filter((e:any)=>{
    const s=n(e?.season_number),ep=n(e?.episode_number);
    return s>0&&ep>0&&(s<ls||(s===ls&&ep<=le))&&!watched.has(epKey(s,ep));
  }).sort((a:any,b:any)=>n(a.season_number)-n(b.season_number)||n(a.episode_number)-n(b.episode_number))[0]||null;
};
const cacheComplete=(e:any)=>!!(e&&String(e.name_local||e.name_en||'').trim()&&e.air_date&&Number.isFinite(Number(e.vote_average)));

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  if(req.method!=='POST')return json({error:'POST required'},405);
  try{
    const url=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,anonKey=Deno.env.get('SUPABASE_ANON_KEY')!;
    const auth=req.headers.get('authorization')||'';
    if(!auth.toLowerCase().startsWith('bearer '))return json({error:'authorization required'},401);
    const admin=createClient(url,serviceKey),userSb=createClient(url,anonKey,{global:{headers:{Authorization:auth}}});
    const {data:userData,error:userError}=await userSb.auth.getUser();
    if(userError||!userData?.user?.id)return json({error:'invalid session'},401);

    const {data:dashboard,error:de}=await userSb.rpc('cinetracker_profile_media_dashboard_v0991');
    if(de)return json({error:'dashboard unavailable'},500);
    const dash=rows(dashboard).filter((x:any)=>String(x.media_type)==='tv'&&n(x.watched_episodes)>0);
    const mediaIds=[...new Set(dash.map((x:any)=>n(x.media_id)).filter((x:number)=>x>0))];
    if(!mediaIds.length)return json({ok:true,processed:0,refreshed:0,episodes_cached:0,skipped:0,version:'tv-state-refresh-v2'});

    const {data:media,error:me}=await admin.from('media')
      .select('id,tmdb_id,media_type,title,original_title,poster_path,runtime_minutes,total_episodes,raw_tmdb,updated_at')
      .in('id',mediaIds);
    if(me)throw me;
    const tvRows=rows(media).map((m:any)=>({...m,__tmdb:n(m.tmdb_id)>0?n(m.tmdb_id):n(m.raw_tmdb?.source_tmdb_id)})).filter((m:any)=>m.__tmdb>0);
    const tmdbIds=[...new Set(tvRows.map((m:any)=>m.__tmdb))];

    const {data:watchState,error:wse}=await userSb.rpc('cinetracker_home_series_watch_state_v4',{p_tmdb_ids:tmdbIds});
    if(wse)throw wse;
    const stateMap=new Map(rows(watchState).map((s:any)=>[
      n(s.tmdb_id),
      new Set(rows(s.watched_keys).map((k:any)=>epKey(k?.s,k?.e)))
    ]));

    const catalog:any[]=[];
    for(let from=0;from<12000;from+=1000){
      const {data,error}=await admin.from('episode_catalog_v336')
        .select('show_tmdb_id,season_number,episode_number,episode_tmdb_id,name_local,name_en,air_date,vote_average,still_path,poster_path')
        .in('show_tmdb_id',tmdbIds)
        .order('show_tmdb_id',{ascending:true})
        .order('season_number',{ascending:true})
        .order('episode_number',{ascending:true})
        .range(from,from+999);
      if(error)throw error;
      catalog.push(...rows(data));
      if(rows(data).length<1000)break;
    }
    const catMap=new Map<number,any[]>();
    for(const e of catalog){const id=n(e.show_tmdb_id);if(!catMap.has(id))catMap.set(id,[]);catMap.get(id)!.push(e)}

    const priority=new Map(dash.map((x:any)=>[n(x.media_id),(x.is_up_to_date?1000:0)+(x.is_in_progress?500:0)+n(x.watched_episodes)]));
    const needs=(m:any)=>{
      const watched=stateMap.get(m.__tmdb)||new Set<string>(),show=m.raw_tmdb||{};
      const sn=firstNeededSeason(show,watched);
      if(sn<=0)return stale(m);
      const candidate=cachedCandidate(catMap.get(m.__tmdb)||[],show,watched);
      return stale(m)||!cacheComplete(candidate);
    };
    const work=tvRows.filter(needs).sort((a:any,b:any)=>(priority.get(b.id)||0)-(priority.get(a.id)||0)).slice(0,80);

    const {data:token,error:te}=await admin.rpc('cinetracker_tmdb_token');
    if(te||!token)return json({error:'tmdb token unavailable'},500);
    const headers={Authorization:`Bearer ${token}`,Accept:'application/json'};

    let refreshed=0,failed=0,episodesCached=0,nextEpisodes=0;
    for(let i=0;i<work.length;i+=6){
      await Promise.all(work.slice(i,i+6).map(async(m:any)=>{
        try{
          const tmdbId=m.__tmdb,watched=stateMap.get(tmdbId)||new Set<string>();
          let show=m.raw_tmdb||{},didShowFetch=false;
          if(stale(m)||!rows(show?.seasons).length||!show?.last_episode_to_air){
            const rs=await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?language=pt-BR`,{headers});
            if(!rs.ok)throw new Error(`TMDB show ${rs.status}`);
            show=await rs.json();didShowFetch=true;
          }

          if(didShowFetch){
            const genres=rows(show.genres).map((g:any)=>g?.name).filter(Boolean);
            const countries=rows(show.origin_country);
            const anime=countries.includes('JP')&&genres.some((g:string)=>/anima/i.test(g));
            const raw={...(m.raw_tmdb||{}),...show,source_tmdb_id:tmdbId,enriched_at:new Date().toISOString()};
            const patch={
              title:show.name||m.title,
              original_title:show.original_name||m.original_title||null,
              release_year:Number(String(show.first_air_date||'').slice(0,4))||null,
              poster_path:show.poster_path||m.poster_path||null,
              runtime_minutes:rows(show.episode_run_time)[0]||m.runtime_minutes||null,
              total_seasons:show.number_of_seasons||null,
              total_episodes:show.number_of_episodes||m.total_episodes||null,
              genres,media_kind:anime?'anime':'series',raw_tmdb:raw,updated_at:new Date().toISOString()
            };
            const {error:ue}=await admin.from('media').update(patch).eq('id',m.id);if(ue)throw ue;
            refreshed++;
          }

          const sn=firstNeededSeason(show,watched);if(!(sn>0))return;
          const cached=cachedCandidate(catMap.get(tmdbId)||[],show,watched);
          if(cacheComplete(cached))return;

          const rr=await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${sn}?language=pt-BR`,{headers});
          if(!rr.ok)throw new Error(`TMDB season ${rr.status}`);
          const season=await rr.json(),limit=releasedLimit(show,sn),now=new Date().toISOString();
          const eps=rows(season?.episodes).filter((ep:any)=>{
            const en=n(ep?.episode_number),air=String(ep?.air_date||'').slice(0,10);
            return en>0&&en<=limit&&air&&air<=today();
          });
          if(eps.length){
            const payload=eps.map((ep:any)=>({
              show_tmdb_id:tmdbId,season_number:sn,episode_number:n(ep.episode_number),
              episode_tmdb_id:n(ep.id)||null,
              show_name:show.name||m.title||null,show_original_name:show.original_name||m.original_title||null,
              name_local:String(ep.name||'').trim()||('Episódio '+n(ep.episode_number)),
              air_date:ep.air_date||null,vote_average:Number(ep.vote_average)||0,
              still_path:ep.still_path||null,poster_path:show.poster_path||m.poster_path||null,updated_at:now
            }));
            const {error:ce}=await admin.from('episode_catalog_v336').upsert(payload,{onConflict:'show_tmdb_id,season_number,episode_number'});
            if(ce)throw ce;
            episodesCached+=payload.length;
            if(payload.some((ep:any)=>!watched.has(epKey(ep.season_number,ep.episode_number))))nextEpisodes++;
          }
        }catch(e){failed++;console.error('ct-refresh-tv-state-user item failed',m?.id,m?.__tmdb,String(e))}
      }));
    }
    return json({
      ok:true,processed:work.length,refreshed,failed,episodes_cached:episodesCached,next_episodes_cached:nextEpisodes,
      skipped:Math.max(0,tvRows.length-work.length),version:'tv-state-refresh-v2'
    });
  }catch(e){return json({error:String(e)},500)}
});