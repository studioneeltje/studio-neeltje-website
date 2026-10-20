export const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));
export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeURL(value, fallback = '#') {
  const s = String(value || '').trim();
  if (!s || /[\u0000-\u0020]/.test(s) || /^(?:javascript|data|vbscript):/i.test(s) || s.startsWith('//')) return fallback;
  if (/^[a-z][\w+.-]*:/i.test(s) && !/^(https?:|mailto:|tel:|blob:)/i.test(s)) return fallback;
  return s;
}
export function cropValue(crop, focus = {}) {
  return { x: clamp(crop?.x ?? focus.x ?? 50, 0, 100), y: clamp(crop?.y ?? focus.y ?? 50, 0, 100), zoom: Math.max(1, Math.min(3, Number(crop?.zoom) || 1)) };
}
export function imagePresentation(asset, selection = {}) {
  const desktop = cropValue(selection.desktop, asset?.focus);
  const mobile = cropValue(selection.mobile ?? selection.desktop, asset?.focus);
  return {desktop, mobile};
}
export function mediaURL(value, root = '') {
  const url=safeURL(value,'');
  if(!url||!root)return url;
  try{return new URL(url,root).href;}catch{return '';}
}
export function assetURL(asset, manifest = {}, root = '') {
  const entry = manifest[asset?.id];
  if(entry?.missing||entry?.deleted)return '';
  return mediaURL(entry?.src || asset?.previewURL || asset?.source || '',root);
}
export function thumbnailURL(asset,manifest={},root=''){
  const variants=manifest[asset?.id]?.variants||[];
  const thumbnail=variants.filter(v=>v.format==='webp').sort((a,b)=>a.width-b.width)[0];
  return asset?.previewURL?.startsWith('blob:')?asset.previewURL:mediaURL(thumbnail?.src||assetURL(asset,manifest),root);
}
export function missingImageMarkup(selection={},asset,{className='',aspect=''}={}){
  const label='Foto ontbreekt — kies een nieuwe foto';
  const width=Math.round(clamp(asset?.dimensions?.width||1200,1,100000)),height=Math.round(clamp(asset?.dimensions?.height||800,1,100000));
  // An image keeps the sizing/positioning rules of every existing photo frame.
  // No original, derived file or enlargeable image is exposed for a trashed photo.
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 600 400" preserveAspectRatio="none"><rect width="600" height="400" fill="#e8f2ff"/><rect x="22" y="22" width="556" height="356" fill="none" stroke="#65001d" stroke-opacity=".25" stroke-dasharray="8 8"/><g fill="none" stroke="#65001d" stroke-width="3"><rect x="278" y="140" width="44" height="36"/><path d="m279 170 12-12 10 10 8-8 12 12"/><circle cx="309" cy="150" r="3"/></g><text x="300" y="218" fill="#65001d" font-family="sans-serif" font-size="19" text-anchor="middle">Foto ontbreekt</text><text x="300" y="245" fill="#65001d" font-family="sans-serif" font-size="14" text-anchor="middle">Kies een nieuwe foto</text></svg>`;
  return `<picture class="sn-picture" data-sn-missing="true"><img class="sn-media sn-missing-image ${escapeHTML(className)}" data-sn-missing="true" src="data:image/svg+xml,${encodeURIComponent(svg)}" alt="${label}" width="${width}" height="${height}"${aspect?` style="aspect-ratio:${escapeHTML(aspect)}"`:''} draggable="false"></picture>`;
}
export function imageMarkup(selection, context, {eager = false, className = '', aspect = ''} = {}) {
  const asset = context.media.find(a => a.id === selection?.mediaId);
  if (!asset||asset.deletedAt||context.manifest?.[asset.id]?.missing||context.manifest?.[asset.id]?.deleted) return missingImageMarkup(selection,asset,{className,aspect});
  const processed = context.manifest?.[asset.id];
  const url = assetURL(asset, context.manifest, context.assetBaseURL);
  if (!url) return missingImageMarkup(selection,asset,{className,aspect});
  const {desktop, mobile} = imagePresentation(asset, selection);
  const variants = processed?.variants || [];
  const sources = ['avif','webp'].map(format => {
    const list = variants.filter(v => v.format === format);
    return list.length ? `<source type="image/${format}" srcset="${list.map(v => `${escapeHTML(mediaURL(v.src,context.assetBaseURL))} ${v.width}w`).join(', ')}" sizes="${escapeHTML(selection.sizes || '(max-width: 760px) 100vw, 80vw')}">` : '';
  }).join('');
  const style = `--sn-x:${desktop.x}%;--sn-y:${desktop.y}%;--sn-z:${desktop.zoom};--sn-x-m:${mobile.x}%;--sn-y-m:${mobile.y}%;--sn-z-m:${mobile.zoom};${aspect ? `aspect-ratio:${aspect};` : ''}`;
  const dimensions = processed?.width && processed?.height ? ` width="${processed.width}" height="${processed.height}"` : '';
  return `<picture class="sn-picture">${sources}<img class="sn-media ${escapeHTML(className)}" src="${escapeHTML(url)}" alt="${escapeHTML(selection.alt ?? asset.alt ?? asset.title)}" style="${style}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}${dimensions} data-full-src="${escapeHTML(mediaURL(processed?.full || url,context.assetBaseURL))}" draggable="false"></picture>`;
}
export function videoMarkup(mediaId, context, {type = 'talk', caption = '', title = ''} = {}) {
  const asset = context.media.find(a => a.id === mediaId);
  if (!asset||asset.deletedAt||context.manifest?.[asset.id]?.missing||context.manifest?.[asset.id]?.deleted) return '<div class="sn-missing-media">Video ontbreekt — kies een nieuwe video.</div>';
  const entry = context.manifest?.[asset.id];
  const url = entry?.src || asset.previewURL;
  if (!url) return '<p class="sn-video-processing">Deze video wordt bij publicatie geoptimaliseerd.</p>';
  const clip = type === 'clip';
  const sources = (entry?.variants || [{src:url, width:1920}]).slice().sort((a,b)=>a.width-b.width).map((v,i)=>`<source src="${escapeHTML(mediaURL(v.src,context.assetBaseURL))}" type="video/mp4"${i === 0 && (entry?.variants?.length || 0)>1 ? ' media="(max-width: 760px)"' : ''}>`).join('');
  const captions = entry?.captions || asset.captions;
  const track = captions ? `<track kind="captions" src="${escapeHTML(mediaURL(captions,context.assetBaseURL))}" srclang="nl" label="Nederlands" default>` : '';
  return `<figure class="sn-video"><video ${clip ? 'muted loop playsinline data-ambient' : 'controls playsinline'} preload="none"${entry?.poster ? ` poster="${escapeHTML(mediaURL(entry.poster,context.assetBaseURL))}"` : ''} aria-label="${escapeHTML(title || asset.title)}">${sources}${track}Je browser ondersteunt geen video.</video>${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}${clip ? '<button type="button" class="sn-video-toggle">Sfeerclip afspelen</button>' : ''}</figure>`;
}
