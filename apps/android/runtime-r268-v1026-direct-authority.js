function ct186History268(){
 const id=String(user?.id||session?.user?.id||'anon');
 const key='ct:r268:daily-shown:'+id;
 let list=[];try{list=JSON.parse(localStorage.getItem(key)||'[]')}catch{}
 return{key,list:Array.isArray(list)?list.filter(x=>x&&typeof x.key==='string'&&typeof x.day==='string').slice(-30):[]};
}
function ct186SaveDaily268(item){
 const mediaKey=ct186Key(item);if(!mediaKey)return;
 const day=localDay(),hist=ct186History268();
 try{
  localStorage.setItem(ct186DailyStorage(),mediaKey);
  if(!hist.list.some(x=>x.day===day&&x.key===mediaKey)){
   hist.list.push({day,key:mediaKey});
   localStorage.setItem(hist.key,JSON.stringify(hist.list.slice(-30)));
  }
 }catch{}
}
function ct186DailyPick(pool,used){
 const usable=(pool||[]).filter(x=>!used.has(ct186Key(x))&&!ct186LocalBlocked.has(ct186Key(x)));
 if(!usable.length)return null;
 let saved='';try{saved=localStorage.getItem(ct186DailyStorage())||''}catch{}
 const today=localDay(),hist=ct186History268();
 const current=usable.find(x=>ct186Key(x)===saved);
 const recorded=hist.list.some(x=>x.day===today&&x.key===saved);
 if(current&&recorded)return current;
 const lastKeys=new Set(hist.list.filter(x=>x.day!==today).slice(-8).map(x=>x.key));
 // On upgrading from pre-r268, the old stored title may be the one shown
 // for weeks. Rotate it once, then keep the new result stable that day.
 if(current&&!recorded)lastKeys.add(saved);
 try{
  const date=new Date(today+'T12:00:00');
  for(let offset=1;offset<=7;offset++){
   const previous=new Date(date);previous.setDate(previous.getDate()-offset);
   const key='ct:r186:daily:'+String(user?.id||session?.user?.id||'anon')+':'+previous.toISOString().slice(0,10);
   const old=localStorage.getItem(key);if(old)lastKeys.add(old);
  }
 }catch{}
 const fresh=usable.filter(x=>!lastKeys.has(ct186Key(x)));
 const candidates=fresh.length?fresh:usable;
 const seed=today+':'+String(user?.id||session?.user?.id||'anon');
 const pick=candidates[ct186Hash(seed)%candidates.length]||candidates[0];
 ct186SaveDaily268(pick);
 return pick;
}
//__CT268_DAILY_END__
function pick237(key,current){
 const pool=pool237(key);if(pool.length<2)return null;
 const excluded=[];
 if(key==='fresh:movie'){
  try{
   const daily=ct186ForYouData?ct186Select(ct186ForYouData).daily:null;
   const id=Number(daily?.id||daily?.tmdb_id||0);if(id>0)excluded.push(id);
  }catch{}
 }
 const available=pool.filter(x=>{
  const id=Number(x?.id||x?.tmdb_id||0);
  return id>0&&id!==Number(current||0)&&!excluded.includes(id);
 });
 if(!available.length)return null;
 const previous=Number(ct166SwapIndex[key]||0);
 const selection=available[previous%available.length];
 ct166SwapIndex[key]=previous+1;
 if(key==='daily:movie'&&selection)ct186SaveDaily268(selection);
 return selection||null;
}
//__CT268_SWAP_END__
function bodyF111(d,tab){
 const drv=f111Stand(d.drivers,'DriverStandings'),con=f111Stand(d.constructors,'ConstructorStandings'),res=f111Race(d.results);
 const next=d.next||{},last=d.last||{},raceList=Array.isArray(d.races)?d.races:[];
 if(tab==='calendar'){
  return '<div class="ct267-f1-calendar">'+raceList.map((r,i)=>'<button type="button" class="ct111-f1-race ct267-f1-race" data-ct265-race="'+i+'" aria-label="Abrir detalhes do '+e111(r.raceName||'Grande Prêmio')+'"><b>'+e111(r.round)+'. '+e111(r.raceName||'Grande Prêmio')+'</b><span>'+e111(r.Circuit?.circuitName||'Circuito')+' · '+e111(r.Circuit?.Location?.country||'')+'</span><small>'+e111(f111Date(r.date))+'</small><em>Fim de semana, sessões, grid e resultado ›</em></button>').join('')+'</div>';
 }
 if(tab==='drivers')return '<div class="ct111-f1-card ct267-f1-rank"><h3>Classificação de Pilotos</h3>'+rowsF111(drv)+'</div>';
 if(tab==='constructors')return '<div class="ct111-f1-card ct267-f1-rank"><h3>Classificação de Construtores</h3>'+rowsF111(con,true)+'</div>';
 const podium=res&&Array.isArray(res.Results)?{...res,Results:res.Results.slice(0,3)}:res;
 return '<div class="ct267-f1-overview ct268-f1-overview"><div class="ct111-f1-card"><h3>Próximo GP</h3><h2>'+e111(next.raceName||'A definir')+'</h2><small>'+e111(next.Circuit?.circuitName||'')+' · '+e111(f111Date(next.date))+'</small></div><div class="ct111-f1-card"><h3>Último GP · Pódio</h3><h2>'+e111(last.raceName||'Sem resultado')+'</h2>'+resultsF111(podium)+'</div><div class="ct111-f1-card"><h3>Pilotos · Top 3</h3>'+rowsF111(drv.slice(0,3))+'<small class="ct268-overview-more">Top 20 na aba Pilotos ›</small></div><div class="ct111-f1-card"><h3>Construtores · Top 3</h3>'+rowsF111(con.slice(0,3),true)+'<small class="ct268-overview-more">Classificação na aba Construtores ›</small></div></div>';
}
//__CT268_F1_END__
