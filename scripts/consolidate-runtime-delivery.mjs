import { readFile, writeFile, unlink } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

const root=resolve(process.cwd());
const dirs=[resolve(root,'dist'),resolve(root,'apps/web/dist')];
const OUT='cinetracker-runtime-consolidated.js';

for(const dir of dirs){
  const indexPath=resolve(dir,'index.html');
  let html=await readFile(indexPath,'utf8');
  const matches=[...html.matchAll(/<script\s+src=["']\/(patch-[^"']+\.js)["']><\/script>/g)];
  const ordered=matches.map(m=>m[1]);
  if(ordered.length<2) throw new Error(`Runtime consolidation expected multiple patch scripts in ${indexPath}, found ${ordered.length}`);
  const seen=new Set(); const chunks=[];
  for(const name of ordered){
    if(seen.has(name)) continue;
    seen.add(name);
    const code=await readFile(resolve(dir,name),'utf8');
    chunks.push(`\n/* ==== ${name} ==== */\n${code.trim()}\n`);
  }
  const banner=`/* CineTracker 0.99.7 consolidated runtime delivery. Generated from ${seen.size} ordered patch files; source files remain in repository for audit/recovery. */\n`;
  await writeFile(resolve(dir,OUT),banner+chunks.join('\n'),'utf8');
  html=html.replace(/<script\s+src=["']\/patch-[^"']+\.js["']><\/script>/g,'');
  if(html.includes(`/${OUT}`)) html=html.replace(new RegExp(`<script\\s+src=["']/${OUT.replaceAll('.','\\.')}["']><\\/script>`,'g'),'');
  html=html.replace('</body>',`<script src="/${OUT}"></script></body>`);
  await writeFile(indexPath,html,'utf8');
  for(const name of seen){try{await unlink(resolve(dir,name))}catch{}}
  console.log(`CineTracker runtime delivery consolidated: ${seen.size} patch scripts -> 1 (${basename(dir)})`);
}
