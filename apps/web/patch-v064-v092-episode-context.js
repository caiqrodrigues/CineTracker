(() => {
'use strict';
if(window.__ct92EpisodeContextLoaded)return;window.__ct92EpisodeContextLoaded=true;
document.addEventListener('click',e=>{const card=e.target.closest?.('[data-tmdb-id],[data-media-id],.ct54-card,.ct87-card,.ct84-card,.ct86-card,.card,.feature');if(!card)return;const raw=String(card.dataset.mediaId||''),m=raw.match(/tmdb-(movie|tv)-(\d+)/),type=m?m[1]:String(card.dataset.mediaType||card.dataset.type||'').toLowerCase().includes('movie')?'movie':'tv',id=m?Number(m[2]):Number(card.dataset.tmdbId||card.dataset.id||0);if(type==='tv'&&id)window.__ct92LastTv=id},true);
})();
