import fs from'node:fs/promises';
import path from'node:path';
import{build as viteBuild}from'vite';
import{load}from'cheerio';
import{parse}from'yaml';
import{marked}from'marked';
import sanitizeHTML from'sanitize-html';
import{processMedia}from'./process-media.mjs';
import{renderPage,renderHeader,renderFooter}from'../src/shared/render.mjs';
import{imageMarkup,escapeHTML as e}from'../src/shared/media.mjs';

export async function loadCollection(name,root=process.cwd()){
 const dir=path.join(root,'content',name);const names=(await fs.readdir(dir)).filter(n=>n.endsWith('.json')).sort();return Promise.all(names.map(async n=>JSON.parse(await fs.readFile(path.join(dir,n),'utf8'))));
}
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const out='dist';
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
const templates=await read('site/blocks.json'),settings=await read('content/settings/site.json'),mediaSettings=await read('content/settings/media.json');
const[media,pages,stories,articles]=await Promise.all(['media','pages','stories','articles'].map(n=>loadCollection(n)));
for(const color of Object.values(settings.colors))if(!/^#[\da-f]{6}$/i.test(color))throw Error('Kies volledige zescijferige huisstijlkleuren.');
for(const page of pages){if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(page.id))throw Error('Ongeldige paginanaam.');for(const block of page.content){if(!templates[block.type])throw Error('Onbekend blok.');if(block.type==='Video'&&!block.props.mediaId)throw Error(`${page.title}: kies een video voordat je publiceert.`);}}
const manifest=await processMedia();
for(const asset of media){
 if(asset.captions){const source=path.resolve(String(asset.captions).replace(/^\//,''));if(!source.startsWith(path.resolve('media/originals')+path.sep))throw Error('Ongeldig ondertitelpad.');const text=await fs.readFile(source,'utf8');if(!text.startsWith('WEBVTT'))throw Error('Ondertiteling moet een WebVTT-bestand zijn.');const target=`media/captions/${asset.id}.vtt`;await fs.mkdir(path.dirname(path.join(out,target)),{recursive:true});await fs.writeFile(path.join(out,target),text);manifest[asset.id].captions=target;}
}
for(const page of pages)for(const block of page.content){
 const selections=block.props.images||[];if(block.type==='Photo')selections.push(block.props.image);
 for(const image of selections)if(!media.some(a=>a.id===image?.mediaId&&a.kind==='image'))throw Error(`${page.title}: kies een bestaande foto in ${block.type}.`);
 if(block.type==='Video'&&!media.some(a=>a.id===block.props.mediaId&&a.kind==='video'))throw Error(`${page.title}: kies een bestaande video.`);
}
for(const record of [...stories,...articles])if(record.published!==false){for(const id of [record.cover,...(record.gallery||[])])if(!media.some(a=>a.id===id&&a.kind==='image'))throw Error(`${record.title}: een foto ontbreekt in de mediabibliotheek.`);}
const context={templates,settings,media,manifest,stories,articles};
const roleNames=[...new Set(Object.values(templates).flatMap(t=>[...t.html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1])))];
function blockSelectors(css){for(const id of roleNames)css=css.replace(new RegExp('#'+id+'(?=[\\s.:,{>+~\\[])','g'),`[data-role="${id}"]`);return css;}

function brandCSS(css){for(const[from,to]of Object.entries({'#65001d':settings.colors.wine,'#fde6f2':settings.colors.pink,'#e8f2ff':settings.colors.blue,'#ff4802':settings.colors.orange}))css=css.replace(new RegExp(from,'gi'),to);return css;}
await fs.mkdir(path.join(out,'assets'),{recursive:true});
await fs.writeFile(path.join(out,'assets/theme.css'),brandCSS(blockSelectors((await fs.readFile('site/theme.css','utf8')).replace(/url\((["']?)(classic-photo-wall-v2\.png)\1\)/g,'url(../$2)'))));
for(const name of ['site.css','blocks.css'])await fs.writeFile(path.join(out,'assets',name),brandCSS(await fs.readFile('assets/'+name,'utf8')));
for(const name of ['site.js','blocks-runtime.js'])await fs.copyFile('assets/'+name,path.join(out,'assets',name));
for(const name of ['studio-neeltje-logo.png','classic-photo-wall-v2.png'])await fs.copyFile(name,path.join(out,name));
await fs.writeFile(path.join(out,'.nojekyll'),'');
const fonts='https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Host+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Homemade+Apple&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Space+Grotesk:wght@400;500;600;700&display=swap';
function documentHTML(title,description,content){return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(description)}"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fonts}" rel="stylesheet"><link rel="stylesheet" href="assets/theme.css"><link rel="stylesheet" href="assets/site.css"><link rel="stylesheet" href="assets/blocks.css"><script src="assets/site.js" defer></script><script src="assets/blocks-runtime.js" defer></script><noscript><style>.review-line,.quote-note,.quote-handwritten,.portfolio-mosaic-item{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript></head><body class="theme-canvas sn-public">${renderHeader(settings)}<main><div class="mode mode-canvas active">${content}</div></main>${renderFooter(settings)}</body></html>`;}
function fixLinks(html){const $=load(html);$('a').each((_,el)=>{const a=$(el),href=a.attr('href')||'';if(href.includes('preview-pagina.html?')){const url=new URL(href,'https://example.test/');const id=url.searchParams.get('pagina'),article=url.searchParams.get('artikel');const map={kasteel:'reportage-keukenhof',dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga',checklist:'weddingschecklist'};a.attr('href',`${article?'artikel-'+article:map[id]||id||'reportages'}.html${url.hash}`);}if(a.closest('.orbit-card').length){const img=a.find('img');if(img.length)a.attr('href',img.attr('data-full-src')||img.attr('src'));}});return $.html();}
for(const page of pages){const html=fixLinks(documentHTML(page.root?.props?.title||page.title,page.root?.props?.description||page.description||'',renderPage(page,context)));const file=page.id==='home'?'index.html':`${page.id}.html`;await fs.writeFile(path.join(out,file),html);if(page.id==='home')await fs.writeFile(path.join(out,'nieuwe-site.html'),html);}
function prose(value){return sanitizeHTML(marked.parse(String(value||''),{async:false}),{allowedTags:['p','br','h2','h3','h4','ul','ol','li','strong','em','a','blockquote'],allowedAttributes:{a:['href','title']},allowedSchemes:['https','http','mailto','tel']});}
for(const [collection,prefix]of [[stories,'reportage'],[articles,'artikel']])for(const record of collection.filter(r=>r.published!==false)){
 if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(record.id))throw Error('Ongeldige URL voor een reportage of artikel.');
 const content=`<section class="sn-page-intro"><div class="section-tag">${e(record.location||record.category||'STUDIO NEELTJE')}</div><h1>${e(record.title)}</h1><p>${e(record.excerpt)}</p></section><div class="sn-story-cover">${imageMarkup({mediaId:record.cover},context,{eager:true})}</div><article class="sn-story-body">${prose(record.body)}</article>${record.gallery?`<section class="sn-story-gallery" aria-label="Fotogalerij">${record.gallery.map((id,i)=>`<button aria-label="Vergroot foto ${i+1}">${imageMarkup({mediaId:id},context)}</button>`).join('')}</section>`:''}<section class="sn-text-section"><a class="button" href="${prefix==='reportage'?'reportages':'journal'}.html">← Terug naar ${prefix==='reportage'?'reportages':'journal'}</a></section>`;
 await fs.writeFile(path.join(out,`${prefix}-${record.id}.html`),documentHTML(record.title,record.excerpt,content));
 if(prefix==='reportage')await fs.writeFile(path.join(out,`pagina-reportage-${record.id}.html`),documentHTML(record.title,record.excerpt,content));
}
const routes={reportages:'reportages',over:'over',werkwijze:'werkwijze',journal:'journal',contact:'contact',checklist:'weddingschecklist',leveranciers:'leveranciers',kasteel:'reportage-keukenhof',dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga'};
await fs.writeFile(path.join(out,'preview-pagina.html'),`<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Studio Neeltje</title><script>const r=${JSON.stringify(routes)};const p=new URLSearchParams(location.search).get('pagina')||'reportages';location.replace((r[p]||r.reportages)+'.html'+location.hash);</script></head><body><a href="index.html">Naar de homepage</a></body></html>`);
await fs.mkdir(path.join(out,'content'),{recursive:true});await fs.writeFile(path.join(out,'content/bundle.json'),JSON.stringify({...context,pages,mediaSettings}));
await fs.mkdir(path.join(out,'cms/vendor'),{recursive:true});await fs.cp('node_modules/@sveltia/cms/dist',path.join(out,'cms/vendor'),{recursive:true,filter:source=>!source.endsWith('.map')&&!source.endsWith('.mjs')});
const cmsConfig=(await fs.readFile('cms/config.yml','utf8')).replace(/max_file_size: \d+/,`max_file_size: ${mediaSettings.maxUploadMB*1024*1024}`);parse(cmsConfig);await fs.writeFile(path.join(out,'cms/config.yml'),cmsConfig);
await viteBuild();
console.log(`Gebouwd: ${pages.length} Puck-pagina's, ${stories.length} reportages en ${articles.length} artikelen.`);
