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
export function assetURL(asset, manifest = {}, root = '') {
  const entry = manifest[asset?.id];
  return safeURL(entry?.src || asset?.previewURL || asset?.source || '', '');
}
export function imageMarkup(selection, context, {eager = false, className = '', aspect = ''} = {}) {
  const asset = context.media.find(a => a.id === selection?.mediaId);
  if (!asset) return '<span class="sn-missing-media">Kies een foto in de beheeromgeving.</span>';
  const processed = context.manifest?.[asset.id];
  const url = assetURL(asset, context.manifest);
  if (!url) return '<span class="sn-missing-media">Foto wordt verwerkt.</span>';
  const {desktop, mobile} = imagePresentation(asset, selection);
  const variants = processed?.variants || [];
  const sources = ['avif','webp'].map(format => {
    const list = variants.filter(v => v.format === format);
    return list.length ? `<source type="image/${format}" srcset="${list.map(v => `${escapeHTML(v.src)} ${v.width}w`).join(', ')}" sizes="${escapeHTML(selection.sizes || '(max-width: 760px) 100vw, 80vw')}">` : '';
  }).join('');
  const style = `--sn-x:${desktop.x}%;--sn-y:${desktop.y}%;--sn-z:${desktop.zoom};--sn-x-m:${mobile.x}%;--sn-y-m:${mobile.y}%;--sn-z-m:${mobile.zoom};${aspect ? `aspect-ratio:${aspect};` : ''}`;
  const dimensions = processed?.width && processed?.height ? ` width="${processed.width}" height="${processed.height}"` : '';
  return `<picture class="sn-picture">${sources}<img class="sn-media ${escapeHTML(className)}" src="${escapeHTML(url)}" alt="${escapeHTML(selection.alt ?? asset.alt ?? asset.title)}" style="${style}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}${dimensions} data-full-src="${escapeHTML(processed?.full || url)}" draggable="false"></picture>`;
}
export function videoMarkup(mediaId, context, {type = 'talk', caption = '', title = ''} = {}) {
  const asset = context.media.find(a => a.id === mediaId);
  if (!asset) return '<p>Kies een video in de beheeromgeving.</p>';
  const entry = context.manifest?.[asset.id];
  const url = entry?.src || asset.previewURL;
  if (!url) return '<p class="sn-video-processing">Deze video wordt bij publicatie geoptimaliseerd.</p>';
  const clip = type === 'clip';
  const sources = (entry?.variants || [{src:url, width:1920}]).slice().sort((a,b)=>a.width-b.width).map((v,i)=>`<source src="${escapeHTML(safeURL(v.src,''))}" type="video/mp4"${i === 0 && (entry?.variants?.length || 0)>1 ? ' media="(max-width: 760px)"' : ''}>`).join('');
  const captions = entry?.captions || asset.captions;
  const track = captions ? `<track kind="captions" src="${escapeHTML(safeURL(captions,''))}" srclang="nl" label="Nederlands" default>` : '';
  return `<figure class="sn-video"><video ${clip ? 'muted loop playsinline data-ambient' : 'controls playsinline'} preload="none"${entry?.poster ? ` poster="${escapeHTML(entry.poster)}"` : ''} aria-label="${escapeHTML(title || asset.title)}">${sources}${track}Je browser ondersteunt geen video.</video>${caption ? `<figcaption>${escapeHTML(caption)}</figcaption>` : ''}${clip ? '<button type="button" class="sn-video-toggle">Sfeerclip afspelen</button>' : ''}</figure>`;
}
