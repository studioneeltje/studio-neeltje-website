// Blob URLs belong to the editor's origin. Embed just the displayed photos so
// the isolated preview can show them without receiving same-origin privileges.
const photos=new Map();
function embeddedPhoto(url){
 if(!photos.has(url)){
  const pending=new Promise((resolve,reject)=>{
   const image=new Image();
   image.onload=()=>{
    try{
     const scale=Math.min(1,1600/Math.max(image.naturalWidth,image.naturalHeight));
     const canvas=document.createElement('canvas');
     canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));
     canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
     const painter=canvas.getContext('2d');
     if(!painter)throw Error('Foto kon niet worden voorbereid');
     painter.drawImage(image,0,0,canvas.width,canvas.height);
     const embedded=canvas.toDataURL('image/webp',0.88);
     canvas.width=canvas.height=1;
     resolve(embedded);
    }catch(error){reject(error);}
   };
   image.onerror=()=>reject(Error('Foto kon niet worden gelezen'));
   image.src=url;
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
 for(const image of images){
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
 }
 return {html:doc.body.innerHTML,failed};
}
