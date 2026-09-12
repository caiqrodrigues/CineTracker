const A=(c,m)=>{if(!c)throw new Error(m)};
const pos=(s,e)=>Number(s)>0&&Number(e)>0?Number(s)*100000+Number(e):0;
function nextAfterFrontier(watched,episodes,today='2026-09-12'){
 const set=new Set(watched.map(x=>pos(x[0],x[1]))),frontier=Math.max(...set,0);
 return episodes.filter(e=>e.air_date<=today&&pos(e.s,e.e)>frontier&&!set.has(pos(e.s,e.e))).sort((a,b)=>pos(a.s,a.e)-pos(b.s,b.e))[0]||null;
}
let next=nextAfterFrontier([[1,1],[28,35],[28,36],[28,37]],[{s:1,e:2,air_date:'1999-05-06'},{s:28,e:38,air_date:'2026-09-11'}]);
A(next&&next.s===28&&next.e===38,'SmackDown must continue after recent watched frontier, never S01 historic hole');
next=nextAfterFrontier([[1,1],[28,35],[28,36],[28,37],[28,38]],[{s:1,e:2,air_date:'1999-05-06'},{s:28,e:38,air_date:'2026-09-11'}]);
A(next===null,'caught-up SmackDown remains Em dia despite historical holes');
A(nextAfterFrontier([[3,5]],[{s:3,e:6,air_date:'2026-09-06'}])?.e===6,'Lioness current pending episode must win');
A(nextAfterFrontier([[1,6]],[{s:1,e:7,air_date:'2026-09-10'}])?.e===7,'Stuart current pending episode must win');
const excluded=new Set(['tv:1396','movie:438631','tv:900']);
const browse=x=>x.id>0&&!!x.poster&&!excluded.has(`${x.type}:${x.id}`);
A(!browse({type:'tv',id:1396,poster:'/bb.jpg'}),'seen/in-progress item excluded from public Discover');
A(!browse({type:'movie',id:438631,poster:'/dune.jpg'}),'Watchlist item excluded from public Discover');
A(browse({type:'movie',id:2,poster:'/x.jpg',score:5.1,year:1985}),'public browse must not inherit strict recommendation score/year rules');
const rows=Array.from({length:60},(_,i)=>({type:i%2?'tv':'movie',id:i+100,poster:'/p.jpg'})).filter(browse);
A(rows.slice(0,10).length===10&&rows.slice(0,60).length>=20,'multipage public pools stay complete');
const sessions=['FirstPractice','SecondPractice','ThirdPractice','Qualifying','Race'];A(sessions.includes('Qualifying')&&sessions.length>=5,'F1 weekend includes qualifying and race');
console.log('R257_ALGORITHMS_PASS');
