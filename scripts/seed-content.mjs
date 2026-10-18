import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {load} from 'cheerio';

try { await fs.access('content/pages/home.json'); throw new Error('De inhoud bestaat al; de eenmalige migratie wordt niet opnieuw uitgevoerd.'); }
catch(error) { if (error.code !== 'ENOENT') throw error; }

const write = async(path,data)=>fs.writeFile(path,JSON.stringify(data,null,2)+'\n');
const source=await fs.readFile('site/source-home.html','utf8');
const $=load(source);
await fs.writeFile('site/theme.css',$('style').map((_,el)=>$(el).html()).get().join('\n'));
const media=[];
function addMedia(url,alt='') {
  const normalized=url.startsWith('https://static.wixstatic.com/media/') ? url.split('/').slice(0,5).join('/') : url;
  let asset=media.find(a=>a.source===normalized);
  if(!asset){asset={id:'foto-'+crypto.createHash('sha256').update(normalized).digest('hex').slice(0,12),title:alt || 'Portfoliofoto',alt,kind:'image',source:normalized,focus:{x:50,y:50}};media.push(asset);}
  return asset.id;
}
function linkURL(href) {
  const u=new URL(href,'https://example.test/');
  if(u.origin!=='https://example.test')return href;
  const page=u.searchParams.get('pagina');
  const routes={reportages:'reportages',over:'over',werkwijze:'werkwijze',journal:'journal',contact:'contact',checklist:'weddingschecklist',leveranciers:'leveranciers',kasteel:'reportage-keukenhof',dengh:'reportage-dengh',bordeaux:'reportage-bordeaux',malaga:'reportage-malaga'};
  if(u.pathname.endsWith('preview-pagina.html'))return `${routes[page]||'reportages'}.html${u.hash}`;
  return href;
}
const templates={};
const defaults={};
const names={Hero:'Header met foto',Quote:'Quote met handtekening',Checklist:'Gratis trouwchecklist',Availability:'Datumaanvraag',ContactForm:'Contactformulier',Stories:'Reportages uit Sveltia',StoryCarousel:'Van eerste moment tot laatste dans',Orbit:'Draai mee door jullie dag',Mosaic:'Alles wat ertussen leeft',Review:'Review',Wall:'Fotomuur',About:'Wat er echt gebeurt',Journal:'Artikelen uit Sveltia',FAQ:'Veelgestelde vragen',Method:'Rustig dichtbij, altijd alert',Pricing:'Prijsopties',ContactCTA:'Kennismaken',Social:'Social media',Intro:'Pagina-intro',Steps:'Werkwijze in stappen'};
function makeTemplate(type,element) {
  const $block=load(element,null,false);
  const texts=[],images=[],links=[];
  $block('dialog').remove();
  const parentLabel=node=>{const p=node.parent;return ['h1','h2','h3','h4','blockquote'].includes(p?.name)?'Titel':p?.name==='a'?'Knop / link':p?.name==='p'?'Tekst':'Label';};
  function visit(node){for(const child of [...(node.children||[])]){if(child.type==='text' && child.data.trim() && /[\p{L}\p{N}]/u.test(child.data) && !['style','script'].includes(node.name)){const value=child.data.trim();const key=texts.length;texts.push({key:String(key),label:`${parentLabel(child)}: ${value.slice(0,48)}`,value});child.data=child.data.replace(value,`{{t:${key}}}`);}else visit(child);}}
  for(const node of $block.root().children().get()) visit(node);
  $block('img[src]').each((_,img)=>{const key=images.length,im=$block(img),alt=im.attr('alt')||'';images.push({key:String(key),label:alt||`Foto ${key+1}`,mediaId:addMedia(im.attr('src'),alt),desktop:null,mobile:null});im.replaceWith(`{{image:${key}}}`);});
  $block('a[href]').each((_,a)=>{const link=$block(a);const key=links.length;links.push({key:String(key),label:`Link ${key+1}`,href:linkURL(link.attr('href'))});link.attr('href',`{{link:${key}}}`);});
  if(type==='Stories')$block('.canvas-project-list').html('<!-- stories:start --><!-- stories:end -->');
  if(type==='Journal')$block('.journal-cards').html('<!-- articles:start --><!-- articles:end -->');
  const item={label:names[type],html:$block.html(),defaults:{texts,images,links}};
  templates[type]=item;defaults[type]={type,props:{id:`${type.toLowerCase()}-default`,...structuredClone(item.defaults)}};
  return defaults[type];
}
const mapping=[['canvas-hero','Hero'],['quote-module','Quote'],['checklist-feature','Checklist'],['availability-check','Availability'],['standalone-form-module','ContactForm'],['canvas-selected-stories','Stories'],['story-showcase','StoryCarousel'],['orbit-gallery','Orbit'],['portfolio-mosaic-section','Mosaic'],['truus-review','Review'],['canvas-wall','Wall'],['canvas-intro-copy','Method'],['canvas-intro','About'],['canvas-journal','Journal'],['canvas-faq','FAQ'],['canvas-pricing','Pricing'],['canvas-end','ContactCTA']];
const home=[];
$('.mode-canvas').children('section').each((_,el)=>{const found=mapping.find(([cls])=>$(el).hasClass(cls));if(!found)throw new Error(`Onbekend blok ${$(el).attr('class')}`);home.push(makeTemplate(found[1],$.html(el)));});
home.push(makeTemplate('Social',$.html($('.social-feature').first())));
makeTemplate('Intro','<section class="sn-page-intro"><div class="section-tag">STUDIO NEELTJE / TROUWFOTOGRAFIE</div><h1>Jullie verhaal.<br><em>Helemaal eigen.</em></h1><p>Een dag vol momenten om te bewaren.</p></section>');
makeTemplate('Steps','<section class="sn-steps"><article><span>01 / KENNISMAKEN</span><h2>Jullie verhaal</h2><p>Vertel over jullie plannen en datum.</p></article><article><span>02 / DE DAG</span><h2>Vrij beleven</h2><p>Ik beweeg mee, zonder de dag over te nemen.</p></article><article><span>03 / HERINNEREN</span><h2>Beelden terug</h2><p>Een reportage die jullie weer terugbrengt.</p></article></section>');
for(const [type,label,props] of [['Photo','Losse foto',{image:{mediaId:media[0].id,desktop:null,mobile:null},aspect:'3/2',caption:''}],['Video','Sfeerclip of vertelvideo',{mediaId:'',type:'talk',title:'Een kijkje achter de camera',eyebrow:'STUDIO NEELTJE',caption:''}],['Text','Tekstblok',{eyebrow:'STUDIO NEELTJE',title:'Jullie verhaal',body:'Vertel hier jullie verhaal.'}]]){templates[type]={label,html:'',defaults:props};defaults[type]={type,props:{id:`${type.toLowerCase()}-default`,...props}};}
await write('site/blocks.json',templates);
const page=(id,title,types)=>({id,title,description:'Trouwfotografie door Studio Neeltje.',root:{props:{title,description:'Trouwfotografie door Studio Neeltje.'}},content:types.map((type,i)=>({...structuredClone(defaults[type]),props:{...structuredClone(defaults[type].props),id:`${id}-${type.toLowerCase()}-${i}`}}))});
const hp=page('home','Studio Neeltje — trouwfotografie',home.map(b=>b.type));await write('content/pages/home.json',hp);
const pages={reportages:['Reportages',['Intro','Stories','Review','ContactCTA']],over:['Over Neeltje',['Intro','About','Method','ContactCTA']],werkwijze:['Werkwijze',['Intro','Steps','Pricing','FAQ','ContactCTA']],journal:['Journal',['Intro','Journal','Checklist']],contact:['Contact',['Intro','ContactForm']],weddingschecklist:['Gratis trouwchecklist',['Intro','Checklist','ContactForm']],leveranciers:['Leveranciers',['Intro','Text','ContactCTA']]};
for(const [id,[title,types]]of Object.entries(pages)){const p=page(id,title,types);p.content[0].props.texts[1].value=title; p.content[0].props.texts[2].value=id==='reportages'?'in beeld.':id==='contact'?'Vertel me jullie plannen.':'Helemaal eigen.';await write(`content/pages/${id}.json`,p);}
const storySeed=[['keukenhof','Kasteel Keukenhof','Lisse','5954ea8bc4af4dc19ee32d1d9358dc0d'],['dengh','Dengh, Utrecht','Utrecht','a2289c669fbb4815a7b6835801ea71e2'],['bordeaux','Bordeaux, France','Frankrijk','026e0e715cbf4b3b8608bd92ca53cbd3'],['malaga','Málaga, Spanje','Spanje','6bac505b81914da6b60da6829caa2f8e']];
for(const[id,title,location,key]of storySeed){const cover=media.find(m=>m.source.includes(key))?.id||media[0].id;await write(`content/stories/${id}.json`,{id,title,location,excerpt:'Een dag vol grote momenten en alles wat ertussen leeft.',body:'Deze reportage wordt aangevuld met het verhaal en de beelden van de dag.',cover,gallery:[cover],published:true});}
$('.canvas-journal .journal-card').each((i,el)=>{const card=$(el),id=['fotoshoot-trouwdag','niet-graag-op-de-foto','onvergetelijke-bruiloft'][i];const image=card.find('img').first();write(`content/articles/${id}.json`,{id,title:card.find('h3').text(),category:'TROUWPLANNING',readTime:'5 min lezen',excerpt:'Praktische tips vanuit het perspectief van een trouwfotograaf.',body:'Dit artikel wordt hier aangevuld.',cover:addMedia(image.attr('src'),image.attr('alt')),published:true});});
for(const asset of media)await write(`content/media/${asset.id}.json`,asset);
await write('content/settings/site.json',{title:'Studio Neeltje',email:'',phone:'',instagram:'',colors:{wine:'#65001D',pink:'#FDE6F2',blue:'#E8F2FF',orange:'#FF4802'},navigation:[{label:'Reportages',href:'reportages.html',kind:'link'},{label:'Over Neeltje',href:'over.html',kind:'link'},{label:'Werkwijze',href:'werkwijze.html',kind:'link'},{label:'Journal',href:'journal.html',kind:'link'},{label:'Gratis checklist',href:'weddingschecklist.html',kind:'checklist'},{label:'Contact',href:'contact.html',kind:'contact'}],footer:{title:'Schrijf je in',emphasis:'voor praktische tips.',copy:'Schrijf je in en ontvang praktische tips voor jullie trouwdag, precies op de momenten dat ze van pas komen.',button:'Ontvang de tips'}});
await write('content/settings/media.json',{imageWidths:[480,800,1280,1920,2560],webpQuality:85,avifQuality:65,videoWidths:[640,1280],videoCRF:23,maxVideoMinutes:15,maxUploadMB:45});
console.log(`Gemigreerd: ${Object.keys(templates).length} bouwstenen, ${home.length} homepageblokken en ${media.length} foto's.`);
