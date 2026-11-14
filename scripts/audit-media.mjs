// Controleert of gebruikte Puck-/Sveltia-foto's nog in de beeldbank bestaan.
// Draait zonder beelden te verwijderen of te vervangen.
import fs from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const mediaDir=path.join(root,'content/media');
const originalDir=path.join(root,'media/originals');
const maxMB=JSON.parse(await fs.readFile(path.join(root,'content/settings/media.json'),'utf8')).maxUploadMB||45;
const isId=value=>typeof value==='string'&&/^(?:media-[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}|foto-[a-f0-9]{12})$/i.test(value);
async function filesIn(dir){
 try{return (await fs.readdir(path.join(root,dir))).filter(name=>name.endsWith('.json')).sort();}
 catch(error){if(error.code==='ENOENT')return [];throw error;}
}
function findRefs(value,found=new Set()){
 if(isId(value))found.add(value);
 else if(Array.isArray(value))for(const item of value)findRefs(item,found);
 else if(value&&typeof value==='object')for(const item of Object.values(value))findRefs(item,found);
 return found;
}
const media=new Map();
for(const name of await filesIn('content/media')){
 const asset=JSON.parse(await fs.readFile(path.join(mediaDir,name),'utf8'));
 media.set(asset.id,asset);
}
const usages=new Map();
for(const kind of ['pages','articles','stories','settings']){
 for(const name of await filesIn('content/'+kind)){
  if(kind==='settings'&&name==='media.json')continue;
  const file='content/'+kind+'/'+name;
  const record=JSON.parse(await fs.readFile(path.join(root,file),'utf8'));
  for(const id of findRefs(record)){
   if(!usages.has(id))usages.set(id,new Set());
   usages.get(id).add(file);
  }
 }
}
const warnings=[];
let active=0,deleted=0,sourceMissing=0,sourceOversized=0;
let sourceBytes=0,originalCount=0;
const metadata=[];
for(const [id,asset] of media){
 let status='ok',bytes=0;
 if(asset.deletedAt){deleted++;status='deleted';}
 else{
  active++;
  if(typeof asset.source!=='string'||!asset.source.startsWith('media/originals/')){
   status=asset.source?.startsWith('https://static.wixstatic.com/media/')?'external-source':'invalid-source';
  }else{
   const source=path.resolve(root,asset.source);
   if(!source.startsWith(originalDir+path.sep))status='invalid-source';
   else{
    try{
     bytes=(await fs.stat(source)).size;
     if(bytes>maxMB*1024*1024){status='oversized';sourceOversized++;}
    }catch(error){if(error.code==='ENOENT'){status='missing-original';sourceMissing++;}else throw error;}
   }
  }
 }
 metadata.push({id,status,bytes,usedIn:[...(usages.get(id)||[])]});
 if(status!=='ok'&&status!=='deleted')warnings.push({id,status,usedIn:[...(usages.get(id)||[])]});
}
for(const [id,places] of usages){
 const asset=media.get(id);
 if(!asset)warnings.push({id,status:'missing-metadata',usedIn:[...places]});
 else if(asset.deletedAt)warnings.push({id,status:'deleted-but-used',usedIn:[...places]});
}
for(const name of await fs.readdir(originalDir)){
 const stat=await fs.stat(path.join(originalDir,name));
 if(stat.isFile()){originalCount++;sourceBytes+=stat.size;}
}
const report={
 createdAt:new Date().toISOString(),
 summary:{metadata:media.size,active,deleted,originals:originalCount,originalGiB:Number((sourceBytes/1024**3).toFixed(2)),referencedMedia:usages.size,affectedMedia:new Set(warnings.map(x=>x.id)).size,activeMissingOriginal:sourceMissing,activeTooLarge:sourceOversized},
 warnings,metadata
};
await fs.mkdir(path.join(root,'.cache'),{recursive:true});
await fs.writeFile(path.join(root,'.cache/media-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log('Beeldbankcontrole: '+JSON.stringify(report.summary));
for(const item of warnings.slice(0,60))console.warn('BEELDBANK '+item.status+': '+item.id+(item.usedIn.length?' | '+item.usedIn.join(', '):''));
if(warnings.length>60)console.warn('En nog '+(warnings.length-60)+' meldingen; zie .cache/media-audit.json.');
if(process.argv.includes('--strict')&&warnings.length)process.exitCode=1;
