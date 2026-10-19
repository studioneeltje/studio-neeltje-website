import {imageMarkup,escapeHTML as e,safeURL} from './media.mjs';
export function infoCardsMarkup(p,context){
 const data=context.settings.editorial?.cards||[];
 return `<section class="sn-info-cards" id="information-cards"><div class="sn-editorial-head"><span class="section-tag">${e(p.eyebrow||'VOOR JULLIE DAG. EN DAARNA.')}</span><h2>${e(p.title||'Volop beleven.')}<br><em>${e(p.emphasis||'Mooi bewaren.')}</em></h2></div><div class="sn-info-grid">${data.map((card,i)=>{
 const href=safeURL(card.href,'');
 return `<article class="sn-info-card" data-card="${i%2}">${card.label?`<span class="sn-info-label">${e(card.label)}</span>`:''}<h3>${e(card.title)}${card.emphasis?`<br><em>${e(card.emphasis)}</em>`:''}</h3>${card.text?`<p>${e(card.text)}</p>`:''}${card.image?`<div class="sn-info-photo">${imageMarkup({mediaId:card.image,sizes:'(max-width: 760px) 90vw, 560px'},context)}</div>`:''}${card.tags?.length?`<ul class="sn-info-tags">${card.tags.map(t=>`<li>${e(t)}</li>`).join('')}</ul>`:''}${card.button?.trim()&&href?`<a class="button sn-info-button" href="${e(href)}"><span>${e(card.button)}</span><i aria-hidden="true">↗</i></a>`:''}</article>`;
 }).join('')}</div></section>`;
}
export function reviewCardsMarkup(p,context){
 const records=(context.settings.editorial?.reviews||[]).filter(r=>r.quote?.trim()&&r.name?.trim()&&r.visible!==false);
 if(!records.length)return '';
 return `<section class="sn-reviews" id="review-cards" aria-label="Ervaringen van bruidsparen"><div class="sn-editorial-head"><span class="section-tag">${e(p.eyebrow||'LIEVE WOORDEN / VAN BRUIDSPAREN')}</span><h2>${e(p.title||'Wat zij')}<br><em>${e(p.emphasis||'ervan vinden.')}</em></h2></div><div class="sn-reviews-window"><div class="sn-reviews-track" data-review-count="${records.length}">${records.map(r=>`<figure class="sn-review-card"><span class="sn-review-mark" aria-hidden="true">“</span><blockquote>${e(r.quote)}</blockquote><div class="sn-review-credit">${r.image?imageMarkup({mediaId:r.image,sizes:'100px'},context):''}<figcaption><strong>${e(r.name)}</strong>${r.caption?`<span>${e(r.caption)}</span>`:''}</figcaption></div></figure>`).join('')}</div></div><div class="sn-reviews-navigation" hidden><button type="button" data-reviews-prev aria-label="Vorige reviews">←</button><span data-reviews-status aria-live="polite"></span><button type="button" data-reviews-next aria-label="Volgende reviews">→</button></div></section>`;
}
// Treat the visual label and URL as one optional action, in preview and publication.
export function removeEmptyButtons(html){return html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/g,(whole,attrs,content)=>{
 if(/\bdata-thanks-download\b/.test(attrs)&&/\bhidden\b/.test(attrs))return whole;
 const classes=attrs.match(/\bclass="([^"]*)"/)?.[1]||'';
 if(!/(?:^|\s)(?:button|sn-info-button|sn-text-link|social-follow-link|story-project-link)(?:\s|$)/.test(classes))return whole;
 const href=attrs.match(/\bhref="([^"]*)"/)?.[1]?.trim();
 const label=content.replace(/<[^>]*>/g,'').replace(/&(?:nbsp|#160);/g,' ').replace(/[↗↘↙↖→←↑↓+×]/g,'').trim();
 return label&&href&&href!=='#'?whole:'';
 });}
