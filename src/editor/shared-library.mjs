const REPO='studioneeltje/studio-neeltje-website';
const API=`https://api.github.com/repos/${REPO}/`;
const RAW=`https://raw.githubusercontent.com/${REPO}/`;
const validId=id=>/^[a-z0-9][a-z0-9-]{0,100}$/.test(id||'');
const sourcePath=asset=>String(asset.source||'').replace(/^\//,'');
const rawSource=(asset,sha)=>sourcePath(asset).startsWith('media/originals/')?`${RAW}${sha}/${sourcePath(asset).split('/').map(encodeURIComponent).join('/')}`:/^https:\/\/static\.wixstatic\.com\/media\//.test(asset.source||'')?asset.source:'';
const CACHE_KEY='studio-neeltje-public-library-v2';
let requests=new Map(),blockedUntil=0;
try{const saved=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'null');if(saved){requests=new Map(saved.requests||[]);blockedUntil=saved.blockedUntil||0;}}catch{}
function saveCache(){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify({requests:[...requests],blockedUntil}));}catch{}}
async function json(url){
 const cached=requests.get(url),immutable=url.startsWith(RAW)||/git\/trees\/[a-f0-9]{40}/.test(url),ttl=immutable?86400000:300000;
 if(cached&&Date.now()-cached.time<ttl)return cached.value;
 if(url.startsWith(API)&&Date.now()<blockedUntil)throw Error('GitHub begrenst het ophalen tijdelijk. Je laatst opgehaalde beeldbank blijft beschikbaar. Probeer na '+new Date(blockedUntil).toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'})+' opnieuw.');
 const response=await fetch(url,{cache:immutable?'force-cache':'no-cache',credentials:'omit',referrerPolicy:'no-referrer'});
 if(!response.ok){
  if(response.status===403||response.status===429){const reset=Number(response.headers.get('x-ratelimit-reset'))*1000,retry=Number(response.headers.get('retry-after'))*1000;blockedUntil=Math.max(Date.now()+60000,reset||(retry?Date.now()+retry:Date.now()+300000));saveCache();throw Error('GitHub begrenst het ophalen tijdelijk. De laatst opgehaalde beeldbank blijft beschikbaar. Probeer later opnieuw.');}
  throw Error(`De online beeldbank kon niet laden (${response.status}). Je huidige selectie blijft behouden.`);
 }
 const value=await response.json();requests.set(url,{time:Date.now(),value});saveCache();return value;
}
async function mapLimit(items,work){const results=new Array(items.length);let next=0;await Promise.all(Array.from({length:Math.min(5,items.length)},async()=>{let i;while((i=next++)<items.length)results[i]=await work(items[i]);}));return results;}
async function treeAt(sha){const tree=await json(`${API}git/trees/${sha}?recursive=1`);if(tree.truncated)throw Error('De online beeldbank is te groot om volledig op te halen. Je huidige selectie blijft behouden.');return tree.tree||[];}
const recordFiles=tree=>tree.filter(item=>item.type==='blob'&&/^content\/media\/[^/]+\.json$/.test(item.path));
async function recordsAt(sha,files){return mapLimit(files,async file=>{const asset=await json(`${RAW}${sha}/${file.path}`);if(!validId(asset.id)||!['image','video'].includes(asset.kind))return null;return asset;});}

// Read the same canonical media records as Puck. No token, private CMS state or
// new authentication storage is needed for this public GitHub Pages repository.
export async function onlineLibrary(published){
 const [ref,pulls]=await Promise.all([json(`${API}git/ref/heads/main`),json(`${API}pulls?state=open&per_page=100`)]);
 const mainSha=ref.object.sha,mainTree=await treeAt(mainSha),paths=new Set(mainTree.filter(item=>item.type==='blob').map(item=>item.path));
 const assets=new Map((await recordsAt(mainSha,recordFiles(mainTree))).filter(Boolean).map(asset=>[asset.id,{...asset,libraryStatus:'Gepubliceerd'}]));
 const manifest={...published.manifest};
 for(const asset of assets.values()){
  const previous=published.media.find(item=>item.id===asset.id);
  const missing=sourcePath(asset).startsWith('media/originals/')&&!paths.has(sourcePath(asset));
  if(missing){asset.libraryMissing=true;delete manifest[asset.id];}
  else if(previous?.source!==asset.source||!manifest[asset.id]?.src||manifest[asset.id]?.missing||manifest[asset.id]?.deleted){delete manifest[asset.id];asset.previewURL=rawSource(asset,mainSha);}
 }
 const drafts=pulls.filter(pr=>pr.head?.repo?.full_name===REPO&&(pr.head.ref==='beheer/media-bibliotheek'||pr.head.ref.startsWith('puck/'))).sort((a,b)=>a.updated_at.localeCompare(b.updated_at));
 for(const pr of drafts){
  const changed=[];
  for(let page=1;page<=30;page++){
   const files=await json(`${API}pulls/${pr.number}/files?per_page=100&page=${page}`);
   changed.push(...files.filter(file=>/^content\/media\/[^/]+\.json$/.test(file.filename)));
   if(files.length<100)break;
   if(page===30)throw Error('Het mediaconcept bevat te veel wijzigingen om volledig te laden.');
  }
  if(!changed.length)continue;
  const draftTree=await treeAt(pr.head.sha),draftPaths=new Set(draftTree.filter(item=>item.type==='blob').map(item=>item.path));
  for(const file of changed.filter(file=>file.status==='removed')){const id=file.filename.split('/').at(-1).slice(0,-5);assets.delete(id);delete manifest[id];}
  for(const asset of (await recordsAt(pr.head.sha,changed.filter(file=>file.status!=='removed').map(file=>({path:file.filename})))).filter(Boolean)){
   const missing=sourcePath(asset).startsWith('media/originals/')&&!draftPaths.has(sourcePath(asset));
   const previous=assets.get(asset.id);
   if(previous?.source!==asset.source||missing||!manifest[asset.id]?.src)delete manifest[asset.id];
   assets.set(asset.id,{...asset,libraryStatus:'Online mediaconcept — publiceer media vóór de pagina',libraryMissing:missing,previewURL:missing?'':rawSource(asset,pr.head.sha)});
  }
 }
 return {...published,media:[...assets.values()],manifest,libraryNotice:'Beeldbank bijgewerkt vanuit GitHub: gepubliceerde foto’s en online mediaconcepten.'};
}

export function localLibrary(data,uploads,changes,makeURL){
 const media=new Map(data.media.map(asset=>[asset.id,asset])),manifest={...data.manifest};
 for(const asset of changes){
  if(!validId(asset.id))continue;
  const pending=uploads.find(item=>item.path===asset.source),previous=media.get(asset.id);
  // Online records win over a stale cache. A newer local edit to metadata or
  // a pending local upload is still shown, and never silently discarded.
  const sameSource=previous?.source===asset.source;
  if(!pending&&!sameSource)continue;
  if(pending){const onlyLocal=!previous||!sameSource||previous.libraryMissing;delete manifest[asset.id];media.set(asset.id,{...asset,previewURL:makeURL(pending.file,asset.source),libraryMissing:false,libraryLocalOnly:onlyLocal,libraryStatus:onlyLocal?'Alleen op dit apparaat — sla eerst online op in Puck':previous.libraryStatus});}
  else if(previous)media.set(asset.id,{...previous,...asset,libraryMissing:previous.libraryMissing,libraryStatus:previous.libraryStatus});
 }
 return {...data,media:[...media.values()],manifest};
}

// A completed Puck save records an immutable commit and the uploaded paths.
// Reuse that confirmed save in this browser even while GitHub's public API is limited.
export function savedOnlineLibrary(data,saved){
 if(!/^[a-f0-9]{40}$/.test(saved?.head||'')||!Array.isArray(saved.changes))return data;
 const media=new Map(data.media.map(asset=>[asset.id,asset])),manifest={...data.manifest};
 for(const asset of saved.changes){
  if(!validId(asset.id))continue;
  const previous=media.get(asset.id),uploaded=saved.pendingPaths?.includes(asset.source);
  if(!uploaded&&previous?.source!==asset.source)continue;
  const source=rawSource(asset,saved.head);if(!source)continue;
  delete manifest[asset.id];
  media.set(asset.id,{...asset,previewURL:source,libraryMissing:false,libraryLocalOnly:false,libraryStatus:'Online opgeslagen in Puck — laatste bekende versie'});
 }
 return {...data,media:[...media.values()],manifest};
}
