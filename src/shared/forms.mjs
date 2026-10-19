import {escapeHTML as e,safeURL} from './media.mjs';
export const THANKS_ROUTES={contact:'bedankt-contact.html',availability:'bedankt-datum.html',newsletter:'bedankt-nieuwsbrief.html',checklist:'bedankt-checklist.html'};
export function formService(kind,settings){return settings.forms?.[kind==='availability'?'contact':kind]||{};}
export function formIsReady(kind,settings){const service=formService(kind,settings);return service.provider==='json'&&service.activated===true&&/^https:\/\//i.test(safeURL(service.endpoint,''));}
export function formSettingsScript(settings,{preview=false}={}){
 const data={preview,services:settings.forms||{},thanks:settings.experience?.thanks||{},routes:THANKS_ROUTES};
 return `<script type="application/json" id="sn-form-settings">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`;
}
export function prepareForms(html,settings,{preview=false,defaultKind='contact'}={}){
 return html.replace(/<form\b([^>]*)>([\s\S]*?)<\/form>/g,(_,attrs,body)=>{
  let kind=attrs.match(/\bdata-form="([^"]+)"/)?.[1]||defaultKind;
  if(/availability-form/.test(attrs))kind='availability';
  if(!THANKS_ROUTES[kind])kind='contact';
  const ready=!preview&&formIsReady(kind,settings);
  const recipient=String(settings.forms?.recipient||settings.email||'').trim();
  const mail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)?`<a href="mailto:${e(recipient)}">${e(recipient)}</a>`:'';
  const note=preview?'Voorvertoning: dit formulier verstuurt geen gegevens.':ready?'':kind==='newsletter'?'Inschrijven voor de nieuwsbrief wordt nog aangesloten.':kind==='checklist'?'Het aanvraagformulier en de download worden nog klaargezet.':`Het online formulier wordt nog aangesloten.${mail?' Stuur je bericht naar '+mail+'.':''}`;
  body=body.replace(/<button\b([^>]*\btype="submit"[^>]*)>/g,(whole,a)=>`<button${a}${ready?'':' disabled aria-disabled="true"'}>`);
  const privacy=safeURL(settings.forms?.privacyURL,'');
  body+=`<div class="sn-form-honey" aria-hidden="true"><label>Laat dit veld leeg<input name="website_url" type="text" autocomplete="off" tabindex="-1"></label></div>${note?`<p class="sn-form-connection-note">${note}</p>`:''}${privacy?`<p class="sn-form-connection-note"><a href="${e(privacy)}">Hoe ik met jullie gegevens omga</a></p>`:''}`;
  const clean=attrs.replace(/\s(?:action|method|data-form|data-form-kind)="[^"]*"/g,'');
  return `<form${clean} method="post" data-form-kind="${kind}"${ready?` data-form-ready="true"`:''}>${body}</form>`;
 });
}
