import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const targets=[resolve(root,'dist/patch-v112-v0994-warm-boot.js'),resolve(root,'apps/web/dist/patch-v112-v0994-warm-boot.js')];
for(const file of targets){
  let s=await readFile(file,'utf8');
  s=s.replace("const dashJob=retry(()=>timeout(window.__ct991Preload?.(Boolean(force)),12000,'Perfil demorou demais'),2).catch(()=>[]);","const dashJob=retry(()=>timeout(window.__ct991Preload?.(Boolean(force)),12000,'Perfil demorou demais'),2);");
  s=s.replace("const remainingJob=timeout(window.sbRpc(REMAINING_RPC,{}),9000,'Métricas demoraram demais').catch(()=>null);","const remainingJob=retry(()=>timeout(window.sbRpc(REMAINING_RPC,{}),9000,'Métricas demoraram demais'),2);");
  s=s.replace("const discoverJob=retry(()=>timeout(window.__ct991PreloadDiscover?.(Boolean(force)),14000,'Descobrir demorou demais'),2).catch(()=>null);","const discoverJob=retry(()=>timeout(window.__ct991PreloadDiscover?.(Boolean(force)),14000,'Descobrir demorou demais'),2);");
  if(s.includes("'Perfil demorou demais'),2).catch"))throw new Error('warm boot still allows Profile preload failure');
  if(s.includes("'Descobrir demorou demais'),2).catch"))throw new Error('warm boot still allows Discover preload failure');
  if(s.includes("'Métricas demoraram demais').catch"))throw new Error('warm boot still allows metrics preload failure');
  await writeFile(file,s,'utf8');
}
console.log('CineTracker Web 0.99.4: boot só libera após Home, Perfil, métricas e Descobrir estarem prontos.');
