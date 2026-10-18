import React from'react';
import{createRoot}from'react-dom/client';
import{CropEditor}from'./CropEditor.jsx';
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
CMS.registerPreviewTemplate('stories',({entry,getAsset})=>{
  const h=CMS.React.createElement;const title=entry.getIn(['data','title']);const body=entry.getIn(['data','body']);
  return h('article',{style:{fontFamily:'sans-serif',color:'#65001d',padding:30}},h('h1',null,title),h('p',null,entry.getIn(['data','location'])),h('p',{style:{whiteSpace:'pre-wrap',lineHeight:1.7}},body));
});
CMS.init();
