/* Android 1.0.47/r289 F1 classifications recovery, injected inside f111 closure.
   Does not modify backend, Web, or other sports routes. */
(()=>{
'use strict';
if(window.__ctR289F1)return;
window.__ctR289F1='jolpica-independent-standings-no-blank-tabs';
const list=x=>Array.isArray(x)?x:[];
const standing=(d,kind)=>list(d?.[kind]?.MRData?.StandingsTable?.StandingsLists?.[0]?.[kind==='drivers'?'DriverStandings':'ConstructorStandings']);
const visible=()=>{try{return route()==='sports'&&!!q111('#ct-f1-v111')}catch{return false}};
let pending=null,attemptedAt=0,stamp='',errorText='';
function valid(d){return standing(d,'drivers').length>0&&standing(d,'constructors').length>0}
async function requestStandings(season,kind){
 const ctrl=new AbortController();
 const timeout=setTimeout(()=>ctrl.abort(),9000);
 try{
  const endpoint=kind==='drivers'?'driverstandings':'constructorstandings';
  const url='https://api.jolpi.ca/ergast/f1/'+season+'/'+endpoint+'/';
  const response=await fetch(url,{method:'GET',headers:{Accept:'application/json'},signal:ctrl.signal});
  if(!response.ok)throw Error('Jolpica '+response.status);
  const data=await response.json();
  if(!standing({[kind]:data},kind).length)throw Error('Classificação de '+kind+' vazia');
  return data;
 }finally{clearTimeout(timeout)}
}
async function recover(force=false){
 if(!f111Data?.races?.length||!visible())return false;
 const season=Number(f111Data?.season||new Date().getFullYear());
 const key=String(season);
 if(valid(f111Data))return true;
 if(pending)return pending;
 if(!force&&stamp===key&&Date.now()-attemptedAt<45000)return false;
 stamp=key;attemptedAt=Date.now();
 pending=(async()=>{
  const [driver,team]=await Promise.allSettled([
   standing(f111Data,'drivers').length?Promise.resolve(f111Data.drivers):requestStandings(season,'drivers'),
   standing(f111Data,'constructors').length?Promise.resolve(f111Data.constructors):requestStandings(season,'constructors')
  ]);
  if(Number(f111Data?.season||new Date().getFullYear())!==season)return false;
  if(driver.status==='fulfilled')f111Data.drivers=driver.value;
  if(team.status==='fulfilled')f111Data.constructors=team.value;
  const ok=valid(f111Data);
  if(ok){
   errorText='';
   f111At=Date.now();
   try{localStorage.setItem('ct:v111:f1:'+season,JSON.stringify({t:Date.now(),d:f111Data}))}catch{}
  }else{
   errorText='As classificações ainda não foram disponibilizadas pelo provedor. Tente novamente.';
   document.documentElement.dataset.ct289F1Error=[
    driver.status==='rejected'?String(driver.reason?.message||driver.reason):'',
    team.status==='rejected'?String(team.reason?.message||team.reason):''
   ].join(' | ');
  }
  if(visible()){
   const body=q111('[data-ct111-f1-body]');
   if(body)body.innerHTML=bodyF111(f111Data,f111Tab);
  }
  return ok;
 })().finally(()=>{pending=null});
 return pending;
}
const originalGet=getF111;
getF111=async function(force=false){
 const data=await originalGet(force);
 if(data?.races?.length&&!valid(data))void recover(false);
 return data;
};
const originalBody=bodyF111;
bodyF111=function(d,tab){
 const ready=valid(d),missing=tab==='overview'?'':tab==='drivers'?'drivers':tab==='constructors'?'constructors':'';
 if(!ready&&visible())void recover(false);
 if(missing&&!standing(d,missing).length){
  return '<div class="ct111-f1-card ct267-f1-rank"><h3>Classificação de '+
   (missing==='drivers'?'Pilotos':'Construtores')+'</h3>'+
   '<div class="notice">'+(pending?'Buscando classificação atualizada…':errorText||'Buscando os resultados desta temporada…')+'</div>'+
   '<button type="button" class="btn" data-ct111-f1-retry>Atualizar classificação</button></div>';
 }
 const html=originalBody.apply(this,arguments);
 if(tab!=='overview'||ready)return html;
 return html+'<div class="notice">Classificação parcial — atualizando Pilotos e Construtores.</div>';
};
document.addEventListener('click',event=>{
 const b=event.target.closest?.('[data-ct111-f1]');
 if(!b)return;
 if(b.dataset.ct111F1==='drivers'||b.dataset.ct111F1==='constructors')void recover(false);
},false);
window.__ctR289F1Test={valid,standing,recover,requestStandings};
})();