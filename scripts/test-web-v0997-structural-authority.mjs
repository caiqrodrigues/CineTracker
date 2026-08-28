import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const src=await readFile(resolve(root,'apps/web/patch-v120-v0997-structural-authority.js'),'utf8');
const html=await readFile(resolve(root,'dist/index.html'),'utf8');

function must(ok,msg){if(!ok)throw new Error(msg)}

must(src.includes("PROFILE_ORDER120=['basic','series','movies','series-favorites','movie-favorites','actors','daily','extras']"),'Perfil 0.99.7: ordem estrutural dos 8 blocos ausente.');
must(src.includes("data-ct120-slot=\"daily\""),'Perfil 0.99.7: gráfico Episódios por Dia ausente.');
must(src.includes('7 dias visíveis · Hoje centralizado · navegação temporal'),'Perfil 0.99.7: timeline centralizada/navegável ausente.');
must(src.includes("DISCOVER_TABS120=[['foryou','Pra Você'],['trending','Em alta'],['anticipated','Mais aguardados'],['popular','Populares'],['top','Mais bem avaliados'],['calendar','Calendário']]"),'Descobrir 0.99.7: tabs canônicas ausentes.');
must(src.includes("data-ct120-type=\"all\">Todos")&&src.includes("data-ct120-type=\"tv\">Séries")&&src.includes("data-ct120-type=\"movie\">Filmes"),'Descobrir 0.99.7: filtros Todos/Séries/Filmes ausentes.');
must(src.includes("data-ct120-view=\"list\">Lista")&&src.includes("data-ct120-view=\"carousel\">Carrossel")&&src.includes("data-ct120-view=\"grid\">Grade"),'Descobrir 0.99.7: modos Lista/Carrossel/Grade ausentes.');
must(src.includes('names120(x).includes(want)'),'Match TMDB 0.99.7: comparação exata de aliases ausente.');
must(!src.includes('want.includes(n)')&&!src.includes('n.includes(want)'),'Match TMDB 0.99.7: fuzzy includes proibido na autoridade v120.');
must(src.includes("if(yr>0&&cy>0&&yr!==cy)return false"),'Match TMDB 0.99.7: ano exato ausente.');
must(src.includes('O CineTracker não abrirá outro filme ou série por aproximação.'),'Match TMDB 0.99.7: proteção contra mídia errada ausente.');
must(src.includes('hardClean120')&&src.includes('normalizeNav120')&&src.includes('normalizeVersion120'),'0.99.7: limpeza estrutural de DOM/nav/versão ausente.');
const v119=html.indexOf('<script src="/patch-v119-v0997-real-smoke-hotfix.js"></script>');
const v120=html.indexOf('<script src="/patch-v120-v0997-structural-authority.js"></script>');
must(v119>=0&&v120>v119,'0.99.7: v120 deve ser emitida depois da v119.');
must((html.match(/patch-v120-v0997-structural-authority\.js/g)||[]).length===1,'0.99.7: v120 duplicada no HTML final.');

console.log('CineTracker 0.99.7 structural authority: PASS');
