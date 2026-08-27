import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const preName = 'patch-v101-v0994-nav-pre.js';
const finalName = 'patch-v099-v0994-web.js';
const authName = 'patch-v103-v0994-session-gate.js';
const authorityName = 'patch-v104-v0994-authority.js';
const preTag = `<script src="/${preName}"></script>`;
const finalTag = `<script src="/${finalName}"></script>`;
const authTag = `<script src="/${authName}"></script>`;
const authorityTag = `<script src="/${authorityName}"></script>`;
const legacyAnchor = '<script src="/patch-v088-v098-nav-pre.js"></script>';
const fallbackAnchor = '<script src="/patch-v095-v0992-fix.js"></script>';
const legacyDiscoverName = 'patch-v092-v0991.js';
const legacyMovieSeed = "movieSeed=watch.filter(x=>x.media_type==='movie').slice(0,16)";
const authoritativeMovieSeed = "movieSeed=watch.filter(x=>x.media_type==='movie'&&Number(x.tmdb_id)>0&&validRec991(x)).slice(0,48)";
const removeTags = [
  preTag,
  finalTag,
  authTag,
  authorityTag,
  '<script src="/patch-v100-v0994-authority.js"></script>',
  '<script src="/patch-v097-v0993-nav-pre.js"></script>',
  '<script src="/patch-v098-v0993-web.js"></script>'
];
const targets = [resolve(root, 'dist'), resolve(root, 'apps/web/dist')];

for (const target of targets) {
  const indexPath = resolve(target, 'index.html');
  let html = await readFile(indexPath, 'utf8');
  for (const tag of removeTags) html = html.split(tag).join('');

  /* The old P0 recovery intentionally discarded a session once. That migration is long finished;
     leaving it active in a newly built Web client can erase a perfectly valid browser session. */
  const destructiveReset = "if (localStorage.getItem(resetKey) !== '1') {";
  const disabledReset = "if (false && localStorage.getItem(resetKey) !== '1') {";
  if (html.includes(destructiveReset)) html = html.replace(destructiveReset, disabledReset);
  if (!html.includes(disabledReset)) throw new Error(`Web 0.99.4: legacy session reset could not be disabled: ${indexPath}`);

  const anchor = html.includes(legacyAnchor) ? legacyAnchor : fallbackAnchor;
  if (!html.includes(anchor)) throw new Error(`Web 0.99.4: legacy navigation anchor missing: ${indexPath}`);
  html = html.replace(anchor, `${preTag}${anchor}`);
  html = html.replace('</body>', `${finalTag}${authTag}${authorityTag}</body>`);
  if (html.indexOf(preTag) >= html.indexOf(anchor)) throw new Error(`Web 0.99.4: pre-gate order invalid: ${indexPath}`);
  if (html.indexOf(authTag) <= html.indexOf(finalTag)) throw new Error(`Web 0.99.4: session gate order invalid: ${indexPath}`);
  if (html.indexOf(authorityTag) <= html.indexOf(authTag)) throw new Error(`Web 0.99.4: authority order invalid: ${indexPath}`);
  await writeFile(indexPath, html, 'utf8');

  const legacyDiscoverPath = resolve(target, legacyDiscoverName);
  let legacyDiscover = await readFile(legacyDiscoverPath, 'utf8');
  if (legacyDiscover.includes(legacyMovieSeed)) legacyDiscover = legacyDiscover.replace(legacyMovieSeed, authoritativeMovieSeed);
  if (!legacyDiscover.includes(authoritativeMovieSeed)) throw new Error(`Web 0.99.4: Discover watchlist seed patch missing: ${legacyDiscoverPath}`);
  await writeFile(legacyDiscoverPath, legacyDiscover, 'utf8');

  for (const name of [preName, finalName, authName, authorityName]) await copyFile(resolve(root, 'apps/web', name), resolve(target, name));
}
console.log('CineTracker Web 0.99.4: navigation + auth + single authority + expanded eligible Discover pool emitted.');
