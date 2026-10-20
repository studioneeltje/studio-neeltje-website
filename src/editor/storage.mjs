const PREFIX='studio-neeltje-v1:';
export function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem(PREFIX+key))??fallback;}catch{return fallback;}}
export function writeLocal(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));}catch{throw new Error('Lokale opslag is vol. Download een reservekopie of sla het concept op in GitHub.');}}
export function removeLocal(key){localStorage.removeItem(PREFIX+key);}
async function database(){return new Promise((resolve,reject)=>{const req=indexedDB.open('studio-neeltje-uploads',1);req.onupgradeneeded=()=>req.result.createObjectStore('files',{keyPath:'path'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Tijdelijke bestanden konden niet worden opgeslagen.'));});}
export async function saveUpload(upload){const db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(upload);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
export async function getUploads(){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('files');const req=tx.objectStore('files').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}finally{db.close();}}
export async function removeUploads(paths){const db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');for(const path of paths)tx.objectStore('files').delete(path);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
export function backupJSON(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

// Separate from the current draft and uploads: loading another version must not
// destroy the only copy of the page that was on screen. Never store credentials.
function recoveryDatabase(){return new Promise((resolve,reject)=>{const req=indexedDB.open('studio-neeltje-recovery',1);req.onupgradeneeded=()=>{const store=req.result.createObjectStore('versions',{keyPath:'id'});store.createIndex('pageId','pageId');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Het herstelpunt kon niet worden bewaard. Je huidige bewerking blijft staan. Download eerst een reservekopie.'));});}
function cleanMedia(media){return media.map(({previewURL,...asset})=>asset);}
export async function saveRecovery(page,mediaChanges=[],reason='Automatisch bewaard',{coalesce=false}={}){
 if(!page?.id||!Array.isArray(page.content))return null;
 const db=await recoveryDatabase();
 try{return await new Promise((resolve,reject)=>{
   const tx=db.transaction('versions','readwrite'),store=tx.objectStore('versions');
   const request=store.index('pageId').getAll(page.id);let result;
   request.onsuccess=()=>{
     const versions=request.result.sort((a,b)=>b.createdAt-a.createdAt),media=cleanMedia(mediaChanges);
     const signature=JSON.stringify({page,media});
     if(versions[0]?.signature===signature){result=versions[0];return;}
     const now=Date.now(),previous=versions[0];
     const replace=coalesce&&previous?.automatic&&now-previous.createdAt<60000;
     result={id:replace?previous.id:crypto.randomUUID(),pageId:page.id,createdAt:now,reason,automatic:coalesce,page:structuredClone(page),media,signature};
     store.put(result);
     const keep=[result,...versions.filter(v=>v.id!==result.id)].sort((a,b)=>b.createdAt-a.createdAt);
     for(const old of keep.slice(30))store.delete(old.id);
   };
   tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(new Error('Het herstelpunt kon niet worden bewaard. Je huidige bewerking blijft staan. Download eerst een reservekopie.'));
 });}finally{db.close();}
}
export async function getRecoveries(pageId){
 const db=await recoveryDatabase();
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction('versions'),req=tx.objectStore('versions').index('pageId').getAll(pageId);req.onsuccess=()=>resolve(req.result.sort((a,b)=>b.createdAt-a.createdAt));req.onerror=()=>reject(new Error('De herstelpunten konden niet worden geladen. Je huidige bewerking blijft staan.'));});}finally{db.close();}
}

export function validatePageBackup(value,pageId,templates){
 const page=value?.page||value;
 if(!page||page.id!==pageId||!Array.isArray(page.content)||!page.root?.props)throw Error('Kies een paginabestand voor deze pagina. Je huidige bewerking is niet veranderd.');
 const zones=page.zones||{};
 if(typeof zones!=='object'||Array.isArray(zones)||Object.values(zones).some(blocks=>!Array.isArray(blocks)))throw Error('Deze reservekopie bevat geen geldige pagina-indeling.');
 const blocks=[...page.content,...Object.values(zones).flat()];
 if(blocks.some(block=>!templates[block?.type]||!block.props||typeof block.props!=='object'))throw Error('Deze reservekopie gebruikt een onbekende bouwsteen en is niet ingeladen.');
 return structuredClone(page);
}
