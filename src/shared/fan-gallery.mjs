import {escapeHTML as e,imageMarkup,isMediaAvailable} from './media.mjs';
import {imageSlots} from './image-slots.mjs';

export function fanGalleryMarkup(props,context){
 const defaults=context.templates.FanGallery.defaults.images;
 const photos=imageSlots(props.images,defaults).slice(0,3);
 return `<section class="sn-fan-section" aria-label="Drie fotoprints"><div class="sn-fan-gallery"${props.motion==='off'?' data-still="true"':''}>${photos.map((selection,index)=>{
  const asset=context.media.find(item=>item.id===selection.mediaId);
  const image=imageMarkup({...selection,sizes:'(max-width: 480px) 30vw, 220px'},context,{aspect:'3/4'});
  return isMediaAvailable(asset,context.manifest)?`<button type="button" class="sn-fan-photo" aria-label="Vergroot foto ${index+1}: ${e(asset.alt||asset.title)}" aria-haspopup="dialog">${image}</button>`:`<div class="sn-fan-photo sn-fan-empty">${image}</div>`;
 }).join('')}</div></section>`;
}
