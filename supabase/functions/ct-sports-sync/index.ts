import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Access-Control-Max-Age':'86400'
};
const json=(data:any,status=200)=>new Response(JSON.stringify(data),{status,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});
const day=/^\d{4}-\d{2}-\d{2}$/;
const nowIso=()=>new Date().toISOString();
const safeText=(v:any)=>v===null||v===undefined?null:String(v);
const n=(v:any)=>{const x=Number(v);return Number.isFinite(x)?x:null};
const statusOf=(short:any,long:any,startsAt:string)=>{
  const s=String(short||'').toUpperCase(),l=String(long||'').toLowerCase();
  if(['FT','AET','PEN','FINAL','FINISHED'].includes(s)||/finished|final|after extra|penalt/.test(l))return'finished';
  if(['1H','2H','HT','ET','BT','LIVE','Q1','Q2','Q3','Q4','OT','P1','P2','P3','IN PLAY'].includes(s)||/live|progress|quarter|period|halftime/.test(l))return'live';
  if(['PST','POST','POSTPONED'].includes(s)||/postpon/.test(l))return'postponed';
  if(['CANC','CANCELLED'].includes(s)||/cancel/.test(l))return'cancelled';
  return new Date(startsAt).getTime()>Date.now()?'scheduled':'unknown';
};
const startFromTsd=(x:any)=>{
  if(x?.strTimestamp){const d=new Date(x.strTimestamp);if(!Number.isNaN(d.getTime()))return d.toISOString()}
  const date=String(x?.dateEvent||'').slice(0,10),time=String(x?.strTime||x?.strEventTime||'00:00:00').slice(0,8);
  const d=new Date(`${date}T${time.length===5?time+':00':time}Z`);return Number.isNaN(d.getTime())?`${date}T12:00:00.000Z`:d.toISOString();
};
const totalScore=(x:any)=>safeText(x?.total??x?.score??x?.points??x);

type CanonicalEvent={
  sport_slug:string;provider:string;provider_event_id:string;title:string;starts_at:string;status:string;
  competition?:{id:string;name:string;logo?:string|null;country?:string|null};
  home?:{id:string;name:string;logo?:string|null;country?:string|null};
  away?:{id:string;name:string;logo?:string|null;country?:string|null};
  season?:string|null;round?:string|null;venue?:string|null;home_score?:string|null;away_score?:string|null;image_url?:string|null;participants?:any[];raw:any;
};

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

    let body:any={};try{body=await req.json()}catch{}
    const action=String(body?.action||'sync');
    if(action==='status'){
      return json({ok:true,api_sports_configured:Boolean(Deno.env.get('API_SPORTS_KEY')),fallback:'thesportsdb',version:'sports-hub-v1'});
    }
    const from=day.test(String(body?.date_from||''))?String(body.date_from):new Date().toISOString().slice(0,10);
    const maxTo=new Date(`${from}T12:00:00Z`);maxTo.setUTCDate(maxTo.getUTCDate()+6);
    const requestedTo=day.test(String(body?.date_to||''))?String(body.date_to):from;
    const to=requestedTo>maxTo.toISOString().slice(0,10)?maxTo.toISOString().slice(0,10):requestedTo;
    const force=body?.force===true;
    const {data:catalog,error:catalogError}=await admin.from('sports_catalog').select('slug,name_pt,provider_sport_name,metadata,enabled').eq('enabled',true).order('sort_order');
    if(catalogError)throw catalogError;
    const requested=Array.isArray(body?.sports)?new Set(body.sports.map(String)):null;
    const selected=(catalog||[]).filter((s:any)=>!requested||requested.has(s.slug));
    if(!selected.length)return json({error:'no sports selected'},400);

    const apiKey=Deno.env.get('API_SPORTS_KEY')||'';
    const tsdKey=Deno.env.get('THESPORTSDB_KEY')||'123';
    const stats={sports:selected.length,days:0,provider_calls:0,events_received:0,events_upserted:0,entities_upserted:0,skipped_cached:0,errors:[] as any[]};
    const providersUsed=new Set<string>();

    const dates:string[]=[];for(let d=new Date(`${from}T12:00:00Z`);d<=new Date(`${to}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+1))dates.push(d.toISOString().slice(0,10));
    stats.days=dates.length;

    async function apiGet(base:string,path:string){
      stats.provider_calls++;const r=await fetch(`${base}${path}`,{headers:{'x-apisports-key':apiKey}});const d=await r.json().catch(()=>({}));
      if(!r.ok||d?.errors&&(Array.isArray(d.errors)?d.errors.length:Object.keys(d.errors||{}).length))throw new Error(`API-Sports ${r.status}: ${JSON.stringify(d?.errors||d?.message||'request failed').slice(0,180)}`);
      return Array.isArray(d?.response)?d.response:[];
    }
    async function tsdGet(date:string,sportName:string){
      stats.provider_calls++;const r=await fetch(`https://www.thesportsdb.com/api/v1/json/${encodeURIComponent(tsdKey)}/eventsday.php?d=${encodeURIComponent(date)}&s=${encodeURIComponent(sportName)}`);const d=await r.json().catch(()=>({}));
      if(!r.ok)throw new Error(`TheSportsDB ${r.status}`);return Array.isArray(d?.events)?d.events:[];
    }

    function fromFootball(x:any,slug:string):CanonicalEvent{
      const starts=String(x?.fixture?.date||new Date(Number(x?.fixture?.timestamp||0)*1000).toISOString());
      return{sport_slug:slug,provider:'api-sports:football',provider_event_id:String(x.fixture.id),title:`${x?.teams?.home?.name||''} x ${x?.teams?.away?.name||''}`.trim(),starts_at:starts,status:statusOf(x?.fixture?.status?.short,x?.fixture?.status?.long,starts),competition:{id:String(x?.league?.id),name:String(x?.league?.name||'Futebol'),logo:x?.league?.logo,country:x?.league?.country},home:x?.teams?.home?.id?{id:String(x.teams.home.id),name:String(x.teams.home.name),logo:x.teams.home.logo}:undefined,away:x?.teams?.away?.id?{id:String(x.teams.away.id),name:String(x.teams.away.name),logo:x.teams.away.logo}:undefined,season:safeText(x?.league?.season),round:safeText(x?.league?.round),venue:safeText(x?.fixture?.venue?.name),home_score:safeText(x?.goals?.home),away_score:safeText(x?.goals?.away),image_url:x?.league?.logo,raw:x};
    }
    function fromGenericGame(x:any,slug:string,product:string):CanonicalEvent{
      const g=x?.game||x,starts=g?.date?.date&&g?.date?.time?new Date(Number(g.date.timestamp||0)*1000).toISOString():String(g?.date||new Date(Number(g?.timestamp||0)*1000).toISOString());
      const home=x?.teams?.home,away=x?.teams?.away,league=x?.league;
      return{sport_slug:slug,provider:`api-sports:${product}`,provider_event_id:String(g?.id||x?.id),title:`${home?.name||''} x ${away?.name||''}`.trim(),starts_at:starts,status:statusOf(g?.status?.short||x?.status?.short,g?.status?.long||x?.status?.long,starts),competition:league?.id?{id:String(league.id),name:String(league.name||product),logo:league.logo,country:x?.country?.name||league.country}:undefined,home:home?.id?{id:String(home.id),name:String(home.name),logo:home.logo}:undefined,away:away?.id?{id:String(away.id),name:String(away.name),logo:away.logo}:undefined,season:safeText(league?.season),round:safeText(g?.week||g?.stage||x?.week),venue:safeText(g?.venue?.name||x?.venue),home_score:totalScore(x?.scores?.home),away_score:totalScore(x?.scores?.away),image_url:league?.logo,raw:x};
    }
    function fromFormula1(x:any,slug:string):CanonicalEvent{
      const starts=String(x?.date||x?.competition?.date||'');const comp=x?.competition||{};const circuit=x?.circuit||{};
      return{sport_slug:slug,provider:'api-sports:formula-1',provider_event_id:String(x?.id),title:String(comp?.name||x?.type||'Fórmula 1'),starts_at:starts,status:statusOf(x?.status?.short,x?.status?.long,starts),competition:{id:String(comp?.id||`season-${x?.season}`),name:String(comp?.name||'Formula 1'),logo:comp?.logo,country:comp?.location?.country||comp?.country?.name},season:safeText(x?.season),round:safeText(x?.type),venue:safeText(circuit?.name||comp?.location?.city),image_url:comp?.logo||circuit?.image,participants:Array.isArray(x?.participants)?x.participants:[],raw:x};
    }
    function fromTsd(x:any,slug:string):CanonicalEvent{
      const starts=startFromTsd(x),homeId=x?.idHomeTeam,awayId=x?.idAwayTeam,leagueId=x?.idLeague;
      return{sport_slug:slug,provider:'thesportsdb',provider_event_id:String(x?.idEvent),title:String(x?.strEvent||[x?.strHomeTeam,x?.strAwayTeam].filter(Boolean).join(' x ')||x?.strLeague||'Evento esportivo'),starts_at:starts,status:statusOf(x?.strStatus,x?.strProgress,starts),competition:leagueId?{id:String(leagueId),name:String(x?.strLeague||'Competição'),logo:x?.strLeagueBadge,country:x?.strCountry}:undefined,home:homeId?{id:String(homeId),name:String(x?.strHomeTeam||'Mandante'),logo:x?.strHomeTeamBadge}:undefined,away:awayId?{id:String(awayId),name:String(x?.strAwayTeam||'Visitante'),logo:x?.strAwayTeamBadge}:undefined,season:safeText(x?.strSeason),round:safeText(x?.intRound||x?.strRound),venue:safeText(x?.strVenue),home_score:safeText(x?.intHomeScore),away_score:safeText(x?.intAwayScore),image_url:x?.strThumb||x?.strPoster||x?.strBanner||x?.strLeagueBadge,participants:[],raw:x};
    }

    async function apiSportsEvents(s:any,date:string):Promise<CanonicalEvent[]|null>{
      if(!apiKey)return null;
      const product=String(s?.metadata?.api_sports||'');
      try{
        if(s.slug==='soccer')return(await apiGet('https://v3.football.api-sports.io',`/fixtures?date=${date}&timezone=UTC`)).map((x:any)=>fromFootball(x,s.slug));
        if(s.slug==='basketball')return(await apiGet('https://v1.basketball.api-sports.io',`/games?date=${date}`)).map((x:any)=>fromGenericGame(x,s.slug,'basketball'));
        if(s.slug==='ice_hockey')return(await apiGet('https://v1.hockey.api-sports.io',`/games?date=${date}`)).map((x:any)=>fromGenericGame(x,s.slug,'hockey'));
        if(s.slug==='american_football')return(await apiGet('https://v1.american-football.api-sports.io',`/games?date=${date}`)).map((x:any)=>fromGenericGame(x,s.slug,'nfl'));
        if(s.slug==='baseball')return(await apiGet('https://v1.baseball.api-sports.io',`/games?date=${date}`)).map((x:any)=>fromGenericGame(x,s.slug,'baseball'));
        if(['formula_1'].includes(s.slug)){
          const season=Number(date.slice(0,4));const all=await apiGet('https://v1.formula-1.api-sports.io',`/races?season=${season}`);
          return all.filter((x:any)=>String(x?.date||'').slice(0,10)===date).map((x:any)=>fromFormula1(x,s.slug));
        }
        if(product)return null;
      }catch(e){stats.errors.push({sport:s.slug,date,provider:'api-sports',error:String(e).slice(0,220)});return null}
      return null;
    }

    function allowedByCatalog(s:any,e:any){
      const filters=Array.isArray(s?.metadata?.league_filters)?s.metadata.league_filters.map((v:any)=>String(v).toLowerCase()):[];
      if(!filters.length)return true;const hay=`${e?.strLeague||''} ${e?.strEvent||''}`.toLowerCase();return filters.some((f:string)=>hay.includes(f.toLowerCase()));
    }

    async function upsertEntity(sportSlug:string,type:string,provider:string,item:any){
      if(!item?.id||!item?.name)return null;
      const row={sport_slug:sportSlug,entity_type:type,provider,provider_id:String(item.id),name:String(item.name),country:item.country||null,logo_url:item.logo||null,image_url:item.image||null,metadata:item.metadata||{},updated_at:nowIso()};
      const {data,error}=await admin.from('sport_entities').upsert(row,{onConflict:'provider,entity_type,provider_id'}).select('id').single();if(error)throw error;stats.entities_upserted++;return Number(data.id);
    }
    async function persist(e:CanonicalEvent){
      if(!e.provider_event_id||!e.starts_at||Number.isNaN(new Date(e.starts_at).getTime()))return;
      const compId=e.competition?await upsertEntity(e.sport_slug,'competition',e.provider,e.competition):null;
      const homeId=e.home?await upsertEntity(e.sport_slug,'team',e.provider,e.home):null;
      const awayId=e.away?await upsertEntity(e.sport_slug,'team',e.provider,e.away):null;
      const row={sport_slug:e.sport_slug,provider:e.provider,provider_event_id:e.provider_event_id,competition_entity_id:compId,home_entity_id:homeId,away_entity_id:awayId,title:e.title||'Evento esportivo',starts_at:e.starts_at,status:e.status||'unknown',season:e.season||null,round:e.round||null,venue:e.venue||null,home_score:e.home_score||null,away_score:e.away_score||null,image_url:e.image_url||null,participants:e.participants||[],raw:e.raw||{},last_synced_at:nowIso(),updated_at:nowIso()};
      const {error}=await admin.from('sport_events').upsert(row,{onConflict:'provider,provider_event_id'});if(error)throw error;stats.events_upserted++;providersUsed.add(e.provider);
    }

    for(const s of selected){
      for(const date of dates){
        const cacheProvider=apiKey&&s.slug!=='mma'&&s.slug!=='motogp'?'api-sports':'thesportsdb';
        if(!force){
          const {data:state}=await admin.from('sport_sync_state').select('last_synced_at,status').eq('provider',cacheProvider).eq('sport_slug',s.slug).eq('sync_date',date).maybeSingle();
          if(state?.last_synced_at){const age=Date.now()-new Date(state.last_synced_at).getTime(),ttl=date===new Date().toISOString().slice(0,10)?2*60*1000:30*60*1000;if(age<ttl&&state.status==='ok'){stats.skipped_cached++;continue}}
        }
        let canonical=await apiSportsEvents(s,date),provider='api-sports';
        if(canonical===null){
          provider='thesportsdb';
          try{const raw=await tsdGet(date,String(s.provider_sport_name));canonical=raw.filter((e:any)=>allowedByCatalog(s,e)).map((e:any)=>fromTsd(e,s.slug));}
          catch(e){canonical=[];stats.errors.push({sport:s.slug,date,provider,error:String(e).slice(0,220)})}
        }
        stats.events_received+=canonical.length;
        for(const e of canonical){try{await persist(e)}catch(err){stats.errors.push({sport:s.slug,date,provider,event:e.provider_event_id,error:String(err).slice(0,220)})}}
        await admin.from('sport_sync_state').upsert({provider:provider==='api-sports'?`api-sports`:provider,sport_slug:s.slug,sync_date:date,status:'ok',event_count:canonical.length,last_error:null,metadata:{api_sports_configured:Boolean(apiKey)},last_synced_at:nowIso()},{onConflict:'provider,sport_slug,sync_date'});
      }
    }
    await admin.from('profiles').update({updated_at:nowIso()}).eq('id',userData.user.id);
    return json({ok:true,...stats,providers:[...providersUsed],api_sports_configured:Boolean(apiKey),fallback:'thesportsdb',date_from:from,date_to:to,version:'sports-hub-v1'});
  }catch(e){return json({error:String(e)},500)}
});
