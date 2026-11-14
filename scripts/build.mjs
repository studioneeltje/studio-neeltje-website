import {projectPage} from '../src/shared/project-story.mjs';
import {apacheRules,createRoutes,publicArticlePath,publicPagePath,publicStoryPath} from './public-routes.mjs';
import {THANKS_ROUTES,formSettingsScript} from '../src/shared/forms.mjs';
import fs from'node:fs/promises';
import path from'node:path';
import{createHash}from'node:crypto';
import{build as viteBuild}from'vite';
import{load}from'cheerio';
import{parse}from'yaml';
import{processMedia}from'./process-media.mjs';
import {keepPublicMedia} from './public-media.mjs';
import{renderPage,renderHeader,renderFooter}from'../src/shared/render.mjs';
import {renderArticle} from './render-article.mjs';
import{escapeHTML as e}from'../src/shared/media.mjs';

export async function loadCollection(name,root=process.cwd()){
 const dir=path.join(root,'content',name);const names=(await fs.readdir(dir)).filter(n=>n.endsWith('.json')).sort();return Promise.all(names.map(async n=>{const record=JSON.parse(await fs.readFile(path.join(dir,n),'utf8'));return ['articles','stories'].includes(name)?{...record,cmsSlug:n.slice(0,-5)}:record;}));
}
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const assetVersion=createHash('sha256').update((await Promise.all(['site/theme.css','assets/site.css','assets/blocks.css','assets/design.css','assets/checklist.css','assets/site.js','assets/blocks-runtime.js','assets/forms.js','assets/analytics.js'].map(p=>fs.readFile(p,'utf8')))).join('\n')).digest('hex').slice(0,12);
process.env.VITE_ASSET_VERSION=assetVersion;
// The existing editor build retains its media bank and previews.
const indexable=process.env.SITE_INDEXABLE==='1';
const staging=process.env.SITE_STAGING==='1';
const publicBuild=indexable||staging;
if(indexable&&staging)throw Error('Kies een testbouw of productiebouw.');
if(publicBuild&&!process.env.SITE_URL)throw Error('Vul het website-adres in bij SITE_URL.');
const out=staging?'dist-staging':indexable?'dist-production':'dist';
const siteURL=new URL(process.env.SITE_URL||'https://studioneeltje.github.io/studio-neeltje-website/');
if(!['https:','http:'].includes(siteURL.protocol))throw Error('SITE_URL moet een http(s)-adres zijn.');
siteURL.pathname=siteURL.pathname.replace(/\/?$/,'/');
siteURL.search='';siteURL.hash='';
const publicURL=relative=>new URL(relative,siteURL).href;
const sitePath=siteURL.pathname;
const routes=createRoutes({production:publicBuild,siteURL});
const routeFile=route=>path.join(out,route.file);
const formRoutes=publicBuild?Object.fromEntries(Object.entries(THANKS_ROUTES).map(([kind,file])=>[kind,sitePath+file.replace(/\.html$/,'')])):THANKS_ROUTES;

await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
const templates=await read('site/blocks.json'),settings=await read('content/settings/site.json'),mediaSettings=await read('content/settings/media.json');
const[media,pages,stories,articles]=await Promise.all(['media','pages','stories','articles'].map(n=>loadCollection(n)));
for(const color of Object.values(settings.colors))if(!/^#[\da-f]{6}$/i.test(color))throw Error('Kies volledige zescijferige huisstijlkleuren.');
for(const page of pages){if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(page.id))throw Error('Ongeldige paginanaam.');for(const block of page.content){if(!templates[block.type])throw Error('Onbekend blok.');if(block.type==='Video'&&!block.props.mediaId)throw Error(`${page.title}: kies een video voordat je publiceert.`);}}
for(const story of stories){const keys=(story.sections||[]).map((section,index)=>String(section.key||index));if(new Set(keys).size!==keys.length)throw Error(`${story.title}: geef ieder verhaalonderdeel een unieke korte naam.`);}
const manifest=await processMedia({outputDir:out,writeManifest:!publicBuild});
for(const asset of media){
 if(asset.captions&&!asset.deletedAt&&!manifest[asset.id]?.missing){const source=path.resolve(String(asset.captions).replace(/^\//,''));if(!source.startsWith(path.resolve('media/originals')+path.sep))throw Error('Ongeldig ondertitelpad.');const text=await fs.readFile(source,'utf8');if(!text.startsWith('WEBVTT'))throw Error('Ondertiteling moet een WebVTT-bestand zijn.');const target=`media/captions/${asset.id}.vtt`;await fs.mkdir(path.dirname(path.join(out,target)),{recursive:true});await fs.writeFile(path.join(out,target),text);manifest[asset.id].captions=target;}
}
function checkPhoto(id,label){const asset=media.find(a=>a.id===id);if(!asset){if(id)console.warn(`${label}: foto ontbreekt; een leeg fotovlak wordt getoond.`);return;}if(asset.kind!=='image')throw Error(`${label}: kies een foto in plaats van een video.`);}
for(const page of pages)for(const block of page.content){
 const selections=[...(block.props.images||[])];if(block.type==='Photo'||block.type==='ChecklistContents'&&block.props.image?.mediaId)selections.push(block.props.image);
 for(const image of selections)checkPhoto(image?.mediaId,`${page.title} · ${block.type}`);
 if(block.type==='Video'&&media.some(a=>a.id===block.props.mediaId&&a.kind!=='video'))throw Error(`${page.title}: kies een video.`);
}
for(const record of [...stories,...articles])if(record.published!==false){for(const id of [record.cover,record.hoverCover,record.review?.image,...(record.gallery||[]),...(record.sections||[]).flatMap(s=>[s.image,s.secondImage,...(s.gallery||[])])].filter(Boolean))checkPhoto(id,record.title);}
settings.editorial=await read('content/settings/editorial.json');
settings.contact=await read('content/settings/contact.json');
settings.legal=await read('content/settings/legal.json');
const reviewIds=new Set();
for(const review of settings.editorial.reviews){
 if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(review.id||'')||reviewIds.has(review.id))throw Error('Geef iedere review een unieke korte naam, zoals jeroen-martine.');
 reviewIds.add(review.id);
}
for(const review of settings.editorial.reviews)if(review.continuationOf&&(!reviewIds.has(review.continuationOf)||review.continuationOf===review.id))throw Error('Het gekoppelde vervolg hoort niet bij een bestaande andere review.');
for(const page of pages)for(const block of page.content)if(block.type==='SingleReview'&&block.props.reviewId&&!reviewIds.has(block.props.reviewId))throw Error(`${page.title}: kies een bestaande review in de losse quote.`);
settings.experience=await read('content/settings/experience.json');
settings.forms=await read('content/settings/forms.json');
if(staging){
 for(const kind of ['contact','checklist','newsletter'])settings.forms[kind]={provider:'none',endpoint:'',activated:false};
}
settings.analytics=await read('content/settings/analytics.json');
const analyticsEnabled=process.env.SITE_ANALYTICS==='1';
if(analyticsEnabled&&(!indexable||!/^G-[A-Z0-9]+$/.test(settings.analytics.measurementId)))throw Error('Analytics vereist een productiebuild met een geldig meet-ID.');
settings.checklist=await read('content/settings/checklist.json');
for(const [label,items]of [['voordelen',settings.checklist.contents.benefits],['herkenningspunten',settings.checklist.audience.points]]){
 if(![3,5,7].includes(items?.length))throw Error(`Trouwchecklist: kies 3, 5 of 7 ${label}.`);
 if(items.some(item=>!item.title?.trim()||!item.text?.trim()))throw Error(`Trouwchecklist: geef alle ${label} een titel en toelichting.`);
}
if(settings.checklist.contents.cover)checkPhoto(settings.checklist.contents.cover,'Coverfoto van de trouwchecklist');
if(settings.checklist.contents.sampleImage)checkPhoto(settings.checklist.contents.sampleImage,'Voorbeeldpagina van de trouwchecklist');
if(settings.forms.checklistFile){
 const source=path.resolve(String(settings.forms.checklistFile).replace(/^\//,''));
 const base=path.resolve('media/originals')+path.sep;
 if(!source.startsWith(base)||path.extname(source).toLowerCase()!=='.pdf')throw Error('Kies voor de trouwchecklist een PDF uit de uploads.');
 const real=await fs.realpath(source);if(!real.startsWith(base))throw Error('Ongeldig checklistbestand.');
 await fs.mkdir(path.join(out,'downloads'),{recursive:true});await fs.copyFile(real,path.join(out,'downloads/trouwchecklist.pdf'));settings.forms.checklistFile=(publicBuild?sitePath:'')+'downloads/trouwchecklist.pdf';
}
if(settings.experience.author.image)checkPhoto(settings.experience.author.image,'Auteursfoto');
for(const item of [...settings.editorial.cards,...settings.editorial.reviews])if(item.image)checkPhoto(item.image,'Informatiekaart of review');
const context={templates,settings,media,manifest,stories,articles};
const storyRoutes=new Map(),storyPageById=new Map(),storyPageIds=new Set();
const pageRoutes=new Map(),articleRoutes=new Map(),previewAliases=new Map();
const portfolioFiles=new Set();
for(const story of stories.filter(record=>record.published!==false)){
 const legacy=`reportage-${story.id}.html`;
 const ids=new Set([story.id,story.cmsSlug]);
 const alternatives=[...ids].flatMap(id=>[`reportage-${id}.html`,`pagina-reportage-${id}.html`]);
 // Custom Puck pages and historic filenames share the story's public address.
 for(const page of pages.filter(record=>record.id.startsWith('reportage-'))){
  const selected=page.content.find(block=>block.type==='ProjectStory')?.props?.storyId||page.id.slice('reportage-'.length);
  if(ids.has(selected))alternatives.push(`${page.id}.html`);
 }
 const route=routes.add({legacy,preferred:publicStoryPath(story),alternatives});
 storyRoutes.set(story.id,route);
 portfolioFiles.add(route.file);
 for(const alias of alternatives)previewAliases.set(alias,route);
}
for(const page of pages.filter(p=>p.id.startsWith('reportage-'))){
 const selected=page.content.find(block=>block.type==='ProjectStory')?.props?.storyId;
 const key=selected||page.id.slice('reportage-'.length);
 const story=stories.find(record=>record.id===key||record.cmsSlug===key);
 if(!story)continue;
 if(storyPageById.has(story.id))throw Error(`Meerdere Puck-pagina's voor dezelfde reportage: ${story.id}`);
 storyPageById.set(story.id,page);storyPageIds.add(page.id);

}
for(const page of pages.filter(record=>record.published!==false&&!storyPageIds.has(record.id))){
 const legacy=page.id==='home'?'index.html':`${page.id}.html`;
 const alternatives=page.id==='home'?['nieuwe-site.html']:page.id==='werkwijze'&&!pages.some(record=>record.id==='investering')?['investering.html']:page.id==='algemene-voorwaarden'?['privacy-beleid-1']:page.id==='veelgestelde-vragen'?['veelgestelde-vragen-trouwfotograaf.html']:[];
 const route=routes.add({legacy,preferred:publicPagePath(page.id),alternatives,indexable:!page.id.startsWith('bedankt-')&&page.root?.props?.searchVisibility!=='noindex'});
 pageRoutes.set(page.id,route);
 if(['portfolio','reportages'].includes(page.id))portfolioFiles.add(route.file);
 for(const alias of alternatives.filter(name=>name.endsWith('.html')))previewAliases.set(alias,route);
}
for(const article of articles.filter(record=>record.published!==false)){
 const legacy=`artikel-${article.id}.html`;
 const alternatives=[`artikel-${article.cmsSlug}.html`];
 const route=routes.add({legacy,preferred:publicArticlePath(article),alternatives});
 articleRoutes.set(article.id,route);
 for(const alias of alternatives)previewAliases.set(alias,route);
}
function reportagePage(page,storyId){
 return {...page,content:page.content.map(block=>block.type==='ProjectStory'?{...block,props:{...block.props,storyId}}:block)};
}
function redirectHTML(target){
 const script='location.replace('+JSON.stringify(target)+'+location.search+location.hash)';
 return '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url='+e(target)+'"><title>Pagina verplaatst — Studio Neeltje</title><script>'+script+'</script></head><body><a href="'+e(target)+'">Ga naar de pagina</a></body></html>';
}
const roleNames=[...new Set(Object.values(templates).flatMap(t=>[...t.html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])))];
function blockSelectors(css){for(const id of roleNames)css=css.replace(new RegExp('#'+id+'(?=[\\s.:,{>+~\\[])','g'),`[data-role="${id}"]`);return css;}

function brandCSS(css){for(const[from,to]of Object.entries({'#65001d':settings.colors.wine,'#fde6f2':settings.colors.pink,'#e8f2ff':settings.colors.blue,'#ff4802':settings.colors.orange}))css=css.replace(new RegExp(from,'gi'),to);return css;}
await fs.mkdir(path.join(out,'assets'),{recursive:true});
await fs.writeFile(path.join(out,'assets/theme.css'),brandCSS(blockSelectors((await fs.readFile('site/theme.css','utf8')).replace(/url\((["']?)(classic-photo-wall-v2\.png)\1\)/g,'url(../$2)'))));
for(const name of ['site.css','blocks.css','design.css','checklist.css'])await fs.writeFile(path.join(out,'assets',name),brandCSS(await fs.readFile('assets/'+name,'utf8')));
for(const name of ['site.js','blocks-runtime.js','forms.js','analytics.js'])await fs.copyFile('assets/'+name,path.join(out,'assets',name));
for(const name of ['studio-neeltje-logo.png','studio-neeltje-logo.svg','classic-photo-wall-v2.png'])await fs.copyFile(name,path.join(out,name));
await fs.writeFile(path.join(out,'.nojekyll'),'');
const fonts='https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Host+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Homemade+Apple&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Space+Grotesk:wght@400;500;600;700&display=swap';
function documentHTML(title,description,content,{route,kind}){
 const canonical='<link rel="canonical" href="'+e(publicURL(route.canonical))+'">';
 const analytics=JSON.stringify({...settings.analytics,enabled:analyticsEnabled,environment:indexable?'production':'preview',origin:siteURL.origin,pageType:kind,contactURL:sitePath+'contact',privacyURL:sitePath+'privacy-beleid'}).replace(/</g,'\\u003c');
 return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}">${!route.indexable||!indexable?'<meta name="robots" content="noindex,follow">':''}${canonical}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fonts}" rel="stylesheet"><link rel="stylesheet" href="assets/theme.css?v=${assetVersion}"><link rel="stylesheet" href="assets/site.css?v=${assetVersion}"><link rel="stylesheet" href="assets/blocks.css?v=${assetVersion}"><link rel="stylesheet" href="assets/design.css?v=${assetVersion}"><link rel="stylesheet" href="assets/checklist.css?v=${assetVersion}"><script src="assets/site.js?v=${assetVersion}" defer></script><script src="assets/blocks-runtime.js?v=${assetVersion}" defer></script><script src="assets/forms.js?v=${assetVersion}" defer></script><noscript><style>.review-line,.quote-note,.quote-handwritten,.portfolio-mosaic-item{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript></head><body class="theme-canvas sn-public">${renderHeader(settings)}<main id="main-content" tabindex="-1"><div class="mode mode-canvas active">${content}</div></main>${renderFooter(settings)}${formSettingsScript(settings,{routes:formRoutes})}<script id="sn-analytics-settings" type="application/json">${analytics}</script><script src="assets/analytics.js?v=${assetVersion}" defer></script></body></html>`;}
const previewRoutes={
 reportages:'reportages',over:'over',werkwijze:'werkwijze',journal:'journal',contact:'contact',
 checklist:'weddingschecklist',leveranciers:'leveranciers',kasteel:'reportage-keukenhof',
 dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga',castricum:'reportage-castricum',
};
function routeHref(href){
 const result=routes.resolve(href);
 if(!result)return href;
 return (publicBuild?sitePath+result.route.canonical:result.route.file)+result.suffix;
}
function siteAsset(value){
 return publicBuild&&/^(?:assets\/|media\/|downloads\/|studio-neeltje-logo\.|classic-photo-wall-v2\.)/.test(value)?sitePath+value:value;
}
function fixLinks(html){
 const $=load(html);
 $('a[href]').each((_,el)=>{
  const a=$(el);
  let href=a.attr('href');
  if(href.startsWith('preview-pagina.html?')){
   const url=new URL(href,siteURL),id=url.searchParams.get('pagina'),article=url.searchParams.get('artikel');
   href=`${article?'artikel-'+article:previewRoutes[id]||id||'reportages'}.html${url.hash}`;
  }
  a.attr('href',routeHref(href));
  if(a.closest('.orbit-card').length){
   const img=a.find('img');
   if(img.is('[data-sn-missing]'))a.removeAttr('href').attr('aria-disabled','true');
   else if(img.length)a.attr('href',img.attr('data-full-src')||img.attr('src'));
  }
 });
 $('[data-story-href]').each((_,el)=>{
  const slide=$(el);
  slide.attr('data-story-href',routeHref(slide.attr('data-story-href')));
 });
 if(publicBuild){
  for(const attribute of ['src','href','poster','data-full-src','data-poster-src','data-animated-src']){
   $(`[${attribute}]`).each((_,element)=>$(element).attr(attribute,siteAsset($(element).attr(attribute))));
  }
  $('source[srcset],img[srcset]').each((_,element)=>{
   const srcset=$(element).attr('srcset');
   if(srcset.startsWith('data:'))return;
   $(element).attr('srcset',srcset.split(',').map(candidate=>candidate.trim().replace(/^\S+/,siteAsset)).join(', '));
  });
 }
 return $.html();
}
function storySocialHTML(story,canonical,title,description){
 const cover=manifest[story.cover];
 const image=cover?.variants?.find(item=>item.format==='webp'&&item.width>=1280)?.src||cover?.src;
 const alt=media.find(asset=>asset.id===story.cover)?.alt||story.title;
 const properties={'og:type':'article','og:url':publicURL(canonical),'og:title':title,'og:description':description};
 if(image){
  properties['og:image']=publicURL(image);
  properties['og:image:alt']=alt;
 }
 return Object.entries(properties).map(([key,value])=>`<meta property="${key}" content="${e(value)}">`).join('');
}
async function writePage(route,html){
 await fs.mkdir(path.dirname(routeFile(route)),{recursive:true});
 await fs.writeFile(routeFile(route),fixLinks(html));
}
for(const page of pages){
 const route=pageRoutes.get(page.id);
 if(!route)continue;
 const title=page.root?.props?.seoTitle||page.root?.props?.title||page.title;
 const description=page.root?.props?.description||page.description||'';
 await writePage(route,documentHTML(title,description,renderPage(page,context),{route,kind:'page'}));
}
for(const [collection,prefix]of [[stories,'reportage'],[articles,'artikel']])for(const record of collection.filter(r=>r.published!==false)){
 if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(record.id))throw Error('Ongeldige URL voor een reportage of artikel.');
 const custom=prefix==='reportage'?storyPageById.get(record.id):null;
 const content=prefix==='artikel'?renderArticle(record,context):custom?renderPage(reportagePage(custom,record.id),context):renderPage(projectPage(record),context);
 const title=record.seoTitle||record.title,description=record.seoDescription||record.excerpt;
 const route=prefix==='reportage'?storyRoutes.get(record.id):articleRoutes.get(record.id);
 let html=documentHTML(title,description,content,{route,kind:prefix==='reportage'?'story':'article'});
 if(prefix==='reportage')html=html.replace('</head>',storySocialHTML(record,route.canonical,title,description)+'</head>');
 await writePage(route,html);
}
if(publicBuild){
 await fs.writeFile(path.join(out,'_redirects'),routes.redirectRules().join('\n')+'\n');
 await fs.writeFile(path.join(out,'.htaccess'),apacheRules(routes,sitePath,staging));
}else{
 for(const [alias,route] of previewAliases){
  if(alias!==route.file)await fs.writeFile(path.join(out,alias),redirectHTML(route.file));
 }
}
// The sitemap lists only the preferred addresses of public, indexable pages.
const searchablePages=indexable?[...routes.files.values()].filter(route=>route.indexable).map(route=>route.canonical):[];
const xmlEscape=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
await fs.writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...new Set(searchablePages)].map(file=>'  <url><loc>'+xmlEscape(publicURL(file==='index.html'?'':file))+'</loc></url>').join('\n')+'\n</urlset>\n');
await fs.writeFile(path.join(out,'robots.txt'),indexable?'User-agent: *\nAllow: /\nSitemap: '+publicURL('sitemap.xml')+'\n':'User-agent: *\nDisallow: '+sitePath+'\n');

const previewLinks=Object.fromEntries(Object.entries(previewRoutes).map(([id,stem])=>[id,routeHref(stem+'.html')]));
await fs.writeFile(path.join(out,'preview-pagina.html'),`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Studio Neeltje</title><script>const r=${JSON.stringify(previewLinks)};const p=new URLSearchParams(location.search).get('pagina')||'reportages';location.replace((r[p]||r.reportages)+location.hash);</script></head><body><a href="index.html">Naar de homepage</a></body></html>`);
if(publicBuild){
 const notFound=`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Pagina niet gevonden | Studio Neeltje</title><link rel="stylesheet" href="${e(sitePath)}assets/site.css"><link rel="stylesheet" href="${e(sitePath)}assets/blocks.css"></head><body class="theme-canvas sn-public"><main class="mode mode-canvas active"><section class="sn-text-section"><h1>Pagina niet gevonden</h1><p>Deze pagina is verhuisd of verwijderd.</p><a class="button" href="${e(sitePath)}">Terug naar de homepage</a></section></main></body></html>`;
 await fs.writeFile(path.join(out,'404.html'),notFound);
 if(staging)await fs.writeFile(path.join(out,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n');
 const mediaReferences=[...routes.files.keys(),...((await fs.readdir(path.join(out,'assets'))).map(file=>'assets/'+file))];
 const {retained,removed}=await keepPublicMedia(out,mediaReferences);
 console.log(`Openbaar pakket: ${retained} gebruikte mediabestanden, ${removed} overige varianten weggelaten.`);
}else{
 await fs.mkdir(path.join(out,'content'),{recursive:true});
 await fs.writeFile(path.join(out,'content/bundle.json'),JSON.stringify({...context,pages:[...pages,...stories.filter(story=>story.published!==false&&!storyPageById.has(story.id)).map(projectPage)],mediaSettings}));
 await fs.mkdir(path.join(out,'cms/vendor'),{recursive:true});
 await fs.cp('node_modules/@sveltia/cms/dist',path.join(out,'cms/vendor'),{recursive:true,filter:source=>!source.endsWith('.map')&&!source.endsWith('.mjs')});
 const cmsConfig=(await fs.readFile('cms/config.yml','utf8')).replace(/max_file_size: \d+/,`max_file_size: ${mediaSettings.maxUploadMB*1024*1024}`);
 parse(cmsConfig);
 await fs.writeFile(path.join(out,'cms/config.yml'),cmsConfig);
}
// SEO consistency audit of the generated HTML, before uploading the preview.
// Avoid false positives from external websites, mailto links and in-page anchors.
const auditFiles=[...routes.files.keys()];
const seenPortfolioTitles=new Set(),seenPortfolioDescriptions=new Set();
let headingProblems=0,brokenLinks=0,portfolioProblems=0;
for(const file of auditFiles){
 const html=await fs.readFile(path.join(out,file),'utf8');
 const $=load(html);
 const isCore=routes.files.get(file).indexable;
 if(isCore&&!$('meta[http-equiv="refresh"]').length){
  const count=$('main h1').length;
  if(count!==1){headingProblems++;console.warn(`SEO audit: ${file} heeft ${count} H1-koppen (verwacht 1).`);}
 }
 if(portfolioFiles.has(file)){
  const title=$('title').text().trim(),description=$('meta[name="description"]').attr('content')?.trim();
  if(!title||!description||seenPortfolioTitles.has(title)||seenPortfolioDescriptions.has(description)){
   portfolioProblems++;console.warn(`SEO audit: ${file} mist een unieke titel of omschrijving.`);
  }
  seenPortfolioTitles.add(title);seenPortfolioDescriptions.add(description);
  let previous=0;
  $('main :is(h1,h2,h3,h4,h5,h6)').each((_,heading)=>{
   const level=Number(heading.tagName.slice(1));
   if(level>previous+1||!$(heading).text().trim()){
    portfolioProblems++;console.warn(`SEO audit: ${file} heeft een lege kop of een sprong naar H${level}.`);
   }
   previous=level;
  });
  if(!$('main h2').length){portfolioProblems++;console.warn(`SEO audit: ${file} mist een H2-kop.`);}
 }
 $('a[href], [data-story-href]').each((_,link)=>{
  const href=$(link).attr('href')||$(link).attr('data-story-href')||'';
  if(!href||href.startsWith('#'))return;
  const resolved=routes.resolve(href);
  if(resolved)return;
  if(/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href))return;
  const hrefPath=href.split(/[?#]/)[0];
  if(!hrefPath.endsWith('.html'))return;
  brokenLinks++;
  console.warn(`SEO audit: ${file} verwijst naar ontbrekende pagina ${hrefPath}.`);
 });
}
console.log(`SEO audit: ${auditFiles.length} HTML-pagina's gecontroleerd, ${headingProblems} H1-meldingen en ${brokenLinks} ontbrekende interne paginalinks.`);
if(headingProblems||brokenLinks||portfolioProblems)throw Error('SEO audit: herstel de gemelde problemen vóór publicatie.');
if(!publicBuild)await viteBuild();
console.log(`Gebouwd: ${pages.length} Puck-pagina's, ${stories.length} reportages en ${articles.length} artikelen.`);
