import { readFile } from 'node:fs/promises';
const src=await readFile(new URL('../apps/web/patch-v124-v0997-video-smoke-authority.js',import.meta.url),'utf8');
const must=['v124-video-smoke-production-authority','ct124FastHome','warmAuthenticated','setInterval(()=>','850',"['foryou','Pra Você']","['trending','Em alta']","['anticipated','Mais aguardados']","['calendar','Calendário']",'Minha Watchlist','+ Watchlist','minPopularity:4','vote_count.gte',"PROFILE_ORDER=['basic','series','movies','series-favorites','movie-favorites','actors','daily','extras']",'c.hidden=i>=10','Ver mais','tempo de tela','historico','dedupeNav','ct122-more-card'];
for(const token of must)if(!src.includes(token))throw new Error(`v124 missing ${token}`);
if(src.includes('Da sua Watchlist'))throw new Error('v124 must not restore Da sua Watchlist');
console.log('WEB_0997_VIDEO_SMOKE_AUTHORITY_OK');
