const REPO='studioneeltje/studio-neeltje-website';
let token='',verifiedOwner=false;
function draftConflict(){const error=new Error('Het online concept is intussen gewijzigd. Je huidige bewerking is behouden. Vergelijk de versies om veilig verder te gaan.');error.code='DRAFT_CHANGED';return error;}
export function setToken(value){token=String(value).trim();verifiedOwner=false;}
export function isConnected(){return Boolean(token&&verifiedOwner);}
async function request(url,{method='GET',body,allow404=false}={}) {
  if(!token)throw new Error('Log eerst in met je GitHub-token.');
  let response;
  try{response=await fetch(url,{method,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${token}`,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});}
  catch{throw new Error('De verbinding met GitHub kon niet worden gemaakt. Controleer je internetverbinding en probeer opnieuw. Blijft dit gebeuren? Vernieuw de beheerpagina en log opnieuw in.');}
  if(response.status===404&&allow404)return null;
  if(!response.ok){if(response.status===401)throw new Error('GitHub herkent deze token niet. Controleer of je de volledige, geldige token hebt gekopieerd.');if(response.status===409||response.status===422)throw draftConflict();if(response.status===403)throw new Error('GitHub geeft geen toegang. Controleer of de token rechten heeft voor deze repository, Contents, Pull requests en Actions.');throw new Error(`De aanvraag bij GitHub is mislukt (${response.status}). Probeer later opnieuw.`);}
  return response.status===204?null:response.json();
}
export async function api(endpoint,options={}) {
  if(!isConnected())throw new Error('Log eerst in met het GitHub-account van Studio Neeltje.');
  // GitHub's repository endpoint rejects a trailing slash during CORS preflight.
  const route=String(endpoint||'').replace(/^\/+/, '');
  return request(`https://api.github.com/repos/${REPO}${route?'/'+route:''}`,options);
}
export async function connect(value){
  setToken(value);
  try{
    const user=await request('https://api.github.com/user');
    if(String(user.login||'').toLowerCase()!==REPO.split('/')[0].toLowerCase())throw new Error('Deze beheeromgeving is alleen toegankelijk voor het GitHub-account studioneeltje.');
    const repo=await request(`https://api.github.com/repos/${REPO}`);
    if(!repo.permissions?.push)throw new Error('Deze token heeft geen schrijfrechten voor de website. Controleer de rechten voor studio-neeltje-website.');
    verifiedOwner=true;return repo;
  }catch(error){setToken('');throw error;}
}
export async function readFile(file,ref='main'){const result=await api(`contents/${file}?ref=${encodeURIComponent(ref)}`,{allow404:true});if(!result)return null;return {sha:result.sha,data:JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(result.content.replace(/\n/g,'')),c=>c.charCodeAt(0))))};}
export async function head(branch='main'){return api(`git/ref/heads/${branch}`);}
export function pageBranch(id){if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(id))throw new Error('Gebruik een korte paginanaam met letters, cijfers en streepjes.');return `puck/${id}`;}
async function readDraftAt(id,ref){
 const entries=await api(`contents/content/media?ref=${encodeURIComponent(ref)}`);
 const media=await Promise.all(entries.filter(e=>e.name.endsWith('.json')).map(async entry=>(await readFile(entry.path,ref)).data));
 const file=await readFile(`content/pages/${id}.json`,ref);if(!file)throw Error('Deze versie bevat geen paginaconcept. Je huidige bewerking blijft staan.');
 return {media,...file};
}
export async function openDraft(id){
 const branch=pageBranch(id),ref=await api(`git/ref/heads/${branch}`,{allow404:true});if(!ref)return null;
 const prs=await api(`pulls?head=studioneeltje:${encodeURIComponent(branch)}&base=main&state=open`);if(!prs.length)return null;
 // Every file belongs to the same immutable snapshot, even during another save.
 const sha=prs[0].head.sha;
 return {branch,head:sha,versionSha:sha,pr:prs[0],...await readDraftAt(id,sha)};
}
export async function listDraftHistory(id){
 const branch=pageBranch(id),ref=await api(`git/ref/heads/${branch}`,{allow404:true});if(!ref)return [];
 const commits=await api(`commits?sha=${ref.object.sha}&path=content/pages/${id}.json&per_page=30`);
 return commits.map(commit=>({sha:commit.sha,date:commit.commit.committer.date,label:commit.commit.message.split('\n')[0]}));
}
export async function openDraftVersion(id,sha){
 if(!/^[a-f0-9]{40}$/.test(sha))throw Error('Deze versie kon niet worden geopend.');
 const current=await openDraft(id);
 return {...await readDraftAt(id,sha),branch:pageBranch(id),head:current?.head||null,pr:current?.pr||null,versionSha:sha,fromHistory:true};
}
export async function sourcePreview(asset,branch){
 const file=await api(`contents/${asset.source.replace(/^\//,'')}?ref=${encodeURIComponent(branch)}`);
 const blob=await api(`git/blobs/${file.sha}`);const bytes=Uint8Array.from(atob(blob.content.replace(/\n/g,'')),c=>c.charCodeAt(0));
 return new Blob([bytes],{type:asset.kind==='video'?'video/mp4':'image/jpeg'});
}
export async function saveDraft(page,mediaChanges=[],uploads=[],expectedHead=null,baselineMedia=[]){
  const stable=value=>JSON.stringify(value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().filter(k=>k!=='previewURL').map(k=>[k,JSON.parse(stable(value[k])||'null')])):value);
  for(const asset of mediaChanges){const baseline=baselineMedia.find(m=>m.id===asset.id);const current=await readFile(`content/media/${asset.id}.json`);if(stable(current?.data)!==stable(baseline))throw Error(`De mediagegevens van ${asset.title} zijn intussen elders veranderd. Je pagina is lokaal bewaard. Download een reservekopie voordat je de beheeromgeving vernieuwt.`);}
  const branch=pageBranch(page.id);const main=await head();let ref=await api(`git/ref/heads/${branch}`,{allow404:true});
  if(!ref){ref=await api('git/refs',{method:'POST',body:{ref:`refs/heads/${branch}`,sha:main.object.sha}});}
  else if(!expectedHead){const open=await api(`pulls?head=studioneeltje:${encodeURIComponent(branch)}&base=main&state=open`);if(open.length)throw draftConflict();await api('merges',{method:'POST',body:{base:branch,head:'main'}});ref=await head(branch);}
  else if(expectedHead!==ref.object.sha)throw draftConflict();
  const base=await api(`git/commits/${ref.object.sha}`);const tree=[];
  for(const upload of uploads){const buffer=await upload.file.arrayBuffer();let binary='';for(let i=0;i<buffer.byteLength;i+=0x8000)binary+=String.fromCharCode(...new Uint8Array(buffer,i,Math.min(0x8000,buffer.byteLength-i)));const blob=await api('git/blobs',{method:'POST',body:{content:btoa(binary),encoding:'base64'}});tree.push({path:upload.path,mode:'100644',type:'blob',sha:blob.sha});}
  tree.push({path:`content/pages/${page.id}.json`,mode:'100644',type:'blob',content:JSON.stringify(Object.fromEntries(Object.entries(page).filter(([key])=>key!=='localOnly')),null,2)+'\n'});
  for(const asset of mediaChanges){const {previewURL,...saved}=asset;tree.push({path:`content/media/${asset.id}.json`,mode:'100644',type:'blob',content:JSON.stringify(saved,null,2)+'\n'});}
  const createdTree=await api('git/trees',{method:'POST',body:{base_tree:base.tree.sha,tree}});
  const commit=await api('git/commits',{method:'POST',body:{message:`Concept: ${page.title}`,tree:createdTree.sha,parents:[ref.object.sha]}});
  // A normal fast-forward rejects an intervening edit; never force-push.
  await api(`git/refs/heads/${branch}`,{method:'PATCH',body:{sha:commit.sha,force:false}});
  let prs=await api(`pulls?head=studioneeltje:${encodeURIComponent(branch)}&base=main&state=open`);
  const pr=prs[0]||await api('pulls',{method:'POST',body:{title:`Pagina: ${page.title}`,head:branch,base:'main',body:'Concept uit de visuele editor. Controleer de voorvertoning en de automatische beeldverwerking voordat je publiceert.'}});
  return {branch,head:commit.sha,pr};
}
export async function publishDraft(pr,sha){
  const latest=await api(`pulls/${pr.number}`);if(latest.head.sha!==sha)throw new Error('Het concept is gewijzigd. Bekijk eerst opnieuw de laatste versie.');
  const checks=await api(`actions/runs?head_sha=${sha}`);
  const build=checks.workflow_runs.find(run=>run.path?.includes('website.yml'));
  if(!build||build.status!=='completed')throw new Error('De automatische controle verwerkt de media nog. Probeer het over een moment opnieuw.');
  if(build.conclusion!=='success')throw new Error('De automatische controle is niet geslaagd. Open de controle in GitHub om de fout te bekijken.');
  const result=await api(`pulls/${pr.number}/merge`,{method:'PUT',body:{sha,merge_method:'squash'}});
  if(!result.merged)throw new Error('GitHub heeft het concept nog niet gepubliceerd. Controleer of er conflicten zijn.');return result;
}
