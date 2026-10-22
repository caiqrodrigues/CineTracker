/* CineTracker official Android 1.0/r320 — Discover Top 10 bounded loader.
 * Only wraps the existing provider-aware CT171 Top 10 source; keeps server
 * data, cards, source semantics, user marks, and all other tabs unchanged.
 */
(()=>{
'use strict';
if(window.__ctR320Discover)return;
let calls=0,failures=0,lastError='';
const timebox=(promise,ms,label)=>new Promise((resolve,reject)=>{
 let settled=false;
 const timer=setTimeout(()=>{
  if(settled)return;
  settled=true;failures++;lastError=label+' excedeu '+Math.ceil(ms/1000)+'s';
  reject(new Error(lastError));
 },ms);
 Promise.resolve(promise).then(value=>{
  if(settled)return;
  settled=true;clearTimeout(timer);resolve(value);
 },error=>{
  if(settled)return;
  settled=true;clearTimeout(timer);failures++;
  lastError=String(error?.message||error||label+' indisponível');
  reject(error);
 });
});
const providers=()=>timebox(
 Promise.resolve().then(()=>ct171Providers()),
 10000,'Lista de streamings');
const topRows=provider=>timebox(
 Promise.resolve().then(()=>{
  const id=Number(provider);
  if(!Number.isSafeInteger(id)||id<=0)throw new Error('Streaming inválido');
  calls++;return ct171TopRows(id);
 }),
 12000,'Top 10 do streaming selecionado');
window.__ctR320Discover={providers,topRows,stats:()=>({calls,failures,lastError}),
 scope:'Only provider-specific Discover Top10 request deadlines'};
})();