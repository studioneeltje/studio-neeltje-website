import {orbitGalleryMarkup} from './orbit-gallery.mjs';
import {projectMarkup} from './project-story.mjs';
import {prepareForms} from './forms.mjs';
import {checklistContentsMarkup,checklistAudienceMarkup} from './checklist.mjs';
import {journeyMarkup,thankYouMarkup} from './experience.mjs';
import {infoCardsMarkup,reviewCardsMarkup,singleReviewMarkup,removeEmptyButtons} from './editorial.mjs';
import {articleReadTime} from './article-data.mjs';
import {BACKGROUNDS} from './themes.mjs';
import {tiltCardMarkup} from './tilt-card.mjs';
import {imageSlots} from './image-slots.mjs';
import {fanGalleryMarkup} from './fan-gallery.mjs';
import {storyCarouselMarkup} from './story-carousel.mjs';
import {escapeHTML as e, safeURL, imageMarkup, videoMarkup, assetURL} from './media.mjs';

export function renderBlock(block, context) {
  const p = block.props || {};
  const spec = context.templates[block.type];
  if (!spec) throw new Error(`Onbekend blok: ${block.type}`);
  let html = spec.html;
  if(block.type==='ProjectStory') html=projectMarkup(context.stories?.find(story=>story.id===p.storyId),context,p);
  else if(block.type==='TiltCard') html=tiltCardMarkup(p);
  else if(block.type==='Orbit') html=orbitGalleryMarkup(p,context);
  else if(block.type==='FanGallery') html=fanGalleryMarkup(p,context);
  else if(block.type==='StoryCarousel'&&['all','selected'].includes(p.storySource)) html=storyCarouselMarkup(p,context);
  else if(block.type==='ChecklistContents') html=checklistContentsMarkup(p,context);
  else if(block.type==='ChecklistAudience') html=checklistAudienceMarkup(p,context);
  else if(block.type==='ThankYou') html=thankYouMarkup(p.kind||'contact',context);
  else if(block.type==='Journey') html=journeyMarkup(p,context);
  else if (block.type === 'InfoCards') html=infoCardsMarkup(p,context);
  else if(block.type === 'Review') html=reviewCardsMarkup(p,context);
  else if(block.type === 'SingleReview') html=singleReviewMarkup(p,context);
  else if (block.type === 'Video') html = `<section class="sn-video-section"><div class="section-tag">${e(p.eyebrow)}</div><h2>${e(p.title)}</h2>${videoMarkup(p.mediaId,context,p)}</section>`;
  else if (block.type === 'Photo') html = `<section class="sn-photo-section" style="--sn-aspect:${e(p.aspect || '3/2')}">${imageMarkup(p.image,context,{aspect:p.aspect || '3/2'})}${p.caption ? `<p>${e(p.caption)}</p>` : ''}</section>`;
  else if (block.type === 'Text') html = `<section class="sn-text-section"><div class="section-tag">${e(p.eyebrow)}</div><h2>${e(p.title)}</h2><p>${e(p.body).replace(/\n/g,'<br>')}</p></section>`;
  else {
    html = html.replace(/\{\{t:(\d+)\}\}/g,(_,key)=>e(p.texts?.[key]?.value ?? spec.defaults.texts?.[key]?.value ?? ''));
    const sizes={Hero:'100vw',Orbit:'(max-width: 760px) 150px, 280px',Mosaic:'(max-width: 760px) 88vw, 45vw',StoryCarousel:'(max-width: 760px) 70vw, 480px',Social:'(max-width: 760px) 45vw, 25vw',Wall:'(max-width: 760px) 40vw, 300px',Checklist:'(max-width: 760px) 88vw, 45vw',About:'(max-width: 760px) 88vw, 45vw',ContactCTA:'(max-width: 760px) 88vw, 400px'};
    html = html.replace(/\{\{image:(\d+)\}\}/g,(_,key)=>{
      const selection=imageSlots(p.images,spec.defaults.images)[key];
      const image=imageMarkup({...selection,sizes:sizes[block.type]},context,{eager:block.type==='Hero'&&Number(key)===0,className:block.type==='Wall'?'':spec.imageClasses?.[key]||''});
      if(block.type!=='Wall')return image;
      const asset=context.media.find(asset=>asset.id===selection?.mediaId);
      return asset&&!asset.deletedAt?`<button type="button" class="sn-wall-open ${e(spec.imageClasses?.[key]||'')}" aria-label="Vergroot foto: ${e(asset.alt||asset.title)}" aria-haspopup="dialog">${image}</button>`:`<span class="sn-wall-open ${e(spec.imageClasses?.[key]||'')}">${image}</span>`;
    });
    html = html.replace(/\{\{link:(\d+)\}\}/g,(_,key)=>e(safeURL(p.links?.[key]?.href ?? spec.defaults.links?.[key]?.href)));
    if (block.type === 'Stories') {
      const stories = context.stories.filter(s => s.published !== false);
      html = html.replace(/<!-- stories:start -->[\s\S]*?<!-- stories:end -->/, `<!-- stories:start -->${stories.map((story,i)=>{
        return `<a class="canvas-project sn-story-row" href="reportage-${e(story.id)}.html"><span class="sn-story-index">${String(i+1).padStart(2,'0')}</span><b>${e(story.title)}</b><span class="sn-story-location">${e(story.location||'Trouwreportage')}</span><i aria-hidden="true">↗</i><div class="sn-story-hover-photo">${imageMarkup({...p.crops?.[story.id],mediaId:story.cover,sizes:'(max-width: 760px) 90vw, 420px'},context)}</div></a>`;
      }).join('')}<!-- stories:end -->`);
    }
    if (block.type === 'Journal') {
      html = html.replace(/<!-- articles:start -->[\s\S]*?<!-- articles:end -->/, `<!-- articles:start -->${context.articles.filter(a=>a.published!==false).map((article,i)=>`<a class="journal-card" href="artikel-${e(article.id)}.html">${article.cover?`<div class="journal-card-visual">${imageMarkup({...p.crops?.[article.id],mediaId:article.cover,sizes:'(max-width: 780px) 88vw, 30vw'},context)}</div>`:''}<div class="journal-card-meta"><span>${e(article.category)}</span><span>${articleReadTime(article)}</span></div><h3>${e(article.title)}</h3><span class="journal-card-link"><span class="sn-link-label">Lees het artikel</span> <i aria-hidden="true">↗</i></span></a>`).join('')}<!-- articles:end -->`);
    }
  }
  if(block.type==='ContactForm'&&p.formKind==='checklist')html=html.replace(/<label[^>]*>[\s\S]*?<\/label>/g,label=>/name="(?:date|location|message)"/.test(label)?'':label);
  if (block.type === 'About') {
    const note=context.settings.aboutPhotoNote;
    const position=note?.position==='below'?'below':'inside';
    html=html.replace('class="about-split-photo"',`class="about-split-photo" data-note-position="${position}"`);
    if(note){
      const markup=note.enabled!==false && String(note.text||'').trim() ? `<span class="about-photo-note">${e(note.text)}</span>` : '';
      html=html.replace(/<span class="about-photo-note">[\s\S]*?<\/span>/,markup);
    }
  }
  if (block.type === 'Social') html = html.replace(/href="https:\/\/(?:www\.)?instagram\.com[^"]*"/g, `href="${e(safeURL(context.settings.instagram))}"`);
  html=prepareForms(removeEmptyButtons(html),context.settings,{preview:context.preview,defaultKind:p.formKind||'contact'});
  const id = String(p.id || block.type).replace(/[^\w-]/g,'');
  // Original named anchors remain as data roles. Every instance gets unique IDs.
  html = html.replace(/\bid="([^"]+)"/g,(_,old)=>`id="${e(id)}-${e(old)}" data-role="${e(old)}"`)
    .replace(/(aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g,(_,attr,ids)=>`${attr}="${ids.split(' ').map(old=>`${id}-${old}`).join(' ')}"`);
  return `<div data-sn-block="${e(block.type)}" data-block-id="${e(id)}"${BACKGROUNDS.includes(p.background)?` data-sn-theme="${p.background}"`:''}>${html}</div>`;
}

export function renderPage(page, context) {
  const ids = new Set();
  let checklistAnchor=false;
  return page.content.map(block=>{
    const id=block.props?.id;
    if (!id || ids.has(id)) throw new Error('Ieder blok moet een unieke identificatie hebben.');
    ids.add(id);
    const anchor=block.type==='ContactForm'&&block.props.formKind==='checklist'&&!checklistAnchor?'<span class="sn-checklist-form-anchor" id="checklist-aanvragen" aria-hidden="true"></span>':'';
    if(anchor)checklistAnchor=true;
    return anchor+renderBlock(block,context);
  }).join('\n');
}

export function renderHeader(settings) {
  const items = (settings.navigation || []).filter(item=>item.label?.trim()&&safeURL(item.href,'')&&safeURL(item.href,'')!=='#');
  const menu=items.filter(item=>item.kind==='link');
  const actions=items.filter(item=>item.kind!=='link');
  const link=item=>`<a data-page="${e(item.href?.replace(/\.html.*$/,''))}" href="${e(safeURL(item.href))}">${e(item.label)}</a>`;
  return `<a class="sn-skip-link" href="#main-content">Naar de inhoud</a><header class="sn-header" id="mast"><a class="sn-brand" href="index.html" aria-label="Studio Neeltje — naar de homepage"><span class="sn-logo-crop"><img src="studio-neeltje-logo.svg" width="64" height="64" alt="Studio Neeltje"></span><span class="sn-home-hint" aria-hidden="true">Naar home</span></a><nav class="sn-navigation" id="site-navigation" aria-label="Hoofdnavigatie">${menu.map(link).join('')}</nav><div class="sn-header-actions" aria-label="Snel naar"><!-- Always visible, outside the collapsible navigation. -->${actions.map(item=>`<a class="sn-header-action nav-${e(item.kind)}" href="${e(safeURL(item.href))}">${e(item.kind==='checklist'?'Gratis trouwchecklist':item.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div><button class="sn-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Menu openen" hidden>Menu <span aria-hidden="true">＋</span></button></header>`;
}

export function renderFooter(settings) {
  const f = settings.footer;
  return prepareForms(`<footer class="site-footer" id="footer"><div class="footer-stripe-line" aria-hidden="true"></div><div class="footer-top"><div><div class="footer-kicker">STUDIO NEELTJE / NIEUWSBRIEF</div><h2>${e(f.title)}<br><em>${e(f.emphasis)}</em></h2></div><div class="footer-cta-side"><p>${e(f.copy)}</p><form class="footer-newsletter-form" data-form="newsletter"><label for="newsletter-email">Jullie e-mailadres</label><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Jullie e-mailadres" required><button class="footer-cta" type="submit">${e(f.button)} <i aria-hidden="true">↗</i></button><p data-form-status hidden aria-live="polite"></p></form></div></div><div class="footer-menu"><div><h3>Ontdek</h3><nav aria-label="Ontdek">${settings.navigation.filter(n=>n.kind==='link').map(n=>`<a href="${e(safeURL(n.href))}">${e(n.label)}</a>`).join('')}</nav></div><div><h3>Studio</h3><nav><a href="weddingschecklist.html">Gratis trouwchecklist</a><a href="contact.html">Contact</a></nav></div><div><h3>Contact</h3><nav>${settings.email ? `<a href="mailto:${e(settings.email)}">${e(settings.email)}</a>` : '<a href="contact.html">Kennismaken ↗</a>'}${settings.phone ? `<a href="tel:${e(settings.phone.replace(/[^+\d]/g,''))}">${e(settings.phone)}</a>` : ''}<a href="#mast">Terug naar boven ↑</a></nav></div></div><div class="footer-bottom"><a href="index.html">Studio Neeltje</a><span>ECHT · ONGEDWONGEN · HELEMAAL JULLIE</span><span>© ${new Date().getFullYear()}</span></div></footer>`,settings);
}
