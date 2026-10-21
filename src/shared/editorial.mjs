import {imageMarkup,escapeHTML as e,safeURL} from './media.mjs';
export function infoCardsMarkup(p,context){
 const data=context.settings.editorial?.cards||[];
 return `<section class="sn-info-cards" id="information-cards"><div class="sn-editorial-head"><span class="section-tag">${e(p.eyebrow||'VOOR JULLIE DAG. EN DAARNA.')}</span><h2>${e(p.title||'Volop beleven.')}<br><em>${e(p.emphasis||'Mooi bewaren.')}</em></h2></div><div class="sn-info-grid">${data.map((card,i)=>{
 const href=safeURL(card.href,'');
 return `<article class="sn-info-card" data-card="${i%2}">${card.label?`<span class="sn-info-label">${e(card.label)}</span>`:''}<h3>${e(card.title)}${card.emphasis?`<br><em>${e(card.emphasis)}</em>`:''}</h3>${card.text?`<p>${e(card.text)}</p>`:''}${card.image?`<div class="sn-info-photo">${imageMarkup({mediaId:card.image,sizes:'(max-width: 760px) 90vw, 560px'},context)}</div>`:''}${card.tags?.length?`<ul class="sn-info-tags">${card.tags.map(t=>`<li>${e(t)}</li>`).join('')}</ul>`:''}${card.button?.trim()&&href?`<a class="button sn-info-button" href="${e(href)}"><span>${e(card.button)}</span><i aria-hidden="true">↗</i></a>`:''}</article>`;
 }).join('')}</div></section>`;
}
export function selectedReviews(p,context){
 const visible=(context.settings.editorial?.reviews||[]).filter(r=>r.id&&r.quote?.trim()&&r.name?.trim()&&r.visible!==false);
 if(p.reviewSource!=='selected')return {records:visible,missing:[]};
 const seen=new Set(),records=[],missing=[];
 for(const item of Array.isArray(p.reviewSelection)?p.reviewSelection:[]){const id=item?.reviewId;if(!id||seen.has(id))continue;seen.add(id);const record=visible.find(r=>r.id===id);if(record)records.push(record);else missing.push(id);}
 return {records,missing};
}
function completeReview(review,records){return review.fullText?.trim()||records.filter(record=>record.continuationOf===review.id&&record.visible!==false).map(record=>record.quote?.trim()).filter(Boolean).join('\n\n');}
function reviewExpansion(review,records){const full=completeReview(review,records);if(!full||full===review.quote?.trim())return '';return `<details class="sn-review-more"><summary><span>Lees de volledige review</span><span class="sn-review-toggle" aria-hidden="true"></span></summary><div class="sn-review-full">${full.split(/\n\s*\n/).map(paragraph=>`<p>${e(paragraph).replace(/\n/g,'<br>')}</p>`).join('')}</div></details>`;}
export function reviewCardsMarkup(p,context){
 const {records,missing}=selectedReviews(p,context);
 const notice=context.preview&&p.reviewSource==='selected'&&(!records.length||missing.length)?`<p class="sn-missing-media" role="status">${!records.length?'Nog geen beschikbare reviews gekozen. Voeg reviews toe onder Eigen selectie en volgorde. ':''}${missing.length?`Niet beschikbaar of uitgezet in Sveltia: ${missing.map(e).join(', ')}. Kies een andere review of verwijder deze uit je selectie.`:''}</p>`:'';
 if(!records.length)return notice;
 return notice+`<section class="sn-reviews" id="review-cards" aria-label="Ervaringen van bruidsparen"><div class="sn-editorial-head"><span class="section-tag">${e(p.eyebrow||'LIEVE WOORDEN / VAN BRUIDSPAREN')}</span><h2>${e(p.title||'Wat zij')}<br><em>${e(p.emphasis||'ervan vinden.')}</em></h2></div><div class="sn-reviews-window"><div class="sn-reviews-track" data-review-count="${records.length}">${records.map(r=>`<figure class="sn-review-card"><span class="sn-review-mark" aria-hidden="true">“</span><blockquote>${e(r.quote).replace(/\n/g,'<br>')}</blockquote>${reviewExpansion(r,context.settings.editorial?.reviews||[])}<div class="sn-review-credit">${r.image?imageMarkup({mediaId:r.image,sizes:'100px'},context):''}<figcaption><strong>${e(r.name)}</strong>${r.caption?`<span>${e(r.caption)}</span>`:''}</figcaption></div></figure>`).join('')}</div></div><div class="sn-reviews-navigation" hidden><button type="button" data-reviews-prev aria-label="Vorige reviews">←</button><span data-reviews-status aria-live="polite"></span><button type="button" data-reviews-next aria-label="Volgende reviews">→</button></div></section>`;
}
export function singleReviewMarkup(p,context){
 const records=context.settings.editorial?.reviews||[];
 const review=records.find(record=>record.id===p.reviewId&&record.visible!==false);
 if(!review?.quote?.trim()||!review.name?.trim())return context.preview?'<p class="sn-missing-media">Kies een zichtbare review met quote en naam. De inhoud staat in Sveltia → Informatiekaarten &amp; reviews.</p>':'';
 // Existing cards hold two fragments of one real review. Reuse the continuation
 // instead of making another editable copy of that text for the new block.
 const full=completeReview(review,records);
 const photo=Boolean(review.image);
 return `<section class="sn-single-review${photo?' has-photo':''}" id="single-review" aria-label="Review van ${e(review.name)}"><div class="sn-single-review-inner"><div class="sn-single-review-heading"><span class="section-tag">${e(p.eyebrow||'WOORDEN VAN EEN BRUIDSPAAR')}</span></div><figure><div class="sn-single-review-copy"><span class="sn-single-review-mark" aria-hidden="true">“</span><blockquote>${e(review.quote).replace(/\n/g,'<br>')}</blockquote>${full?`<details class="sn-single-review-more"><summary><span>Lees de volledige review</span><span class="sn-single-review-toggle" aria-hidden="true">+</span></summary><div class="sn-single-review-full">${full.split(/\n\s*\n/).map(paragraph=>`<p>${e(paragraph).replace(/\n/g,'<br>')}</p>`).join('')}</div></details>`:''}<figcaption><strong>${e(review.name)}</strong>${review.caption?`<span>${e(review.caption)}</span>`:''}</figcaption></div>${photo?`<div class="sn-single-review-photo">${imageMarkup({...p.crops?.[review.id],mediaId:review.image,sizes:'(max-width: 760px) 70vw, 300px'},context)}</div>`:''}</figure></div></section>`;
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
