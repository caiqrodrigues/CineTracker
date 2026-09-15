/* Web 1.0.80 r289 — normalize Discover cards to the long-standing CineTracker size, Web-only. */
window.__ctR289='discover-standard-card-size';
window.__ctR289Cards='legacy-standard-128-152px-2x3';
window.__ctR289Scope='discover-layout-only';
window.__ctR289Android='preserved-1.0.20-10062';

const ct289Style=document.createElement('style');
ct289Style.id='ct-web-r289-discover-standard-card-size';
ct289Style.textContent=`
[data-ct288-discover]{--ct289-card-w:clamp(128px,14vw,152px)}

/* Pra você: the three category slots must keep card width instead of stretching to 1/3 of the page. */
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

/* Browse and Top 10: use the same compact card width instead of the r288 desktop enlargement. */
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

/* Keep the established poster proportion on every r288/r289 Discover card. */
.ct288-poster,.ct288-empty-poster{aspect-ratio:2/3!important;object-fit:cover!important}
`;
document.getElementById(ct289Style.id)?.remove();
document.head.appendChild(ct289Style);

window.__ctR289Test={cardWidth:'clamp(128px,14vw,152px)',ratio:'2/3',scope:'discover-layout-only'};
