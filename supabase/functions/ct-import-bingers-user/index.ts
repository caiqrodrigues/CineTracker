import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const URL=Deno.env.get('SUPABASE_URL')!;
const SERVICE=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const H={apikey:SERVICE,Authorization:`Bearer ${SERVICE}`,'Content-Type':'application/json'};
const CORS={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS',
  'Access-Control-Max-Age':'86400',
};
const json=(d:any,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...CORS,'content-type':'application/json','cache-control':'no-store'}});

async function rest(path:string,init:RequestInit={}){
  const r=await fetch(`${URL}/rest/v1/${path}`,{...init,headers:{...H,...(init.headers||{})}});
  const t=await r.text();
  if(!r.ok)throw new Error(`${path} ${r.status}: ${t.slice(0,800)}`);
  return t?JSON.parse(t):null;
}
async function uid(req:Request){
  const auth=req.headers.get('authorization')||'';
  if(!auth.toLowerCase().startsWith('bearer '))throw new Error('Sessão ausente');
  const r=await fetch(`${URL}/auth/v1/user`,{headers:{apikey:SERVICE,Authorization:auth}});
  if(!r.ok)throw new Error('Sessão inválida');
  const u=await r.json();if(!u?.id)throw new Error('Usuário inválido');return String(u.id);
}
function hash32(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const mt=(x:any)=>x.type==='movie'?'movie':'tv';
function stableTmdb(x:any){const real=Number(x.tmdb_id||0);if(real>0)return real;return -(1000000000+(hash32(`${mt(x)}|${x.tvdb_id||''}|${x.title||''}|${x.year||''}`)%900000000))}
function plays(x:any){const n=Number(x?.plays||1);return Number.isFinite(n)&&n>0?Math.floor(n):1}
async function insert(table:string,rows:any[],conflict='',mode:'merge'|'ignore'='merge'){
  if(!rows.length)return;
  const q=conflict?`?on_conflict=${encodeURIComponent(conflict)}`:'';
  const resolution=conflict?(mode==='ignore'?'resolution=ignore-duplicates,return=minimal':'resolution=merge-duplicates,return=minimal'):'return=minimal';
  await rest(`${table}${q}`,{method:'POST',headers:{Prefer:resolution},body:JSON.stringify(rows)});
}
async function owned(u:string,id:number){const r=await rest(`imports?id=eq.${id}&profile_id=eq.${u}&select=id`);if(!r?.[0])throw new Error('Importação não pertence ao usuário')}
async function mediaMap(ids:number[]){if(!ids.length)return new Map();const unique=[...new Set(ids)];const r=await rest(`media?select=id,tmdb_id,media_type,title&tmdb_id=in.(${unique.join(',')})`);return new Map((r||[]).map((m:any)=>[`${m.media_type}:${m.tmdb_id}`,m]))}

const progressStates=new Set(['AlreadySeen','Completed','InProgress','NotInterested']);
function conflicts(incoming:string,manual:Set<string>){
  if(manual.has(incoming))return true;
  if(incoming==='AlreadySeen'||incoming==='InProgress'||incoming==='Completed')return [...manual].some(s=>progressStates.has(s));
  if(incoming==='AddedToWatchlist')return [...manual].some(s=>progressStates.has(s));
  if(incoming==='WatchLater')return manual.has('AlreadySeen')||manual.has('Completed')||manual.has('NotInterested');
  return false;
}
async function withoutConflictingManualOverrides(user:string,rows:any[]){
  if(!rows.length)return rows;
  const ids=[...new Set(rows.map((x:any)=>Number(x.media_id)).filter(Boolean))];
  if(!ids.length)return rows;
  const manual=await rest(`media_overrides?profile_id=eq.${user}&origin=eq.manual&media_id=in.(${ids.join(',')})&select=media_id,state`).catch(()=>[]);
  const byMedia=new Map<number,Set<string>>();
  for(const x of manual||[]){const id=Number(x.media_id);if(!byMedia.has(id))byMedia.set(id,new Set());byMedia.get(id)!.add(String(x.state))}
  return rows.filter((x:any)=>!conflicts(String(x.state),byMedia.get(Number(x.media_id))||new Set()));
}
async function clearPreviousImport(user:string){
  await rest(`episode_progress?profile_id=eq.${user}&origin=eq.import`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  await rest(`watch_history?profile_id=eq.${user}&source=eq.bingers`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  await rest(`media_overrides?profile_id=eq.${user}&origin=eq.import`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
  await rest(`imports?profile_id=eq.${user}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
}

Deno.serve(async(req)=>{
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:CORS});
  if(req.method!=='POST')return json({ok:false,error:'Método não permitido'},405);
  try{
    const user=await uid(req),b=await req.json().catch(()=>({})),action=String(b.action||'');
    if(action==='begin'){
      await clearPreviousImport(user);
      const r=await rest('imports',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({
        profile_id:user,filename:String(b.filename||'Bingers'),file_type:b.file_type==='json'?'json':'zip',status:'processing',total_items:Number(b.total_items||0),matched_items:0,unmatched_items:0,processing_cursor:0,
        summary:{source:'Bingers',strategy:'hotfix15_cors_plays_semantics',phase:'begin',preserves_manual:true,ratings_ignored:true,lists_ignored:true}
      })});
      return json({ok:true,import_id:r?.[0]?.id});
    }

    const importId=Number(b.import_id||0);if(!importId)throw new Error('import_id obrigatório');await owned(user,importId);

    if(action==='library_batch'){
      const rows=Array.isArray(b.rows)?b.rows:[];if(!rows.length||rows.length>200)throw new Error('Lote de biblioteca deve ter 1-200 registros');
      const mediaRows=rows.map((x:any)=>({
        tmdb_id:stableTmdb(x),media_type:mt(x),media_kind:x.type==='movie'?'movie':'series',title:String(x.title||'Sem título'),original_title:x.original_title||null,release_year:Number(x.year)||null,
        raw_tmdb:{tvdb_id:Number(x.tvdb_id)||null,source_tmdb_id:Number(x.tmdb_id)||null,bingers_added_at:x.added_at||null,import_key:x.import_key||null,history_only:x.history_only===true||undefined},updated_at:new Date().toISOString()
      }));
      await insert('media',mediaRows,'tmdb_id,media_type','ignore');
      const map=await mediaMap(mediaRows.map((m:any)=>m.tmdb_id));
      let ovs:any[]=[];
      for(let i=0;i<rows.length;i++){
        const x=rows[i],m=mediaRows[i],found=map.get(`${m.media_type}:${m.tmdb_id}`);if(!found)continue;
        if(x.ct13_added_to_watchlist===true)ovs.push({profile_id:user,media_id:found.id,state:'AddedToWatchlist',origin:'import',source_import_id:importId});
        if(x.ct13_watch_later===true)ovs.push({profile_id:user,media_id:found.id,state:'WatchLater',origin:'import',source_import_id:importId});
        if(x.type==='show'&&x.ct13_in_progress===true)ovs.push({profile_id:user,media_id:found.id,state:'InProgress',origin:'import',source_import_id:importId});
      }
      ovs=await withoutConflictingManualOverrides(user,ovs);
      await insert('media_overrides',ovs,'profile_id,media_id,state','ignore');
      const cursor=Number(b.cursor||0)+rows.length;
      await rest(`imports?id=eq.${importId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({processing_cursor:cursor,summary:{source:'Bingers',strategy:'hotfix15_cors_plays_semantics',phase:'library',progress:Number(b.progress||0),preserves_manual:true}})});
      return json({ok:true,count:rows.length,cursor});
    }

    if(action==='watches_batch'){
      const rows=Array.isArray(b.rows)?b.rows:[];if(!rows.length||rows.length>200)throw new Error('Lote de histórico deve ter 1-200 registros');
      const map=await mediaMap(rows.map((x:any)=>Number(x.media_tmdb_id))),hist:any[]=[],prog:any[]=[];let ovs:any[]=[];const states=new Set<string>();
      for(const x of rows){
        const type=x.media_type==='movie'?'movie':'tv',m=map.get(`${type}:${Number(x.media_tmdb_id)}`);if(!m)continue;
        const first=x.first_watched_at||x.last_watched_at||new Date().toISOString(),last=x.last_watched_at||first,p=plays(x);
        if(x.type==='movie'){
          hist.push({profile_id:user,source:'bingers',source_history_id:Number(x.source_history_id),media_id:m.id,item_type:'movie',watched_at:last,external_ids:{plays:p,first_watched_at:first,last_watched_at:last,tvdb_id:Number(x.tvdb_id)||null,tmdb_id:Number(x.tmdb_id)||null},title:x.title||m.title});
          const k=`${m.id}:AlreadySeen`;if(!states.has(k)){states.add(k);ovs.push({profile_id:user,media_id:m.id,state:'AlreadySeen',origin:'import',source_import_id:importId,watched_at:last})}
        }else{
          const s=Number(x.season_number),e=Number(x.episode_number);
          hist.push({profile_id:user,source:'bingers',source_history_id:Number(x.source_history_id),media_id:m.id,item_type:'episode',season_number:s,episode_number:e,watched_at:last,external_ids:{plays:p,first_watched_at:first,last_watched_at:last,tvdb_id:Number(x.tvdb_id)||null,tmdb_id:Number(x.tmdb_id)||null},title:`${x.title||m.title} — T${s}E${e}`});
          prog.push({profile_id:user,media_id:m.id,season_number:s,episode_number:e,watched:true,watched_at:last,origin:'import',source_import_id:importId});
          const k=`${m.id}:InProgress`;if(!states.has(k)){states.add(k);ovs.push({profile_id:user,media_id:m.id,state:'InProgress',origin:'import',source_import_id:importId,watched_at:last})}
        }
      }
      ovs=await withoutConflictingManualOverrides(user,ovs);
      await insert('watch_history',hist,'profile_id,source,source_history_id');
      await insert('episode_progress',prog,'profile_id,media_id,season_number,episode_number','ignore');
      await insert('media_overrides',ovs,'profile_id,media_id,state','ignore');
      const cursor=Number(b.cursor||0)+rows.length;
      await rest(`imports?id=eq.${importId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({processing_cursor:cursor,summary:{source:'Bingers',strategy:'hotfix15_cors_plays_semantics',phase:'history',progress:Number(b.progress||0),preserves_manual:true}})});
      return json({ok:true,count:rows.length,cursor});
    }

    if(action==='finish'){
      const s=b.summary||{};
      if(Number(s.unmatched_watch_events||0)>0)throw new Error('Importação bloqueada: existem registros de histórico não mapeados.');
      await rest(`imports?id=eq.${importId}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({status:'completed',matched_items:Number(s.library_items||0),unmatched_items:Number(s.unmatched_watch_events||0),processing_cursor:Number(s.import_media_items||s.library_items||0)+Number(s.raw_watch_records||0),summary:{source:'Bingers',strategy:'hotfix15_cors_plays_semantics',preserves_manual:true,ratings_ignored:true,lists_ignored:true,...s},completed_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
      const p=await rest(`profiles?id=eq.${user}&select=settings`),settings=p?.[0]?.settings||{};
      settings.bingers_import={import_id:importId,imported_at:new Date().toISOString(),preserves_manual:true,ratings_ignored:true,lists_ignored:true,...s};delete settings.trakt_import;
      await rest(`profiles?id=eq.${user}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({settings,updated_at:new Date().toISOString()})});
      return json({ok:true,summary:s});
    }
    throw new Error('Ação desconhecida');
  }catch(e){return json({ok:false,error:e instanceof Error?e.message:String(e)},400)}
});
