import {escapeHtml as e} from './html.mjs';
import {renderImage} from './image.mjs';
export function renderEditorial(site,images){
 const c=site.campaign;
 const picture=(id,options={})=>renderImage(images[id],options);
 const spreads=site.layout.spreads.map((ids,i)=>`<div class="spread-band band-${i+1}"><div class="spread spread-${i+1}">${ids.map((id,j)=>`<figure class="editorial-image image-${j+1}">${picture(id,{sizes:j===1?'(max-width:767px) calc(100vw - 40px), 40vw':'(max-width:767px) calc(100vw - 40px), 30vw'})}<figcaption><span>${String(i*3+j+1).padStart(2,'0')}</span><span>${j===0?'The Sunday Edit':''}</span></figcaption></figure>`).join('')}</div></div>`).join('');
 const opening=`<div class="masthead"><span class="wordmark">Swing</span><span class="collab-cross" aria-hidden="true">×</span><span class="partner-name">John Montgomery</span><span class="sr-only">${e(c.collaboration)}</span></div>
 <div class="cover"><div class="cover-copy"><p class="eyebrow">${e(c.title)}</p><h1 id="campaign-heading">Forget the flowers.<br> <em>Book the tee time.</em></h1><p class="cover-intro">${e(c.intro)}</p><a class="text-link" href="#products">Explore the collection <span aria-hidden="true">↗</span></a></div>
 <div class="cover-pictures"><figure class="cover-primary">${picture('C02',{priority:true,sizes:'(max-width:767px) 76vw, 34vw'})}<figcaption>SWING × JOHN MONTGOMERY</figcaption></figure><figure class="cover-secondary">${picture('C19',{sizes:'(max-width:767px) 40vw, 22vw'})}</figure></div></div>
 <div class="editorial-divider"><span>The Sunday Edit</span><span aria-hidden="true">↓</span><span>SWING × JOHN MONTGOMERY</span></div><div class="editorial">${spreads}</div>`;
 const story=`<div class="story-inner"><figure class="story-image">${picture(site.layout.story,{sizes:'(max-width:767px) calc(100vw - 64px), 40vw'})}</figure><div class="story-copy"><p class="eyebrow">Swing × John Montgomery</p><h2 id="story-heading">${e(c.storyHeading)}</h2><p>${e(c.story)}</p><a class="text-link" href="#products">Shop the edit <span aria-hidden="true">↗</span></a></div></div>`;
 return {opening,story};
}
