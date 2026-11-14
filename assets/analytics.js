/* Optional measurement. No tag, cookie or event is sent from previews or before consent. */
(() => {
 const node=document.getElementById('sn-analytics-settings');if(!node)return;
 let config;try{config=JSON.parse(node.textContent);}catch{return;}
 if(config.environment!=='production'||config.enabled!==true||!/^G-[A-Z0-9]+$/.test(config.measurementId||'')||!config.privacyURL)return;
 if(config.origin&&location.origin!==config.origin)return;
 if(new URLSearchParams(location.search).get('sn_test')==='1')return;
 const id=config.measurementId,key='sn-analytics-consent-v1';let consent='denied',loaded=false;
 const sent=new Set();
 try{consent=localStorage.getItem(key)||'unknown';}catch{consent='unknown';}
 function incomingSource(){
  let host='';try{host=new URL(document.referrer).hostname;}catch{}
  const utm=new URLSearchParams(location.search).get('utm_source')?.toLowerCase();
  if(['google','instagram','facebook','linkedin','chatgpt'].includes(utm))return utm;
  if(/(^|\.)google\.[a-z.]+$/.test(host))return 'google';
  if(/(^|\.)(instagram\.com|l\.instagram\.com)$/.test(host))return 'instagram';
  if(/(^|\.)(facebook\.com|fb\.com)$/.test(host))return 'facebook';
  if(/(^|\.)(linkedin\.com|lnkd\.in)$/.test(host))return 'linkedin';
  if(/(^|\.)(chatgpt\.com|chat\.openai\.com)$/.test(host))return 'chatgpt';
  return host&&host!==location.hostname?'other':'direct';
 }
 function sourceGroup(){
  const now=Date.now();let group=incomingSource();
  try{const previous=JSON.parse(sessionStorage.getItem('sn-source-group-v1')||'null');if(previous&&now-previous.at<1800000&&['google','instagram','facebook','linkedin','chatgpt','other','direct'].includes(previous.group))group=previous.group;sessionStorage.setItem('sn-source-group-v1',JSON.stringify({group,at:now}));}catch{}
  return group;
 }
 function referrerOrigin(){try{return new URL(document.referrer).origin;}catch{return '';}}
 function gtag(){window.dataLayer.push(arguments);}
 function start(){
  if(consent!=='granted')return;
  if(loaded){window['ga-disable-'+id]=false;gtag('consent','update',{analytics_storage:'granted'});return;}
  loaded=true;window['ga-disable-'+id]=false;window.dataLayer=window.dataLayer||[];
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('consent','update',{analytics_storage:'granted'});gtag('js',new Date());
  gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:referrerOrigin(),page_title:'Studio Neeltje · '+config.pageType});
  const tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.appendChild(tag);
  gtag('event','page_view',{page_type:config.pageType,source_group:sourceGroup()});
 }
 function event(name,parameters={}){if(consent!=='granted'||!loaded)return false;gtag('event',name,{page_type:config.pageType,source_group:sourceGroup(),...parameters});return true;}
 document.addEventListener('sn:form-success',e=>{
  const detail=e.detail||{},names={contact:'generate_lead',availability:'generate_lead',checklist:'checklist_request_success',newsletter:'newsletter_signup'};
  if(detail.confirmed!==true||!names[detail.kind]||!detail.receiptId||sent.has(detail.receiptId)||consent!=='granted'||!loaded)return;
  sent.add(detail.receiptId);
  detail.waitUntil=new Promise(resolve=>event(names[detail.kind],{lead_type:detail.kind,event_callback:resolve,event_timeout:1000}));
 });
 document.addEventListener('click',e=>{
  const link=e.target.closest?.('a[href]'),href=link?.getAttribute('href');
  if(href?.startsWith('mailto:'))event('contact_click',{contact_method:'email'});
  else if(href?.startsWith('tel:'))event('contact_click',{contact_method:'phone'});
  else if(href&&config.contactURL){
   let url;try{url=new URL(href,location.href);}catch{}
   if(url?.origin===location.origin&&url.pathname===config.contactURL)event('contact_click',{contact_method:'page'});
  }else if(!link&&e.target.closest?.('[data-contact-jump]'))event('contact_click',{contact_method:'form'});
  if(link?.hasAttribute('data-checklist-download'))event('checklist_download');
 });
 const style=document.createElement('style');style.textContent='.sn-analytics-choice{position:fixed;z-index:10000;bottom:20px;left:20px;max-width:440px;padding:24px;background:#fde6f2;color:#65001d;border:1px solid #65001d;border-radius:18px;box-shadow:0 8px 40px #65001d25;font:16px/1.5 "Host Grotesk",sans-serif}.sn-analytics-choice h2{font:700 22px/1.2 "Host Grotesk",sans-serif;margin:0 0 12px}.sn-analytics-choice button,.sn-analytics-settings{font:inherit;border:1px solid #65001d;color:#65001d;background:transparent;border-radius:999px;padding:10px 18px;cursor:pointer}.sn-analytics-choice button{margin:8px 8px 0 0}.sn-analytics-settings{position:fixed;bottom:8px;left:8px;background:#fde6f2;font-size:12px;z-index:9999}';document.head.appendChild(style);
 let panel;const settings=document.createElement('button');settings.type='button';settings.className='sn-analytics-settings';settings.textContent='Privacykeuze';settings.addEventListener('click',show);document.body.appendChild(settings);
 function choose(value){consent=value;try{localStorage.setItem(key,value);}catch{}panel?.remove();panel=null;
  if(value==='granted')start();else{window['ga-disable-'+id]=true;try{sessionStorage.removeItem('sn-source-group-v1');}catch{}if(loaded)gtag('consent','update',{analytics_storage:'denied'});}
 }
 function show(){if(panel)return;panel=document.createElement('section');panel.className='sn-analytics-choice';panel.setAttribute('role','region');panel.setAttribute('aria-label','Keuze voor bezoekersmeting');
  const heading=document.createElement('h2');heading.textContent='Mag ik zien wat helpt?';panel.appendChild(heading);
  const copy=document.createElement('p');copy.textContent='Met jouw toestemming meet ik welke pagina’s en contactmogelijkheden worden gebruikt. Zonder toestemming blijft de website gewoon werken.';panel.appendChild(copy);
  const privacy=document.createElement('a');privacy.href=config.privacyURL;privacy.textContent='Lees de privacy-informatie';panel.appendChild(privacy);panel.appendChild(document.createElement('br'));
  for(const [label,value] of [['Niet toestaan','denied'],['Toestaan','granted']]){const button=document.createElement('button');button.type='button';button.textContent=label;button.addEventListener('click',()=>choose(value));panel.appendChild(button);}
  document.body.appendChild(panel);
 }
 if(consent==='granted')start();else if(consent==='unknown')show();
})();
