import {renderArticle} from '../shared/article.mjs';
import {inlinePreviewPhotos} from './preview-images.mjs';
import {projectMarkup} from '../shared/project-story.mjs';
import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{CropEditor}from'./CropEditor.jsx';
import{VisualMediaPicker}from'./MediaPicker.jsx';
import{thumbnailURL}from'../shared/media.mjs';
import{onlineLibrary,localLibrary,savedOnlineLibrary}from'./shared-library.mjs';
import{getUploads,readLocal}from'./storage.mjs';
import'./editor.css';

const CMS=window.CMS;
class FocusControl extends CMS.React.Component{
  componentDidMount(){this.root=createRoot(this.host);this.draw();}
  componentDidUpdate(){this.draw();}
  componentWillUnmount(){this.root.unmount();}
  draw(){if(this.props.entry.getIn(['data','kind'])==='video'){this.root.render(<p className="field-help">Een focuspunt geldt alleen voor foto’s. Video’s behouden hun volledige beeldverhouding.</p>);return;}const value=this.props.value?.toJS?.()||this.props.value;const source=this.props.entry.getIn(['data','source']);const asset=source&&this.props.getAsset(source);this.root.render(<CropEditor focusOnly src={asset?.url||source} value={value} label="Standaardfocus" onChange={v=>this.props.onChange(v||{x:50,y:50})}/>);}
  render(){return CMS.React.createElement('div',{ref:el=>{this.host=el;}});}
}
CMS.registerFieldType('neeltje-focus',FocusControl);
const ROOT=new URL('../',location.href).href;
let libraryPromise,libraryLoading=false,lastLibrary;
const SNAPSHOT="studio-neeltje-online-library-v2";
try{lastLibrary=JSON.parse(localStorage.getItem(SNAPSHOT)||"null");}catch{}
const libraryListeners=new Set(),localURLs=new Map();
const localURL=(file,path)=>{const key=`${path}:${file.size}:${file.lastModified}`;if(!localURLs.has(key))localURLs.set(key,URL.createObjectURL(file));return localURLs.get(key);};
window.addEventListener('pagehide',()=>{for(const url of localURLs.values())URL.revokeObjectURL(url);localURLs.clear();});
function loadLibrary(refresh=false){
 if(libraryLoading)return libraryPromise;
 if(refresh||!libraryPromise){libraryLoading=true;libraryPromise=(async()=>{
  const response=await fetch(new URL('content/bundle.json',ROOT),{cache:'no-cache'});
  if(!response.ok)throw Error('De beeldbank kon niet laden. Je huidige fotoselectie blijft behouden.');
  let data=await response.json();
  try{data=await onlineLibrary(data);lastLibrary={media:data.media,manifest:data.manifest};try{localStorage.setItem(SNAPSHOT,JSON.stringify(lastLibrary));}catch{}}catch(error){data={...data,...(lastLibrary||{}),libraryWarning:error.message,libraryNotice:lastLibrary?'Je laatst succesvol opgehaalde beeldbank blijft beschikbaar. Nieuwe online wijzigingen zijn nog niet opgehaald.':'De gepubliceerde beeldbank is beschikbaar. Online concepten konden nog niet worden opgehaald.'};}
  if(data.libraryWarning)data=savedOnlineLibrary(data,readLocal('mediaDraft',null));
  try{data=localLibrary(data,await getUploads(),readLocal('mediaChanges',[]),localURL);}catch{data={...data,libraryWarning:[data.libraryWarning,'Lokale uploads konden niet worden gelezen. Online foto’s blijven beschikbaar.'].filter(Boolean).join(' ')};}
  for(const listener of libraryListeners)listener(data);
  return data;
 })().catch(error=>{libraryPromise=null;throw error;}).finally(()=>{libraryLoading=false;});}
 return libraryPromise;
}
function PhotoChooser({value,onChange,field,forID}){
 const[data,setData]=useState(null),[error,setError]=useState(''),[picking,setPicking]=useState(false),[loading,setLoading]=useState(false);
 const multiple=field.get('multiple')===true,current=value?.toJS?.()??value,ids=(multiple?(Array.isArray(current)?current:[]):[current]).filter(Boolean);
 async function refresh(force=false){try{setLoading(true);setError('');setData(await loadLibrary(force));}catch(error){setError(error.message);}finally{setLoading(false);}}
 useEffect(()=>{let active=true;const listener=next=>{if(active)setData(next);};libraryListeners.add(listener);loadLibrary().then(listener).catch(error=>{if(active)setError(error.message);});return()=>{active=false;libraryListeners.delete(listener);};},[]);
 return <div className="cms-photo-control"><div className="cms-photo-actions"><button type="button" id={forID} disabled={!data} onClick={()=>setPicking(true)}>{multiple?'Foto’s visueel kiezen':'Foto visueel kiezen'} ↗</button><button type="button" className="quiet-button" disabled={loading} onClick={()=>refresh(true)}>{loading?'Beeldbank ophalen…':'Beeldbank vernieuwen'}</button>{ids.length>0&&<button type="button" className="quiet-button" onClick={()=>onChange(multiple?[]:'')}>Leegmaken</button>}</div>{error&&<p role="alert">{error}</p>}{data?.libraryWarning&&<p role="alert">{data.libraryWarning}</p>}{data?.libraryNotice&&<p className="field-help" role="status">{data.libraryNotice}</p>}{data&&<div className="cms-photo-selection">{ids.map((id,index)=>{const asset=data.media.find(a=>a.id===id&&!a.deletedAt);return <div key={`${id}-${index}`}>{asset&&!asset.libraryMissing&&!data.manifest?.[id]?.missing?<img src={thumbnailURL(asset,data.manifest,ROOT)} alt={asset.alt||asset.title} loading="lazy"/>:<p className="missing-photo-note">Foto ontbreekt — kies een nieuwe foto.</p>}<small>{asset?.title||id}</small></div>;})}</div>}<p className="field-help">Nieuwe foto’s upload je in <a href="../beheer/" target="_blank" rel="noreferrer">Puck → Media ↗</a>. Sla de media daar online op en klik hier op Beeldbank vernieuwen. Ook online mediaconcepten worden getoond. Publiceer die media vóór je de pagina of reportage publiceert. Foto’s die alleen op dit apparaat staan zijn zichtbaar ter herkenning, maar nog niet plaatsbaar. Je hoeft niets opnieuw te uploaden.</p>{picking&&data&&<VisualMediaPicker media={data.media} manifest={data.manifest} assetBaseURL={ROOT} value={ids} multiple={multiple} onClose={()=>setPicking(false)} onChoose={selected=>{onChange(selected);setPicking(false);}}/>}</div>;
}
class PhotoControl extends CMS.React.Component{
 componentDidMount(){this.root=createRoot(this.host);this.draw();}
 componentDidUpdate(){this.draw();}
 componentWillUnmount(){this.root.unmount();}
 draw(){this.root.render(<PhotoChooser {...this.props}/>);}
 render(){return CMS.React.createElement('div',{ref:el=>{this.host=el;}});}
}
CMS.registerFieldType('neeltje-image',PhotoControl,undefined,{type:'object',properties:{multiple:{type:'boolean'}}});
function ProjectPreview({record}){
 const [context,setContext]=useState(null);
 useEffect(()=>{let active=true;loadLibrary().then(data=>{if(active)setContext(data);}).catch(()=>{});return()=>{active=false;};},[]);
 if(!context)return <p>Voorvertoning laden…</p>;
 const html=projectMarkup(record,{...context,assetBaseURL:ROOT,preview:true});
 const source=`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${ROOT}"><link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600;800&family=Playfair+Display:ital,wght@1,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/theme.css"><link rel="stylesheet" href="assets/site.css"><link rel="stylesheet" href="assets/blocks.css"><link rel="stylesheet" href="assets/design.css"></head><body class="sn-public"><main class="mode mode-canvas active">${html}</main></body></html>`;
 return <iframe title="Voorvertoning van deze reportage" sandbox="" srcDoc={source} style={{width:'100%',height:'90vh',border:0}}/>;
}
class ProjectPreviewControl extends CMS.React.Component{
 componentDidMount(){this.root=createRoot(this.host);this.draw();}
 componentDidUpdate(){this.draw();}
 componentWillUnmount(){this.root.unmount();}
 draw(){this.root.render(<ProjectPreview record={this.props.entry.get('data').toJS()}/>);}
 render(){return CMS.React.createElement('div',{ref:el=>{this.host=el;}});}
}
CMS.registerPreviewTemplate('stories',ProjectPreviewControl);

function prepareArticlePreview(markup){
 const doc=new DOMParser().parseFromString(markup,'text/html'),headings=[],used=new Set();
 doc.querySelectorAll('h2,h3').forEach(el=>{const title=el.textContent,base=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'onderwerp';let id='lees-'+base,n=2;while(used.has(id))id='lees-'+base+'-'+n++;used.add(id);el.id=id;headings.push({id,title,sub:el.tagName==='H3'});});
 return {html:doc.body.innerHTML,headings};
}
function usePreviewPhotos(markup){
 const [prepared,setPrepared]=useState({markup:'',html:'',failed:0}),[attempt,setAttempt]=useState(0);
 useEffect(()=>{let active=true;if(markup)inlinePreviewPhotos(markup).then(result=>{if(active)setPrepared({markup,...result});}).catch(()=>{if(active)setPrepared({markup,html:'',failed:1});});return()=>{active=false;};},[markup,attempt]);
 return {...prepared,ready:prepared.markup===markup,retry:()=>{setPrepared({markup:'',html:'',failed:0});setAttempt(value=>value+1);}};
}
function ArticlePreview({record}){
 const [context,setContext]=useState(null),[error,setError]=useState(''),[mobile,setMobile]=useState(false),[large,setLarge]=useState(false);
 useEffect(()=>{let active=true;const listener=data=>{if(active){setContext(data);setError('');}};libraryListeners.add(listener);loadLibrary().then(listener).catch(()=>{if(active)setError('De voorvertoning kon niet laden. Je tekst blijft behouden. Vernieuw de beheeromgeving nadat je je werk hebt opgeslagen.');});return()=>{active=false;libraryListeners.delete(listener);};},[]);
 const markup=context?renderArticle(record,{...context,assetBaseURL:ROOT,preview:true},prepareArticlePreview):'';
 const photos=usePreviewPhotos(markup);
 if(error)return <p role="alert">{error}</p>;
 if(!context)return <p role="status">Je blog in de website-opmaak laden…</p>;
 const html=photos.ready?photos.html:'';
 const source=`<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><base href="${ROOT}"><link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;600;800&family=Playfair+Display:ital,wght@1,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="assets/theme.css"><link rel="stylesheet" href="assets/site.css"><link rel="stylesheet" href="assets/blocks.css"><link rel="stylesheet" href="assets/design.css"></head><body class="sn-public"><main class="mode mode-canvas active">${html}</main><script>document.addEventListener('click',function(event){var link=event.target.closest('a');if(link){event.preventDefault();var href=link.getAttribute('href')||'';if(href.startsWith('#')){var target=document.getElementById(href.slice(1));if(target)target.scrollIntoView({behavior:'smooth'});}}});var bar=document.querySelector('.sn-article-progress');if(bar){bar.hidden=false;function update(){var total=document.documentElement.scrollHeight-innerHeight;var progress=total>0?Math.min(100,Math.max(0,scrollY/total*100)):0;bar.setAttribute('aria-valuenow',Math.round(progress));bar.querySelector('span').style.width=progress+'%';}addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}<\/script></body></html>`;
 const frame=!photos.ready?<p role="status">Foto’s in je voorvertoning laden…</p>:<iframe title="Visuele voorvertoning van je blog" sandbox="allow-scripts" srcDoc={source} style={{display:'block',width:mobile?'390px':'100%',maxWidth:'100%',height:large?'calc(100vh - 160px)':'80vh',border:0,margin:'0 auto',background:'#fff'}}/>;
 return <section style={large?{position:'fixed',inset:12,zIndex:10000,background:'#f5f5f5',padding:16,overflow:'auto',boxShadow:'0 0 0 40px #0008'}:{}} role={large?'dialog':undefined} aria-modal={large?true:undefined} aria-label="Blogvoorvertoning" onKeyDown={event=>{if(event.key==='Escape')setLarge(false);}}>
 <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12}}><button type="button" onClick={()=>setMobile(false)} aria-pressed={!mobile}>Desktop</button><button type="button" onClick={()=>setMobile(true)} aria-pressed={mobile}>Mobiel</button><button type="button" onClick={()=>setLarge(!large)}>{large?'Sluit groot voorbeeld':'Groot bekijken ↗'}</button></div>
 <p style={{fontSize:14,margin:'0 0 12px'}}>Dit is je huidige concept in de website-opmaak, ook vóór het opslaan. Er wordt niets gepubliceerd. Links naar andere pagina’s zijn hier uitgeschakeld.</p>{photos.ready&&photos.failed>0&&<p role="alert">Niet alle foto’s konden laden. Je fotokeuzes blijven behouden. <button type="button" onClick={photos.retry}>Foto’s opnieuw laden</button></p>}{frame}</section>;
}
class ArticlePreviewControl extends CMS.React.Component{
 componentDidMount(){this.root=createRoot(this.host);this.draw();}
 componentDidUpdate(){this.draw();}
 componentWillUnmount(){this.root.unmount();}
 draw(){this.root.render(<ArticlePreview record={this.props.entry.get('data').toJS()}/>);}
 render(){return CMS.React.createElement('div',{ref:el=>{this.host=el;}});}
}
CMS.registerPreviewTemplate('articles',ArticlePreviewControl);

CMS.init();
