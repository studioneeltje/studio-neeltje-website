import {escapeHTML as e, safeURL, imageMarkup, videoMarkup, assetURL} from './media.mjs';

export function renderBlock(block, context) {
  const p = block.props || {};
  const spec = context.templates[block.type];
  if (!spec) throw new Error(`Onbekend blok: ${block.type}`);
  let html = spec.html;
  if (block.type === 'Video') html = `<section class="sn-video-section"><div class="section-tag">${e(p.eyebrow)}</div><h2>${e(p.title)}</h2>${videoMarkup(p.mediaId,context,p)}</section>`;
  else if (block.type === 'Photo') html = `<section class="sn-photo-section" style="--sn-aspect:${e(p.aspect || '3/2')}">${imageMarkup(p.image,context,{aspect:p.aspect || '3/2'})}${p.caption ? `<p>${e(p.caption)}</p>` : ''}</section>`;
  else if (block.type === 'Text') html = `<section class="sn-text-section"><div class="section-tag">${e(p.eyebrow)}</div><h2>${e(p.title)}</h2><p>${e(p.body).replace(/\n/g,'<br>')}</p></section>`;
  else {
    html = html.replace(/\{\{t:(\d+)\}\}/g,(_,key)=>e(p.texts?.[key]?.value ?? spec.defaults.texts?.[key]?.value ?? ''));
    const sizes={Hero:'100vw',Orbit:'(max-width: 760px) 150px, 280px',Mosaic:'(max-width: 760px) 88vw, 45vw',StoryCarousel:'(max-width: 760px) 70vw, 480px',Social:'(max-width: 760px) 45vw, 25vw',Wall:'(max-width: 760px) 40vw, 300px',Checklist:'(max-width: 760px) 88vw, 45vw',About:'(max-width: 760px) 88vw, 45vw',ContactCTA:'(max-width: 760px) 88vw, 400px'};
    html = html.replace(/\{\{image:(\d+)\}\}/g,(_,key)=>imageMarkup({...p.images?.[key]||spec.defaults.images?.[key],sizes:sizes[block.type]}, context,{eager:block.type === 'Hero' && Number(key) === 0,className:spec.imageClasses?.[key] || ''}));
    html = html.replace(/\{\{link:(\d+)\}\}/g,(_,key)=>e(safeURL(p.links?.[key]?.href ?? spec.defaults.links?.[key]?.href)));
    if (block.type === 'Stories') {
      const stories = context.stories.filter(s => s.published !== false);
      html = html.replace(/<!-- stories:start -->[\s\S]*?<!-- stories:end -->/, `<!-- stories:start -->${stories.map((story,i)=>`<a class="canvas-project" href="reportage-${e(story.id)}.html"><span>${String(i+1).padStart(2,'0')}</span><b>${e(story.title)}</b><i aria-hidden="true">↗</i>${imageMarkup({...p.crops?.[story.id],mediaId:story.cover,sizes:'210px'},context)}</a>`).join('')}<!-- stories:end -->`);
    }
    if (block.type === 'Journal') {
      html = html.replace(/<!-- articles:start -->[\s\S]*?<!-- articles:end -->/, `<!-- articles:start -->${context.articles.filter(a=>a.published!==false).map((article,i)=>`<a class="journal-card" href="artikel-${e(article.id)}.html"><div class="journal-card-visual">${imageMarkup({...p.crops?.[article.id],mediaId:article.cover,sizes:'(max-width: 780px) 88vw, 30vw'},context)}<span class="journal-card-number">${String(i+1).padStart(2,'0')} / ${e(article.category)}</span></div><div class="journal-card-meta"><span>${e(article.category)}</span><span>${e(article.readTime || '5 min lezen')}</span></div><h3>${e(article.title)}</h3><span class="journal-card-link"><span class="sn-link-label">Lees het artikel</span> <i aria-hidden="true">↗</i></span></a>`).join('')}<!-- articles:end -->`);
    }
  }
  if (block.type === 'Social') html = html.replace(/href="https:\/\/(?:www\.)?instagram\.com[^"]*"/g, `href="${e(safeURL(context.settings.instagram))}"`);
  const id = String(p.id || block.type).replace(/[^\w-]/g,'');
  // Original named anchors remain as data roles. Every instance gets unique IDs.
  html = html.replace(/\bid="([^"]+)"/g,(_,old)=>`id="${e(id)}-${e(old)}" data-role="${e(old)}"`)
    .replace(/(aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g,(_,attr,ids)=>`${attr}="${ids.split(' ').map(old=>`${id}-${old}`).join(' ')}"`);
  return `<div data-sn-block="${e(block.type)}" data-block-id="${e(id)}">${html}</div>`;
}

export function renderPage(page, context) {
  const ids = new Set();
  return page.content.map(block=>{
    const id=block.props?.id;
    if (!id || ids.has(id)) throw new Error('Ieder blok moet een unieke identificatie hebben.');
    ids.add(id);return renderBlock(block,context);
  }).join('\n');
}

export function renderHeader(settings) {
  const items = settings.navigation || [];
  return `<a class="sn-skip-link" href="#main-content">Naar de inhoud</a><header class="sn-header" id="mast"><a class="sn-brand" href="index.html" aria-label="Studio Neeltje — naar de homepage"><span class="sn-logo-crop"><img src="studio-neeltje-logo.png" width="101" height="77" alt="Studio Neeltje"></span><span class="sn-home-hint" aria-hidden="true">Naar home</span></a><button class="sn-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Menu openen" hidden>Menu <span aria-hidden="true">＋</span></button><nav class="sn-navigation" id="site-navigation" aria-label="Hoofdnavigatie">${items.map(item=>`<a data-page="${e(item.href?.replace(/\.html.*$/,''))}" ${item.kind !== 'link' ? `class="nav-${item.kind}" ` : ''}href="${e(safeURL(item.href))}">${e(item.label)}${item.kind !== 'link' ? ' <span aria-hidden="true">↗</span>' : ''}</a>`).join('')}</nav></header>`;
}

export function renderFooter(settings) {
  const f = settings.footer;
  return `<footer class="site-footer" id="footer"><div class="footer-stripe-line" aria-hidden="true"></div><div class="footer-top"><div><div class="footer-kicker">STUDIO NEELTJE / NIEUWSBRIEF</div><h2>${e(f.title)}<br><em>${e(f.emphasis)}</em></h2></div><div class="footer-cta-side"><p>${e(f.copy)}</p><form class="footer-newsletter-form" data-form="newsletter"><label for="newsletter-email">Jullie e-mailadres</label><input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="Jullie e-mailadres" required><button class="footer-cta" type="submit">${e(f.button)} <i aria-hidden="true">↗</i></button><p data-form-status hidden aria-live="polite"></p></form></div></div><div class="footer-menu"><div><h3>Ontdek</h3><nav aria-label="Ontdek">${settings.navigation.filter(n=>n.kind==='link').map(n=>`<a href="${e(safeURL(n.href))}">${e(n.label)}</a>`).join('')}</nav></div><div><h3>Studio</h3><nav><a href="weddingschecklist.html">Gratis trouwchecklist</a><a href="contact.html">Contact</a></nav></div><div><h3>Contact</h3><nav>${settings.email ? `<a href="mailto:${e(settings.email)}">${e(settings.email)}</a>` : '<a href="contact.html">Kennismaken ↗</a>'}${settings.phone ? `<a href="tel:${e(settings.phone.replace(/[^+\d]/g,''))}">${e(settings.phone)}</a>` : ''}<a href="#mast">Terug naar boven ↑</a></nav></div></div><div class="footer-bottom"><a href="index.html">Studio Neeltje</a><span>ECHT · ONGEDWONGEN · HELEMAAL JULLIE</span><span>© ${new Date().getFullYear()}</span></div></footer>`;
}
