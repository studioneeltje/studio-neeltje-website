import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{CropEditor}from'./CropEditor.jsx';
import{VisualMediaPicker}from'./MediaPicker.jsx';
import{thumbnailURL}from'../shared/media.mjs';
import{onlineLibrary,localLibrary}from'./shared-library.mjs';
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
let libraryPromise;
const libraryListeners=new Set(),localURLs=new Map();
const localURL=(file,path)=>{const key=`${path}:${file.size}:${file.lastModified}`;if(!localURLs.has(key))localURLs.set(key,URL.createObjectURL(file));return localURLs.get(key);};
window.addEventListener('pagehide',()=>{for(const url of localURLs.values())URL.revokeObjectURL(url);localURLs.clear();});
function loadLibrary(refresh=false){
 if(refresh||!libraryPromise)libraryPromise=(async()=>{
  const response=await fetch(new URL('content/bundle.json',ROOT),{cache:'no-cache'});
  if(!response.ok)throw Error('De beeldbank kon niet laden. Je huidige fotoselectie blijft behouden.');
  let data=await response.json();
  try{data=await onlineLibrary(data);}catch(error){data={...data,libraryWarning:error.message,libraryNotice:'Alleen de laatst gepubliceerde beeldbank is geladen; de online concepten konden niet worden bijgewerkt.'};}
  try{data=localLibrary(data,await getUploads(),readLocal('mediaChanges',[]),localURL);}catch{data={...data,libraryWarning:[data.libraryWarning,'Lokale uploads konden niet worden gelezen. Online foto’s blijven beschikbaar.'].filter(Boolean).join(' ')};}
  for(const listener of libraryListeners)listener(data);
  return data;
 })().catch(error=>{libraryPromise=null;throw error;});
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
CMS.registerPreviewTemplate('stories',({entry,getAsset})=>{
  const h=CMS.React.createElement;const title=entry.getIn(['data','title']);const body=entry.getIn(['data','body']);
  return h('article',{style:{fontFamily:'sans-serif',color:'#65001d',padding:30}},h('h1',null,title),h('p',null,entry.getIn(['data','location'])),h('p',{style:{whiteSpace:'pre-wrap',lineHeight:1.7}},body));
});
CMS.init();
