import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(process.cwd());
const html=await readFile(resolve(root,'apps/android/app/src/main/assets/hotfix5/index.html'),'utf8');
const must=[
  'android-v0.99.7.44-r216-top10-person-season',
  "const REVISION='r216-android-top10-person-season';",
  'top10-current-state-person-summary-season-one-screen',
  'current-dom-token-no-legacy-nav-guard',
  'photo-name-short-biography-no-intro',
  'whole-season-one-screen-swipe-season-only',
  "typeof window.ctR216RenderTop10==='function'",
  'await window.ctR216RenderTop10(seq);',
  'data-ct216-top10','ct171PaintTopProvider=paintTop216','ctR216ShortBio','max=420',
  'flex:0 0 100%!important','overflow-x:hidden!important','scroll-snap-type:x mandatory!important',
  'grid-template-columns:repeat(3,minmax(0,1fr))','main-and-sports-collapse-together-tight-gap','safe-title-type-tmdb-fallback-cache'
];
for(const m of must)if(!html.includes(m))throw new Error('0.99.7.44 missing '+m);
if(html.includes("setApp(shell('Pessoa','Biografia e filmografia completa.','discover'"))throw new Error('0.99.7.44 person intro still present');
if(html.includes('<div class="ct169-kicker">PESSOA</div>'))throw new Error('0.99.7.44 person kicker still present');
if(html.includes('await ctR180RenderTop10(seq);'))throw new Error('0.99.7.44 r214 still delegates Top 10 to legacy renderer');
if(!html.includes("${esc((typeof ctR216ShortBio==='function'?ctR216ShortBio(biography):biography)||'Biografia não disponível no TMDB.')}"))throw new Error('0.99.7.44 concise person biography is not wired');

const marker='<script data-ct-android="r216-android-js">',a=html.indexOf(marker),b=html.indexOf('</script>',a+marker.length);
if(a<0||b<a)throw new Error('0.99.7.44 embedded r216 JS missing');
const embedded=html.slice(a+marker.length,b),start=embedded.indexOf('/* Android 0.99.7.44'),end=embedded.indexOf('})();',start),r216=start>=0&&end>start?embedded.slice(start,end+5):'';
if(!r216)throw new Error('0.99.7.44 r216 block missing');
for(const bad of ["addEventListener('pointerdown'","addEventListener('pointerup'","addEventListener('touchstart'","addEventListener('touchend'"]){if(r216.includes(bad))throw new Error('0.99.7.44 r216 added gesture listener '+bad)}
if(r216.includes('seq!==navSeq'))throw new Error('0.99.7.44 Top 10 must not use legacy nav sequence guard');

function shortBio(value){const text=String(value||'').replace(/\s+/g,' ').trim();if(!text)return '';const max=420;if(text.length<=max)return text;const sentences=text.match(/[^.!?]+[.!?]+(?:[”"']|$)?/g)||[];let out='';for(const sentence of sentences){const next=(out+' '+sentence.trim()).trim();if(next.length>max)break;out=next;if(out.length>=220&&out.split(/[.!?]+/).filter(Boolean).length>=2)break}if(out.length>=160)return out;const cut=text.slice(0,max+1),at=cut.lastIndexOf(' ');return (at>260?cut.slice(0,at):text.slice(0,max)).trim().replace(/[,:;\-–—]+$/,'')+'…'}
const long=('Primeira frase da biografia com informações relevantes sobre a carreira e origem do artista. Segunda frase com os principais trabalhos, prêmios e reconhecimento obtido ao longo do tempo. Terceira frase com outros detalhes profissionais importantes para contextualizar a pessoa. Quarta frase que já não deve transformar a tela em um texto enorme. ').repeat(3),compact=shortBio(long);
if(!(compact.length>100&&compact.length<=420))throw new Error('0.99.7.44 short biography fixture failed: '+compact.length);
console.log('ANDROID_099744_TEST_OK top10=current-dom-token person=short-bio season=one-screen-swipe-only web=unchanged');
