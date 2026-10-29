(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href="#checklist-aanvragen"]');
    const anchor=link&&document.getElementById('checklist-aanvragen');
    if(!anchor)return;
    event.preventDefault();anchor.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    anchor.nextElementSibling?.querySelector('form input:not([type="hidden"])')?.focus({preventScroll:true});
  });
  document.querySelectorAll('.sn-fan-section').forEach(section=>{
    const rail=section.querySelector('.sn-fan-gallery'),controls=section.querySelector('.sn-fan-controls');if(!rail||!controls)return;
    const update=()=>{controls.hidden=rail.scrollWidth<=rail.clientWidth+2;controls.querySelector('[data-fan-step="-1"]').disabled=rail.scrollLeft<2;controls.querySelector('[data-fan-step="1"]').disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-2;};
    const move=step=>rail.scrollBy({left:step*Math.max(200,rail.clientWidth*.7),behavior:reduced?'auto':'smooth'});
    controls.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>move(Number(button.dataset.fanStep))));
    rail.addEventListener('scroll',update,{passive:true});rail.addEventListener('keydown',event=>{if(event.target!==rail||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();move(event.key==='ArrowRight'?1:-1);});
    if('ResizeObserver'in window)new ResizeObserver(update).observe(rail);update();
  });
  document.body.classList.add('motion-ready');
  document.querySelectorAll('.canvas-title').forEach(el=>el.classList.add('title-ready'));
  const reveal=document.querySelectorAll('.quote-module,.truus-review,.canvas-intro,.showcase-intro,.story-showcase,.canvas-wall,.canvas-end,.portfolio-mosaic-item');
  if(!reduced&&'IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');io.unobserve(entry.target);}}),{threshold:.03});reveal.forEach(el=>io.observe(el));}
  else reveal.forEach(el=>el.classList.add('in-view'));

  // Photograph reveals are progressive enhancement: no script means visible photos.
  if(!reduced&&'IntersectionObserver'in window){
    const photoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.querySelectorAll('.sn-photo-reveal').forEach(photo=>photo.classList.add('sn-photo-visible'));photoObserver.unobserve(entry.target);}
    }),{threshold:.04});
    document.querySelectorAll('.sn-story-images,.journal-card-visual,.social-photo,.about-photo-surface,.sn-photo-section>.sn-picture,.sn-story-gallery>button').forEach(el=>{
      el.classList.add('sn-photo-reveal');photoObserver.observe(el.parentElement);
    });
    const heroObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('sn-hero-paused',!entry.isIntersecting)));
    document.querySelectorAll('.canvas-hero').forEach(el=>heroObserver.observe(el));
  }

  const dialog=document.createElement('dialog');dialog.className='sn-lightbox';dialog.setAttribute('aria-label','Vergrote foto');
  dialog.innerHTML='<button class="lightbox-close" aria-label="Foto sluiten" type="button">×</button><button class="lightbox-prev" aria-label="Vorige foto" type="button">←</button><figure><img alt=""></figure><button class="lightbox-next" aria-label="Volgende foto" type="button">→</button>';
  document.body.appendChild(dialog);let photos=[],active=0,trigger;
  function showPhoto(index){active=(index+photos.length)%photos.length;const original=photos[active].querySelector('img');const img=dialog.querySelector('img');img.src=original.dataset.fullSrc||original.currentSrc||original.src;img.alt=original.alt;}
  function openGallery(items,index,source){photos=items;trigger=source;dialog.classList.toggle('sn-lightbox-wall',Boolean(source.closest('.salon-wall,.sn-fan-gallery,.sn-project')));dialog.querySelectorAll('.lightbox-prev,.lightbox-next').forEach(button=>button.hidden=items.length<2);showPhoto(index);dialog.showModal();document.body.classList.add('sn-lightbox-open');}
  dialog.addEventListener('click',event=>{if(event.target.closest('.lightbox-prev')){event.stopPropagation();showPhoto(active-1);}else if(event.target.closest('.lightbox-next')){event.stopPropagation();showPhoto(active+1);}else dialog.close();});
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(active-1);}if(event.key==='ArrowRight'){event.preventDefault();showPhoto(active+1);}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('sn-lightbox-open');trigger?.focus({preventScroll:true});});
  document.querySelectorAll('.portfolio-mosaic,.sn-story-gallery,.salon-wall,.sn-fan-gallery').forEach(gallery=>{gallery.querySelectorAll('button').forEach(button=>{if(button.querySelector('img[data-sn-missing]')&&!button.querySelector('img:not([data-sn-missing])')){button.disabled=true;button.setAttribute('aria-label','Foto ontbreekt — kies een nieuwe foto');}});const items=[...gallery.querySelectorAll('button')].filter(b=>b.querySelector('img:not([data-sn-missing])'));items.forEach((item,index)=>item.addEventListener('click',event=>{event.preventDefault();openGallery(items,index,item);}));});

  document.querySelectorAll('[data-sn-block="Orbit"]').forEach(block=>{
    const stage=block.querySelector('.orbit-stage'),cards=[...block.querySelectorAll('.orbit-card')],status=block.querySelector('[data-role="orbitStatus"]');
    if(!stage||!cards.length)return;
    let angle=0,velocity=0,last=0,visible=false,raf=0,pointer=null,startX=0,startY=0,lastX=0,moved=false,suppress=0;
    function layout(){const box=stage.getBoundingClientRect();if(!box.width||!box.height)return;const mobile=box.width<700,maxW=Math.min(box.width*(mobile?.30:.23),mobile?150:(cards.length>7?230:280)),maxH=mobile?165:(cards.length>7?215:240),rx=Math.max(24,Math.min(box.width*.44-maxW*.5,box.width*.5-maxW*.5-24)),ry=Math.max(24,Math.min(box.height*.34,box.height*.5-maxH*.5-42));let front=0,best=10;
      cards.forEach((card,i)=>{const a=angle+i*Math.PI*2/cards.length,c=Math.cos(a),s=Math.sin(a),depth=(c+1)/2,img=card.querySelector('img'),ratio=img?.naturalWidth&&img?.naturalHeight?img.naturalWidth/img.naturalHeight:1.2;card.style.setProperty('--card-width',Math.min(maxW,maxH*ratio)+'px');card.style.zIndex=String(Math.round(depth*100));card.style.opacity='1';card.style.visibility='visible';card.style.filter='none';card.style.transform=`translate(-50%,-50%) translate3d(${s*rx}px,${c*ry}px,${c*15}px) scale(${.72+depth*.28}) rotate(${s*(mobile?2:4)}deg)`;const distance=Math.abs(Math.atan2(Math.sin(a),Math.cos(a)));if(distance<best){best=distance;front=i;}});
      cards.forEach((card,i)=>card.setAttribute('aria-current',String(i===front)));if(status)status.textContent=`${String(front+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')} · SLEEP OM TE DRAAIEN · KLIK OM TE OPENEN`;
    }
    function frame(now){raf=0;if(!visible)return;const dt=Math.min(48,now-(last||now));last=now;if(pointer===null&&!dialog.open&&!stage.matches(':hover,:focus-within')&&!document.hidden){if(Math.abs(velocity)>.0002){angle+=velocity*dt;velocity*=Math.pow(.94,dt/16);}else if(!reduced)angle+=dt*.00012;layout();}raf=requestAnimationFrame(frame);}
    function start(){if(!raf&&visible){last=0;raf=requestAnimationFrame(frame);}}
    stage.classList.add('is-ready');cards.forEach((card,index)=>{const image=card.querySelector('img');if(!image.complete)image.addEventListener('load',layout,{once:true});card.addEventListener('click',event=>{event.preventDefault();if(performance.now()<suppress)return;if(image?.dataset.snMissing)return;const available=cards.filter(item=>item.querySelector('img:not([data-sn-missing])'));if(available.length)openGallery(available,available.indexOf(card),card);});});
    function step(dir){angle+=dir*Math.PI*2/cards.length;velocity=0;layout();}
    block.querySelector('[data-role="orbitPrev"]')?.addEventListener('click',()=>step(-1));block.querySelector('[data-role="orbitNext"]')?.addEventListener('click',()=>step(1));
    stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();step(-1);}if(event.key==='ArrowRight'){event.preventDefault();step(1);}});
    stage.style.touchAction='pan-y';stage.addEventListener('pointerdown',event=>{if(event.button!==0)return;pointer=event.pointerId;startX=lastX=event.clientX;startY=event.clientY;moved=false;velocity=0;});
    stage.addEventListener('pointermove',event=>{if(pointer!==event.pointerId)return;const dx=event.clientX-lastX;if(!moved&&Math.abs(event.clientY-startY)>Math.abs(event.clientX-startX)+8){pointer=null;return;}if(!moved&&Math.abs(event.clientX-startX)>7){moved=true;stage.setPointerCapture(pointer);stage.classList.add('is-dragging');}if(moved){angle+=dx/Math.max(180,stage.clientWidth*.38);layout();}lastX=event.clientX;});
    function finish(event){if(pointer!==event.pointerId)return;if(moved)suppress=performance.now()+350;pointer=null;stage.classList.remove('is-dragging');}
    stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);window.addEventListener('pointerup',finish);
    if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:.01}).observe(stage);else{visible=true;start();}
    new ResizeObserver(layout).observe(stage);layout();
  });

  document.querySelectorAll('[data-sn-block="StoryCarousel"]').forEach(block=>{
    const stage=block.querySelector('.story-carousel'),slides=[...block.querySelectorAll('.story-slide')],range=block.querySelector('.story-range'),title=block.querySelector('[data-role="storyProjectTitle"]'),count=block.querySelector('[data-role="storyCount"]'),projectLink=block.querySelector('[data-role="storyProjectLink"]'),projectType=block.querySelector('[data-role="storyProjectType"]');if(!stage||!slides.length)return;let active=0,start=0,suppressClick=0;
    function show(index){active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{let offset=i-active;if(offset>slides.length/2)offset-=slides.length;if(offset< -slides.length/2)offset+=slides.length;slide.style.setProperty('--x',offset*Math.max(85,Math.min(stage.clientWidth*.205,235))+'px');slide.style.setProperty('--rot',Math.max(-4,Math.min(4,offset))*(innerWidth<760?5:7)+'deg');slide.style.setProperty('--scale',Math.max(.52,1-Math.abs(offset)*.12));slide.style.setProperty('--opacity',1);slide.style.setProperty('--z',Math.max(1,10-Math.abs(offset)));slide.classList.toggle('is-active',i===active);});if(range)range.value=active;if(count)count.textContent=`${String(active+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;if(title)title.textContent=slides[active].querySelector('.story-slide-label span')?.textContent||'Een moment om te bewaren';}
    const updateProject=()=>{const slide=slides[active];slides.forEach((item,index)=>{const link=item.querySelector('.sn-carousel-project');if(link){link.tabIndex=index===active?0:-1;link.setAttribute('aria-current',String(index===active));}});if(!slide.dataset.storyHref)return;if(title)title.textContent=slide.dataset.storyTitle;if(projectType)projectType.textContent=slide.dataset.storyLocation;if(projectLink)projectLink.setAttribute('href',slide.dataset.storyHref);};
    const select=index=>{show(index);updateProject();};
    block.querySelector('[data-role="storyPrev"]')?.addEventListener('click',()=>select(active-1));block.querySelector('[data-role="storyNext"]')?.addEventListener('click',()=>select(active+1));range?.addEventListener('input',()=>select(Number(range.value)));stage.style.touchAction='pan-y';stage.addEventListener('pointerdown',event=>start=event.clientX);stage.addEventListener('pointerup',event=>{if(Math.abs(event.clientX-start)>35){suppressClick=performance.now()+450;select(active+(event.clientX<start?1:-1));}});stage.addEventListener('click',event=>{if(performance.now()<suppressClick)event.preventDefault();});stage.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();select(active+(event.key==='ArrowLeft'?-1:1));slides[active].querySelector('.sn-carousel-project')?.focus({preventScroll:true});}});window.addEventListener('resize',()=>select(active));select(0);
  });

  document.querySelectorAll('video[data-ambient]').forEach(video=>{const button=video.parentElement.querySelector('.sn-video-toggle');button?.addEventListener('click',()=>video.paused?video.play():video.pause());video.addEventListener('play',()=>button.textContent='Sfeerclip pauzeren');video.addEventListener('pause',()=>button.textContent='Sfeerclip afspelen');if(!reduced&&'IntersectionObserver'in window)new IntersectionObserver(entries=>{if(entries[0].isIntersecting)video.play().catch(()=>{});else video.pause();},{threshold:.3}).observe(video);});
  function resolveAnchor(){const target=location.hash.slice(1);if(target&&!document.getElementById(target))document.querySelector(`[data-role="${CSS.escape(target)}"]`)?.scrollIntoView();}window.addEventListener('hashchange',resolveAnchor);resolveAnchor();
})();

// Article progress stops at the end of the reading, before recommendations/footer.
(() => {
 const reading=document.querySelector('[data-article-reading]');
 const progress=document.querySelector('.sn-article-progress');
 if(!reading||!progress)return;
 const fill=progress.querySelector('span');
 const links=[...document.querySelectorAll('.sn-article-toc a')];
 const headings=links.map(link=>document.getElementById(link.hash.slice(1)));
 let queued=false;
 function update(){
  queued=false;
  const box=reading.getBoundingClientRect();
  const start=box.top+window.scrollY;
  const end=Math.max(start+1,box.bottom+window.scrollY-window.innerHeight);
  const value=Math.round(Math.max(0,Math.min(1,(window.scrollY-start)/(end-start)))*100);
  progress.hidden=false;fill.style.transform=`scaleX(${value/100})`;
  progress.setAttribute('aria-valuenow',String(value));
  let active=-1;headings.forEach((heading,i)=>{if(heading&&heading.getBoundingClientRect().top<window.innerHeight*.35)active=i;});
  links.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(update);}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 if('ResizeObserver'in window)new ResizeObserver(schedule).observe(reading);
 document.fonts?.ready.then(schedule);update();
})();

// Independent tilted review cards: two stationary cards, or three plus arrows.
document.querySelectorAll('.sn-reviews').forEach(section=>{
 const track=section.querySelector('.sn-reviews-track');
 const cards=[...track.children];const nav=section.querySelector('.sn-reviews-navigation');
 const prev=nav.querySelector('[data-reviews-prev]'),next=nav.querySelector('[data-reviews-next]');
 let index=0;
 function render(){const cols=Math.max(1,parseInt(getComputedStyle(track).getPropertyValue('--review-cols'),10)||2);index=Math.max(0,Math.min(index,cards.length-cols));track.style.transform=`translateX(-${index*(track.clientWidth+32)/cols}px)`;nav.hidden=cards.length<=cols;prev.disabled=index===0;next.disabled=index>=cards.length-cols;nav.querySelector('[data-reviews-status]').textContent=`${index+1}–${Math.min(cards.length,index+cols)} / ${cards.length}`;cards.forEach((card,i)=>{card.inert=i<index||i>=index+cols;});}
 prev.addEventListener('click',()=>{index--;render();});next.addEventListener('click',()=>{index++;render();});
 section.addEventListener('keydown',event=>{if(event.key==='ArrowRight'&&!next.disabled){event.preventDefault();index++;render();}if(event.key==='ArrowLeft'&&!prev.disabled){event.preventDefault();index--;render();}});
 if('ResizeObserver'in window)new ResizeObserver(render).observe(track);else window.addEventListener('resize',render);
 render();
});

if('IntersectionObserver'in window){const collageObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('sn-animation-paused',!entry.isIntersecting)),{threshold:.01});document.querySelectorAll('.sn-collage-photos').forEach(collage=>collageObserver.observe(collage));}

/* Contact motion is optional. A poster and all content work without JavaScript. */
(() => {
 if(!document.querySelector('.sn-contact-header,.sn-contact-personal'))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const texture=document.createElement('canvas');texture.width=160;texture.height=160;
 const ctx=texture.getContext('2d');let textureURL='';
 if(ctx){let seed=71;const random=()=>{seed=seed*16807%2147483647;return(seed-1)/2147483646;};ctx.fillStyle='#706576';ctx.fillRect(0,0,160,160);for(let i=0;i<9500;i++){const x=random()*160,y=random()*160,size=.3+random()*1.8,light=Math.floor(95+random()*160);ctx.fillStyle=`rgb(${light},${Math.min(255,light+1)},${Math.min(255,light+8)})`;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+size,y+random()*size);ctx.lineTo(x+random()*size,y+size);ctx.closePath();ctx.fill();}for(let i=0;i<24;i++){const x=random()*160,y=random()*160;ctx.fillStyle='#fff';ctx.fillRect(x-.3,y-1.8,.6,3.6);ctx.fillRect(x-1.8,y-.3,3.6,.6);}textureURL=texture.toDataURL('image/png');}
 document.querySelectorAll('.sn-contact-header,.sn-contact-personal').forEach(section=>{if(textureURL&&section.classList.contains('has-glitter'))section.style.setProperty('--sn-contact-texture',`url("${textureURL}")`);});
 document.querySelectorAll('.sn-contact-header').forEach(section=>{
  section.querySelector('[data-contact-jump]')?.addEventListener('click',()=>{
   let block=section.closest('[data-sn-block]')?.nextElementSibling,target;
   while(block&&!target){target=block.matches?.('[data-contact-form-section]')?block:block.querySelector('[data-contact-form-section]');block=block.nextElementSibling;}
   target=target||document.querySelector('[data-contact-form-section]');if(!target)return;
   target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  });
  if(section.classList.contains('has-glitter')){section.classList.toggle('sn-contact-motion-paused',reduced);const pause=document.createElement('button');pause.type='button';pause.className='sn-contact-glitter-toggle';function label(){const stopped=section.classList.contains('sn-contact-motion-paused');pause.textContent=stopped?'Glitters laten bewegen':'Glitters pauzeren';pause.setAttribute('aria-pressed',String(stopped));}pause.addEventListener('click',()=>{section.classList.toggle('sn-contact-motion-paused');label();});label();section.append(pause);}
  const media=section.querySelector('.sn-contact-hero-media'),video=section.querySelector('[data-contact-video]'),gif=section.querySelector('[data-contact-gif]'),button=section.querySelector('[data-contact-motion]');
  if(!media||!button||(!video&&!gif))return;
  let userPaused=reduced,visible=false,request=0,failed=false;
  function setState(playing){media.dataset.playing=String(playing);button.textContent=playing?(video?'Video pauzeren':'Animatie pauzeren'):(video?'Video afspelen':'Animatie afspelen');button.setAttribute('aria-pressed',String(playing));}
  function stop(){request++;if(video)video.pause();if(gif){gif.hidden=true;gif.removeAttribute('src');}setState(false);}
  async function play(){const generation=++request;if(failed)return;if(gif){gif.src=gif.dataset.animatedSrc;gif.hidden=false;setState(true);return;}try{await video.play();if(request!==generation||userPaused||!visible||document.hidden){video.pause();return;}setState(true);}catch{setState(false);}}
  function update(){if(visible&&!userPaused&&!document.hidden)void play();else stop();}
  button.hidden=false;setState(false);
  button.addEventListener('click',()=>{userPaused=media.dataset.playing==='true';if(failed){failed=false;}visible=true;update();});
  if(video){video.addEventListener('error',()=>{failed=true;stop();});video.addEventListener('pause',()=>setState(false));}
  if(gif)gif.addEventListener('error',()=>{failed=true;stop();});
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();},{threshold:.15}).observe(media);
  else{visible=true;update();}
  document.addEventListener('visibilitychange',update);
 });
})();
