import {escapeHTML as e,safeURL,imageMarkup,assetURL,mediaURL,isMediaAvailable,imagePresentation} from './media.mjs';

export const contactDefaults={
 "hero": {
  "eyebrow": "Hé, daar zijn jullie.",
  "title": "Jullie hebben\neen verhaal.",
  "emphasis": "Ik ben benieuwd.",
  "body": "Grote gevoelens. Kleine momenten.\nEn een fotograaf die er helemaal bij is.",
  "button": "Even kennismaken",
  "mode": "image",
  "image": "media-06bb057a-1e07-43fe-b00f-e12d6c726440",
  "gif": "",
  "videoId": "",
  "photoLabel": "Aangenaam, Neeltje.",
  "photoCaption": "Trouwfotografie met energie",
  "glitter": true
 },
 "form": {
  "eyebrow": "Een berichtje is het begin.",
  "title": "Hé, wie zijn jullie?",
  "emphasis": "",
  "intro": "Meer dan jullie namen en telefoonnummer heb ik voor nu niet nodig.",
  "sideTitle": "Even kennismaken?",
  "sideText": "Laat jullie namen en telefoonnummer achter. Dan neem ik persoonlijk contact met jullie op.\n\nGewoon even ontdekken of het klikt.",
  "signature": "Liefs, Neeltje",
  "namesLabel": "Jullie namen",
  "button": "Stuur Neeltje een bericht",
  "reassurance": "Vrijblijvend. Persoonlijk. Zonder verplichtingen.",
  "reviewId": "sari-onno",
  "sideEmphasis": "Lijkt me leuk.",
  "image": "media-06bb057a-1e07-43fe-b00f-e12d6c726440",
  "phoneLabel": "Telefoonnummer"
 },
 "personal": {
  "title": "Achter de camera?",
  "emphasis": "Ook gewoon Neeltje.",
  "intro": "Betrokken, een beetje eigenwijs en met liefde voor alles wat echt is.",
  "glitter": true,
  "cards": [
   {
    "image": "media-06bb057a-1e07-43fe-b00f-e12d6c726440",
    "caption": "Met camera.",
    "title": "",
    "emphasis": ""
   },
   {
    "image": "media-06bb057a-1e07-43fe-b00f-e12d6c726440",
    "caption": "Zonder pose.",
    "title": "Geen stijve",
    "emphasis": "poses."
   },
   {
    "image": "media-06bb057a-1e07-43fe-b00f-e12d6c726440",
    "caption": "Altijd betrokken.",
    "title": "Wel een",
    "emphasis": "beetje sjabam."
   }
  ]
 }
};
const text=value=>e(value).replace(/\n/g,'<br>');
const settings=(context,key)=>({...contactDefaults[key],...context.settings.contact?.[key]});
function sparkles(){return '<span class="sn-contact-halo" aria-hidden="true"></span><span class="sn-contact-sparkles" aria-hidden="true">'+Array.from({length:11},(_,i)=>`<span class="sn-contact-spark sn-contact-spark-${i}"><svg viewBox="0 0 32 32" focusable="false"><path d="M16 1 20 12 31 16 20 20 16 31 12 20 1 16 12 12Z" fill="currentColor"/></svg></span>`).join('')+'</span>';}
export function contactHeaderMarkup(props,context){
 const p=settings(context,'hero'),selection={...props.image,mediaId:props.image?.mediaId||p.image,sizes:'(max-width:700px) 90vw, 480px'},poster=imageMarkup(selection,context,{aspect:'3/4',eager:true});
 const video=context.media.find(asset=>asset.id===p.videoId&&asset.kind==='video'),entry=video&&context.manifest?.[video.id];
 const gif=context.media.find(asset=>asset.id===p.gif&&asset.kind==='image'),gifEntry=gif&&context.manifest?.[gif.id];
 const gifURL=isMediaAvailable(gif,context.manifest)?mediaURL(gifEntry?.animated||(/\.gif$/i.test(gif.source||'')?assetURL(gif,context.manifest):''),context.assetBaseURL):'';
 const crop=imagePresentation(context.media.find(a=>a.id===selection.mediaId),props.image||{}),frameStyle=`--contact-x:${crop.desktop.x}%;--contact-y:${crop.desktop.y}%;--contact-z:${crop.desktop.zoom};--contact-x-m:${crop.mobile.x}%;--contact-y-m:${crop.mobile.y}%;--contact-z-m:${crop.mobile.zoom}`;
 let motion='';
 if(p.mode==='video'&&isMediaAvailable(video,context.manifest)&&entry?.src){const variants=entry.variants||[{src:entry.src}];motion=`<video data-contact-video muted loop playsinline preload="none"${entry.poster?` poster="${e(mediaURL(entry.poster,context.assetBaseURL))}"`:''} aria-label="Stil videowelkom van Neeltje">${variants.map(v=>`<source src="${e(mediaURL(v.src,context.assetBaseURL))}" type="video/mp4">`).join('')}</video><button type="button" class="sn-contact-motion-toggle" data-contact-motion hidden>Video afspelen</button>`;}
 else if(p.mode==='gif'&&gifURL)motion=`<img class="sn-contact-gif" data-contact-gif data-animated-src="${e(gifURL)}" data-poster-src="${e(mediaURL(gifEntry?.src||assetURL(context.media.find(a=>a.id===selection.mediaId),context.manifest),context.assetBaseURL))}" alt="Bewegend welkom van Neeltje" hidden><button type="button" class="sn-contact-motion-toggle" data-contact-motion hidden>Animatie afspelen</button>`;
 const warning=context.preview&&p.mode!=='image'&&!motion?'<p class="sn-contact-preview-note">Kies een gepubliceerd '+(p.mode==='gif'?'GIF-bestand':'videobestand')+' in Sveltia. Tot die tijd blijft de posterfoto zichtbaar.</p>':'';
 return `<section class="sn-contact-header${p.glitter!==false?' has-glitter':''}"><div class="sn-contact-hero-copy"><p class="sn-contact-kicker">${e(p.eyebrow)}</p><h1>${text(p.title)}<em>${e(p.emphasis)}</em></h1><p class="sn-contact-lead">${text(p.body)}</p>${p.button?.trim()?`<button type="button" class="sn-contact-jump" data-contact-jump>${e(p.button)} <span aria-hidden="true">↓</span></button>`:''}</div><figure class="sn-contact-hero-media" style="${e(frameStyle)}"><div class="sn-contact-poster">${poster}</div>${motion}<figcaption><strong>${e(p.photoLabel)}</strong><span>${e(p.photoCaption)}</span></figcaption></figure>${p.glitter!==false?sparkles():''}${warning}</section>`;
}
export function contactConversationMarkup(props,context){
 const p=settings(context,'form'),address=String(context.settings.email||context.settings.forms?.recipient||'info@studioneeltje.com'),email=safeURL('mailto:'+address);
 const review=(context.settings.editorial?.reviews||[]).find(r=>r.id===p.reviewId&&r.visible!==false&&!r.continuationOf);
 const field=(label,name,type,placeholder,autocomplete)=>`<label class="sn-contact-field is-wide"><span>${e(label)} <span aria-hidden="true">*</span></span><input name="${name}" type="${type}" required autocomplete="${autocomplete}" placeholder="${e(placeholder)}"></label>`;
 const portrait=imageMarkup({...props.image,mediaId:props.image?.mediaId||p.image,sizes:'(max-width:700px) 100px, 330px'},context,{aspect:'1'});
 const fullReview=review?.fullText?.trim();
 return `<section class="sn-contact-conversation" data-contact-form-section><aside class="sn-contact-aside"><h2>${text(p.sideTitle)}${p.sideEmphasis?`<em>${e(p.sideEmphasis)}</em>`:''}</h2><p>${text(p.sideText)}</p><figure class="sn-contact-aside-portrait">${portrait}<figcaption>${e(p.signature)}</figcaption></figure></aside><div class="sn-contact-paper"><p class="sn-contact-kicker">${e(p.eyebrow)}</p><h2>${e(p.title)}${p.emphasis?`<em>${e(p.emphasis)}</em>`:''}</h2><p class="sn-contact-form-intro">${text(p.intro)}</p><form class="sn-contact-conversation-form" data-form="contact">${field(p.namesLabel,'names','text','Wij zijn…','name')}${field(p.phoneLabel,'phone','tel','Waar kan ik jullie bereiken?','tel')}<div class="sn-contact-send"><div class="sn-contact-send-effect"><button type="submit" class="sn-contact-submit"><span>${e(p.button)}</span><i aria-hidden="true">↗</i></button><span class="sn-contact-button-sparks" aria-hidden="true">✦ <b>✧</b> ✦</span></div><p>${e(p.reassurance)}<br>Liever mailen? <a href="${e(email)}">${e(address)}</a></p></div><p data-form-status hidden aria-live="polite"></p></form>${review?`<figure class="sn-contact-review"><span aria-hidden="true">“</span><blockquote>${e(review.quote)}</blockquote><figcaption>${e(review.name)}</figcaption>${fullReview&&fullReview!==review.quote.trim()?`<details><summary>Lees hun hele review</summary><p>${e(fullReview)}</p></details>`:''}</figure>`:''}</div></section>`;
}
export function behindCameraMarkup(props,context){
 const p=settings(context,'personal'),cards=(Array.isArray(p.cards)?p.cards:contactDefaults.personal.cards).slice(0,3);
 return `<section class="sn-contact-personal${p.glitter!==false?' has-glitter':''}"><header><h2>${e(p.title)}<em>${e(p.emphasis)}</em></h2><p>${e(p.intro)}</p></header><div class="sn-contact-prints">${cards.map((card,i)=>`<figure class="sn-contact-print sn-contact-print-${i}">${card.image?imageMarkup({mediaId:card.image,...props.crops?.[card.image],sizes:'(max-width:700px) 30vw, 300px'},context,{aspect:'1'}):`<div class="sn-contact-typeprint">${e(card.title)}<em>${e(card.emphasis)}</em></div>`}<figcaption>${e(card.caption)}</figcaption></figure>`).join('')}</div></section>`;
}
