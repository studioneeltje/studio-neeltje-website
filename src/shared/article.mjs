import {authorMarkup} from './experience.mjs';
import {marked} from 'marked';
import sanitizeHTML from 'sanitize-html';
import {imageMarkup,escapeHTML as e,safeURL} from './media.mjs';
import {articleReadTime} from './article-data.mjs';

function prose(value){return sanitizeHTML(marked.parse(String(value||''),{async:false}),{allowedTags:['p','br','h2','h3','h4','ul','ol','li','strong','em','a','blockquote','img'],allowedAttributes:{a:['href','title'],img:['src','alt','width','height','loading','decoding']},allowedSchemes:['https','http','mailto','tel'],transformTags:{img:(tagName,attrs)=>{const size=String(attrs.src||'').match(/\/(?:fill|fit)\/w_(\d+),h_(\d+)/);return{tagName,attribs:{...attrs,loading:'lazy',decoding:'async',...(size?{width:size[1],height:size[2]}:{})}};}}});}
function dateMarkup(value,label){
 const raw=String(value||'').slice(0,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(raw))return '';
 const date=new Date(raw+'T12:00:00Z');if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==raw)return '';
 return `<span>${label} <time datetime="${raw}">${date.toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'})}</time></span>`;
}
function picture(id,context,sizes='(max-width: 760px) 90vw, 1000px'){
 return id?imageMarkup({mediaId:id,sizes},context):'';
}
function caption(text){return text?`<figcaption>${e(text)}</figcaption>`:'';}
function sectionMarkup(s,context){
 const heading=s.title?`<h2>${e(s.title)}</h2>`:'';
 switch(s.type){
  case 'photo':return s.image?`<figure class="sn-article-photo" data-width="${s.width==='wide'?'wide':'copy'}">${picture(s.image,context)}${caption(s.caption)}</figure>`:'';
  case 'pair':return s.image&&s.secondImage?`<figure class="sn-article-photo sn-article-pair"><div>${picture(s.image,context,'(max-width: 760px) 44vw, 480px')}${picture(s.secondImage,context,'(max-width: 760px) 44vw, 480px')}</div>${caption(s.caption)}</figure>`:'';
  case 'split':return `<section class="sn-article-split${s.image?'':' sn-article-split-text'}">${s.image?`<figure>${picture(s.image,context,'(max-width: 760px) 90vw, 440px')}${caption(s.caption)}</figure>`:''}<div>${heading}${prose(s.text)}</div></section>`;
  case 'tip':return `<aside class="sn-article-tip"><span class="sn-article-label">Goed om te weten</span>${heading}${prose(s.text)}</aside>`;
  case 'checklist':return `<aside class="sn-article-tip sn-article-checklist"><span class="sn-article-label">Even checken</span>${heading}<ul>${(s.items||[]).map(item=>`<li>${e(item)}</li>`).join('')}</ul></aside>`;
  default:return `<section class="sn-article-text">${heading}${prose(s.text)}</section>`;
 }
}
export function renderArticle(record,context,prepareProse){
 const markup=`<div class="sn-article-prose">${record.body?`<div class="sn-article-text">${prose(record.body)}</div>`:''}${(record.sections||[]).map(s=>sectionMarkup(s,context)).join('')}</div>`;
 const {html:prepared,headings}=prepareProse(markup);
 const toc=record.showToc!==false&&headings.length>=3?`<nav class="sn-article-toc" aria-label="In dit artikel"><details open><summary>In dit artikel</summary><ol>${headings.map(h=>`<li${h.sub?' class="sn-toc-sub"':''}><a href="#${h.id}">${e(h.title)}</a></li>`).join('')}</ol></details></nav>`:'';
 const summary=(record.summary||[]).filter(s=>String(s).trim());if(!summary.length&&record.excerpt)summary.push(record.excerpt);
 const author=record.author||'Neeltje';
 const eligible=context.articles.filter(a=>a.id!==record.id&&a.published!==false);
 const selected=record.related?.length?record.related.map(id=>eligible.find(a=>a.id===id)).filter(Boolean).slice(0,3):eligible.slice().sort((a,b)=>Number(b.category===record.category)-Number(a.category===record.category)).slice(0,3);
 const cta=record.cta===undefined?{enabled:true,title:'Meer rust in jullie planning?',text:'De gratis trouwchecklist helpt jullie stap voor stap op weg.',label:'Ontdek de gratis trouwchecklist',href:'weddingschecklist.html'}:record.cta;
 const href=safeURL(cta?.href,'');const showCta=cta?.enabled!==false&&cta?.label?.trim()&&href;
 return `<div class="sn-article-progress" role="progressbar" aria-label="Leesvoortgang van dit artikel" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" hidden><span></span></div>
 <article class="sn-article" aria-labelledby="article-title">
 <header class="sn-article-header"><div class="sn-article-header-inner"><a class="sn-article-back" href="journal.html">← Alle tips &amp; verhalen</a><div class="sn-article-meta"><span>${e(record.category||'JOURNAL')}</span><span>${articleReadTime(record)}</span></div><h1 id="article-title">${e(record.title)}</h1><div class="sn-article-byline"><span>Door ${e(author)}</span>${dateMarkup(record.date,'Gepubliceerd op')}${record.updated&&record.updated!==record.date?dateMarkup(record.updated,'Bijgewerkt op'):''}</div></div></header>
 <div class="sn-article-reading" data-article-reading>
 <div class="sn-article-opening"><p class="sn-article-intro">${e(record.excerpt)}</p><aside class="sn-article-summary" aria-labelledby="article-summary-title"><span class="sn-article-label">Voor de snelle lezer</span><h2 id="article-summary-title">In het kort</h2><ul>${summary.map(item=>`<li>${e(item)}</li>`).join('')}</ul></aside></div>
 ${record.cover?`<figure class="sn-article-cover">${imageMarkup({mediaId:record.cover,sizes:'(max-width: 760px) 100vw, 1100px'},context,{eager:true})}${caption(record.coverCaption)}</figure>`:''}
 <div class="sn-article-layout${toc?' has-toc':''}">${toc}${prepared}</div>
 <div class="sn-article-signoff"><span>Met liefde gedeeld,</span><em>${e(author)}</em></div>
 </div>
 ${authorMarkup(record,context)}
 ${showCta?`<section class="sn-article-cta">${cta.title?`<h2>${e(cta.title)}</h2>`:''}${cta.text?`<p>${e(cta.text)}</p>`:''}<a class="button" href="${e(href)}"><span>${e(cta.label)}</span><i aria-hidden="true">↗</i></a></section>`:''}
 </article>
 ${selected.length?`<section class="sn-article-related" aria-labelledby="related-title"><div class="sn-article-related-head"><span class="sn-article-label">Nog even verder lezen</span><h2 id="related-title">Ook fijn <em>om te weten.</em></h2></div><div class="sn-article-related-grid">${selected.map(a=>`<a class="sn-article-related-card" href="artikel-${e(a.id)}.html">${a.cover?`<div class="sn-article-related-image">${picture(a.cover,context,'(max-width: 760px) 90vw, 380px')}</div>`:''}<div class="sn-article-meta"><span>${e(a.category||'JOURNAL')}</span><span>${articleReadTime(a)}</span></div><h3>${e(a.title)}</h3><span class="sn-article-related-link">Lees het artikel <i aria-hidden="true">↗</i></span></a>`).join('')}</div></section>`:''}`;
}
