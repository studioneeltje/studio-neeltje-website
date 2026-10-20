import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import{CropEditor}from'./CropEditor.jsx';
import{VisualMediaPicker}from'./MediaPicker.jsx';
import{thumbnailURL}from'../shared/media.mjs';
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
function loadLibrary(refresh=false){if(refresh||!libraryPromise)libraryPromise=fetch(new URL('content/bundle.json',ROOT),{cache:'no-cache'}).then(response=>{if(!response.ok)throw Error('De beeldbank kon niet laden. Probeer het opnieuw.');return response.json();}).catch(error=>{libraryPromise=null;throw error;});return libraryPromise;}
function PhotoChooser({value,onChange,field,forID}){
 const[data,setData]=useState(null),[error,setError]=useState(''),[picking,setPicking]=useState(false);
 const multiple=field.get('multiple')===true,current=value?.toJS?.()??value,ids=(multiple?(Array.isArray(current)?current:[]):[current]).filter(Boolean);
 async function refresh(force=false){try{setError('');setData(await loadLibrary(force));}catch(error){setError(error.message);}}
 useEffect(()=>{void refresh();},[]);
 return <div className="cms-photo-control"><div className="cms-photo-actions"><button type="button" id={forID} disabled={!data} onClick={()=>setPicking(true)}>{multiple?'Foto’s visueel kiezen':'Foto visueel kiezen'} ↗</button><button type="button" className="quiet-button" onClick={()=>refresh(true)}>Beeldbank vernieuwen</button>{ids.length>0&&<button type="button" className="quiet-button" onClick={()=>onChange(multiple?[]:'')}>Leegmaken</button>}</div>{error&&<p role="alert">{error}</p>}{data&&<div className="cms-photo-selection">{ids.map((id,index)=>{const asset=data.media.find(a=>a.id===id&&!a.deletedAt);return <div key={`${id}-${index}`}>{asset?<img src={thumbnailURL(asset,data.manifest,ROOT)} alt={asset.alt||asset.title} loading="lazy"/>:<p className="missing-photo-note">Foto ontbreekt — kies een nieuwe foto.</p>}<small>{asset?.title||id}</small></div>;})}</div>}<p className="field-help">Nieuwe foto’s upload je in <a href="../beheer/" target="_blank" rel="noreferrer">Puck → Media ↗</a>. Publiceer de media en vernieuw daarna deze beeldbank. Dezelfde foto’s blijven in alle onderdelen beschikbaar.</p>{picking&&data&&<VisualMediaPicker media={data.media} manifest={data.manifest} assetBaseURL={ROOT} value={ids} multiple={multiple} onClose={()=>setPicking(false)} onChoose={selected=>{onChange(selected);setPicking(false);}}/>}</div>;
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
