import {withPortfolioCards} from './portfolio-cards.mjs';
import {marked} from 'marked';
import sanitizeHTML from 'sanitize-html';
import {escapeHTML as e,safeURL,imageMarkup,isMediaAvailable} from './media.mjs';
export function projectProse(value){return sanitizeHTML(marked.parse(String(value||''),{async:false}),{allowedTags:['p','br','h2','h3','h4','ul','ol','li','strong','em','a','blockquote'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto','tel']});}
export function projectSections(record,order){
 const sections=(record.sections||[]).map((section,index)=>({...section,key:String(section.key||index)}));
 if(!order?.length)return sections;
 const seen=new Set();return [...order.flatMap(item=>{const part=sections.find(s=>s.key===item.sectionKey);if(!part||seen.has(part.key))return [];seen.add(part.key);return [part];}),...sections.filter(s=>!seen.has(s.key))];
}
export function projectPage(record){return withPortfolioCards({id:`reportage-${record.id}`,title:record.title,description:record.seoDescription||record.excerpt,root:{props:{title:record.seoTitle||record.title,description:record.seoDescription||record.excerpt}},content:[{type:'ProjectStory',props:{id:`project-${record.id}`,storyId:record.id,background:'white',crops:{},sectionOrder:[]}}]});}
export function projectMarkup(record,context,props={}){
 if(record?.published===false&&!context.preview)return '';
 if(!record)return context.preview?'<section class="sn-text-section"><p>Kies een trouwreportage uit Sveltia.</p></section>':'';
 const photo=(id,options={})=>imageMarkup({...props.crops?.[id],mediaId:id},context,options);
 const gallery=(ids,label='Fotogalerij')=>`<section class="sn-story-gallery" aria-label="${e(label)}">${ids.map((id,i)=>{const available=isMediaAvailable(context.media.find(a=>a.id===id),context.manifest);return available?`<button type="button" aria-label="Vergroot foto ${i+1}">${photo(id)}</button>`:`<div>${photo(id)}</div>`;}).join('')}</section>`;
 const button=(label,href)=>String(label||'').trim()&&safeURL(href,'')&&href!=='#'?`<a class="button" href="${e(safeURL(href,''))}"><span>${e(label)}</span><i aria-hidden="true">↗</i></a>`:'';
 const review=value=>value?.quote?.trim()?`<figure class="sn-project-review">${value.image?`<div class="sn-project-review-photo">${photo(value.image,{aspect:'1'})}</div>`:''}<div><span class="sn-review-mark" aria-hidden="true">“</span><blockquote>${e(value.quote).replace(/\n/g,'<br>')}</blockquote>${value.name?.trim()?`<figcaption>${e(value.name)}</figcaption>`:''}</div></figure>`:'';
 const parts=projectSections(record,props.sectionOrder).map(part=>{
  const heading=part.heading?.trim()?`<h2>${e(part.heading)}</h2>`:'',body=part.body?.trim()?`<div class="sn-project-prose">${projectProse(part.body)}</div>`:'';
  if(part.type==='gallery')return `${heading?`<div class="sn-project-chapter">${heading}${body}</div>`:body?`<div class="sn-project-chapter">${body}</div>`:''}${gallery(part.gallery||[],part.heading||'Fotogalerij')}`;
  if(part.type==='photo')return `<figure class="sn-project-wide">${photo(part.image)}${part.caption?.trim()?`<figcaption>${e(part.caption)}</figcaption>`:''}</figure>`;
  if(part.type==='pair')return `<div class="sn-project-pair">${photo(part.image)}${photo(part.secondImage)}</div>`;
  if(part.type==='textPhoto')return `<section class="sn-project-split"><div>${heading}${body}</div><figure>${photo(part.image,{aspect:'3/4'})}</figure></section>`;
  if(part.type==='review')return review({quote:part.quote,name:part.name,image:part.image});
  return `<section class="sn-project-chapter">${heading}${body}</section>`;
 }).join('');
 const suppliers=(record.suppliers||[]).filter(item=>item.name?.trim()).map(item=>`<li>${item.role?.trim()?`<span>${e(item.role)}</span>`:''}${safeURL(item.url,'')?`<a href="${e(safeURL(item.url,''))}">${e(item.name)} ↗</a>`:e(item.name)}</li>`).join('');
 const related=(record.related||[]).map(id=>(context.stories||[]).find(s=>s.id===id&&s.id!==record.id&&s.published!==false)).filter(Boolean);
 return `<article class="sn-project"><header class="sn-project-header"><div class="section-tag">${e(record.location||'Trouwreportage')}</div><h1>${e(record.title)}</h1>${record.couple?.trim()?`<p class="sn-project-couple">${e(record.couple)}</p>`:''}<p class="sn-project-intro">${e(record.excerpt)}</p></header><div class="sn-project-cover">${photo(record.cover,{eager:true})}</div>${record.body?.trim()?`<section class="sn-project-chapter sn-project-prose">${projectProse(record.body)}</section>`:''}${parts}${record.gallery?.length?gallery(record.gallery):''}${review(record.review)}${record.details?.trim()||suppliers?`<section class="sn-project-info"><h2>De plekken en mensen achter deze dag</h2>${record.details?.trim()?`<div class="sn-project-prose">${projectProse(record.details)}</div>`:''}${suppliers?`<ul>${suppliers}</ul>`:''}</section>`:''}${record.contactLabel?.trim()&&record.contactUrl?.trim()?`<section class="sn-project-contact"><h2>${e(record.contactTitle||'Ook jullie verhaal verdient het om bewaard te worden.')}</h2>${button(record.contactLabel,record.contactUrl)}</section>`:''}${related.length?`<section class="sn-project-related"><h2>Meer verhalen om in te duiken</h2><div>${related.map(story=>`<a href="reportage-${encodeURIComponent(story.id)}.html">${photo(story.cover)}<h3>${e(story.title)}</h3><p>${e(story.location)}</p></a>`).join('')}</div></section>`:''}<section class="sn-text-section">${button('← Terug naar de reportages','reportages.html')}</section></article>`;
}
