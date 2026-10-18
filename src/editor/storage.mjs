const PREFIX='studio-neeltje-v1:';
export function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem(PREFIX+key))??fallback;}catch{return fallback;}}
export function writeLocal(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));}catch{throw new Error('Lokale opslag is vol. Download een reservekopie of sla het concept op in GitHub.');}}
export function removeLocal(key){localStorage.removeItem(PREFIX+key);}
async function database(){return new Promise((resolve,reject)=>{const req=indexedDB.open('studio-neeltje-uploads',1);req.onupgradeneeded=()=>req.result.createObjectStore('files',{keyPath:'path'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(new Error('Tijdelijke bestanden konden niet worden opgeslagen.'));});}
export async function saveUpload(upload){const db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(upload);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}}
export async function getUploads(){const db=await database();try{return await new Promise((resolve,reject)=>{const tx=db.transaction('files');const req=tx.objectStore('files').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}finally{db.close();}}
export function backupJSON(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
