import {assetURL,escapeHTML as e,imageMarkup,isMediaAvailable,safeURL} from './media.mjs';

export function checklistSignupMarkup(p,context){
 const text=key=>e(p.texts?.find(item=>String(item.key)===String(key))?.value);
 const cover=p.images?.[0];
 const sampleHref=safeURL(p.links?.[0]?.href,'');
 return `<section class="sn-checklist-signup" aria-labelledby="checklist-signup-title">
  <div class="sn-checklist-signup-inner">
   <div class="sn-checklist-signup-copy">
    <p class="section-tag">${text(9)}</p>
    <h1 id="checklist-signup-title">${text(10)} <em>${text(11)}</em></h1>
    <p class="sn-checklist-signup-lead">${text(13)}</p>
    <form class="sn-checklist-inline-form" data-form-kind="checklist">
     <label class="sn-checklist-email">Je e-mailadres<input type="email" name="email" autocomplete="email" required></label>
     <button type="submit" class="sn-checklist-submit"><span>${text(16)}</span><span aria-hidden="true">↗</span></button>
     <p data-form-status hidden aria-live="polite"></p>
     <p class="sn-checklist-delivery">${text(14)}</p>
    </form>
    ${sampleHref?`<a class="sn-checklist-sample-link" href="${e(sampleHref)}">Bekijk eerst een voorbeeldpagina <span aria-hidden="true">↓</span></a>`:''}
   </div>
   ${cover?.mediaId?`<figure class="sn-checklist-signup-cover">${imageMarkup({...cover,sizes:'(max-width: 820px) 240px, 330px'},context,{eager:true})}<figcaption>${text(15)}</figcaption></figure>`:''}
  </div>
 </section>`;
}

export function checklistContentsMarkup(p,context){
 const data=context.settings.checklist?.contents;
 if(!data)return '';
 const image={...p.image,mediaId:p.image?.mediaId||data.cover,sizes:'(max-width: 760px) 240px, 360px'};
 const hasImage=Boolean(image.mediaId);
 const href=safeURL(data.href,'');
 const sample=context.media.find(asset=>asset.id===data.sampleImage&&asset.kind==='image');
 const sampleImage=isMediaAvailable(sample,context.manifest)
  ?imageMarkup({mediaId:sample.id,sizes:'(max-width: 760px) 86vw, 420px'},context)
  :'';
 const featured=p.variant==='example'&&sampleImage;
 const sampleMarkup=sampleImage&&!featured
  ?`<details class="sn-checklist-sample"><summary>Bekijk een voorbeeldpagina</summary><figure>${sampleImage}<figcaption>Uit de checklist · De trouwlocatie</figcaption></figure></details>`
  :'';
 const previewSheet=featured
  ?`<figure id="checklist-voorbeeld" class="sn-checklist-book-stage sn-checklist-preview-sheet">
    <figcaption><span>Uit de checklist</span><strong>De trouwlocatie</strong></figcaption>
    <a class="sn-checklist-spread" href="${e(assetURL(sample,context.manifest,context.assetBaseURL))}" target="_blank" rel="noopener" aria-label="Bekijk de voorbeeldpagina De trouwlocatie op groot formaat">
     <span class="sn-checklist-spread-note" aria-hidden="true"><span>Studio Neeltje</span><em>Waar valt het licht?</em></span>
     <span class="sn-checklist-spread-page">${sampleImage}</span>
     <span class="sn-checklist-spread-open">Bekijk de pagina <span aria-hidden="true">↗</span></span>
    </a>
   </figure>`
  :`<div class="sn-checklist-book-stage" aria-label="Vormgeving van de trouwchecklist"><div class="sn-checklist-loose-sheet" aria-hidden="true"><span>Jullie planning</span><i></i><i></i><i></i></div><div class="sn-checklist-book">${hasImage?`<div class="sn-checklist-book-photo">${imageMarkup(image,context)}</div>`:''}<div class="sn-checklist-book-copy"><span class="sn-checklist-book-brand">STUDIO NEELTJE</span><strong>${e(data.coverTitle)}<em>${e(data.coverEmphasis)}</em></strong></div><span class="sn-checklist-book-footer">${e(data.coverFooter)}</span>${data.coverLabel?`<span class="sn-checklist-book-label">${e(data.coverLabel)} <span aria-hidden="true">↗</span></span>`:''}</div></div>`;
 return `<section class="sn-checklist-contents" id="checklist-contents" aria-labelledby="checklist-contents-title"><div class="sn-checklist-layout"><header class="sn-checklist-heading"><span class="section-tag">${e(data.eyebrow)}</span><h2 id="checklist-contents-title">${e(data.title)}<br><em>${e(data.emphasis)}</em></h2><p>${e(data.intro)}</p></header><ul class="sn-checklist-benefits">${(data.benefits||[]).map(item=>`<li><span class="sn-checklist-star" aria-hidden="true">✳</span><div><h3>${e(item.title)}</h3><p>${e(item.text)}</p></div></li>`).join('')}</ul>${previewSheet}<div class="sn-checklist-action">${data.button?.trim()&&href?`<a class="button" href="${e(href)}"><span>${e(data.button)}</span><i aria-hidden="true">↗</i></a>`:''}${data.note?`<p class="sn-checklist-note">${e(data.note)}</p>`:''}${sampleMarkup}</div></div></section>`;
}

export function checklistAudienceMarkup(p,context){
 const data=context.settings.checklist?.audience;
 if(!data)return '';
 const editorial=p.variant==='editorial';
 const heading=`<span class="section-tag">${e(data.eyebrow)}</span><h2 id="checklist-audience-title">${e(editorial?data.editorialTitle:data.title)}<br><em>${e(editorial?data.editorialEmphasis:data.emphasis)}</em></h2>`;
 const points=data.points||[];
 const action=p.showAction&&context.settings.checklist?.contents;
 const actionHref=safeURL(action?.href,'');
 const closingAction=action?.button&&actionHref
  ?`<a class="button sn-checklist-closing-action" href="${e(actionHref)}"><span>${e(action.button)}</span><i aria-hidden="true">↗</i></a>`
  :'';

 if(editorial)return `<section class="sn-checklist-audience sn-checklist-audience-editorial" id="checklist-audience" aria-labelledby="checklist-audience-title"><div class="sn-checklist-audience-inner"><header class="sn-checklist-audience-editorial-head"><div>${heading}</div><p>${e(data.intro)}</p></header><div class="sn-checklist-audience-details">${points.map((point,i)=>`<details${p.openFirst!==false&&i===0?' open':''}><summary><span class="sn-checklist-point-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${e(point.shortTitle||point.title)}</span><span class="sn-checklist-plus" aria-hidden="true"></span></summary><p>${e(point.text)}</p></details>`).join('')}</div>${data.footer?`<div class="sn-checklist-audience-footer"><span class="sn-checklist-star" aria-hidden="true">✳</span><p>${e(data.footer)}</p></div>`:''}${closingAction}</div></section>`;
 return `<section class="sn-checklist-audience sn-checklist-audience-personal" id="checklist-audience" aria-labelledby="checklist-audience-title"><div class="sn-checklist-audience-inner"><header class="sn-checklist-audience-heading">${heading}</header><div class="sn-checklist-audience-grid"><div class="sn-checklist-audience-intro"><p>${e(data.intro)}</p>${data.asideTitle||data.asideText?`<div class="sn-checklist-audience-aside">${data.asideTitle?`<strong>${e(data.asideTitle)}</strong>`:''}${data.asideText?`<p>${e(data.asideText)}</p>`:''}</div>`:''}</div><ul class="sn-checklist-audience-points">${points.map(point=>`<li><span class="sn-checklist-star" aria-hidden="true">✳</span><div><h3>${e(point.title)}</h3><p>${e(point.text)}</p></div></li>`).join('')}</ul></div></div></section>`;
}

// Add the approved blocks once to older local or GitHub concepts, keeping every
// existing block and its text. The version flag allows later deliberate removal.
export function upgradeChecklistPage(page,templates){
 if(page?.id!=='weddingschecklist'||page.checklistDesignVersion>=1||!templates.ChecklistContents||!templates.ChecklistAudience)return page;
 const next=structuredClone(page);
 const blocks=next.content||[];
 const added=[];
 if(!blocks.some(block=>block.type==='ChecklistContents'))added.push({type:'ChecklistContents',props:{...structuredClone(templates.ChecklistContents.defaults),id:'weddingschecklist-contents',background:'white'}});
 if(!blocks.some(block=>block.type==='ChecklistAudience'))added.push({type:'ChecklistAudience',props:{...structuredClone(templates.ChecklistAudience.defaults),id:'weddingschecklist-audience',background:'pink'}});
 let position=blocks.findIndex(block=>block.type==='About'&&(block.props.texts||[]).some(text=>/waarom/i.test(text.value)));
 if(position<0)position=blocks.findIndex(block=>block.type==='Checklist');
 if(position<0)position=blocks.findIndex(block=>block.type==='Intro'||block.type==='Hero');
 blocks.splice(position+1,0,...added);
 if(!blocks.some(block=>block.type==='ContactForm'&&block.props.formKind==='checklist')){
   const form=structuredClone(templates.ContactForm.defaults);
   form.id='weddingschecklist-contactform-2';form.formKind='checklist';form.background='pink';
   const labels={0:'EEN FIJNE START VOOR JULLIE PLANNING',1:'Jullie checklist.',2:'Meer rust.',3:'Vraag de gratis trouwchecklist aan met jullie namen en e-mailadres.',4:'GRATIS VOOR JULLIE',5:'STAP VOOR STAP OVERZICHT',6:'DE GRATIS TROUWCHECKLIST',14:'Vraag de checklist aan'};
   for(const [key,value]of Object.entries(labels))if(form.texts?.[key])form.texts[key].value=value;
   const end=blocks.findIndex(block=>block.type==='ContactCTA');
   blocks.splice(end<0?blocks.length:end,0,{type:'ContactForm',props:form});
 }
 next.content=blocks;next.checklistDesignVersion=1;
 return next;
}
