import{escapeHTML as e,safeURL}from'./media.mjs';

export function tiltCardMarkup(p){
 const label=String(p.labelText||'').trim(),title=String(p.title||'').trim(),emphasis=String(p.emphasis||'').trim(),body=String(p.body||'').trim(),button=String(p.button||'').trim(),href=safeURL(p.href,'');
 return `<aside class="sn-tilt-cta" aria-label="${e(title||'Uitnodiging van Studio Neeltje')}"><div class="sn-tilt-card${label?' has-label':''}"${p.motion==='off'?' data-still="true"':''}><div class="sn-tilt-sheet" aria-hidden="true"></div><div class="sn-tilt-face">${label?`<span class="sn-tilt-label">${e(label)}</span>`:''}${p.eyebrow?.trim()?`<span class="sn-tilt-eyebrow">${e(p.eyebrow)}</span>`:''}${title||emphasis?`<h2 class="sn-tilt-title">${e(title)}${title&&emphasis?' ':''}${emphasis?`<em>${e(emphasis)}</em>`:''}</h2>`:''}<div class="sn-tilt-bottom">${body?`<p>${e(body).replace(/\n/g,'<br>')}</p>`:''}${button&&href&&href!=='#'?`<a class="sn-tilt-button" href="${e(href)}"><span>${e(button)}</span><i aria-hidden="true">↗</i></a>`:''}</div></div></div></aside>`;
}
