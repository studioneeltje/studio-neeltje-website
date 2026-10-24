import {projectMarkup,projectPage} from '../src/shared/project-story.mjs';
import {formSettingsScript} from '../src/shared/forms.mjs';
import fs from'node:fs/promises';
import path from'node:path';
import{createHash}from'node:crypto';
import{build as viteBuild}from'vite';
import{load}from'cheerio';
import{parse}from'yaml';
import{marked}from'marked';
import sanitizeHTML from'sanitize-html';
import{processMedia}from'./process-media.mjs';
import{renderPage,renderHeader,renderFooter}from'../src/shared/render.mjs';
import {renderArticle} from './render-article.mjs';
import{imageMarkup,escapeHTML as e}from'../src/shared/media.mjs';

export async function loadCollection(name,root=process.cwd()){
 const dir=path.join(root,'content',name);const names=(await fs.readdir(dir)).filter(n=>n.endsWith('.json')).sort();return Promise.all(names.map(async n=>JSON.parse(await fs.readFile(path.join(dir,n),'utf8'))));
}
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const assetVersion=createHash('sha256').update((await Promise.all(['site/theme.css','assets/site.css','assets/blocks.css','assets/design.css','assets/checklist.css','assets/site.js','assets/blocks-runtime.js','assets/forms.js'].map(p=>fs.readFile(p,'utf8')))).join('\n')).digest('hex').slice(0,12);
process.env.VITE_ASSET_VERSION=assetVersion;
const out='dist';
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
const templates=await read('site/blocks.json'),settings=await read('content/settings/site.json'),mediaSettings=await read('content/settings/media.json');
const[media,pages,stories,articles]=await Promise.all(['media','pages','stories','articles'].map(n=>loadCollection(n)));
for(const color of Object.values(settings.colors))if(!/^#[\da-f]{6}$/i.test(color))throw Error('Kies volledige zescijferige huisstijlkleuren.');
for(const page of pages){if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(page.id))throw Error('Ongeldige paginanaam.');for(const block of page.content){if(!templates[block.type])throw Error('Onbekend blok.');if(block.type==='Video'&&!block.props.mediaId)throw Error(`${page.title}: kies een video voordat je publiceert.`);}}
for(const story of stories){const keys=(story.sections||[]).map((section,index)=>String(section.key||index));if(new Set(keys).size!==keys.length)throw Error(`${story.title}: geef ieder verhaalonderdeel een unieke korte naam.`);}
const manifest=await processMedia();
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
const reviewIds=new Set();
for(const review of settings.editorial.reviews){
 if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(review.id||'')||reviewIds.has(review.id))throw Error('Geef iedere review een unieke korte naam, zoals jeroen-martine.');
 reviewIds.add(review.id);
}
for(const review of settings.editorial.reviews)if(review.continuationOf&&(!reviewIds.has(review.continuationOf)||review.continuationOf===review.id))throw Error('Het gekoppelde vervolg hoort niet bij een bestaande andere review.');
for(const page of pages)for(const block of page.content)if(block.type==='SingleReview'&&block.props.reviewId&&!reviewIds.has(block.props.reviewId))throw Error(`${page.title}: kies een bestaande review in de losse quote.`);
settings.experience=await read('content/settings/experience.json');
settings.forms=await read('content/settings/forms.json');
settings.checklist=await read('content/settings/checklist.json');
for(const [label,items]of [['voordelen',settings.checklist.contents.benefits],['herkenningspunten',settings.checklist.audience.points]]){
 if(![3,5,7].includes(items?.length))throw Error(`Trouwchecklist: kies 3, 5 of 7 ${label}.`);
 if(items.some(item=>!item.title?.trim()||!item.text?.trim()))throw Error(`Trouwchecklist: geef alle ${label} een titel en toelichting.`);
}
if(settings.checklist.contents.cover)checkPhoto(settings.checklist.contents.cover,'Coverfoto van de trouwchecklist');
if(settings.forms.checklistFile){
 const source=path.resolve(String(settings.forms.checklistFile).replace(/^\//,''));
 const base=path.resolve('media/originals')+path.sep;
 if(!source.startsWith(base)||path.extname(source).toLowerCase()!=='.pdf')throw Error('Kies voor de trouwchecklist een PDF uit de uploads.');
 const real=await fs.realpath(source);if(!real.startsWith(base))throw Error('Ongeldig checklistbestand.');
 await fs.mkdir(path.join(out,'downloads'),{recursive:true});await fs.copyFile(real,path.join(out,'downloads/trouwchecklist.pdf'));settings.forms.checklistFile='downloads/trouwchecklist.pdf';
}
if(settings.experience.author.image)checkPhoto(settings.experience.author.image,'Auteursfoto');
for(const item of [...settings.editorial.cards,...settings.editorial.reviews])if(item.image)checkPhoto(item.image,'Informatiekaart of review');
const context={templates,settings,media,manifest,stories,articles};
const roleNames=[...new Set(Object.values(templates).flatMap(t=>[...t.html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])))];
function blockSelectors(css){for(const id of roleNames)css=css.replace(new RegExp('#'+id+'(?=[\\s.:,{>+~\\[])','g'),`[data-role="${id}"]`);return css;}

function brandCSS(css){for(const[from,to]of Object.entries({'#65001d':settings.colors.wine,'#fde6f2':settings.colors.pink,'#e8f2ff':settings.colors.blue,'#ff4802':settings.colors.orange}))css=css.replace(new RegExp(from,'gi'),to);return css;}
await fs.mkdir(path.join(out,'assets'),{recursive:true});
await fs.writeFile(path.join(out,'assets/theme.css'),brandCSS(blockSelectors((await fs.readFile('site/theme.css','utf8')).replace(/url\((["']?)(classic-photo-wall-v2\.png)\1\)/g,'url(../$2)'))));
for(const name of ['site.css','blocks.css','design.css','checklist.css'])await fs.writeFile(path.join(out,'assets',name),brandCSS(await fs.readFile('assets/'+name,'utf8')));
for(const name of ['site.js','blocks-runtime.js','forms.js'])await fs.copyFile('assets/'+name,path.join(out,'assets',name));
for(const name of ['studio-neeltje-logo.png','studio-neeltje-logo.svg','classic-photo-wall-v2.png'])await fs.copyFile(name,path.join(out,name));
await fs.writeFile(path.join(out,'.nojekyll'),'');
const fonts='https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Host+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Homemade+Apple&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Space+Grotesk:wght@400;500;600;700&display=swap';
function documentHTML(title,description,content,{noindex=false}={}){return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}">${noindex?'<meta name="robots" content="noindex,follow">':''}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fonts}" rel="stylesheet"><link rel="stylesheet" href="assets/theme.css?v=${assetVersion}"><link rel="stylesheet" href="assets/site.css?v=${assetVersion}"><link rel="stylesheet" href="assets/blocks.css?v=${assetVersion}"><link rel="stylesheet" href="assets/design.css?v=${assetVersion}"><link rel="stylesheet" href="assets/checklist.css?v=${assetVersion}"><script src="assets/site.js?v=${assetVersion}" defer></script><script src="assets/blocks-runtime.js?v=${assetVersion}" defer></script><script src="assets/forms.js?v=${assetVersion}" defer></script><noscript><style>.review-line,.quote-note,.quote-handwritten,.portfolio-mosaic-item{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript></head><body class="theme-canvas sn-public">${renderHeader(settings)}<main id="main-content" tabindex="-1"><div class="mode mode-canvas active">${content}</div></main>${renderFooter(settings)}${formSettingsScript(settings)}</body></html>`;}
function fixLinks(html){const $=load(html);$('a').each((_,el)=>{const a=$(el),href=a.attr('href')||'';if(href.includes('preview-pagina.html?')){const url=new URL(href,'https://example.test/');const id=url.searchParams.get('pagina'),article=url.searchParams.get('artikel');const map={kasteel:'reportage-keukenhof',dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga',checklist:'weddingschecklist'};a.attr('href',`${article?'artikel-'+article:map[id]||id||'reportages'}.html${url.hash}`);}if(a.closest('.orbit-card').length){const img=a.find('img');if(img.is('[data-sn-missing]')){a.removeAttr('href').attr('aria-disabled','true');}else if(img.length)a.attr('href',img.attr('data-full-src')||img.attr('src'));}});return $.html();}
for(const page of pages){const html=fixLinks(documentHTML(page.root?.props?.title||page.title,page.root?.props?.description||page.description||'',renderPage(page,context),{noindex:page.id.startsWith('bedankt-')}));const file=page.id==='home'?'index.html':`${page.id}.html`;await fs.writeFile(path.join(out,file),html);if(page.id==='home')await fs.writeFile(path.join(out,'nieuwe-site.html'),html);}
function prose(value){return sanitizeHTML(marked.parse(String(value||''),{async:false}),{allowedTags:['p','br','h2','h3','h4','ul','ol','li','strong','em','a','blockquote'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto','tel']});}
for(const [collection,prefix]of [[stories,'reportage'],[articles,'artikel']])for(const record of collection.filter(r=>r.published!==false)){
 if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(record.id))throw Error('Ongeldige URL voor een reportage of artikel.');
 const custom=prefix==='reportage'?pages.find(page=>page.id===`reportage-${record.id}`):null;
 const content=prefix==='artikel'?renderArticle(record,context):custom?renderPage(custom,context):renderPage(projectPage(record),context);
 const title=record.seoTitle||record.title,description=record.seoDescription||record.excerpt;
 await fs.writeFile(path.join(out,`${prefix}-${record.id}.html`),documentHTML(title,description,content));
 if(prefix==='reportage')await fs.writeFile(path.join(out,`pagina-reportage-${record.id}.html`),documentHTML(title,description,content));
}
// The shared Sveltia card links to investering.html; retain that URL while
// the existing investment page is still stored under its historic route.
if(pages.some(page=>page.id==='werkwijze')&&!pages.some(page=>page.id==='investering'))await fs.writeFile(path.join(out,'investering.html'),'<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=werkwijze.html"><title>Investering — Studio Neeltje</title><script>location.replace("werkwijze.html"+location.search+location.hash);</script></head><body><a href="werkwijze.html">Bekijk pakketten en investering</a></body></html>');
const routes={reportages:'reportages',over:'over',werkwijze:'werkwijze',journal:'journal',contact:'contact',checklist:'weddingschecklist',leveranciers:'leveranciers',kasteel:'reportage-keukenhof',dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga'};
await fs.writeFile(path.join(out,'preview-pagina.html'),`<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Studio Neeltje</title><script>const r=${JSON.stringify(routes)};const p=new URLSearchParams(location.search).get('pagina')||'reportages';location.replace((r[p]||r.reportages)+'.html'+location.hash);</script></head><body><a href="index.html">Naar de homepage</a></body></html>`);
await fs.mkdir(path.join(out,'content'),{recursive:true});await fs.writeFile(path.join(out,'content/bundle.json'),JSON.stringify({...context,pages:[...pages,...stories.filter(story=>story.published!==false&&!pages.some(page=>page.id===`reportage-${story.id}`)).map(projectPage)],mediaSettings}));
await fs.mkdir(path.join(out,'cms/vendor'),{recursive:true});await fs.cp('node_modules/@sveltia/cms/dist',path.join(out,'cms/vendor'),{recursive:true,filter:source=>!source.endsWith('.map')&&!source.endsWith('.mjs')});
const cmsConfig=(await fs.readFile('cms/config.yml','utf8')).replace(/max_file_size: \d+/,`max_file_size: ${mediaSettings.maxUploadMB*1024*1024}`);parse(cmsConfig);await fs.writeFile(path.join(out,'cms/config.yml'),cmsConfig);
await viteBuild();
console.log(`Gebouwd: ${pages.length} Puck-pagina's, ${stories.length} reportages en ${articles.length} artikelen.`);
