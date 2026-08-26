import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

class ApiError extends Error { constructor(public status:number, message:string){ super(message); } }
const json = (body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:CORS});

async function userId(req:Request){
  const auth=req.headers.get('authorization')||'';
  if(!auth.toLowerCase().startsWith('bearer ')) throw new ApiError(401,'AUTH_REQUIRED');
  const r=await fetch(`${SUPABASE_URL}/auth/v1/user`,{headers:{apikey:SERVICE_KEY,authorization:auth}});
  if(!r.ok) throw new ApiError(401,'AUTH_INVALID');
  const u=await r.json();
  if(!u?.id) throw new ApiError(401,'AUTH_INVALID');
  return String(u.id);
}

async function db(path:string,init:RequestInit={}){
  const headers=new Headers(init.headers||{});
  headers.set('apikey',SERVICE_KEY); headers.set('authorization',`Bearer ${SERVICE_KEY}`);
  if(init.body!=null) headers.set('content-type','application/json');
  if(!headers.has('prefer')) headers.set('prefer','return=representation');
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{...init,headers});
  const txt=await r.text();
  const data=txt?(()=>{try{return JSON.parse(txt)}catch{return txt}})():null;
  if(!r.ok) throw new ApiError(r.status,`DATABASE_${r.status}: ${typeof data==='string'?data:JSON.stringify(data)}`);
  return data;
}

async function allUser(table:string,user:string,select='*'){
  const out:any[]=[]; let offset=0;
  for(;;){
    const rows=await db(`${table}?profile_id=eq.${encodeURIComponent(user)}&select=${encodeURIComponent(select)}&order=id.asc&limit=1000&offset=${offset}`) as any[];
    if(Array.isArray(rows)) out.push(...rows);
    if(!Array.isArray(rows)||rows.length<1000) break;
    offset+=rows.length;
    if(offset>200000) throw new ApiError(500,'BACKUP_TOO_LARGE');
  }
  return out;
}

async function snapshot(user:string){
  const [profiles,imports,overrides,history,progress]=await Promise.all([
    db(`profiles?id=eq.${encodeURIComponent(user)}&select=id,display_name,settings`),
    allUser('imports',user), allUser('media_overrides',user), allUser('watch_history',user), allUser('episode_progress',user)
  ]);
  const ids=[...new Set([...overrides,...history,...progress].map((x:any)=>Number(x.media_id)).filter(Number.isFinite))];
  const media:any[]=[];
  for(let i=0;i<ids.length;i+=120){
    const chunk=ids.slice(i,i+120);
    if(!chunk.length) continue;
    const rows=await db(`media?id=in.(${chunk.join(',')})&select=*`) as any[];
    if(Array.isArray(rows)) media.push(...rows);
  }
  return {
    format:'cinetracker-csv-backup', version:'0.0.98', created_at:new Date().toISOString(),
    profile:Array.isArray(profiles)?profiles:[], imports, media, media_overrides:overrides, watch_history:history, episode_progress:progress
  };
}

const num=(v:any)=>v===''||v==null?null:Number(v);
const bool=(v:any)=>v===true||String(v).toLowerCase()==='true'||String(v)==='1';
function jobj(v:any,fallback:any){ if(v==null||v==='') return fallback; if(typeof v==='object') return v; try{return JSON.parse(String(v))}catch{return fallback} }
function safeText(v:any){return v==null?null:String(v)}
function chunks<T>(rows:T[],n=150){const out:T[][]=[];for(let i=0;i<rows.length;i+=n)out.push(rows.slice(i,i+n));return out}

async function restore(user:string,p:any){
  if(!p||p.format!=='cinetracker-csv-backup') throw new ApiError(422,'BACKUP_FORMAT_INVALID');
  const mediaIn=Array.isArray(p.media)?p.media:[], importsIn=Array.isArray(p.imports)?p.imports:[], ovIn=Array.isArray(p.media_overrides)?p.media_overrides:[], histIn=Array.isArray(p.watch_history)?p.watch_history:[], progIn=Array.isArray(p.episode_progress)?p.episode_progress:[];
  if(histIn.length>200000||ovIn.length>50000||progIn.length>200000||mediaIn.length>50000) throw new ApiError(413,'BACKUP_TOO_LARGE');

  const mediaMap=new Map<string,number>();
  for(const part of chunks(mediaIn,100)){
    const body=part.map((m:any)=>({
      tmdb_id:Number(m.tmdb_id), media_type:m.media_type==='tv'?'tv':'movie',
      media_kind:['movie','series','anime'].includes(m.media_kind)?m.media_kind:(m.media_type==='tv'?'series':'movie'),
      title:String(m.title||`TMDB #${m.tmdb_id}`), original_title:safeText(m.original_title), release_year:num(m.release_year), poster_path:safeText(m.poster_path),
      runtime_minutes:num(m.runtime_minutes), total_seasons:num(m.total_seasons), total_episodes:num(m.total_episodes), genres:jobj(m.genres,[]), raw_tmdb:jobj(m.raw_tmdb,{})
    })).filter((m:any)=>Number.isFinite(m.tmdb_id));
    if(!body.length) continue;
    const rows=await db('media?on_conflict=tmdb_id,media_type',{method:'POST',headers:{prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)}) as any[];
    for(const m of rows||[]) mediaMap.set(`${m.tmdb_id}:${m.media_type}`,Number(m.id));
  }
  const oldToNew=new Map<string,number>();
  for(const old of mediaIn){const id=mediaMap.get(`${Number(old.tmdb_id)}:${old.media_type==='tv'?'tv':'movie'}`);if(id)oldToNew.set(String(old.id),id)}

  await db(`episode_progress?profile_id=eq.${encodeURIComponent(user)}`,{method:'DELETE',headers:{prefer:'return=minimal'}});
  await db(`watch_history?profile_id=eq.${encodeURIComponent(user)}`,{method:'DELETE',headers:{prefer:'return=minimal'}});
  await db(`media_overrides?profile_id=eq.${encodeURIComponent(user)}`,{method:'DELETE',headers:{prefer:'return=minimal'}});
  await db(`imports?profile_id=eq.${encodeURIComponent(user)}`,{method:'DELETE',headers:{prefer:'return=minimal'}});

  const importMap=new Map<string,number>();
  for(const old of importsIn){
    const body={profile_id:user,filename:String(old.filename||'backup'),file_type:old.file_type==='json'?'json':'zip',status:['preview','processing','completed','failed'].includes(old.status)?old.status:'completed',total_items:Number(old.total_items||0),matched_items:Number(old.matched_items||0),unmatched_items:Number(old.unmatched_items||0),summary:jobj(old.summary,{}),completed_at:safeText(old.completed_at),processing_cursor:Number(old.processing_cursor||0),error_message:safeText(old.error_message)};
    const rows=await db('imports',{method:'POST',body:JSON.stringify(body)}) as any[];
    if(rows?.[0]?.id!=null) importMap.set(String(old.id),Number(rows[0].id));
  }

  for(const part of chunks(ovIn)){
    const body=part.map((r:any)=>({profile_id:user,media_id:oldToNew.get(String(r.media_id))||null,state:String(r.state||''),origin:['manual','import','system'].includes(r.origin)?r.origin:'manual',source_import_id:r.source_import_id==null?null:(importMap.get(String(r.source_import_id))||null),watched_at:safeText(r.watched_at)})).filter((r:any)=>r.media_id&&['AlreadySeen','Completed','InProgress','UpToDate','NotInterested','Liked','Disliked','WatchLater','AddedToWatchlist'].includes(r.state));
    if(body.length) await db('media_overrides?on_conflict=profile_id,media_id,state',{method:'POST',headers:{prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
  }
  for(const part of chunks(histIn)){
    const body=part.map((r:any)=>({profile_id:user,source:String(r.source||'backup'),source_history_id:num(r.source_history_id),media_id:r.media_id==null?null:(oldToNew.get(String(r.media_id))||null),item_type:r.item_type==='episode'?'episode':'movie',season_number:num(r.season_number),episode_number:num(r.episode_number),watched_at:String(r.watched_at||''),external_ids:jobj(r.external_ids,{}),title:safeText(r.title)})).filter((r:any)=>r.watched_at);
    if(body.length) await db('watch_history?on_conflict=profile_id,source,source_history_id',{method:'POST',headers:{prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
  }
  for(const part of chunks(progIn)){
    const body=part.map((r:any)=>({profile_id:user,media_id:oldToNew.get(String(r.media_id))||null,season_number:Number(r.season_number||0),episode_number:Number(r.episode_number||0),watched:bool(r.watched),watched_at:safeText(r.watched_at),origin:['manual','import','system'].includes(r.origin)?r.origin:'manual',source_import_id:r.source_import_id==null?null:(importMap.get(String(r.source_import_id))||null)})).filter((r:any)=>r.media_id);
    if(body.length) await db('episode_progress?on_conflict=profile_id,media_id,season_number,episode_number',{method:'POST',headers:{prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});
  }
  const profile=Array.isArray(p.profile)?p.profile[0]:null;
  if(profile){await db(`profiles?id=eq.${encodeURIComponent(user)}`,{method:'PATCH',headers:{prefer:'return=minimal'},body:JSON.stringify({display_name:String(profile.display_name||'Usuário'),settings:jobj(profile.settings,{})})});}
  return {media:mediaIn.length,imports:importsIn.length,media_overrides:ovIn.length,watch_history:histIn.length,episode_progress:progIn.length};
}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:CORS});
  if(req.method!=='POST') return json({ok:false,error:'METHOD_NOT_ALLOWED'},405);
  try{
    const user=await userId(req); const body=await req.json().catch(()=>({}));
    if(body.action==='snapshot') return json({ok:true,data:await snapshot(user)});
    if(body.action==='restore') return json({ok:true,restored:await restore(user,body.data)});
    return json({ok:false,error:'INVALID_ACTION'},400);
  }catch(e){const status=e instanceof ApiError?e.status:500;return json({ok:false,error:e instanceof Error?e.message:String(e)},status)}
});
