// Blob URLs belong to the editor's origin. Embed just the displayed photos so
// the isolated preview can show them without receiving same-origin privileges.
const photos=new Map();
function embeddedPhoto(url){
 if(!photos.has(url)){
  const pending=fetch(url).then(async response=>{
   if(!response.ok)throw Error('Foto niet beschikbaar');
   const file=await response.blob();
   if(!/^image\//i.test(file.type))throw Error('Geen afbeeldingsbestand');
   return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Foto kon niet worden gelezen'));reader.readAsDataURL(file);});
  }).catch(error=>{photos.delete(url);throw error;});
  photos.set(url,pending);
  if(photos.size>24)photos.delete(photos.keys().next().value);
 }
 return photos.get(url);
}
export async function inlinePreviewPhotos(markup){
 const doc=new DOMParser().parseFromString(markup,'text/html');
 const images=[...doc.querySelectorAll('img[src^="blob:"]')];
 let failed=0;
 await Promise.all(images.map(async image=>{
  try{
   const url=image.getAttribute('src'),embedded=await embeddedPhoto(url);
   image.setAttribute('src',embedded);
   // A stale responsive candidate must not replace the embedded photo.
   image.removeAttribute('srcset');
   image.closest('picture')?.querySelectorAll('source').forEach(source=>source.remove());
   image.removeAttribute('data-full-src');
  }catch{
   failed++;
   const notice=doc.createElement('div');notice.className='sn-missing-media';notice.setAttribute('role','img');notice.setAttribute('aria-label','Foto kan niet worden geladen in de voorvertoning');notice.textContent='Deze foto kan nog niet worden geladen in de voorvertoning. Je fotokeuze is behouden.';const picture=image.closest('picture');if(picture)picture.replaceWith(notice);else image.replaceWith(notice);
  }
 }));
 return {html:doc.body.innerHTML,failed};
}
