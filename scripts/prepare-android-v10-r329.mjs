import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Android-only loading fixes. Web, Supabase schema and native Java are frozen.
const root=resolve(process.cwd());
const target=resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html');
const from='<script data-ct-android="r328-android-stable-js">';
const to='<script data-ct-android="r329-android-stable-js">';
let html=await readFile(target,'utf8').catch(()=>null);
if(!html?.includes(from)&&!html?.includes(to)){
 execFileSync(process.execPath,[resolve(root,'scripts/prepare-android-v10-r328.mjs')],{cwd:root,stdio:'inherit'});
 html=await readFile(target,'utf8');
}
if(html.includes(to)){console.log('CINETRACKER_ANDROID_1_0_R329_ALREADY_PREPARED');process.exit(0)}
const begin=html.indexOf(from),end=html.indexOf('</script>',begin+from.length);
if(begin<0||end<=begin)throw Error('Android r328 baseline is required');
let js=html.slice(begin+from.length,end);
function once(before,after,label){
 const count=js.split(before).length-1;
 if(count!==1)throw Error(label+': expected one anchor, found '+count);
 js=js.replace(before,after);
}
once("const REVISION='r328-android-official-1.0';","const REVISION='r329-android-official-1.0';",'official revision');
once('window.__ctAndroidOfficialCode=10129;','window.__ctAndroidOfficialCode=10130;','Android build code');

// A detail page waited for four secondary TMDB calls, an exclusion dashboard
// and a recommendation audit before painting anything. Show the primary
// detail promptly, keeping user-specific actions locked until the personal
// snapshot is ready; enrich providers and eligible related titles separately.
once(`    const [d,providers,rec,similar,ctx]=await Promise.all([
      tmdb(\`/\${tmdbKind}/\${id}\`,tmdbKind==='tv'?{append_to_response:'credits,content_ratings'}:{append_to_response:'credits,release_dates'}),safeTmdb(\`/\${tmdbKind}/\${id}/watch/providers\`),safeTmdb(\`/\${tmdbKind}/\${id}/recommendations\`,{page:1}),safeTmdb(\`/\${tmdbKind}/\${id}/similar\`,{page:1}),ct168Exclusions().catch(()=>null)
    ]);
    if(seq!==navSeq)return;const state=ct169MainState(ctx,tmdbKind,id),related=await ct169Related(tmdbKind,id,rec,similar);if(seq!==navSeq)return;
    ct169CurrentDetail={id:Number(id),kind:tmdbKind,detail:d};`,
`    const detailTask=tmdb(\`/\${tmdbKind}/\${id}\`,tmdbKind==='tv'?{append_to_response:'credits,content_ratings'}:{append_to_response:'credits,release_dates'});
    const ctxTask=ct168Exclusions().catch(()=>null);
    const d=await detailTask;
    if(seq!==navSeq)return;
    const state=null,providers=null,related=[];
    ct169CurrentDetail={id:Number(id),kind:tmdbKind,detail:d};`,
'detail foreground loading');
once("related.length?related.map(ct169RelatedCard).join(''):'<div class=\"empty\">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>'",
"related.length?related.map(ct169RelatedCard).join(''):'<div class=\"empty\">Carregando recomendações…</div>'",
'detail recommendation placeholder');
once(`    if(tmdbKind==='tv')void ct169LoadSeasonGraphs(Number(id),seasons,seq);
  }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail('Falha ao abrir detalhes: '+(e?.message||e),kind==='movie'?'home':'discover')}
};`,
`    // Personal actions cannot claim "not watched" before verification.
    const actionRoot=h.querySelector('.ct169-main-actions');
    for(const button of actionRoot?.querySelectorAll('button')||[]){button.disabled=true;button.textContent='Verificando…'}
    void ctxTask.then(context=>{
      if(seq!==navSeq||!h.isConnected)return;
      const template=document.createElement('template');
      template.innerHTML=ct169HeroHtml(tmdbKind,id,d,null,context?ct169MainState(context,tmdbKind,id):null);
      const fresh=template.content.querySelector('.ct169-main-actions');
      h.querySelector('.ct169-main-actions')?.replaceWith(fresh);
      h.querySelector('.ct169-poster-state')?.remove();
      const badge=template.content.querySelector('.ct169-poster-state');
      if(badge)h.querySelector('.ct169-poster-wrap')?.appendChild(badge);
    }).catch(()=>{});
    void safeTmdb(\`/\${tmdbKind}/\${id}/watch/providers\`).then(result=>{
      if(seq!==navSeq||!h.isConnected)return;
      const holder=h.querySelector('.ct169-providers');
      if(holder)holder.outerHTML=ct169ProvidersHtml(result);
    }).catch(()=>{});
    void Promise.all([
      safeTmdb(\`/\${tmdbKind}/\${id}/recommendations\`,{page:1}),
      safeTmdb(\`/\${tmdbKind}/\${id}/similar\`,{page:1})
    ]).then(async([rec,similar])=>{
      const rows=await ct169Related(tmdbKind,id,rec,similar);
      if(seq!==navSeq||!h.isConnected)return;
      const row=h.querySelector('.ct169-related-row');if(!row)return;
      row.innerHTML=rows.length?rows.map(ct169RelatedCard).join(''):
       '<div class="empty">Nenhum título relacionado elegível fora do histórico e da Watchlist.</div>';
      const count=row.closest('.ct169-detail-section')?.querySelector('.ct169-section-head span');
      if(count)count.textContent=String(rows.length);
    }).catch(()=>{
      if(seq===navSeq&&h.isConnected){const row=h.querySelector('.ct169-related-row');
       if(row)row.innerHTML='<div class="empty">Recomendações indisponíveis agora.</div>'}
    });
    if(tmdbKind==='tv')setTimeout(()=>{if(seq===navSeq&&h.isConnected)void ct169LoadSeasonGraphs(Number(id),seasons,seq)},1500);
  }catch(e){if(seq!==navSeq)return;const h=$('[data-detail]');if(h)h.innerHTML=fail('Falha ao abrir detalhes: '+(e?.message||e),kind==='movie'?'home':'discover')}
};`,
'detail progressive enrichment');

// Previously discovered Brazilian providers remain useful even if the remote
// list is slow on a later day. A fourteen-day *real TMDB* snapshot is used;
// no unverified provider ID is invented.
once("Date.now()-Number(c.at||0)<86400000){ct171ProviderList=c.rows;return ct171ProviderList}",
"Date.now()-Number(c.at||0)<1209600000){ct171ProviderList=c.rows;return ct171ProviderList}",
'provider last-known cache');

// Authenticated Discover results become visible when the first audited TMDB
// response arrives, while the other media type continues loading. Only
// authorized, account-matched candidates are shown, never raw TMDB rows.
once('async function rows(tab){\n reset();','async function rows(tab,onPartial){\n reset();','discover progressive API');
once(`  const specs=info(tab);
  const replies=await Promise.allSettled(specs.map(async([path,params,type])=>{
   const response=await timeout(safeTmdb(path,params),7000,'Fonte '+tab);
   return list(response?.results).map(x=>({...x,media_type:type==='mixed'?x.media_type:type}))
    .filter(x=>['movie','tv'].includes(x.media_type));
  }));`,
`  const specs=info(tab),gate=window.__ctR279Audit,partial=new Map();
  if(!gate?.auditCandidates||!gate?.permitted)throw Error('Filtro pessoal indisponível');
  const replies=await Promise.allSettled(specs.map(async([path,params,type])=>{
   const response=await timeout(safeTmdb(path,params),7000,'Fonte '+tab);
   const batch=list(response?.results).map(x=>({...x,media_type:type==='mixed'?x.media_type:type}))
    .filter(x=>['movie','tv'].includes(x.media_type));
   if(onPartial&&batch.length){
    const candidates=batch.filter(x=>window.__ctR265Test?.allowed?.(x));
    const valid=candidates.length&&await timeout(gate.auditCandidates(candidates),10000,'Auditoria parcial');
    if(valid===true&&uid()===id){
     for(const item of candidates)if(gate.permitted(item,false)===true)partial.set(key(item),item);
     if(partial.size)onPartial([...partial.values()]);
    }
   }
   return batch;
  }));`,
'discover first audited batch');
once("  const audit=window.__ctR279Audit;\n  if(!audit?.auditCandidates||!audit?.permitted)throw Error('Filtro pessoal indisponível');\n  checks++;",
"  const audit=gate;\n  checks++;",
'discover final audit');
once(`  const promise=window.__ctR319Discover.rows(tab);
  const result=await Promise.race([promise,new Promise((_,reject)=>{`,
`  let firstPaint=false;
  const promise=window.__ctR319Discover.rows(tab,partial=>{
   if(firstPaint||expected!==seq||!here()||getTab()!==tab||!partial?.length)return;
   firstPaint=true;goodRows.set(tab,{rows:partial,at:Date.now()});present(partial,tab);
  });
  const result=await Promise.race([promise,new Promise((_,reject)=>{`,
'discover first authorized paint');
// r316 retains error handling, rerenders the complete authorized set when the
// other category finishes, and ignores stale navigation tokens.
new Function(js);
html=html.slice(0,begin)+to+js+'</script>'+html.slice(end+'</script>'.length);
await writeFile(target,html,'utf8');
console.log('CINETRACKER_ANDROID_1_0_R329_READY: details staged, providers cached, Discover audited progressively; Web frozen.');
