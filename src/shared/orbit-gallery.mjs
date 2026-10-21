import {imageMarkup,assetURL,escapeHTML as e} from './media.mjs';
import {imageSlots} from './image-slots.mjs';
export function orbitGalleryMarkup(p,context){
 const spec=context.templates.Orbit;
 const photos=imageSlots(p.images,spec.defaults.images).slice(0,12).filter((selection,index)=>index<7||selection.mediaId);
 const cards=photos.map((selection,index)=>{
  const asset=context.media.find(item=>item.id===selection.mediaId),label=asset?.alt||asset?.title||`Foto ${index+1}`;
  return `<a class="orbit-card" href="${e(assetURL(asset,context.manifest,context.assetBaseURL)||'#')}" aria-label="Open foto: ${e(label)}">${imageMarkup({...selection,sizes:'(max-width: 760px) 150px, 230px'},context)}</a>`;
 }).join('');
 let first=true;
 let html=spec.html.replace(/<a class="orbit-card"[\s\S]*?<\/a>/g,()=>{if(!first)return '';first=false;return cards;});
 return html.replace(/\{\{t:(\d+)\}\}/g,(_,key)=>e(key==='7'?`01 / ${String(photos.length).padStart(2,'0')} · SLEEP OM TE DRAAIEN · KLIK OM TE OPENEN`:p.texts?.[key]?.value??spec.defaults.texts?.[key]?.value??''));
}
