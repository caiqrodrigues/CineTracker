import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const src=await readFile(resolve(root,'apps/web/patch-v121-v0997-functional-polish.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');
const must=(ok,msg)=>{if(!ok)throw new Error(msg)};

must(src.includes("window.__ct0997Functional121 = 'v121-functional-polish-no-refactor'"),'0.99.7 v121: marker ausente.');
must(src.includes("PROFILE_ORDER121 = ['basic','series','movies','series-favorites','movie-favorites','actors','daily','extras']"),'0.99.7 v121: ordem estrita do Perfil ausente.');
must(src.includes("for(const key of ['series','movies'])")&&src.includes('Ver histórico (${hidden})'),'0.99.7 v121: histórico integrado às seções Séries/Filmes ausente.');
must(src.includes("for(const child of [...host.children])if(child!==body)child.remove()"),'0.99.7 v121: remoção de conteúdo extra do Perfil ausente.');
must(src.includes("for(const key of ['series-favorites','movie-favorites'])")&&src.includes("h.textContent='♥'"),'0.99.7 v121: coração visual dos favoritos ausente.');
must(src.includes('DISCOVER_TABS121')&&src.includes("['foryou','Pra Você']")&&src.includes("['calendar','Calendário']"),'0.99.7 v121: tabs de Descobrir ausentes.');
must(src.includes("paged121('/discover/movie'")&&src.includes("'movie',4")&&src.includes("'tv',4"),'0.99.7 v121: Descobrir multipágina ausente.');
must(src.includes('Nunca visto · fora da Watchlist · sem correspondência no seu histórico'),'0.99.7 v121: exclusão estrita do Pra Você ausente.');
must(!src.includes('Da sua Watchlist'),'0.99.7 v121: Descobrir não pode voltar a recomendar Watchlist.');
must(src.includes('const daily=movies.slice().sort'),'0.99.7 v121: indicação do dia deve continuar sendo filme.');
must(src.includes('rawSafe121')&&src.includes('exactCandidate(row,raw)'),'0.99.7 v121: validação do raw_tmdb ausente.');
must(src.includes("if(tt&&row.title)tt.textContent=row.title")&&src.includes("if(pt.tagName==='IMG')pt.removeAttribute('src')"),'0.99.7 v121: proteção visual contra título/capa persistidos incorretos ausente.');
must(src.includes("hits=(d?.results||[]).filter(x=>exactCandidate(row,x))"),'0.99.7 v121: resolução TMDB exata ausente.');
must(!src.includes('rows[0]')&&!src.includes('results[0]'),'0.99.7 v121: fallback inseguro por primeiro resultado é proibido.');
must(src.includes("if(key==='history'){el.remove();continue}"),'0.99.7 v121: remoção de Histórico da navegação ausente.');
const v120=html.indexOf('<script src="/patch-v120-v0997-structural-authority.js"></script>');
const v121=html.indexOf('<script src="/patch-v121-v0997-functional-polish.js"></script>');
must(v120>=0&&v121>v120,'0.99.7: v121 deve ser emitida depois da v120.');
must((html.match(/patch-v121-v0997-functional-polish\.js/g)||[]).length===1,'0.99.7: v121 duplicada no HTML final.');

console.log('CineTracker 0.99.7 functional polish: PASS');
