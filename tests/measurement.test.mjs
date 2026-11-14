import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const analytics=await fs.readFile(new URL('../assets/analytics.js',import.meta.url),'utf8');
const forms=await fs.readFile(new URL('../assets/forms.js',import.meta.url),'utf8');
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.attributes={};this.listeners={};this.textContent='';this.dataset={};this.disabled=false;this.classList={contains:()=>false};}
 appendChild(child){this.children.push(child);child.parent=this;return child;}
 setAttribute(k,v){this.attributes[k]=v;}getAttribute(k){return this.attributes[k]??null;}hasAttribute(k){return k in this.attributes;}removeAttribute(k){delete this.attributes[k];}
 addEventListener(k,v){this.listeners[k]=v;}remove(){this.removed=true;}closest(){return this;}
}
function analyticsHarness({environment='production',enabled=true,consent='unknown',search='?email=testpersoon@example.test&utm_source=chatgpt',origin='https://www.studioneeltje.com',session=new Map(),referrer='https://chatgpt.com/c/prive-gesprek?email=testpersoon@example.test'}={}){
 const head=new Element('head'),body=new Element('body'),listeners={},window={};
 const config={environment,enabled,measurementId:'G-C20YD1PDYL',privacyURL:'/privacy-beleid',contactURL:'/contact',origin:'https://www.studioneeltje.com',pageType:'page'};
 const document={head,body,referrer,getElementById:()=>({textContent:JSON.stringify(config)}),createElement:tag=>new Element(tag),addEventListener:(name,fn)=>{listeners[name]=fn;}};
 const location={origin,href:origin+'/contact'+search,pathname:'/contact',hostname:new URL(origin).hostname,search};
 const storage=new Map(consent==='unknown'?[]:[['sn-analytics-consent-v1',consent]]);
 vm.runInNewContext(analytics,{document,window,location,URL,URLSearchParams,Date,Set,Promise,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},sessionStorage:{getItem:k=>session.get(k),setItem:(k,v)=>session.set(k,v),removeItem:k=>session.delete(k)}});
 const commands=()=>Array.from(window.dataLayer||[],args=>Array.from(args));
 const events=()=>commands().filter(c=>c[0]==='event');
 function button(text){const all=[];function visit(el){all.push(el);for(const c of el.children)visit(c);}visit(body);return all.filter(el=>!el.removed&&el.tagName==='button'&&el.textContent===text).at(-1);}
 return {head,body,window,commands,events,button,dispatch:(name,detail)=>listeners[name]?.({detail}),clickLink:href=>{const a=new Element('a');a.setAttribute('href',href);listeners.click?.({target:a});}};
}
test('Geen meting in preview, bij uitgeschakeld meten of tijdens een testbezoek',()=>{
 for(const options of [{environment:'preview',consent:'granted'},{enabled:false,consent:'granted'},{search:'?sn_test=1',consent:'granted'},{origin:'https://test.example',consent:'granted'}]){
  const h=analyticsHarness(options);assert.equal(h.head.children.length,0);assert.equal(h.events().length,0);
 }
});
test('Zonder toestemming wordt geen Google-tag geladen',()=>{
 const h=analyticsHarness();assert.equal(h.head.children.filter(e=>e.tagName==='script').length,0);assert.equal(h.events().length,0);
 h.button('Niet toestaan').listeners.click();assert.equal(h.events().length,0);
});
test('Na toestemming zijn klik en bevestigde aanvraag verschillende gebeurtenissen',()=>{
 const h=analyticsHarness();h.button('Toestaan').listeners.click();h.clickLink('mailto:info@studioneeltje.com');h.clickLink('/contact');
 assert.equal(h.events().filter(c=>c[1]==='contact_click').length,2);
 assert.equal(h.events().filter(c=>c[1]==='generate_lead').length,0);
 h.dispatch('sn:form-success',{kind:'contact',confirmed:false,receiptId:'mislukt'});
 assert.equal(h.events().filter(c=>c[1]==='generate_lead').length,0);
 h.dispatch('sn:form-success',{kind:'contact',confirmed:true,receiptId:'ontvangen',name:'TESTPERSOON',phone:'0612345678',email:'testpersoon@example.test'});
 h.dispatch('sn:form-success',{kind:'contact',confirmed:true,receiptId:'ontvangen'});
 assert.equal(h.events().filter(c=>c[1]==='generate_lead').length,1);
 const payload=JSON.stringify(h.commands());assert.ok(!payload.includes('TESTPERSOON'));assert.ok(!payload.includes('0612345678'));assert.ok(!payload.includes('testpersoon@example.test'));assert.ok(!payload.includes('prive-gesprek'));
 assert.equal(h.events().find(c=>c[1]==='generate_lead')[2].source_group,'chatgpt');
});
test('Checklist en nieuwsbrief tellen niet als trouwcontactaanvraag',()=>{
 const h=analyticsHarness({consent:'granted'});
 h.dispatch('sn:form-success',{kind:'checklist',confirmed:true,receiptId:'checklist'});h.dispatch('sn:form-success',{kind:'newsletter',confirmed:true,receiptId:'nieuwsbrief'});
 assert.equal(h.events().filter(c=>c[1]==='generate_lead').length,0);assert.equal(h.events().filter(c=>c[1]==='checklist_request_success').length,1);assert.equal(h.events().filter(c=>c[1]==='newsletter_signup').length,1);
});
test('Een aanvraag houdt de bron vast wanneer iemand eerst via een andere eigen pagina komt',()=>{
 const session=new Map();analyticsHarness({consent:'granted',search:'',referrer:'https://www.instagram.com/',session});
 const contact=analyticsHarness({consent:'granted',search:'',referrer:'https://www.studioneeltje.com/reportages',session});
 contact.dispatch('sn:form-success',{kind:'contact',confirmed:true,receiptId:'instagram-aanvraag'});
 assert.equal(contact.events().find(c=>c[1]==='generate_lead')[2].source_group,'instagram');
});
test('Toestemming intrekken en opnieuw geven werkt zonder dubbele Google-tag',()=>{
 const h=analyticsHarness({consent:'granted'});h.button('Privacykeuze').listeners.click();h.button('Niet toestaan').listeners.click();
 const n=h.events().length;h.dispatch('sn:form-success',{kind:'contact',confirmed:true,receiptId:'geweigerd'});assert.equal(h.events().length,n);assert.equal(h.window['ga-disable-G-C20YD1PDYL'],true);
 h.button('Privacykeuze').listeners.click();h.button('Toestaan').listeners.click();assert.equal(h.window['ga-disable-G-C20YD1PDYL'],false);assert.equal(h.head.children.filter(e=>e.tagName==='script').length,1);
});
async function submit({ok=true,success=true,activated=true,preview=false,valid=true,honey='',reject=false,checklist=false,checked=true}={}){
 const form=new Element('form'),status=new Element('p'),button=new Element('button');form.dataset={formKind:checklist?'checklist':'contact',formReady:'true'};form.reportValidity=()=>valid;form.reset=()=>{};
 const consent={checked,focus(){},closest:()=>({querySelector:()=>({textContent:'Checklist en nieuwsbrieven ontvangen; uitschrijven kan altijd.'})})};
 form.querySelector=selector=>selector==='[type="submit"]'?button:selector==='[data-checklist-newsletter]'?consent:status;
 const events=[],calls=[],assigned=[],storage=new Map(),service={provider:'json',endpoint:'https://forms.example.test/aanvraag',activated};
 const config={preview,services:{contact:service,checklist:service},routes:{contact:'/bedankt-contact',checklist:'/bedankt-checklist'},thanks:{}};
 const document={getElementById:()=>({textContent:JSON.stringify(config)}),querySelectorAll:()=>[form],querySelector:()=>null,body:new Element('body'),createElement:tag=>new Element(tag),dispatchEvent:event=>events.push(event)};
 class Data{entries(){return Object.entries({...checklist?{email:'testpersoon@example.test'}:{names:'Testpersoon',phone:'0612345678'},website_url:honey});}get(key){return Object.fromEntries(this.entries())[key];}}
 const location={href:'https://www.studioneeltje.com/contact',assign:url=>assigned.push(url),search:''};
 vm.runInNewContext(forms,{document,window:{},location,FormData:Data,AbortController,CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail;}},fetch:async(url,options)=>{calls.push({url,options});if(reject)throw Error('netwerk');return {ok,json:async()=>({success})};},setTimeout,clearTimeout,URL,URLSearchParams,sessionStorage:{setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)},Date,Math,globalThis:{crypto:{randomUUID:()=> 'test-ontvangst'}},Promise});
 await form.listeners.submit({preventDefault(){}});return {calls,events,assigned,status,storage};
}
test('Alleen een succesvolle backendbevestiging geeft een aanvraaggebeurtenis en bedankt-route',async()=>{
 for(const options of [{ok:false},{success:false},{activated:false},{preview:true},{valid:false},{honey:'spam'},{reject:true},{checklist:true,checked:false}]){
  const h=await submit(options);assert.equal(h.events.length,0);assert.equal(h.assigned.length,0);
 }
 const h=await submit();assert.equal(h.events.length,1);assert.equal(h.events[0].type,'sn:form-success');assert.equal(h.events[0].detail.confirmed,true);assert.equal(h.assigned.length,1);
 assert.deepEqual(Object.keys(h.events[0].detail).sort(),['confirmed','kind','receiptId']);
 const receipt=h.storage.get('sn-form-receipt');assert.ok(!receipt.includes('Testpersoon'));assert.ok(!receipt.includes('0612345678'));
});

test('Checklist geeft de PDF vrij op de bevestigingspagina na een geslaagde aanvraag', async () => {
 const result = await submit({checklist:true});
 assert.deepEqual(result.assigned,['https://www.studioneeltje.com/bedankt-checklist']);
 const payload = JSON.parse(result.calls[0].options.body);
 assert.equal(payload.email,'testpersoon@example.test');
 assert.equal(payload.newsletter_consent,'yes');
 assert.equal(result.events[0].detail.kind,'checklist');

 const location = {href:result.assigned[0],origin:'https://www.studioneeltje.com',search:''};
 const config = {services:{checklistFile:'/downloads/trouwchecklist.pdf'},thanks:{checklist:{title:'Jullie trouwchecklist'}}};
 function showDownload(storage) {
  const download = new Element('a');
  download.hidden = true;
  const title = new Element('h1');
  const page = new Element('section');
  page.dataset.thanksKind = 'checklist';
  page.querySelector = selector => ({
   '[data-thanks-download]': download,
   '[data-thanks-title]': title,
  })[selector];
  const document = {
   getElementById: () => ({textContent:JSON.stringify(config)}),
   querySelectorAll: () => [],
   querySelector: () => page,
   body: new Element('body'),
  };
  vm.runInNewContext(forms,{document,location,URL,URLSearchParams,sessionStorage:{getItem:key=>storage.get(key)},Date});
  return {download,title};
 }
 assert.equal(showDownload(new Map()).download.hidden,true);
 const {download,title} = showDownload(result.storage);
 assert.equal(title.textContent,'Jullie trouwchecklist');
 assert.equal(download.hidden,false);
 assert.equal(download.href,'https://www.studioneeltje.com/downloads/trouwchecklist.pdf');
});
