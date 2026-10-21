import {formSettingsScript} from '../shared/forms.mjs';
import {defaultBackground} from '../shared/themes.mjs';
import {upgradeChecklistPage} from '../shared/checklist.mjs';
import React,{useState,useEffect,useMemo,useRef}from'react';
import{createRoot}from'react-dom/client';
import{Puck}from'@puckeditor/core';
import'@puckeditor/core/puck.css';
import'./editor.css';
import{renderBlock,renderPage,renderHeader,renderFooter}from'../shared/render.mjs';
import{assetURL,escapeHTML}from'../shared/media.mjs';
import{MediaLibrary}from'./MediaLibrary.jsx';
import{MediaDetails}from'./MediaDetails.jsx';
import{withLocalPages}from'../shared/media-library.mjs';
import{TextsField,LinksField,ImagesField,ImagePicker,RecordCrops,BackgroundField}from'./Fields.jsx';
import{readLocal,writeLocal,getUploads,saveUpload,removeUploads,backupJSON,removeLocal,saveRecovery,getRecoveries,validatePageBackup}from'./storage.mjs';
import{connect,setToken,isConnected,openDraft,openDraftVersion,listDraftHistory,saveDraft,saveMediaDraft,publishDraft,sourcePreview}from'./github.mjs';
import{CompareVersions,VersionHistory}from'./Versions.jsx';

const ROOT=new URL('../',location.href).href;
const ASSET_VERSION=import.meta.env.VITE_ASSET_VERSION || 'local';
const fontURL='https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&family=DM+Mono&display=swap';
const styles=`<link rel="stylesheet" href="${fontURL}"><link rel="stylesheet" href="${new URL('assets/theme.css?v='+ASSET_VERSION,ROOT).href}"><link rel="stylesheet" href="${new URL('assets/site.css?v='+ASSET_VERSION,ROOT).href}"><link rel="stylesheet" href="${new URL('assets/blocks.css?v='+ASSET_VERSION,ROOT).href}"><link rel="stylesheet" href="${new URL('assets/design.css?v='+ASSET_VERSION,ROOT).href}"><link rel="stylesheet" href="${new URL('assets/checklist.css?v='+ASSET_VERSION,ROOT).href}">`;
const links=`<base href="${ROOT}">${styles}`;
function PreviewFrame({children,document:doc}){useEffect(()=>{if(!doc)return;doc.body.className='theme-canvas sn-preview';let base=doc.head.querySelector('base');if(!base){base=doc.createElement('base');doc.head.prepend(base);}base.href=ROOT;doc.head.insertAdjacentHTML('beforeend',styles);},[doc]);return <>{children}</>;}
function CarouselTextsField(props){return <TextsField {...props} hiddenKeys={['4','5','6','7','8','9','10','11','12','13','14','15','17','18']}/>;}
function blockConfig(context){
 const components={};
 for(const[type,spec]of Object.entries(context.templates)){
   let fields={};
   if(type==='ProjectStory')fields={storyId:{type:'select',label:'Reportage uit Sveltia',options:[{label:'Kies een reportage',value:''},...context.stories.map(story=>({label:story.title,value:story.id}))]},sectionOrder:{type:'array',label:'Volgorde verhaalonderdelen (leeg = volgorde uit Sveltia)',getItemSummary:item=>item.sectionKey||'Kies een onderdeel',arrayFields:{sectionKey:{type:'text',label:'Korte onderdeelnaam uit Sveltia'}}},crops:{type:'custom',label:'Uitsneden per foto in deze reportage',render:props=><RecordCrops {...props} context={context} records={context.media.filter(a=>a.kind==='image'&&!a.deletedAt).map(a=>({id:a.id,title:a.title,cover:a.id}))}/>},beheer:{type:'custom',label:'Teksten, galerijen en reviews',render:()=> <p className="field-help">De inhoud heeft één bron: Sveltia → Trouwreportages → Verhaalonderdelen. Voeg daar tekst, foto’s, galerijen en een echte review toe. Je kunt de onderdelen daar ordenen. Hier kun je met hun korte naam een eigen volgorde instellen en uitsneden aanpassen. Onbekende namen worden overgeslagen; nieuwe onderdelen blijven zichtbaar.</p>}};
   else if(type==='TiltCard')fields={sectionBackground:{type:'custom',label:'Achtergrond van het volledige vlak',render:props=><BackgroundField {...props} fallback="white" colors={context.settings.colors}/>},labelText:{type:'text',label:'Tekst op het label (Bewaar dit gevoel)'},eyebrow:{type:'text',label:'Bovenregel (optioneel)'},title:{type:'text',label:'Titel'},emphasis:{type:'text',label:'Sierlijke titeltekst (optioneel)'},body:{type:'textarea',label:'Korte tekst'},button:{type:'text',label:'Knoptekst (optioneel)'},href:{type:'text',label:'Knoplink (optioneel)'},motion:{type:'radio',label:'Beweging bij aanwijzen',options:[{label:'Aan',value:'on'},{label:'Uit',value:'off'}]}};
   else if(type==='SingleReview')fields={eyebrow:{type:'text',label:'Bovenregel'},reviewId:{type:'select',label:'Review kiezen',options:[{label:'Kies een review',value:''},...(context.settings.editorial?.reviews||[]).filter(review=>review.id&&!review.continuationOf&&review.visible!==false).map(review=>({label:`${review.name} — ${review.caption||review.quote.slice(0,45)}`,value:review.id}))]},beheer:{type:'custom',label:'Reviewtekst en optionele foto',render:()=> <p className="field-help">De korte quote, volledige tekst, naam en optionele foto beheer je in Sveltia → Algemene instellingen → Informatiekaarten &amp; reviews. Zonder lange tekst verschijnt er geen uitklapknop. <a href={new URL('cms/',ROOT).href} target="_blank" rel="noreferrer">Open Sveltia ↗</a></p>},crops:{type:'custom',label:'Uitsneden van reviewfoto’s',render:props=><RecordCrops {...props} context={context} records={(context.settings.editorial?.reviews||[]).filter(review=>review.image&&review.visible!==false).map(review=>({id:review.id,title:review.name,cover:review.image}))} photoLabel="Reviewfoto uit Sveltia" helpText="De foto kies je in Sveltia. Hier stel je de desktop- en mobiele uitsnede voor deze pagina in."/>}};
   else if(['InfoCards','Review','Journey'].includes(type))fields={eyebrow:{type:'text',label:'Bovenregel'},title:{type:'text',label:'Titel'},emphasis:{type:'text',label:'Sierlijke titelregel'},beheer:{type:'custom',label:'Kaarten bewerken',render:()=> <p className="field-help">De inhoud beheer je in Sveltia → Algemene instellingen → Informatiekaarten &amp; reviews of Stappen, auteur &amp; bevestigingen. <a href={new URL('cms/',ROOT).href} target="_blank" rel="noreferrer">Open Sveltia ↗</a></p>}};
   else if(['ChecklistContents','ChecklistAudience'].includes(type)){
     fields={beheer:{type:'custom',label:'Inhoud bewerken',render:()=> <p className="field-help">De teksten en punten bewerk je in Sveltia → Algemene instellingen → Trouwchecklist: verkoopblokken. Beide doelgroepstijlen gebruiken dezelfde punten. <a href={new URL('cms/',ROOT).href} target="_blank" rel="noreferrer">Open Sveltia ↗</a></p>}};
     if(type==='ChecklistContents')fields.image={type:'custom',label:'Coverfoto en uitsnede',render:props=><ImagePicker {...props} value={{...props.value,mediaId:props.value?.mediaId||context.settings.checklist?.contents?.cover||''}} context={context}/>};
     else fields.variant={type:'select',label:'Vormgeving',options:[{label:'Persoonlijk & herkenbaar',value:'personal'},{label:'Rustig & redactioneel',value:'editorial'}]};
   }
   else if(type==='ThankYou')fields={kind:{type:'select',label:'Soort bevestiging',options:[{label:'Contact',value:'contact'},{label:'Datumaanvraag',value:'availability'},{label:'Nieuwsbrief',value:'newsletter'},{label:'Checklist',value:'checklist'}]},beheer:{type:'custom',label:'Teksten bewerken',render:()=> <p className="field-help">De bevestigingsteksten bewerk je in Sveltia → Algemene instellingen → Stappen, auteur &amp; bevestigingen. Verzending staat los van deze voorbeeldweergave.</p>}};
   else if(type==='Photo')fields={image:{type:'custom',label:'Foto en uitsnede',render:props=><ImagePicker {...props} context={context}/>},aspect:{type:'select',label:'Vorm van het vlak',options:[{label:'Liggend 3:2',value:'3/2'},{label:'Breed 16:9',value:'16/9'},{label:'Vierkant',value:'1'},{label:'Staand 2:3',value:'2/3'}]},caption:{type:'text',label:'Bijschrift (optioneel)'}};
   else if(type==='Video')fields={title:{type:'text',label:'Titel'},eyebrow:{type:'text',label:'Bovenregel'},mediaId:{type:'select',label:'Video uit de mediabibliotheek',options:[{label:'Kies een video',value:''},...context.media.filter(a=>a.kind==='video'&&!a.deletedAt).map(a=>({label:a.title,value:a.id}))]},type:{type:'radio',label:'Gebruik',options:[{label:'Vertelvideo met geluid',value:'talk'},{label:'Stille sfeerclip',value:'clip'}]},caption:{type:'textarea',label:'Bijschrift'}};
   else if(type==='Text')fields={title:{type:'text',label:'Titel'},eyebrow:{type:'text',label:'Bovenregel'},body:{type:'textarea',label:'Tekst'}};
   else{
     if(spec.defaults.texts?.length)fields.texts={type:'custom',label:'Teksten in dit blok',render:props=><><TextsField {...props} hiddenKeys={type==='About'?['5']:[]}/>{type==='About'&&<p className="field-help">Het roze fotolabel beheer je in Sveltia → Algemene instellingen → Huisstijl, menu &amp; footer → Fotolabel bij Over Neeltje.</p>}</>};
     if(spec.defaults.images?.length&&!['Stories','Journal'].includes(type))fields.images={type:'custom',label:'Foto’s en uitsneden',render:props=><ImagesField {...props} defaults={spec.defaults.images} context={context}/>};
     if(spec.defaults.links?.length&&!['Journal','Orbit'].includes(type))fields.links={type:'custom',label:'Links en knoppen',render:props=><LinksField {...props} hiddenKeys={type==='Social'?['0','5']:[]}/>};
   }
   if(type==='Review'){
     const reviews=(context.settings.editorial?.reviews||[]).filter(review=>review.id&&review.quote?.trim()&&review.name?.trim()&&review.visible!==false);
     const label=review=>`${review.name} — ${review.quote.slice(0,85)}${review.quote.length>85?'…':''}`;
     fields.reviewSource={type:'radio',label:'Welke reviews tonen?',options:[{label:'Alle zichtbare reviews uit Sveltia',value:'all'},{label:'Zelf reviews kiezen voor dit blok',value:'selected'}]};
     fields.reviewSelection={type:'array',label:'Eigen selectie en volgorde',getItemSummary:item=>{const review=reviews.find(r=>r.id===item.reviewId);return review?label(review):item.reviewId?`Niet beschikbaar: ${item.reviewId}`:'Kies een review';},defaultItemProps:{reviewId:''},arrayFields:{reviewId:{type:'select',label:'Review uit Sveltia',options:[{label:'Kies een review',value:''},...reviews.map(review=>({label:label(review),value:review.id}))]}}};
     fields.beheer={type:'custom',label:'Reviewteksten en foto’s',render:()=> <p className="field-help">Kies hier welke reviews op dit blok verschijnen en sleep ze in de gewenste volgorde. Teksten en foto's bewerk je in Sveltia → Algemene instellingen → Informatiekaarten &amp; reviews. ‘Tonen’ uitzetten verbergt de review overal. Andere blokken houden hun eigen selectie. Nieuwe Sveltia-reviews worden beschikbaar na publicatie en het opnieuw laden van Puck; bewaar eerst je werk.</p>};
   }
   if(type==='StoryCarousel'){
     fields.storySource={type:'select',label:'Inhoud van de carrousel',options:[{label:'Alle gepubliceerde reportages uit Sveltia',value:'all'},{label:'Zelf reportages kiezen en ordenen',value:'selected'},{label:'Handmatige foto’s en teksten behouden',value:'manual'}]};
     fields.storySelection={type:'array',label:'Eigen selectie en volgorde',getItemSummary:item=>context.stories.find(story=>story.id===item.storyId)?.title||'Kies een reportage',defaultItemProps:{storyId:''},arrayFields:{storyId:{type:'select',label:'Trouwreportage',options:[{label:'Kies een reportage',value:''},...context.stories.filter(story=>story.published!==false).map(story=>({label:story.title,value:story.id}))]}}};
     fields.crops={type:'custom',label:'Uitsneden van reportagefoto’s',render:props=><RecordCrops {...props} context={context} records={context.stories}/>};
     fields.beheer={type:'custom',label:'Portfolio beheren',render:()=> <p className="field-help">Kies hierboven reportages uit Sveltia. Foto, titel, locatie en projectlink volgen de reportage. Bij een eigen selectie kun je de volgorde aanpassen. Alleen gepubliceerde reportages krijgen een link. Bewerk verhalen via <a href={new URL('cms/',ROOT).href} target="_blank" rel="noreferrer">Sveltia → Trouwreportages ↗</a>. Ververs Puck na het publiceren vanuit Sveltia; bewaar eerst je werk.</p>};
   }
   if(type==='Orbit')fields.beheer={type:'custom',label:'Tot twaalf foto’s',render:()=> <p className="field-help">De eerste zeven bestaande fotovakken blijven behouden. Vul de extra fotovakken 8 tot en met 12 om de draaigalerij voller te maken. Lege extra vakken worden niet getoond; foto’s en uitsneden kies je hierboven. De volgorde volgt de genummerde fotovakken.</p>};
   if(type==='FanGallery')fields.count={type:'radio',label:'Aantal foto’s naast elkaar',options:[{label:'3 foto’s',value:'3'},{label:'5 foto’s',value:'5'}]};
   if(type==='FanGallery')fields.motion={type:'radio',label:'Beweging bij aanwijzen',options:[{label:'Aan',value:'on'},{label:'Uit',value:'off'}]};
   if(type==='ContactForm')fields.formKind={type:'select',label:'Gebruik van het formulier',options:[{label:'Contactaanvraag',value:'contact'},{label:'Gratis checklist aanvragen',value:'checklist'}]};
   if(['Stories','Journal'].includes(type))fields.crops={type:'custom',label:'Uitsneden van omslagfoto’s',render:props=><RecordCrops {...props} context={context} records={type==='Stories'?context.stories:context.articles}/>};
   fields={background:{type:'custom',label:'Achtergrond & tekstkleur',render:props=><BackgroundField {...props} fallback={defaultBackground(type)} colors={context.settings.colors}/>},...fields};
   let resolveCarouselFields;
   if(type==='StoryCarousel'){
     const manual={...fields,texts:{...fields.texts,key:'carousel-manual-texts'}},selected={...fields,texts:{type:'custom',key:'carousel-project-texts',label:'Kop en knoptekst',render:CarouselTextsField}};
     delete manual.storySelection;delete manual.crops;delete selected.images;delete selected.links;
     const all={...selected};delete all.storySelection;
     resolveCarouselFields=({props})=>props.storySource==='selected'?selected:props.storySource==='all'?all:manual;
   }
   if(type==='Review'){
     const all={...fields};delete all.reviewSelection;
     const selected={...fields};
     resolveCarouselFields=({props})=>props.reviewSource==='selected'?selected:all;
   }
   components[type]={label:spec.label,fields,defaultProps:{...structuredClone(spec.defaults),background:defaultBackground(type)},...(resolveCarouselFields?{resolveFields:resolveCarouselFields}:{}),render:props=><div className="sn-puck-block" dangerouslySetInnerHTML={{__html:renderBlock({type,props},context)}}/>};
 }
 return{components,categories:{intro:{title:'Introductie',components:['Hero','Intro','Text','Quote','About','Method','InfoCards']},media:{title:'Foto’s en video',components:['Photo','Video','Mosaic','Orbit','StoryCarousel','FanGallery','Wall']},stories:{title:'Verhalen',components:['ProjectStory','Stories','Journal','Review','SingleReview','Social']},actions:{title:'Plannen en contact',components:['TiltCard','Checklist','ChecklistContents','ChecklistAudience','ContactForm','ContactCTA','Availability','Pricing','FAQ','Steps','Journey','ThankYou']}},root:{fields:{title:{type:'text',label:'Paginatitel'},description:{type:'textarea',label:'Omschrijving voor zoekmachines'}},render:({children})=><div className="mode mode-canvas active">{children}</div>}};
}

function App(){
 const[bundle,setBundle]=useState(null),[error,setError]=useState(''),[status,setStatus]=useState(''),[view,setView]=useState('pages'),[page,setPage]=useState(null),[media,setMedia]=useState([]),[changedMedia,setChangedMedia]=useState(()=>readLocal('mediaChanges',[])),[uploads,setUploads]=useState([]),[account,setAccount]=useState(false),[showLogin,setShowLogin]=useState(false),[key,setKey]=useState(''),[busy,setBusy]=useState(false),[cloud,setCloud]=useState(null),[preview,setPreview]=useState(false),[width,setWidth]=useState(1280),[reviewed,setReviewed]=useState(false),[selectedAsset,setSelectedAsset]=useState(null),[newTitle,setNewTitle]=useState(''),[newId,setNewId]=useState('');
 const [editorRevision,setEditorRevision]=useState(0);
 const[uploadQueue,setUploadQueue]=useState([]),[uploading,setUploading]=useState(false),[mediaCloud,setMediaCloud]=useState(()=>readLocal('mediaDraft',null)),[mediaProgress,setMediaProgress]=useState(null);
 const queueRef=useRef([]),queueRunning=useRef(false);
 const editorGeneration=useRef(0);
 const latest=useRef(null);const urls=useRef([]);
 const mediaChangesRef=useRef(changedMedia),operationBusy=useRef(false);
 const[versionsOpen,setVersionsOpen]=useState(false),[versions,setVersions]=useState([]),[onlineHistory,setOnlineHistory]=useState(null),[comparison,setComparison]=useState(null);
 const signature=(data,changes)=>JSON.stringify({page:data,media:changes});
 const changesFrom=assets=>assets.filter(asset=>JSON.stringify(asset)!==JSON.stringify(bundle.media.find(original=>original.id===asset.id)));
 function assertCurrent(id,generation){if(latest.current?.id!==id||editorGeneration.current!==generation)throw Error('Je bent intussen naar een andere bewerking gegaan. Die is behouden. Open de gewenste pagina om verder te gaan.');}
 async function replaceEditorPage(data,{persist=true,reason='Vóór een andere versie',changes=mediaChangesRef.current}={}){
   const generation=editorGeneration.current,before=JSON.stringify(latest.current);
   const next=upgradeChecklistPage(structuredClone(data),bundle?.templates||{});
   if(latest.current)await saveRecovery(latest.current,mediaChangesRef.current,reason);
   const local=readLocal(`page:${next.id}`,null);
   if(local)await saveRecovery(local,mediaChangesRef.current,'Vorige lokale bewerking');
   await saveRecovery(next,changes,'Overgenomen versie');
   if(editorGeneration.current!==generation||JSON.stringify(latest.current)!==before)throw Error('Je hebt intussen verder gewerkt. Die wijzigingen zijn behouden; er is geen andere versie overheen geladen.');
   // Do not change the canvas if either the backup or local write fails.
   if(persist)writeLocal(`page:${next.id}`,next);
   // Invalidate callbacks from the old canvas before mounting the next one.
   editorGeneration.current+=1;
   latest.current=next;setPage(next);setEditorRevision(editorGeneration.current);setReviewed(false);
   return next;
 }

 useEffect(()=>{if(!account)return;let cancelled=false;const controller=new AbortController();Promise.all([fetch(new URL('content/bundle.json',ROOT),{cache:'no-cache',signal:controller.signal}).then(r=>{if(!r.ok)throw Error('De beheerinhoud kon niet laden. Vernieuw de pagina.');return r.json();}),getUploads()]).then(([data,files])=>{if(cancelled)return;data.pages.sort((a,b)=>(a.id==='home'?-1:b.id==='home'?1:0));data.pages.push(...readLocal('newPages',[]).filter(p=>!data.pages.some(existing=>existing.id===p.id)));const changes=[...new Map([...files.filter(file=>file.asset&&!data.media.some(asset=>asset.id===file.asset.id)).map(file=>file.asset),...readLocal('mediaChanges',[])].map(asset=>[asset.id,asset])).values()];writeLocal('mediaChanges',changes);setChangedMedia(changes);const restoredQueue=files.map(file=>({id:file.path,file:file.file,state:'done'}));queueRef.current=restoredQueue;setUploadQueue(restoredQueue);const pending=new Map(files.map(f=>{const url=URL.createObjectURL(f.file);urls.current.push(url);return[f.path,url];}));const all=data.media.map(a=>({...a,previewURL:assetURL(a,data.manifest,ROOT)}));for(const change of changes){const asset={...change,previewURL:pending.get(change.source)||assetURL(change,data.manifest,ROOT)};const at=all.findIndex(a=>a.id===asset.id);if(at<0)all.push(asset);else all[at]=asset;}setUploads(files);setMedia(all);setBundle(data);const id=new URLSearchParams(location.search).get('pagina');if(id){const found=data.pages.find(p=>p.id===id);if(found){const saved=readLocal(`page:${id}`,found);saveRecovery(saved,changes,'Lokale bewerking bij openen').catch(e=>setError(e.message));const local=upgradeChecklistPage(saved,data.templates);if(local!==saved){try{writeLocal(`page:${id}`,local);}catch(e){setError(e.message);}setStatus('De nieuwe checklistblokken zijn toegevoegd; je bestaande teksten zijn behouden.');}setPage(local);latest.current=local;setView('editor');}}}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;controller.abort();urls.current.forEach(URL.revokeObjectURL);urls.current=[];};},[account]);
 useEffect(()=>{if(!selectedAsset&&!showLogin&&!preview&&!versionsOpen&&!comparison)return;const previous=document.activeElement;const handler=event=>{if(event.key==='Escape'&&!document.querySelector('.media-picker-dialog[open]')){setSelectedAsset(null);setShowLogin(false);setKey('');setPreview(false);setVersionsOpen(false);setComparison(null);}if(event.key==='Tab'){if(document.querySelector('.media-picker-dialog[open]'))return;const modal=document.querySelector('.modal-backdrop .admin-modal,.preview-overlay');const nodes=[...(modal?.querySelectorAll('button,a[href],input,select,textarea,iframe')||[])].filter(el=>!el.disabled&&el.getClientRects().length);if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}};document.addEventListener('keydown',handler);queueMicrotask(()=>document.querySelector('.modal-backdrop .admin-modal button,.preview-toolbar button')?.focus());return()=>{document.removeEventListener('keydown',handler);previous?.focus();};},[Boolean(selectedAsset),showLogin,preview,versionsOpen,Boolean(comparison)]);
 const context=useMemo(()=>bundle?{...bundle,media,assetBaseURL:ROOT,manifest:Object.fromEntries(Object.entries(bundle.manifest).filter(([id])=>bundle.media.find(a=>a.id===id)?.source===media.find(a=>a.id===id)?.source)),preview:true}:null,[bundle,media]);
 const config=useMemo(()=>context?blockConfig(context):null,[context]);
 function run(fn){if(operationBusy.current)return;operationBusy.current=true;setError('');setBusy(true);return Promise.resolve().then(fn).catch(e=>setError(e.message)).finally(()=>{operationBusy.current=false;setBusy(false);});}
 useEffect(()=>{mediaChangesRef.current=changedMedia;},[changedMedia]);
 useEffect(()=>{if(!uploading)return;const guard=event=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard);},[uploading]);
 useEffect(()=>{if(!account||!page)return;const timer=setTimeout(()=>saveRecovery(page,changedMedia,'Automatisch bewaard',{coalesce:true}).catch(error=>setError(error.message)),800);return()=>clearTimeout(timer);},[account,page,changedMedia]);
 function changePage(data,generation){if(generation!==editorGeneration.current||!latest.current)return;const updated={...latest.current,...data,title:data.root?.props?.title||latest.current.title,description:data.root?.props?.description||''};latest.current=updated;setPage(updated);setReviewed(false);try{writeLocal(`page:${updated.id}`,updated);setStatus('Concept bewaard op dit apparaat');}catch(e){setError(e.message);}}
 async function choosePage(p){const local=readLocal(`page:${p.id}`,p);await replaceEditorPage(local,{reason:'Vóór wisselen van pagina'});setCloud(null);setComparison(null);setReviewed(false);setView('editor');history.replaceState(null,'',`?pagina=${p.id}`);}
 function updateAsset(asset,{open=true}={}){const clean={...asset};delete clean.previewURL;const changes=[...mediaChangesRef.current.filter(a=>a.id!==asset.id),clean];writeLocal('mediaChanges',changes);mediaChangesRef.current=changes;setChangedMedia(changes);setMedia(old=>old.some(a=>a.id===asset.id)?old.map(a=>a.id===asset.id?asset:a):[...old,asset]);if(open)setSelectedAsset(asset);setReviewed(false);}
 async function upload(file,queueId=crypto.randomUUID()){
   const allowedImage=/^image\/(jpeg|png|webp|avif)$/;const allowedVideo=/^video\/(mp4|quicktime|webm)$/;
   if(!allowedImage.test(file.type)&&!allowedVideo.test(file.type))throw Error('Kies een JPG-, PNG-, WebP-, AVIF-, MP4-, MOV- of WebM-bestand.');
   if(file.size>bundle.mediaSettings.maxUploadMB*1024*1024)throw Error(`Dit bronbestand is groter dan ${bundle.mediaSettings.maxUploadMB} MB. Gebruik een kleinere webexport om de opslagkosten laag te houden.`);
   const id=`media-${queueId}`,extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','video/mp4':'mp4','video/quicktime':'mov','video/webm':'webm'})[file.type];const path=`media/originals/${id}.${extension}`,asset={id,title:file.name.replace(/\.[^.]+$/,''),alt:'',kind:allowedVideo.test(file.type)?'video':'image',source:path,focus:{x:50,y:50},captions:''};const pending={path,file,asset};await saveUpload(pending);setUploads(old=>[...old.filter(item=>item.path!==path),pending]);const url=URL.createObjectURL(file);urls.current.push(url);updateAsset({...asset,previewURL:url},{open:false});setStatus('Bronbestand op dit apparaat bewaard. Sla de media online op om de webversies te laten maken.');
 }
 function updateQueue(items){queueRef.current=items;setUploadQueue(items);}
 async function drainQueue(){
   if(queueRunning.current)return;queueRunning.current=true;setUploading(true);
   try{let item;while((item=queueRef.current.find(entry=>entry.state==='queued'))){updateQueue(queueRef.current.map(entry=>entry.id===item.id?{...entry,state:'working'}:entry));try{await upload(item.file,item.id);updateQueue(queueRef.current.map(entry=>entry.id===item.id?{...entry,state:'done'}:entry));}catch(error){updateQueue(queueRef.current.map(entry=>entry.id===item.id?{...entry,state:'failed',error:error.message}:entry));}}}
   finally{queueRunning.current=false;setUploading(false);}
 }
 function enqueueFiles(files){if(!files.length)return;updateQueue([...queueRef.current,...files.map(file=>({id:crypto.randomUUID(),file,state:'queued'}))]);void drainQueue();}
 function retryUpload(id){updateQueue(queueRef.current.map(item=>item.id===id?{...item,state:'queued',error:''}:item));void drainQueue();}
 function trashAssets(assets){for(const asset of assets){const entry=bundle.manifest[asset.id];updateAsset({...asset,deletedAt:new Date().toISOString(),...(entry?.width&&entry?.height?{dimensions:{width:entry.width,height:entry.height}}:{})},{open:false});}setSelectedAsset(null);setStatus('Naar de prullenbak verplaatst. Gebruikte plekken tonen een leeg fotovlak; je kunt de beelden terugzetten. Sla de media online op om deze wijziging te bewaren.');}
 async function restoreAssets(assets){for(const asset of assets){let previewURL=/^https:\/\//.test(asset.source)?asset.source:asset.previewURL;if(!/^https:\/\//.test(asset.source)&&(!previewURL||!bundle.manifest[asset.id]?.src)){const pending=uploads.find(item=>item.path===asset.source);const blob=pending?.file||await sourcePreview(asset,mediaCloud?.head||cloud?.head||'main');previewURL=URL.createObjectURL(blob);urls.current.push(previewURL);}const restored={...asset,previewURL};delete restored.deletedAt;updateAsset(restored,{open:false});}setSelectedAsset(null);setStatus('Beeld teruggezet, inclusief de bestaande uitsneden en verwijzingen. Sla de media online op.');}
 async function saveLibrary(){
   if(queueRunning.current)throw Error('Wacht tot de uploadwachtrij klaar is.');
   const changes=structuredClone(mediaChangesRef.current),pending=[...uploads];
   try{const result=await saveMediaDraft(changes,pending,bundle.media,setMediaProgress,mediaCloud);const saved={...result,changes,pendingPaths:pending.map(item=>item.path),signature:JSON.stringify(changes)};writeLocal('mediaDraft',saved);setMediaCloud(saved);setStatus('Media online als concept opgeslagen. De beeldverwerking is gestart; publiceren kan na de geslaagde controle. Je pagina’s zijn niet aangepast.');}
   finally{setMediaProgress(null);}
 }
 async function finishPublishedMedia(saved){
   if(!saved?.changes?.length)return;
   const keep=mediaChangesRef.current.filter(asset=>!saved.changes.some(previous=>JSON.stringify(previous)===JSON.stringify(asset)));
   writeLocal('mediaChanges',keep);mediaChangesRef.current=keep;setChangedMedia(keep);
   setBundle(old=>({...old,media:[...new Map([...old.media,...saved.changes].map(asset=>[asset.id,asset])).values()]}));
   const paths=(saved.pendingPaths||[]).filter(path=>!keep.some(asset=>asset.source===path||asset.captions===path));
   await removeUploads(paths);setUploads(old=>old.filter(item=>!paths.includes(item.path)));
 }
 async function publishLibrary(){if(!mediaCloud||mediaCloud.signature!==JSON.stringify(mediaChangesRef.current))throw Error('Sla je huidige mediaveranderingen eerst online op.');const saved=mediaCloud;await publishDraft(saved.pr,saved.head);await finishPublishedMedia(saved);removeLocal('mediaDraft');setMediaCloud(null);setStatus('Publicatie van de media gestart. Je pagina’s en concepten zijn niet gewijzigd. De testsite toont de nieuwe beelden zodra GitHub klaar is.');}
 async function save(data=latest.current,acceptedHead=null){
   if(queueRunning.current)throw Error('Wacht tot de uploadwachtrij klaar is voordat je opslaat.');
   if(!isConnected()){setShowLogin(true);throw Error('Je lokale concept is bewaard. Koppel GitHub om het ook online als concept op te slaan.');}
   const normalized={...latest.current,...data,title:data.root?.props?.title||data.title};
   const generation=editorGeneration.current,changes=structuredClone(mediaChangesRef.current),pending=[...uploads];
   latest.current=normalized;setPage(normalized);
   writeLocal(`page:${normalized.id}`,normalized);
   await saveRecovery(normalized,changes,'Vóór online opslaan');
   const online=await openDraft(normalized.id);
   const knownHead=acceptedHead||cloud?.head||readLocal(`savedHead:${normalized.id}`,null);
   if(online)await saveRecovery(online.data,changesFrom(online.media),'Online versie vóór opslaan');
   const firstSaveDiffers=online&&!knownHead&&signature(online.data,changesFrom(online.media))!==signature(normalized,changes);
   if(online&&((knownHead&&online.head!==knownHead)||firstSaveDiffers)){
     assertCurrent(normalized.id,generation);
     setComparison({id:normalized.id,generation,mode:'save',draft:online,label:'Intussen online opgeslagen'});
     setStatus('Er is ook een andere online versie. Je huidige bewerking is behouden.');return;
   }
   let result;
   try{result=await saveDraft(normalized,changes,pending,online?.head||null,bundle.media);}
   catch(error){
     if(error.code!=='DRAFT_CHANGED')throw error;
     const newer=await openDraft(normalized.id);if(!newer)throw error;
     assertCurrent(normalized.id,generation);
     setComparison({id:normalized.id,generation,mode:'save',draft:newer,label:'Intussen online opgeslagen'});
     setStatus('De online versie veranderde tijdens het opslaan. Je bewerking staat nog op het scherm.');return;
   }
   writeLocal(`savedHead:${normalized.id}`,result.head);
   if(latest.current?.id===normalized.id&&editorGeneration.current===generation){
     setCloud({...result,pageId:normalized.id,signature:signature(normalized,changes),changes,pendingPaths:pending.map(item=>item.path)});
     setComparison(null);
     const newer=signature(latest.current,mediaChangesRef.current)!==signature(normalized,changes);
     setStatus(newer?'Concept online opgeslagen. Je nieuwere wijzigingen staan nog lokaal; sla die ook op.':'Concept opgeslagen in GitHub. De vorige online versie blijft in de versiegeschiedenis.');
   }else setStatus(`Concept ‘${normalized.title}’ online opgeslagen. De pagina waarop je nu werkt is niet vervangen.`);
 }
 async function compareOnline(){
   const id=latest.current.id,generation=editorGeneration.current;
   await saveRecovery(latest.current,mediaChangesRef.current,'Vóór online vergelijken');
   const draft=await openDraft(id);if(!draft)throw Error('Er staat nog geen online concept voor deze pagina. Je kunt je huidige bewerking gewoon opslaan.');
   assertCurrent(id,generation);setComparison({id,generation,mode:'load',draft,label:'Huidig online concept'});
 }
 async function restoreCandidate(){
   const candidate=comparison,{draft}=candidate,before=JSON.stringify(latest.current);assertCurrent(candidate.id,candidate.generation);
   const incoming=draft.local?draft.media:changesFrom(draft.media);
   const changes=[...new Map([...mediaChangesRef.current,...incoming].map(asset=>[asset.id,asset])).values()];
   const all=[...new Map([...bundle.media,...(draft.local?[]:draft.media),...changes].map(asset=>[asset.id,asset])).values()].map(asset=>({...asset}));
   await Promise.all(all.map(async asset=>{
     const previous=media.find(item=>item.id===asset.id&&item.source===asset.source);
     if(previous?.previewURL){asset.previewURL=previous.previewURL;return;}
     const pending=uploads.find(upload=>upload.path===asset.source);
     if(pending){const url=URL.createObjectURL(pending.file);urls.current.push(url);asset.previewURL=url;return;}
     if(!bundle.media.some(item=>item.id===asset.id&&item.source===asset.source)&&!draft.local){const blob=await sourcePreview(asset,draft.versionSha||draft.head||draft.branch);const url=URL.createObjectURL(blob);urls.current.push(url);asset.previewURL=url;}
     else asset.previewURL=assetURL(asset,bundle.manifest,ROOT);
   }));
   assertCurrent(candidate.id,candidate.generation);
   if(JSON.stringify(latest.current)!==before)throw Error('Je hebt tijdens het ophalen verder gewerkt. Die bewerking is behouden; kies opnieuw of je een andere versie wilt overnemen.');
   const previousChanges=readLocal('mediaChanges',[]);
   await saveRecovery(latest.current,mediaChangesRef.current,'Vóór overnemen van een andere versie');
   writeLocal('mediaChanges',changes);
   let next;
   try{next=await replaceEditorPage(draft.data,{reason:'Vóór overnemen van een andere versie',changes});}
   catch(error){writeLocal('mediaChanges',previousChanges);throw error;}
   mediaChangesRef.current=changes;setChangedMedia(changes);setMedia(all);
   if(draft.head)writeLocal(`savedHead:${next.id}`,draft.head);
   setCloud(draft.pr?{...draft,pageId:next.id,signature:draft.fromHistory?null:signature(next,incoming)}:null);
   setComparison(null);setVersionsOpen(false);
   setStatus('Versie overgenomen. Je vorige bewerking staat bij Versiegeschiedenis. Er is niets gepubliceerd.');
 }
 async function showVersions(){
   await saveRecovery(latest.current,mediaChangesRef.current,'Huidige bewerking');
   setVersions(await getRecoveries(latest.current.id));setOnlineHistory(null);setVersionsOpen(true);
 }
 function compareLocal(version){setVersionsOpen(false);setComparison({id:latest.current.id,generation:editorGeneration.current,mode:'load',draft:{data:version.page,media:version.media||[],local:true},label:version.reason});}
 async function inspectOnline(version){
   const id=latest.current.id,generation=editorGeneration.current,draft=await openDraftVersion(id,version.sha);
   assertCurrent(id,generation);setVersionsOpen(false);setComparison({id,generation,mode:'load',draft,label:'Eerdere online versie'});
 }
 async function importBackup(file){
   const id=latest.current.id,generation=editorGeneration.current;
   if(file.size>5*1024*1024)throw Error('Kies een JSON-reservekopie van maximaal 5 MB.');
   let parsed;try{parsed=JSON.parse(await file.text());}catch{throw Error('Dit bestand is geen leesbare JSON-reservekopie. Je huidige bewerking blijft staan.');}
   assertCurrent(id,generation);const data=validatePageBackup(parsed,id,bundle.templates);
   compareLocal({page:data,media:mediaChangesRef.current,reason:'Reservekopie uit bestand'});
 }
 async function loadPublished(){const original=bundle.pages.find(p=>p.id===latest.current.id);if(!original)return;await replaceEditorPage(original,{reason:'Vóór laden van gepubliceerde versie'});setCloud(null);setStatus('Gepubliceerde versie geladen. Je vorige bewerking staat bij Versiegeschiedenis.');}
 async function publishCurrent(){
   if(!reviewed||cloud?.pageId!==latest.current.id||cloud.signature!==signature(latest.current,mediaChangesRef.current))throw Error('Sla je huidige bewerking op en bekijk eerst de voorvertoning.');
   const saved=cloud;await saveRecovery(latest.current,mediaChangesRef.current,'Vóór publicatie');
   await publishDraft(saved.pr,saved.head);
   await finishPublishedMedia(saved);
   if(latest.current?.id===saved.pageId){
     if(signature(latest.current,mediaChangesRef.current)===saved.signature)removeLocal(`page:${saved.pageId}`);
     setCloud(null);
   }
   setStatus('Publicatie gestart. Eventuele nieuwere lokale wijzigingen blijven bewaard.');
 }
 function showPreview(){setReviewed(true);setPreview(true);}
 function signOut(){editorGeneration.current+=1;setComparison(null);setVersionsOpen(false);setToken('');setAccount(false);setBundle(null);setPage(null);setMedia([]);setUploads([]);setCloud(null);setPreview(false);setSelectedAsset(null);setShowLogin(false);setKey('');setError('');setStatus('Je bent uitgelogd.');setView('pages');latest.current=null;}
 async function signIn(){await connect(key);setKey('');setAccount(true);setShowLogin(false);setStatus('Ingelogd als studioneeltje.');}
 if(!account)return <main className="admin-login"><div className="login-brand">STUDIO <span>NEELTJE</span></div><section className="login-card"><div className="admin-eyebrow">WEBSITEBEHEER</div><h1>Welkom terug,<br/><em>Neeltje.</em></h1><p>Log in om je website te bewerken. Deze editor is alleen toegankelijk met jouw GitHub-account <strong>studioneeltje</strong>.</p><form onSubmit={event=>{event.preventDefault();run(signIn);}} aria-label="Inloggen voor websitebeheer"><label htmlFor="login-token">GitHub-token<input id="login-token" type="password" autoComplete="off" autoCapitalize="none" spellCheck={false} value={key} onChange={e=>setKey(e.target.value)} required disabled={busy}/></label>{error&&<p className="login-error" role="alert">{error}</p>}<button className="admin-button" disabled={busy||!key.trim()} type="submit">{busy?'Toegang controleren…':'Inloggen'} <span aria-hidden="true">↗</span></button></form><p className="field-help">Je token wordt alleen voor deze browsersessie gebruikt en niet opgeslagen. Na vernieuwen of afsluiten log je opnieuw in.</p><a className="login-back" href="../index.html">← Terug naar de website</a></section></main>;

 if(!bundle)return <main className="admin-loading"><h1>Studio Neeltje</h1><p role="status">{error||'Je beheeromgeving wordt geladen…'}</p></main>;
 const snapshot=page&&`${links}<body class="theme-canvas sn-public"><div class="preview-label">VOORVERTONING — NOG NIET GEPUBLICEERD</div>${renderHeader(bundle.settings)}<main id="main-content" tabindex="-1"><div class="mode mode-canvas active">${renderPage(page,context)}</div></main>${renderFooter(bundle.settings)}${formSettingsScript(bundle.settings,{preview:true})}<script src="${new URL('assets/blocks-runtime.js?v='+ASSET_VERSION,ROOT).href}"></script><script src="${new URL('assets/site.js?v='+ASSET_VERSION,ROOT).href}"></script><script src="${new URL('assets/forms.js?v='+ASSET_VERSION,ROOT).href}"></script></body>`;
 return <><header className="admin-header"><a href="./" className="admin-brand">STUDIO <span>NEELTJE</span><small>JOUW WEBSITE</small></a><nav aria-label="Beheer"><button disabled={busy||uploading} onClick={()=>{setView('pages');history.replaceState(null,'','./');}}>Pagina’s</button><button disabled={busy||uploading} onClick={()=>setView('media')}>Media</button><a href="../cms/">Sveltia: inhoud & instellingen ↗</a><a href="../index.html" target="_blank" rel="noreferrer">Bekijk website ↗</a></nav><button disabled={busy||uploading} className="admin-button" onClick={signOut}>Uitloggen</button></header>
 <div className="admin-notice" role="status">{status||'Werk aan een concept en bekijk het voordat je publiceert.'}{busy&&' · Bezig…'}</div>{error&&<div className="admin-error" role="alert">{error}</div>}
 {view==='pages'&&<main className="admin-main"><div className="admin-eyebrow">MAAK HET EIGEN</div><h1>Jouw verhalen.<br/><em>Jouw website.</em></h1><p>Kies een pagina en werk met de bouwstenen die we voor jouw site hebben gemaakt.</p><div className="page-grid">{bundle.pages.map(p=><button disabled={busy} className="page-card" key={p.id} onClick={()=>run(()=>choosePage(p))}><span>{p.id==='home'?'01 / HOMEPAGE':'PAGINA'}</span><h2>{p.title}</h2><span>Visueel bewerken ↗</span></button>)}</div><details className="new-page"><summary>＋ Nieuwe landingspagina</summary><label>Paginatitel<input value={newTitle} onChange={e=>setNewTitle(e.target.value)}/></label><label>Korte naam in de URL<input placeholder="trouwen-in-utrecht" value={newId} onChange={e=>setNewId(e.target.value)}/></label><button className="admin-button" onClick={()=>run(()=>{if(!/^[a-z0-9][a-z0-9-]{0,80}$/.test(newId)||!newTitle.trim())throw Error('Vul een titel en een korte naam met kleine letters en streepjes in.');if(bundle.pages.some(p=>p.id===newId))throw Error('Deze paginanaam bestaat al.');const created={id:newId,title:newTitle,localOnly:true,root:{props:{title:newTitle,description:''}},content:[]};writeLocal('newPages',[...readLocal('newPages',[]).filter(p=>p.id!==newId),created]);setBundle(old=>({...old,pages:[...old.pages,created]}));return choosePage(created);})}>Pagina maken</button></details><aside className="admin-tip">Reportages, artikelen, contactgegevens en menu’s bewerk je in Sveltia. In Puck bepaal je hoe de pagina is opgebouwd.</aside></main>}
 {view==='editor'&&page&&<main><div className="editor-toolbar"><span>{page.title}</span><button disabled={busy} onClick={showPreview}>Voorvertoning ↗</button><button disabled={page.localOnly||busy} onClick={()=>run(loadPublished)}>Gepubliceerde versie laden</button><button onClick={()=>backupJSON(`${page.id}-concept.json`,latest.current)}>Reservekopie</button><button disabled={busy} onClick={()=>run(showVersions)}>Versiegeschiedenis</button><button disabled={!account||busy} onClick={()=>run(compareOnline)}>Online concept vergelijken</button><button className="admin-button" disabled={cloud?.pageId!==page.id||!cloud?.pr||!reviewed||busy||cloud.signature!==signature(page,changedMedia)} onClick={()=>run(publishCurrent)}>Publiceer gecontroleerd concept</button>{cloud?.pr&&<a href={cloud.pr.html_url} target="_blank" rel="noreferrer">Verwerkingscontrole ↗</a>}</div><Puck key={`${page.id}:${editorRevision}`} config={config} data={page} onChange={data=>changePage(data,editorRevision)} onPublish={data=>{if(editorRevision!==editorGeneration.current)return;run(()=>save({...latest.current,...data}));}} headerTitle="Studio Neeltje" headerPath={page.id} dictionary={{'header-publish':'Concept opslaan'}} iframe={{enabled:true,syncHostStyles:false}} overrides={{iframe:PreviewFrame}} viewports={[{width:1280,height:'auto',label:'Desktop'},{width:390,height:'auto',label:'Mobiel'}]}/></main>}
 {view==='media'&&<MediaLibrary media={media} context={{...context,pages:withLocalPages(bundle.pages,readLocal)}} changes={changedMedia} queue={uploadQueue} uploading={uploading} busy={busy} cloud={mediaCloud&&{...mediaCloud,current:mediaCloud.signature===JSON.stringify(changedMedia)}} progress={mediaProgress} onFiles={enqueueFiles} onRetry={retryUpload} onSelect={setSelectedAsset} onTrash={trashAssets} onRestore={assets=>run(()=>restoreAssets(assets))} onSave={()=>run(saveLibrary)} onPublish={()=>run(publishLibrary)} onBackup={()=>backupJSON('mediabibliotheek-reservekopie.json',{media:mediaChangesRef.current,includesOriginalFiles:false})} onOpenPage={id=>run(()=>choosePage(bundle.pages.find(p=>p.id===id)))}/>}
 {selectedAsset&&<MediaDetails asset={selectedAsset} context={{...context,pages:withLocalPages(bundle.pages,readLocal)}} busy={busy||uploading} onClose={()=>setSelectedAsset(null)} onChange={updateAsset} onTrash={trashAssets} onRestore={assets=>run(()=>restoreAssets(assets))} onCaptions={file=>run(async()=>{const text=await file.text();if(!text.startsWith('WEBVTT'))throw Error('Kies een geldig WebVTT-ondertitelbestand.');const path=`media/originals/${selectedAsset.id}.vtt`,pending={path,file};await saveUpload(pending);setUploads(old=>[...old.filter(u=>u.path!==path),pending]);updateAsset({...selectedAsset,captions:path});})}/>}
 {showLogin&&<div className="modal-backdrop"><form className="admin-modal" aria-label="GitHub koppelen" onSubmit={e=>{e.preventDefault();run(async()=>{await signIn();});}}><button type="button" className="close-modal" onClick={()=>{setShowLogin(false);setKey('');}} aria-label="Sluiten">×</button><h2>Verbind je website.</h2><p>Gebruik een GitHub-sleutel voor alleen de repository <strong>studio-neeltje-website</strong>, met schrijfrechten voor <strong>Contents</strong> en <strong>Pull requests</strong> en leesrechten voor <strong>Actions</strong>.</p><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Maak een beperkte GitHub-sleutel ↗</a><label>GitHub-sleutel<input type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)} required/></label><p className="field-help">Deze editor houdt de sleutel alleen in het geheugen. Bij vernieuwen of afsluiten moet je opnieuw koppelen.</p><button className="admin-button" type="submit" disabled={busy}>Koppelen</button></form></div>}
 {preview&&<div className="preview-overlay" role="dialog" aria-modal="true" aria-label="Voorvertoning concept"><div className="preview-toolbar"><strong>Concept — {page.title}</strong><button aria-pressed={width===1280} onClick={()=>setWidth(1280)}>Desktop</button><button aria-pressed={width===390} onClick={()=>setWidth(390)}>Mobiel</button><button onClick={()=>setPreview(false)}>Sluiten ×</button></div><iframe title="Voorvertoning van het huidige concept" style={{width,maxWidth:'100%'}} srcDoc={`<!doctype html><html lang="nl"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>${snapshot}</html>`}/></div>}
 {versionsOpen&&page&&<VersionHistory page={page} versions={versions} online={onlineHistory} busy={busy} onClose={()=>setVersionsOpen(false)} onInspectLocal={compareLocal} onInspectOnline={version=>run(()=>inspectOnline(version))} onLoadOnline={()=>run(async()=>{const id=latest.current.id,generation=editorGeneration.current;const entries=await listDraftHistory(id);assertCurrent(id,generation);setOnlineHistory(entries);})} onImport={file=>run(()=>importBackup(file))}/>}
 {comparison&&page&&<CompareVersions current={page} incoming={{...comparison.draft,label:comparison.label}} templates={bundle.templates} mode={comparison.mode} busy={busy} onClose={()=>setComparison(null)} onRestore={()=>run(restoreCandidate)} onSaveCurrent={()=>run(async()=>{assertCurrent(comparison.id,comparison.generation);await save(latest.current,comparison.draft.head);})} onDownload={()=>backupJSON(`${page.id}-andere-versie.json`,comparison.draft.data)}/>}
 </>;
}

createRoot(document.getElementById('root')).render(<App/>);
