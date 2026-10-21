import {escapeHTML as e,imageMarkup,isMediaAvailable} from './media.mjs';
import {imageSlots} from './image-slots.mjs';

export function fanGalleryMarkup(props,context){
 const defaults=context.templates.FanGallery.defaults.images;
 const count=String(props.count)==='5'?5:3;
 const photos=imageSlots(props.images,defaults).slice(0,count);
 return `<section class="sn-fan-section" aria-label="${count} fotoprints"><div class="sn-fan-gallery" style="--fan-count:${count}" tabindex="0" role="region" aria-label="Fotoprints, veeg om meer te bekijken"${props.motion==='off'?' data-still="true"':''}>${photos.map((selection,index)=>{
  const asset=context.media.find(item=>item.id===selection.mediaId);
  const image=imageMarkup({...selection,sizes:'(max-width: 760px) 200px, 240px'},context,{aspect:'3/4'});
  return isMediaAvailable(asset,context.manifest)?`<button type="button" class="sn-fan-photo" aria-label="Vergroot foto ${index+1}: ${e(asset.alt||asset.title)}" aria-haspopup="dialog">${image}</button>`:`<div class="sn-fan-photo sn-fan-empty">${image}</div>`;
 }).join('')}</div><div class="sn-fan-controls" hidden><button type="button" data-fan-step="-1" aria-label="Vorige foto’s">←</button><button type="button" data-fan-step="1" aria-label="Volgende foto’s">→</button></div></section>`;
}
