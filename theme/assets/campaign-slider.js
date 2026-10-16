(() => {
  function init(root) {
    if (root.dataset.sliderReady) return;
    root.dataset.sliderReady = 'true';
    const slides = [...root.querySelectorAll('[data-campaign-slide]')];
    if (slides.length < 2) return;
    root.querySelector('[data-slider-controls]').hidden = false;
    const dots = [...root.querySelectorAll('[data-slide-select]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const duration = 5000;
    let active = 0, request = 0, timer, preloadTimer, animation, pointer;
    let paused = reduced.matches, inView = true, keyboardFocus = false;
    const blocked = () => paused || !inView || document.hidden || keyboardFocus || !!document.querySelector('dialog[open]');
    function load(index) {
      const slide = slides[(index + slides.length) % slides.length];
      const template = slide.querySelector('template');
      if (template) template.replaceWith(template.content.cloneNode(true));
      const img = slide.querySelector('img');
      if (img) img.loading = 'eager';
      return img;
    }
    function stop() { clearTimeout(timer); clearTimeout(preloadTimer); animation?.cancel(); }
    function start() {
      stop();
      if (blocked()) return;
      animation = dots[active].querySelector('i').animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}], {duration,fill:'forwards',easing:'linear'});
      preloadTimer = setTimeout(() => load(active + 1), duration - 1800);
      timer = setTimeout(() => go(active + 1), duration);
    }
    async function go(index) {
      stop();
      const next = (index + slides.length) % slides.length;
      const token = ++request;
      const img = load(next);
      if (img) { try { await img.decode(); } catch { /* Retain navigation on a failed request. */ } }
      if (token !== request || !root.isConnected) return;
      if (slides[active].contains(document.activeElement)) root.focus({preventScroll:true});
      active = next;
      slides.forEach((slide,i) => { slide.classList.toggle('is-active',i===active); slide.setAttribute('aria-hidden',String(i!==active)); slide.inert=i!==active; });
      dots.forEach((dot,i) => { dot.classList.toggle('is-active',i===active); dot.setAttribute('aria-current',String(i===active)); });
      start();
    }
    root.querySelector('[data-slide-prev]').addEventListener('click',()=>go(active-1));
    root.querySelector('[data-slide-next]').addEventListener('click',()=>go(active+1));
    dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
    root.addEventListener('keydown',e=>{
      if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(active+(e.key==='ArrowRight'?1:-1));}
      if(e.key==='Tab'){keyboardFocus=true;start();}
    });
    root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget)){keyboardFocus=false;start();}});
    root.addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('button,a'))return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};root.setPointerCapture(e.pointerId);});
    root.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)go(active+(dx<0?1:-1));});
    root.addEventListener('pointercancel',()=>{pointer=null;});
    root.addEventListener('dragstart',e=>e.preventDefault());
    document.addEventListener('visibilitychange',start);
    reduced.addEventListener('change',()=>{paused=reduced.matches;start();});
    const observer = new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;start();},{threshold:0.4});
    // Observe the first following panel, too: the hero is sticky behind it.
    const scrollState=()=>{const visible=scrollY<root.offsetHeight*.65;if(visible!==inView){inView=visible;start();}};
    window.addEventListener('scroll',scrollState,{passive:true});
    observer.observe(root);
    const dialogs=new MutationObserver(start);
    document.querySelectorAll('dialog').forEach(dialog=>dialogs.observe(dialog,{attributes:true,attributeFilter:['open']}));
    root.addEventListener('shopify:block:select',e=>{paused=true;const i=slides.indexOf(e.target.closest('[data-campaign-slide]'));if(i>=0)go(i);});
    document.addEventListener('shopify:section:unload',e=>{if(e.target.contains(root)){stop();observer.disconnect();dialogs.disconnect();window.removeEventListener('scroll',scrollState);document.removeEventListener('visibilitychange',start);}});
    start();
  }
  document.querySelectorAll('[data-campaign-slider]').forEach(init);
  document.addEventListener('shopify:section:load',e=>e.target.querySelectorAll('[data-campaign-slider]').forEach(init));
})();
