/* CineTracker Android r289 / 1.0.47: F1 driver/constructor standings rescue.
   This source MUST be inserted inside r111 F1 module, before rowsF111. */
const originalGetF111289=getF111;
const f1289Season=()=>new Date().getFullYear();
let f1289Request=null,f1289LastFail=0;
const f1289List=(value,key)=>{
 if(Array.isArray(value))return value;
 const x=value?.MRData||value?.data?.MRData||value?.data||value;
 const a=x?.StandingsTable?.StandingsLists?.[0]?.[key]||
  x?.StandingsLists?.[0]?.[key]||x?.standings?.[key]||x?.[key]||x?.items;
 return Array.isArray(a)?a:[];
};
const f1289Good=(value,key)=>f1289List(value,key).length>0;
function f1289Cache(season){
 try{const c=JSON.parse(localStorage.getItem('ct:r289:rank:'+season)||'null');
  return c&&Date.now()-Number(c.at||0)<6*3600000?c:null
 }catch{return null}
}
function f1289Save(season,result){
 try{localStorage.setItem('ct:r289:rank:'+season,JSON.stringify({at:Date.now(),...result}))}catch{}
}
async function f1289Fetch(url){
 const controller=new AbortController();
 const t=setTimeout(()=>controller.abort(),9000);
 try{
  const response=await fetch(url,{signal:controller.signal,mode:'cors',cache:'no-cache',
   headers:{'Accept':'application/json'}});
  if(!response.ok)throw Error('Standings HTTP '+response.status);
  const data=await response.json();
  if(!data?.MRData?.StandingsTable)throw Error('Standings payload inválido');
  return data;
 }finally{clearTimeout(t)}
}
async function f1289Enrich(data){
 const season=f1289Season(),fromStore=f1289Cache(season);
 const output={...data};
 const needs=[
  !f1289Good(output.drivers,'DriverStandings')?'drivers':null,
  !f1289Good(output.constructors,'ConstructorStandings')?'constructors':null
 ].filter(Boolean);
 if(!needs.length)return output;
 for(const kind of needs)if(fromStore?.[kind]&&f1289Good(fromStore[kind],kind==='drivers'?'DriverStandings':'ConstructorStandings'))
  output[kind]=fromStore[kind];
 const remaining=needs.filter(k=>!f1289Good(output[k],k==='drivers'?'DriverStandings':'ConstructorStandings'));
 if(!remaining.length)return output;
 if(Date.now()-f1289LastFail<30000)return output;
 if(!f1289Request){
  f1289Request=(async()=>{
   const endpoints={drivers:'driverstandings',constructors:'constructorstandings'};
   const x=await Promise.allSettled(remaining.map(async kind=>{
    const p='https://api.jolpi.ca/ergast/f1/'+season+'/'+endpoints[kind]+'/?limit=100';
    const response=await f1289Fetch(p);
    const key=kind==='drivers'?'DriverStandings':'ConstructorStandings';
    if(!f1289Good(response,key))throw Error('Classificação vazia');
    return [kind,response];
   }));
   const mapped=Object.fromEntries(x.filter(p=>p.status==='fulfilled').map(p=>p.value));
   if(!Object.keys(mapped).length)f1289LastFail=Date.now();
   else f1289Save(season,{drivers:mapped.drivers||fromStore?.drivers,
    constructors:mapped.constructors||fromStore?.constructors});
   return mapped;
  })().finally(()=>{f1289Request=null});
 }
 const found=await f1289Request;
 for(const kind of remaining)if(found?.[kind])output[kind]=found[kind];
 return output;
}
getF111=async function(force=false){
 const raw=await originalGetF111289(force);
 try{
  const enriched=await f1289Enrich(raw);
  if(enriched&&f111Data===raw)f111Data=enriched;
  return enriched;
 }catch(error){
  document.documentElement.dataset.ct289F1RankError=String(error?.message||error);
  return raw;
 }
};
// Empty standings are a loading/data source failure, not an empty heading.
const renderRowsF111289=rowsF111;
// rowsF111 is a hoisted function declaration and can be replaced in-module.
rowsF111=function(items,constructors=false){
 if(!Array.isArray(items)||items.length===0)
  return '<div class="ct289-f1-unavailable">Classificação não disponível no momento. '+
   '<button type="button" data-ct111-f1-retry class="chip">Atualizar</button></div>';
 return renderRowsF111289(items,constructors);
};
window.__ctR289F1Test={list:f1289List,enrich:f1289Enrich,fetch:f1289Fetch,cache:f1289Cache};
