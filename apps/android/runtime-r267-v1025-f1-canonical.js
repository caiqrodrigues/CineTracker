function bodyF111(d,tab){
 const drv=f111Stand(d.drivers,'DriverStandings'),con=f111Stand(d.constructors,'ConstructorStandings'),res=f111Race(d.results);
 const next=d.next||{},last=d.last||{},raceList=Array.isArray(d.races)?d.races:[];
 if(tab==='calendar'){
  return '<div class="ct267-f1-calendar">'+raceList.map((r,i)=>'<button type="button" class="ct111-f1-race ct267-f1-race" data-ct265-race="'+i+'" aria-label="Abrir detalhes do '+e111(r.raceName||'Grande Prêmio')+'"><b>'+e111(r.round)+'. '+e111(r.raceName||'Grande Prêmio')+'</b><span>'+e111(r.Circuit?.circuitName||'Circuito')+' · '+e111(r.Circuit?.Location?.country||'')+'</span><small>'+e111(f111Date(r.date))+'</small><em>Fim de semana, sessões, grid e resultado ›</em></button>').join('')+'</div>';
 }
 if(tab==='drivers')return '<div class="ct111-f1-card ct267-f1-rank"><h3>Classificação de Pilotos</h3>'+rowsF111(drv)+'</div>';
 if(tab==='constructors')return '<div class="ct111-f1-card ct267-f1-rank"><h3>Classificação de Construtores</h3>'+rowsF111(con,true)+'</div>';
 return '<div class="ct267-f1-overview"><div class="ct111-f1-card"><h3>Próximo Grande Prêmio</h3><h2>'+e111(next.raceName||'A definir')+'</h2><small>'+e111(next.Circuit?.circuitName||'')+' · '+e111(f111Date(next.date))+'</small></div><div class="ct111-f1-card"><h3>Último Grande Prêmio</h3><h2>'+e111(last.raceName||'Sem resultado')+'</h2>'+resultsF111(res)+'</div><div class="ct111-f1-card"><h3>Pilotos</h3>'+rowsF111(drv.slice(0,5))+'</div><div class="ct111-f1-card"><h3>Construtores</h3>'+rowsF111(con.slice(0,5),true)+'</div></div>';
}
//__CT267_END_BODY__
function ensureF111Shell(){
 const root=q111('[data-sports]');if(!root)return null;
 root.querySelector('.sports-summary')?.closest('.panel')?.remove();
 let hub=q111('#ct-f1-v111',root);
 if(!hub){hub=document.createElement('section');hub.id='ct-f1-v111';hub.className='ct111-f1 ct267-f1-hub';root.prepend(hub)}
 const canonical=[['overview','Visão geral'],['calendar','Calendário'],['drivers','Pilotos'],['constructors','Construtores']];
 if(!canonical.some(x=>x[0]===f111Tab))f111Tab='overview';
 const current=[...hub.querySelectorAll('[data-ct111-f1]')].map(x=>x.dataset.ct111F1);
 if(!hub.dataset.ct267Owner||current.join(',')!==canonical.map(x=>x[0]).join(',')){
  hub.innerHTML='<div class="ct111-f1-head"><div><small>FÓRMULA 1</small><h2>F1 Hub</h2></div><div class="ct111-f1-tabs">'+canonical.map(([id,label])=>'<button type="button" data-ct111-f1="'+id+'">'+label+'</button>').join('')+'</div></div><div data-ct111-f1-body><div class="loader">Carregando Fórmula 1...</div></div>';
  hub.dataset.ct267Owner='web-four-tabs';
 }
 for(const button of hub.querySelectorAll('[data-ct111-f1]')){
  const active=button.dataset.ct111F1===f111Tab;
  button.classList.toggle('active',active);
  button.setAttribute('aria-selected',String(active));
 }
 return hub;
}
//__CT267_END_SHELL__
