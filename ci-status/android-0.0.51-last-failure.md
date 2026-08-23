# Android 0.0.51 - last build failure

```text
--- node check ---
/home/runner/work/CineTracker/CineTracker/apps/android/app/src/main/assets/ct51.js:32
async function openEpisode(id,s,e){navStack.push({...current});current={screen:'episode',type:'tv',id,season:s,episode:e};const root=$('#app');root.innerHTML='<div class="app"><main class="content"><div class="ct51-empty">Carregando episódio…</div></main></div>';try{const sd=await tmdb('tv',id,`/season/${s}`),ep=(sd.episodes||[]).find(x=>+x.episode_number===e),st=await episodeState(id),on=st.some(x=>+x.season_number===s&&+x.episode_number===e&&x.watched),content=$('.content');content.innerHTML=`<button class="ct51-back" id="ct51-back">← Temporada ${s}</button><h1>T${s}E${e} · ${esc(ep?.name||'Episódio')}</h1>${ep?.still_path?`<div style="aspect-ratio:16/9;border-radius:14px;background:url('${img(ep.still_path)}') center/cover"></div>`:''}<p class="ct51-overview">${esc(ep?.overview||'Sem sinopse disponível.')}</p><button class="ct51-check" id="ct51-epcheck">${on?'✓ Assistido':'Marcar como assistido'}</button>`;$('#ct51-back').onclick=back;$('#ct51-epcheck').onclick=async()=>{await markEpisode(id,s,e,!on,ep?.name||null);await refreshData();openEpisode(id,s,e)}}catch(e){$('.content').innerHTML=`<button class="ct51-back" onclick="window.ct51Back()">← Voltar</button><div class="ct51-empty">Falha ao carregar episódio.</div>`}}
^^^^^

SyntaxError: Unexpected token 'async'
    at wrapSafe (node:internal/modules/cjs/loader:1713:18)
    at checkSyntax (node:internal/main/check_syntax:78:3)

Node.js v22.23.2
```
