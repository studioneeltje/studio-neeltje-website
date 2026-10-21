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
CMS.init();
