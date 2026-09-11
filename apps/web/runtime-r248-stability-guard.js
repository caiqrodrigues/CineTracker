/* r248 stability guard — suppress identical Sports tab DOM rewrites. */
(()=>{
'use strict';
if(window.__ctR248StabilityGuard)return;window.__ctR248StabilityGuard='idempotent-sports-tabs-innerhtml';
const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');
if(!d?.get||!d?.set)return;
Object.defineProperty(Element.prototype,'innerHTML',{
 configurable:d.configurable,enumerable:d.enumerable,
 get(){return d.get.call(this)},
 set(value){
  const next=String(value??'');
  if(this?.classList?.contains('ct248-sports-tabs')&&d.get.call(this)===next)return;
  return d.set.call(this,value);
 }
});
})();
