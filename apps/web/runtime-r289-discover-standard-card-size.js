/* Web 1.0.80 r289 — normalize Discover cards to the long-standing CineTracker size, Web-only. */
window.__ctR289='discover-standard-card-size';
window.__ctR289Cards='standard-154-mobile-176-desktop-2x3';
window.__ctR289Scope='discover-layout-only';
window.__ctR289Android='preserved-1.0.20-10062';

const ct289Style=document.createElement('style');
ct289Style.id='ct-web-r289-discover-standard-card-size';
ct289Style.textContent=`
[data-ct288-discover]{--ct289-card-w:154px}
@media(min-width:1100px){[data-ct288-discover]{--ct289-card-w:176px}}

/* Pra você: keep Filme/Série/Anime at the established Discover card size instead of stretching to 1/3 of the page. */
.ct288-slot-grid{
 display:grid!important;
 grid-auto-flow:column!important;
 grid-auto-columns:var(--ct289-card-w)!important;
 grid-template-columns:none!important;
 justify-content:start!important;
 align-items:start!important;
 gap:10px!important;
 overflow-x:auto!important;
 overflow-y:hidden!important;
 max-width:100%;
 min-width:0;
 padding:2px 1px 8px;
 scrollbar-width:none;
 scroll-snap-type:x proximity;
 overscroll-behavior-x:contain;
 touch-action:pan-x pan-y
}
.ct288-slot-grid::-webkit-scrollbar{display:none}
.ct288-slot{
 flex:none!important;
 width:var(--ct289-card-w)!important;
 min-width:var(--ct289-card-w)!important;
 max-width:var(--ct289-card-w)!important;
 scroll-snap-align:start
}
.ct288-slot>.ct288-card,.ct288-slot>.ct288-empty-card{width:100%!important;min-width:0!important;max-width:100%!important}

/* Browse and Top 10: normalize every r288 custom card to the same 154/176 standard. */
.ct288-rail>.ct288-card,
.ct288-top-row>.ct171-top-card{
 flex:0 0 var(--ct289-card-w)!important;
 width:var(--ct289-card-w)!important;
 min-width:var(--ct289-card-w)!important;
 max-width:var(--ct289-card-w)!important;
 scroll-snap-align:start
}

/* Ver mais may add rows, but cards never stretch to fill the available desktop width. */
.ct288-rail.ct288-expanded{
 display:grid!important;
 grid-template-columns:repeat(auto-fill,var(--ct289-card-w))!important;
 grid-auto-flow:row!important;
 justify-content:start!important;
 align-items:start!important;
 gap:10px!important;
 overflow:visible!important
}
.ct288-rail.ct288-expanded>.ct288-card{
 width:var(--ct289-card-w)!important;
 min-width:var(--ct289-card-w)!important;
 max-width:var(--ct289-card-w)!important
}

/* Keep the approved poster proportion: 154×231 mobile and 176×264 desktop are both exactly 2:3. */
.ct288-poster,.ct288-empty-poster{aspect-ratio:2/3!important;object-fit:cover!important}
`;
document.getElementById(ct289Style.id)?.remove();
document.head.appendChild(ct289Style);

window.__ctR289Test={mobileWidth:154,desktopWidth:176,ratio:'2/3',scope:'discover-layout-only'};
