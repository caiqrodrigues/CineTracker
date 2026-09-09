import {readFile} from 'node:fs/promises';
const p=await readFile(new URL('./runtime-r238-real-profile-renderer.js',import.meta.url),'utf8');
const must=x=>{if(!p.includes(x))throw new Error('R238 missing '+x)};
for(const x of ["window.__ctR238='real-r180-profile-renderer'","ctR180ProfileStats=ctR238ProfileStats","profile237=function(){}","panel.dataset.ct238ProfileOrder="])must(x);
const order=["ctR180StatCard('Episódios'","ctR180StatCard('Filmes'","ctR180StatCard('Séries Watchlist'","ctR180StatCard('Filmes Watchlist'","ctR180StatCard('Tempo em Séries'","ctR180StatCard('Tempo em Filmes'","ctR180StatCard('Tempo de série em Watchlist'","ctR180StatCard('Tempo de filme em Watchlist'","ctR180StatCard('Tempo total de tela'","ctR180StatCard('Tempo total em Watchlist'"];
let at=-1;for(const x of order){const n=p.indexOf(x,at+1);if(n<0)throw new Error('R238 wrong physical source order: '+x);at=n}
if(!p.includes("card.style.removeProperty('order')"))throw new Error('R238 must neutralize r237 inline CSS order');
console.log('R238_STATIC_OK real-r180-profile-producer');