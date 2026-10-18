(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    document.querySelectorAll('.sn-story-images,.journal-card-visual,.social-photo,.about-split-photo,.sn-photo-section>.sn-picture,.sn-story-gallery>button').forEach(el=>{
      el.classList.add('sn-photo-reveal');photoObserver.observe(el.parentElement);
    });
    const heroObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('sn-hero-paused',!entry.isIntersecting)));
    document.querySelectorAll('.canvas-hero').forEach(el=>heroObserver.observe(el));
  }

  const dialog=document.createElement('dialog');dialog.className='sn-lightbox';dialog.setAttribute('aria-label','Vergrote foto');
  dialog.innerHTML='<button class="lightbox-close" aria-label="Foto sluiten" type="button">×</button><button class="lightbox-prev" aria-label="Vorige foto" type="button">←</button><figure><img alt=""></figure><button class="lightbox-next" aria-label="Volgende foto" type="button">→</button>';
  document.body.appendChild(dialog);let photos=[],active=0,trigger;
  function showPhoto(index){active=(index+photos.length)%photos.length;const original=photos[active].querySelector('img');const img=dialog.querySelector('img');img.src=original.dataset.fullSrc||original.currentSrc||original.src;img.alt=original.alt;}
  function openGallery(items,index,source){photos=items;trigger=source;showPhoto(index);dialog.showModal();document.body.classList.add('sn-lightbox-open');}
  dialog.addEventListener('click',event=>{if(event.target.closest('.lightbox-prev')){event.stopPropagation();showPhoto(active-1);}else if(event.target.closest('.lightbox-next')){event.stopPropagation();showPhoto(active+1);}else dialog.close();});
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(active-1);}if(event.key==='ArrowRight'){event.preventDefault();showPhoto(active+1);}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('sn-lightbox-open');trigger?.focus({preventScroll:true});});
  document.querySelectorAll('.portfolio-mosaic,.sn-story-gallery').forEach(gallery=>{const items=[...gallery.querySelectorAll('button')].filter(b=>b.querySelector('img'));items.forEach((item,index)=>item.addEventListener('click',event=>{event.preventDefault();openGallery(items,index,item);}));});

  document.querySelectorAll('[data-sn-block="Orbit"]').forEach(block=>{
    const stage=block.querySelector('.orbit-stage'),cards=[...block.querySelectorAll('.orbit-card')],status=block.querySelector('[data-role="orbitStatus"]');
    if(!stage||!cards.length)return;
    let angle=0,velocity=0,last=0,visible=false,raf=0,pointer=null,startX=0,startY=0,lastX=0,moved=false,suppress=0;
    function layout(){const box=stage.getBoundingClientRect();if(!box.width||!box.height)return;const mobile=box.width<700,maxW=Math.min(box.width*(mobile?.30:.23),mobile?150:280),maxH=mobile?165:240,rx=Math.max(24,Math.min(box.width*.44-maxW*.5,box.width*.5-maxW*.5-24)),ry=Math.max(24,Math.min(box.height*.34,box.height*.5-maxH*.5-42));let front=0,best=10;
      cards.forEach((card,i)=>{const a=angle+i*Math.PI*2/cards.length,c=Math.cos(a),s=Math.sin(a),depth=(c+1)/2,img=card.querySelector('img'),ratio=img?.naturalWidth&&img?.naturalHeight?img.naturalWidth/img.naturalHeight:1.2;card.style.setProperty('--card-width',Math.min(maxW,maxH*ratio)+'px');card.style.zIndex=String(Math.round(depth*100));card.style.opacity='1';card.style.visibility='visible';card.style.filter='none';card.style.transform=`translate(-50%,-50%) translate3d(${s*rx}px,${c*ry}px,${c*15}px) scale(${.72+depth*.28}) rotate(${s*(mobile?2:4)}deg)`;const distance=Math.abs(Math.atan2(Math.sin(a),Math.cos(a)));if(distance<best){best=distance;front=i;}});
      cards.forEach((card,i)=>card.setAttribute('aria-current',String(i===front)));if(status)status.textContent=`${String(front+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')} · SLEEP OM TE DRAAIEN · KLIK OM TE OPENEN`;
    }
    function frame(now){raf=0;if(!visible)return;const dt=Math.min(48,now-(last||now));last=now;if(pointer===null&&!dialog.open&&!stage.matches(':hover,:focus-within')&&!document.hidden){if(Math.abs(velocity)>.0002){angle+=velocity*dt;velocity*=Math.pow(.94,dt/16);}else if(!reduced)angle+=dt*.00012;layout();}raf=requestAnimationFrame(frame);}
    function start(){if(!raf&&visible){last=0;raf=requestAnimationFrame(frame);}}
    stage.classList.add('is-ready');cards.forEach((card,index)=>{const image=card.querySelector('img');if(!image.complete)image.addEventListener('load',layout,{once:true});card.addEventListener('click',event=>{event.preventDefault();if(performance.now()<suppress)return;openGallery(cards,index,card);});});
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
    const stage=block.querySelector('.story-carousel'),slides=[...block.querySelectorAll('.story-slide')],range=block.querySelector('.story-range'),title=block.querySelector('[data-role="storyProjectTitle"]'),count=block.querySelector('[data-role="storyCount"]');if(!slides.length)return;let active=0,start=0;
    function show(index){active=(index+slides.length)%slides.length;slides.forEach((slide,i)=>{let offset=i-active;if(offset>slides.length/2)offset-=slides.length;if(offset< -slides.length/2)offset+=slides.length;slide.style.setProperty('--x',offset*Math.max(85,Math.min(stage.clientWidth*.205,235))+'px');slide.style.setProperty('--rot',offset*(innerWidth<760?5:7)+'deg');slide.style.setProperty('--scale',1-Math.abs(offset)*.12);slide.style.setProperty('--opacity',1);slide.style.setProperty('--z',10-Math.abs(offset));slide.classList.toggle('is-active',i===active);});if(range)range.value=active;if(count)count.textContent=`${String(active+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;if(title)title.textContent=slides[active].querySelector('.story-slide-label span')?.textContent||'Een moment om te bewaren';}
    block.querySelector('[data-role="storyPrev"]')?.addEventListener('click',()=>show(active-1));block.querySelector('[data-role="storyNext"]')?.addEventListener('click',()=>show(active+1));range?.addEventListener('input',()=>show(Number(range.value)));stage?.addEventListener('pointerdown',e=>start=e.clientX);stage?.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-start)>35)show(active+(e.clientX<start?1:-1));});window.addEventListener('resize',()=>show(active));show(0);
  });

  document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();let status=form.querySelector('[data-form-status],.standalone-form-status');if(!status){status=document.createElement('p');status.setAttribute('aria-live','polite');form.appendChild(status);}status.hidden=false;status.textContent='Deze testwebsite verstuurt nog geen gegevens. De verzendkoppeling wordt later aangesloten.';
  }));
  document.querySelectorAll('video[data-ambient]').forEach(video=>{const button=video.parentElement.querySelector('.sn-video-toggle');button?.addEventListener('click',()=>video.paused?video.play():video.pause());video.addEventListener('play',()=>button.textContent='Sfeerclip pauzeren');video.addEventListener('pause',()=>button.textContent='Sfeerclip afspelen');if(!reduced&&'IntersectionObserver'in window)new IntersectionObserver(entries=>{if(entries[0].isIntersecting)video.play().catch(()=>{});else video.pause();},{threshold:.3}).observe(video);});
  function resolveAnchor(){const target=location.hash.slice(1);if(target&&!document.getElementById(target))document.querySelector(`[data-role="${CSS.escape(target)}"]`)?.scrollIntoView();}window.addEventListener('hashchange',resolveAnchor);resolveAnchor();
})();
