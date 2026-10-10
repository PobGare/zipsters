(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 767px)');
  function initGallery(gallery){
    if(gallery.dataset.ready)return;gallery.dataset.ready='true';
    const slides=[...gallery.querySelectorAll('[data-gallery-slide]')], thumbs=[...gallery.querySelectorAll('[data-gallery-select]')], track=gallery.querySelector('[data-gallery-track]'), counter=gallery.querySelector('[data-gallery-counter]');
    let active=0, scrollFrame;
    const update=index=>{active=(index+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('is-active',i===active);s.setAttribute('aria-hidden',String(i!==active));});thumbs.forEach((t,i)=>{t.classList.toggle('is-active',i===active);t.setAttribute('aria-current',String(i===active));});counter.textContent=(active+1)+' / '+slides.length;};
    const go=index=>{update(index);if(mobile.matches)track.scrollTo({left:active*track.clientWidth,behavior:reduced.matches?'instant':'smooth'});};
    gallery.querySelector('[data-gallery-prev]').addEventListener('click',()=>go(active-1));
    gallery.querySelector('[data-gallery-next]').addEventListener('click',()=>go(active+1));
    thumbs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));
    track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1));}});
    track.addEventListener('scroll',()=>{if(!mobile.matches)return;cancelAnimationFrame(scrollFrame);scrollFrame=requestAnimationFrame(()=>update(Math.round(track.scrollLeft/track.clientWidth)));},{passive:true});
    new ResizeObserver(()=>{if(mobile.matches)track.scrollTo({left:active*track.clientWidth,behavior:'instant'});else track.scrollLeft=0;}).observe(track);
    if(slides.length<2){gallery.querySelectorAll('[data-gallery-prev],[data-gallery-next]').forEach(b=>b.hidden=true);}
  }
  document.querySelectorAll('[data-gallery]').forEach(initGallery);
  document.querySelectorAll('[data-accordion]').forEach(details=>{
    const summary=details.querySelector('summary');let animation;
    summary.addEventListener('click',e=>{
      if(reduced.matches)return;e.preventDefault();if(animation)return;
      const opening=!details.open;const start=details.getBoundingClientRect().height;
      if(opening)details.open=true;
      const end=opening?details.getBoundingClientRect().height:summary.getBoundingClientRect().height;
      details.style.overflow='hidden';animation=details.animate([{height:start+'px'},{height:end+'px'}],{duration:240,easing:'cubic-bezier(.22,.61,.36,1)'});
      animation.finished.then(()=>{if(!opening)details.open=false;details.style.overflow='';animation=null;}).catch(()=>{animation=null;});
    });
  });
  if(!window.zipsters?.preview){document.querySelectorAll('[data-recommendations-url]').forEach(el=>{
    const observer=new IntersectionObserver(async entries=>{if(!entries.some(e=>e.isIntersecting))return;observer.disconnect();try{const response=await fetch(el.dataset.recommendationsUrl);if(!response.ok)return;const doc=new DOMParser().parseFromString(await response.text(),'text/html');const recommendations=doc.querySelector('[data-product-recommendations]');if(recommendations?.querySelector('.product-card'))el.innerHTML=recommendations.innerHTML;}catch{/* Keep merchant-selected or collection fallback products. */}},{rootMargin:'500px'});observer.observe(el);
  });}
})();
