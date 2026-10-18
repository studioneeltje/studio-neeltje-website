import React, {useId, useState} from 'react';
import {cropValue} from '../shared/media.mjs';

export function CropEditor({src,value,onChange,focus={x:50,y:50},label='Uitsnede',focusOnly=false}) {
  const id=useId();const [shape,setShape]=useState('3/2');
  const current=cropValue(value,focus);
  function update(part){onChange({...current,...part});}
  function point(event){const box=event.currentTarget.querySelector('.focus-canvas').getBoundingClientRect();update({x:Math.round((event.clientX-box.left)/box.width*100),y:Math.round((event.clientY-box.top)/box.height*100)});}
  function move(event){const delta={ArrowLeft:{x:Math.max(0,current.x-1)},ArrowRight:{x:Math.min(100,current.x+1)},ArrowUp:{y:Math.max(0,current.y-1)},ArrowDown:{y:Math.min(100,current.y+1)}}[event.key];if(delta){event.preventDefault();update(delta);}}
  return <div className="crop-editor">
    <strong>{label}</strong>
    <p className="field-help">Kies het belangrijkste punt in de foto. Bekijk hieronder hoe dat in het vlak uitkomt.</p>
    {src ? <>
      <button type="button" className="focus-source" aria-label="Kies focuspunt in foto; gebruik ook de pijltjestoetsen" onClick={point} onKeyDown={move}>
        <span className="focus-canvas"><img src={src} alt="Volledige bronfoto" draggable="false"/>
        <span className="focus-marker" style={{left:`${current.x}%`,top:`${current.y}%`}} aria-hidden="true">＋</span></span>
      </button>
      <label htmlFor={`${id}-shape`}>Voorbeeldvlak<select id={`${id}-shape`} value={shape} onChange={e=>setShape(e.target.value)}><option value="16/9">Breed — header (16:9)</option><option value="3/2">Liggend — foto (3:2)</option><option value="1">Vierkant — kaart (1:1)</option><option value="2/3">Staand — mobiel (2:3)</option></select></label>
      <div className="crop-result" style={{aspectRatio:shape}}><img src={src} alt="Voorbeeld van de gekozen uitsnede" style={{objectPosition:`${current.x}% ${current.y}%`,transform:`scale(${current.zoom})`,transformOrigin:`${current.x}% ${current.y}%`}}/></div>
    </> : <p>Kies eerst een foto.</p>}
    <label htmlFor={`${id}-x`}>Horizontaal <output>{current.x}%</output><input id={`${id}-x`} type="range" min="0" max="100" value={current.x} onChange={e=>update({x:Number(e.target.value)})}/></label>
    <label htmlFor={`${id}-y`}>Verticaal <output>{current.y}%</output><input id={`${id}-y`} type="range" min="0" max="100" value={current.y} onChange={e=>update({y:Number(e.target.value)})}/></label>
    {!focusOnly&&<label htmlFor={`${id}-zoom`}>Inzoomen <output>{current.zoom.toFixed(2)}×</output><input id={`${id}-zoom`} type="range" min="1" max="3" step="0.05" value={current.zoom} onChange={e=>update({zoom:Number(e.target.value)})}/></label>}
    <button type="button" className="quiet-button" onClick={()=>onChange(null)}>Standaardfocus gebruiken</button>
    <p className="field-help">De bronfoto blijft intact. Alleen deze instelling verandert.</p>
  </div>;
}
