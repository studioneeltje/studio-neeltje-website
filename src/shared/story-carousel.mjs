import {escapeHTML as e,imageMarkup} from './media.mjs';

export function carouselStories(props,context){
 const available=(context.stories||[]).filter(story=>story.published!==false);
 if(props.storySource!=='selected')return available;
 const seen=new Set();
 return (props.storySelection||[]).flatMap(item=>{
  const story=available.find(story=>story.id===item.storyId);
  if(!story||seen.has(story.id))return [];
  seen.add(story.id);return [story];
 });
}

export function storyCarouselMarkup(props,context){
 const stories=carouselStories(props,context),spec=context.templates.StoryCarousel;
 const text=(key,fallback='')=>e(props.texts?.find(item=>String(item.key)===String(key))?.value??spec.defaults.texts?.find(item=>String(item.key)===String(key))?.value??fallback);
 const href=story=>`reportage-${encodeURIComponent(story.id)}.html`;
 const label=text(16,'Bekijk deze reportage');
 const slides=stories.map(story=>`<article class="story-slide" data-story-title="${e(story.title)}" data-story-location="${e(story.location||'Trouwreportage')}" data-story-href="${e(href(story))}"><a class="sn-carousel-project" href="${e(href(story))}" aria-label="Bekijk reportage: ${e(story.title)}">${imageMarkup({...props.crops?.[story.id],mediaId:story.cover,sizes:'(max-width: 760px) 70vw, 480px'},context)}</a><div class="story-slide-label"><span>${e(story.title)}</span><small>${e(story.location)}</small></div></article>`).join('');
 const first=stories[0];
 const eyebrow=text(0).includes('01—05')?'GESELECTEERDE TROUWREPORTAGES':text(0);
 return `<section class="story-showcase" id="verhalen-galerij" aria-labelledby="story-showcase-title"><div class="story-showcase-head"><div><div class="section-tag">${eyebrow}</div><h3 id="story-showcase-title">${text(1)}<br><em>${text(2)}</em></h3></div><p class="story-showcase-hint">${text(3)}</p></div>${first?`<div class="story-carousel" id="storyCarousel" role="region" aria-label="Trouwreportages">${slides}</div><div class="story-project-meta" aria-live="polite"><div class="section-tag" id="storyProjectType">${e(first.location||'Trouwreportage')}</div><h4 id="storyProjectTitle">${e(first.title)}</h4>${label?`<a id="storyProjectLink" class="story-project-link" href="${e(href(first))}">${label} <span aria-hidden="true">↗</span></a>`:''}</div>${stories.length>1?`<div class="story-slider-controls"><button class="story-arrow" id="storyPrev" type="button" aria-label="Vorige reportage">←</button><input class="story-range" id="storyRange" type="range" min="0" max="${stories.length-1}" step="1" value="0" aria-label="Kies een reportage"><button class="story-arrow" id="storyNext" type="button" aria-label="Volgende reportage">→</button></div>`:''}<div class="story-count" id="storyCount" aria-live="polite">01 / ${String(stories.length).padStart(2,'0')}</div>`:context.preview?'<p class="sn-carousel-empty">Nog geen gepubliceerde reportages gekozen. Kies reportages in Puck of publiceer ze vanuit Sveltia.</p>':''}</section>`;
}
