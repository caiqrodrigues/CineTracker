// Android Pra Você: same current Web authority, v498 single payload plus
// v485/v421 category recovery, with mandatory v525 personal-state audit.
// This function is inserted inside the existing r314 seven-slot controller.
async function auditedPools(id){
 void Promise.resolve().then(()=>taste()?.warm?.(false)).catch(()=>{});
 const raw={_ct186_fresh:empty(),_ct186_watchlist:empty(),_ct186_reserve:empty()};
 const sources={watch:{},fresh:{}};
 const unwrapPayload=value=>{
  if(Array.isArray(value)&&value.length===1&&value[0]&&typeof value[0]==='object')return unwrapPayload(value[0]);
  if(value&&typeof value==='object'&&value.data!=null)return unwrapPayload(value.data);
  return value;
 };
 const primary=await timebox(rpc('cinetracker_foryou_payload_v498',{
  p_watch_limit:30,p_fresh_limit:48
 }),9000).then(unwrapPayload).catch(()=>null);
 if(id!==userId())throw Error('Usuário alterado durante a consulta');
 let fetched=0;
 for(const kind of KINDS){
  for(const group of ['watch','fresh']){
   const bag=group==='watch'?raw._ct186_watchlist:raw._ct186_fresh;
   const rows=arr(primary?.[group]?.[kind]).filter(x=>identity(x)&&kindMatch(x,kind));
   if(rows.length){bag[kind]=rows;sources[group][kind]='v498';fetched++}
  }
 }
 // Web r523 falls back only for empty categories. The v485 source is its
 // preferred fallback; v421 is retained solely for database compatibility.
 const missing=[];
 for(const kind of KINDS)for(const group of ['watch','fresh']){
  if(!sources[group][kind])missing.push([group,kind]);
 }
 async function recoverPool(group,kind){
  const name=group==='watch'?'cinetracker_discover_watch_smart_v485':'cinetracker_discover_fresh_v485';
  const p_limit=group==='watch'?30:48;
  try{
   const response=unwrapPayload(await timebox(rpc(name,{p_kind:kind,p_limit}),3500));
   const rows=arr(response).filter(x=>identity(x)&&kindMatch(x,kind));
   if(rows.length)return{rows,source:'v485'};
  }catch{}
  try{
   const rows=await fetchPool(group,kind);
   if(rows.length)return{rows,source:'v421'};
  }catch{}
  return{rows:[],source:'empty'};
 }
 if(missing.length){
  const settled=await Promise.allSettled(missing.map(([group,kind])=>recoverPool(group,kind)));
  if(id!==userId())throw Error('Usuário alterado durante a recuperação');
  settled.forEach((result,index)=>{
   const[group,kind]=missing[index],out=result.status==='fulfilled'?result.value:null;
   if(out?.rows?.length){
    (group==='watch'?raw._ct186_watchlist:raw._ct186_fresh)[kind]=out.rows;
    sources[group][kind]=out.source;fetched++;
   }
  });
 }
 if(!fetched)throw Error('As fontes autenticadas da Web não responderam');
 // Check canonical TMDB identities and translated-title aliases against the
 // signed-in user. This is the same v525 filter used by the current Web.
 const audited=await timebox(window.__ctR279Audit.auditData(raw),18000);
 if(id!==userId())throw Error('Usuário alterado durante a auditoria');
 if(!verifyData(audited))throw Error('O servidor não confirmou as recomendações');
 const clean=blank();
 for(const kind of KINDS){
  for(const[group,bag,dest]of [
   ['watch',audited._ct186_watchlist,clean.watch],
   ['fresh',audited._ct186_fresh,clean.fresh]
  ]){
   dest[kind]=arr(bag[kind]).filter(item=>{
    if(!window.__ctR279Audit.permitted(item,group==='watch'))return false;
    item.__ct314ServerAudited=true;
    return canUse(item,kind,group==='watch');
   });
  }
 }
 audited.__ct283ServerAudited=true;
 audited.__ct288Canonical=true;
 ct186ForYouData=audited;ct166ForYouData=audited;
 document.documentElement.dataset.ct323PoolSources=JSON.stringify(sources);
 document.documentElement.dataset.ct323PoolCounts=JSON.stringify({
  watch:Object.fromEntries(KINDS.map(k=>[k,clean.watch[k].length])),
  fresh:Object.fromEntries(KINDS.map(k=>[k,clean.fresh[k].length]))
 });
 return clean;
}
