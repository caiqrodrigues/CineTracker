import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root=resolve(process.cwd());
const must=(ok,msg)=>{if(!ok)throw new Error('r149 test: '+msg)};
const source=resolve(root,'apps/web/patch-v149-v0997-discover-contract.js');
const js=await readFile(source,'utf8');
execFileSync(process.execPath,['--check',source],{stdio:'pipe'});

for(const [key,label] of [
  ['foryou','Pra você'],['trending','Em alta'],['popular','Populares'],['top','Mais bem avaliados'],['new','Novidades'],['anticipated','Mais Aguardados'],['calendar','Calendário']
]) must(js.includes(`['${key}','${label}']`),`missing top tab ${label}`);

must(js.includes("const TYPES=[['all','Geral'],['movie','Filmes'],['tv','Séries']]"),'type pills must be Geral / Filmes / Séries in this order');
must(js.includes("function typeBar(){if(state.tab==='foryou')return''"),'Pra você must not render type pills');
must(js.includes("section('Indicação do dia'"),'Pra você daily recommendation missing');
must(js.includes("section('100% novos'"),'Pra você 100% novos missing');
must(js.includes("'1 Filme · 1 Série · 1 Anime'"),'Pra você fresh mix must be one movie, one series and one anime');
must(!js.includes('Da sua Watchlist'),'obsolete Watchlist recommendation section returned');
must(js.includes('class="ct131-row" data-ct149-carousel'),'horizontal carousel primitive missing');
must(!js.includes('ct131-list')&&!js.includes('ct131-grid')&&!js.includes('data-ct131-view'),'list/grid view selectors must not exist in r149');
must(js.includes("if(state.tab==='calendar')out.innerHTML=renderCalendar(rows)"),'calendar renderer missing');
must(js.includes('return `<div class="ct149-calendar">')&&js.includes('${carousel(items)}'),'calendar days must use horizontal carousels');
must(js.includes('e.stopImmediatePropagation()'),'broken legacy click handlers are not isolated');
must(js.includes('document.addEventListener(\'click\'')&&js.includes('},true);'),'Discover click authority must run in capture phase');
must(js.includes('window.__ct135RenderDiscover=renderDiscover'),'r149 does not replace old Discover authority');
must(js.includes('window.__ct135EnsureCalendar=()=>{}'),'legacy calendar injector remains active');
must(js.includes('data-ct131d-calendar hidden'),'legacy authority compatibility marker missing');
must(js.includes('data-ct131-tab="${k}"'),'Novidades compatibility marker path missing');

for(const dir of [resolve(root,'dist'),resolve(root,'apps/web/dist')]){
  const runtime=resolve(dir,'patch-v149-v0997-discover-contract.js');
  const built=await readFile(runtime,'utf8');
  execFileSync(process.execPath,['--check',runtime],{stdio:'pipe'});
  must(built===js,`built r149 differs from source in ${dir}`);
  const html=await readFile(resolve(dir,'index.html'),'utf8');
  const tag='<script src="/patch-v149-v0997-discover-contract.js?r149"></script>';
  must(html.includes(tag),`r149 runtime tag missing in ${dir}`);
  must(html.lastIndexOf(tag)>html.lastIndexOf('patch-v135-v0997-final-primary-authority.js'),`r149 is not last Discover authority in ${dir}`);
  must(html.includes('ct-r148-web-pc-android'),`r148 Web PC lock regressed in ${dir}`);
  const sw=await readFile(resolve(dir,'service-worker.js'),'utf8');
  must(sw.includes("ct-web-0.99.7-r149"),`service worker cache revision is not r149 in ${dir}`);
}

console.log('WEB_R149_TEST_OK buttons=single-authority foryou=no-type+pact other-tabs=Geral/Filmes/Séries carousel=horizontal calendar=grouped r148-web-pc=preserved');
