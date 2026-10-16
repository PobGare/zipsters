(() => {
  function init(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const videos = [...root.querySelectorAll('[data-reel-video]')];
    if (!videos.length) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const listeners = new AbortController(), options = {signal:listeners.signal};
    let active = 0, visible = false, switching = false;
    const allowed = () => visible && !document.hidden && !reduced.matches && !navigator.connection?.saveData && !document.querySelector('dialog[open]');
    function load(video) {
      if (video.dataset.loaded) return;
      video.dataset.loaded = 'true'; video.muted = true;
      const desktop = matchMedia('(min-width: 768px)').matches;
      video.querySelectorAll('source').forEach(source => {
        const url = desktop ? source.dataset.desktopSrc || source.dataset.src : source.dataset.src;
        if (url) source.src = url;
        else source.removeAttribute('src');
      });
      video.preload = 'auto'; video.load();
    }
    function release(video) {
      video.pause(); video.removeAttribute('data-loaded'); video.preload = 'none';
      video.querySelectorAll('source').forEach(source => source.removeAttribute('src'));
      video.load();
    }
    function sync() {
      videos.forEach((video,i) => { if (i !== active || !allowed()) video.pause(); });
      if (!allowed()) return;
      load(videos[active]);
      if (videos[active].ended) advance();
      else videos[active].play().catch(() => {});
    }
    function advance() {
      if (switching || !allowed() || videos.length < 2) return;
      switching = true;
      const previous = videos[active], nextIndex = (active + 1) % videos.length, next = videos[nextIndex];
      load(next);
      const cut = () => {
        switching = false;
        if (!allowed()) return;
        previous.pause();
        active = nextIndex;
        next.classList.add('is-active'); next.removeAttribute('aria-hidden');
        previous.classList.remove('is-active'); previous.setAttribute('aria-hidden','true');
        next.play().catch(() => {});
        release(previous);
      };
      if (next.readyState >= 2) cut();
      else next.addEventListener('loadeddata',cut,{once:true,signal:listeners.signal});
    }
    videos.forEach((video,i) => {
      video.addEventListener('timeupdate',() => {
        if (i === active && allowed() && videos.length > 1 && video.duration - video.currentTime < 2) load(videos[(active+1)%videos.length]);
      },options);
      video.addEventListener('ended',() => { if (i === active) { if (videos.length === 1) { video.currentTime=0;sync(); } else advance(); } },options);
    });
    const observer = new IntersectionObserver(entries => { visible=entries[0].isIntersecting && entries[0].intersectionRatio >= .2;sync(); },{threshold:.2});
    observer.observe(root);
    const dialogs = new MutationObserver(sync);
    document.querySelectorAll('dialog').forEach(dialog => dialogs.observe(dialog,{attributes:true,attributeFilter:['open']}));
    document.addEventListener('visibilitychange',sync,options);
    reduced.addEventListener('change',sync,options);
    document.addEventListener('shopify:section:unload',event => {
      if (event.target.contains(root)) { listeners.abort();observer.disconnect();dialogs.disconnect();videos.forEach(release); }
    },options);
  }
  document.querySelectorAll('[data-reels]').forEach(init);
  document.addEventListener('shopify:section:load',event => event.target.querySelectorAll('[data-reels]').forEach(init));
})();
