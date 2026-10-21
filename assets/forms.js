/* Only a configured, explicitly enabled public JSON endpoint may receive data.
   The testsite ships with all delivery switches off. No keys belong in this file. */
(() => {
 const source=document.getElementById('sn-form-settings');if(!source)return;
 let config;try{config=JSON.parse(source.textContent);}catch{return;}
 const preview=config.preview||Boolean(document.querySelector('.preview-label'))||document.body.classList.contains('sn-preview');
 document.querySelectorAll('form[data-form-kind]').forEach(form=>{
  let busy=false;
  function message(text,error=false){let status=form.querySelector('[data-form-status],.standalone-form-status,.availability-status');if(!status){status=document.createElement('p');form.appendChild(status);}status.hidden=false;status.setAttribute('role',error?'alert':'status');status.textContent=text;}
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(busy)return;
   const kind=form.dataset.formKind;
   const service=config.services[kind==='availability'?'contact':kind];
   if(preview||form.dataset.formReady!=='true'||service?.provider!=='json'||service?.activated!==true){message('Dit formulier is nog niet aangesloten. Er zijn geen gegevens verstuurd.');return;}
   if(!form.reportValidity())return;
   const data=new FormData(form);if(String(data.get('website_url')||'').trim()){message('Het formulier kon niet worden verstuurd.',true);return;}
   const payload={form:kind,...Object.fromEntries([...data.entries()].filter(([key,value])=>key!=='website_url'&&typeof value==='string'))};
   if(kind==='checklist'){
    const consent=form.querySelector('[data-checklist-newsletter]');
    if(!consent?.checked){message('Vink aan dat je de trouwchecklist en nieuwsbrieven wilt ontvangen.',true);consent?.focus();return;}
    payload.newsletter_consent='yes';
    payload.newsletter_consent_text=consent.closest('label')?.querySelector('span')?.textContent||'';
    payload.newsletter_consent_at=new Date().toISOString();
   }
   busy=true;form.setAttribute('aria-busy','true');const button=form.querySelector('[type="submit"]');if(button)button.disabled=true;message('Even versturen…');
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
   try{
    const endpoint=new URL(service.endpoint);if(endpoint.protocol!=='https:')throw Error('endpoint');
    const response=await fetch(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),credentials:'omit',signal:controller.signal});
    const result=await response.json();if(!response.ok||result.success!==true)throw Error('submission');
    // This marker contains no personal data and is set only after backend acceptance.
    let remembered=false;try{sessionStorage.setItem('sn-form-receipt',JSON.stringify({kind,at:Date.now()}));remembered=true;}catch{}
    if(remembered){location.assign(new URL(config.routes[kind],location.href).href);return;}
    message(config.thanks[kind]?.copy||'Je aanvraag is ontvangen.');form.reset();
   }catch(error){message(error.name==='AbortError'?'Er kwam geen bevestiging van de verzenddienst. Controleer de verbinding of neem rechtstreeks contact op.':'Versturen is niet gelukt. Probeer opnieuw of neem rechtstreeks contact op.',true);if(button)button.disabled=false;}
   finally{clearTimeout(timeout);busy=false;form.removeAttribute('aria-busy');}
  });
 });
 const page=document.querySelector('[data-thanks-kind]');if(!page)return;
 let receipt;try{receipt=JSON.parse(sessionStorage.getItem('sn-form-receipt'));}catch{}
 const kind=page.dataset.thanksKind;
 const confirmed=receipt?.kind===kind&&Number.isFinite(receipt.at)&&Date.now()-receipt.at>=0&&Date.now()-receipt.at<3600000;
 const example=new URLSearchParams(location.search).get('voorbeeld')==='1';
 if(!confirmed&&!example)return;
 if(example&&!confirmed&&!page.querySelector('.sn-thanks-notice')){const notice=document.createElement('p');notice.className='sn-thanks-notice';notice.textContent='Voorbeeld van de bevestiging na een geslaagde verzending. Er is nu niets verstuurd.';page.querySelector('.sn-thanks-top')?.after(notice);}
 const data=config.thanks[kind];if(!data)return;
 for(const [key,selector]of Object.entries({title:'[data-thanks-title]',emphasis:'[data-thanks-emphasis]',copy:'[data-thanks-copy]',nextTitle:'[data-thanks-next-title]',nextCopy:'[data-thanks-next-copy]'})){
  const element=page.querySelector(selector);if(element)element.textContent=data[key]||'';
 }
 const download=page.querySelector('[data-thanks-download]');
 if(confirmed&&kind==='checklist'&&download&&config.services.checklistFile){try{const url=new URL(config.services.checklistFile,location.href);if(['https:','http:'].includes(url.protocol)&&url.origin===location.origin){download.href=url.href;download.hidden=false;download.setAttribute('download','');}}catch{}}
})();
