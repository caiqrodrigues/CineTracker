import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, GET, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const norm=(v:string)=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const yearOf=(d:any)=>Number(String(d?.release_date||d?.first_air_date||'').slice(0,4))||0;
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:CORS});
  try{
    const sb=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const {data:token,error:te}=await sb.rpc('cinetracker_tmdb_token');
    if(te||!token) return json({error:'tmdb token unavailable'},500);
    const u=new URL(req.url);
    const limit=Math.min(Math.max(Number(u.searchParams.get('limit')||80),1),120);
    const {data:rows,error}=await sb.from('media')
      .select('id,tmdb_id,media_type,title,release_year,poster_path,runtime_minutes,raw_tmdb,updated_at')
      .or('tmdb_id.lt.0,poster_path.is.null,runtime_minutes.is.null')
      .order('updated_at',{ascending:true,nullsFirst:true})
      .order('id',{ascending:true})
      .limit(limit);
    if(error) throw error;
    let ok=0,fail=0,resolvedSurrogates=0,officialRefreshed=0;
    for(let i=0;i<(rows||[]).length;i+=6){
      await Promise.all((rows||[]).slice(i,i+6).map(async(m:any)=>{
        try{
          let tmdbId=Number(m.tmdb_id||0),detail:any=null;
          if(tmdbId>0){
            const r=await fetch(`https://api.themoviedb.org/3/${m.media_type}/${tmdbId}?language=pt-BR`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!r.ok) throw new Error(`detail ${r.status}`);
            detail=await r.json();officialRefreshed++;
          }else{
            const qp=new URLSearchParams({query:m.title||'',language:'pt-BR',include_adult:'false'});
            if(Number(m.release_year)>0) qp.set(m.media_type==='movie'?'year':'first_air_date_year',String(m.release_year));
            const sr=await fetch(`https://api.themoviedb.org/3/search/${m.media_type}?${qp}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!sr.ok) throw new Error(`search ${sr.status}`);
            const sd=await sr.json();
            const want=norm(m.title),sourceYear=Number(m.release_year||0);
            const candidates=(sd.results||[])
              .map((x:any)=>({x,n:norm(x.title||x.name),y:yearOf(x)}))
              .filter((z:any)=>z.n===want&&(!sourceYear||!z.y||Math.abs(z.y-sourceYear)<=1));
            if(!candidates.length) throw new Error('no exact title/year match');
            candidates.sort((a:any,b:any)=>{
              const ay=sourceYear&&a.y===sourceYear?1:0,by=sourceYear&&b.y===sourceYear?1:0;
              if(by!==ay) return by-ay;
              return Number(b.x.popularity||0)-Number(a.x.popularity||0);
            });
            tmdbId=Number(candidates[0].x.id||0);
            if(!tmdbId) throw new Error('invalid resolved id');
            const dr=await fetch(`https://api.themoviedb.org/3/${m.media_type}/${tmdbId}?language=pt-BR`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/json'}});
            if(!dr.ok) throw new Error(`detail resolved ${dr.status}`);
            detail=await dr.json();resolvedSurrogates++;
          }
          const genres=(detail.genres||[]).map((g:any)=>g.name).filter(Boolean);
          const countries=(detail.origin_country||detail.production_countries?.map((x:any)=>x.iso_3166_1)||[]);
          const anime=m.media_type==='tv'&&countries.includes('JP')&&genres.some((g:string)=>/anima/i.test(g));
          const raw={...(detail||{}),source_tmdb_id:tmdbId,original_surrogate_tmdb_id:Number(m.tmdb_id)<0?Number(m.tmdb_id):undefined,enriched_at:new Date().toISOString()};
          const patch:any={
            title:detail.title||detail.name||m.title,
            original_title:detail.original_title||detail.original_name||null,
            release_year:yearOf(detail)||m.release_year||null,
            poster_path:detail.poster_path||m.poster_path||null,
            runtime_minutes:m.media_type==='movie'?(Number(detail.runtime)||m.runtime_minutes||null):((detail.episode_run_time||[])[0]||m.runtime_minutes||null),
            total_seasons:detail.number_of_seasons||null,
            total_episodes:detail.number_of_episodes||null,
            genres,
            media_kind:anime?'anime':(m.media_type==='movie'?'movie':'series'),
            raw_tmdb:raw,
            updated_at:new Date().toISOString()
          };
          const {error:ue}=await sb.from('media').update(patch).eq('id',m.id);
          if(ue) throw ue;ok++;
        }catch(e){
          fail++;
          try{await sb.from('media').update({raw_tmdb:{...(m.raw_tmdb||{}),enrichment_attempted_at:new Date().toISOString(),enrichment_error:String(e).slice(0,180)},updated_at:new Date().toISOString()}).eq('id',m.id)}catch{}
        }
      }));
    }
    const {count}=await sb.from('media').select('*',{count:'exact',head:true}).or('tmdb_id.lt.0,poster_path.is.null,runtime_minutes.is.null');
    return json({processed:(rows||[]).length,ok,fail,resolved_surrogates:resolvedSurrogates,official_refreshed:officialRefreshed,remaining:count||0,effective_tmdb_ids:true});
  }catch(e){return json({error:String(e)},500)}
});
