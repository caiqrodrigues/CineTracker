(() => {
'use strict';
if(window.__ct90AndroidExportLoaded)return;window.__ct90AndroidExportLoaded=true;
document.addEventListener('click',async e=>{
  const a=e.target?.closest?.('a[download]');
  if(!a||!window.CineTrackerNative?.exportBackup||!String(a.href||'').startsWith('blob:'))return;
  e.preventDefault();e.stopImmediatePropagation();
  try{
    const blob=await fetch(a.href).then(r=>r.blob());
    const bytes=new Uint8Array(await blob.arrayBuffer());
    let bin='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)bin+=String.fromCharCode(...bytes.subarray(i,i+chunk));
    CineTrackerNative.exportBackup(a.download||'cinetracker-backup-v90.json',btoa(bin),blob.type||'application/octet-stream');
  }catch{}
},true);
})();
