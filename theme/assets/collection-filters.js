(() => {
  function init(root) {
    if (root.dataset.filtersReady) return;
    root.dataset.filtersReady = 'true';
    const results = root.querySelector('#collection-products');
    const form = document.querySelector('[data-collection-filters]');
    const status = document.querySelector('[data-collection-status]');
    const pathname = location.pathname;
    const listeners = new AbortController();
    let controller, timer, version = 0, applied = location.href;
    const options = {signal:listeners.signal};
    function formURL() {
      const url = new URL(form.action, location.origin);
      const data = new FormData(form);
      for (const [key,value] of data) if (String(value).trim()) url.searchParams.append(key,value);
      return url;
    }
    async function update(url, push = true) {
      clearTimeout(timer); controller?.abort();
      const ticket = ++version;
      if (url.href === applied) { results.removeAttribute('aria-busy'); status.textContent = ''; return; }
      controller = new AbortController();
      status.removeAttribute('data-error'); results.setAttribute('aria-busy','true'); status.textContent = 'Updating products…';
      const request = new URL(url); request.searchParams.set('section_id',root.dataset.collectionSection);
      try {
        const response = await fetch(request, {signal:controller.signal});
        if (!response.ok) throw new Error('Collection request failed');
        const doc = new DOMParser().parseFromString(await response.text(),'text/html');
        const nextResults = doc.querySelector('#collection-products');
        const nextForm = doc.querySelector('[data-collection-filters]');
        if (!nextResults || !nextForm) throw new Error('Missing collection section');
        if (ticket !== version || !root.isConnected) return;
        const focused = form.contains(document.activeElement) ? {name:document.activeElement.name,value:document.activeElement.value} : null;
        results.innerHTML = nextResults.innerHTML;
        form.innerHTML = nextForm.innerHTML;
        if (focused) [...form.elements].find(el=>el.name===focused.name&&el.value===focused.value)?.focus({preventScroll:true});
        applied = url.href;
        if (push && location.href !== url.href) history.pushState({...history.state,zipstersCollection:true},'',url);
        status.textContent = results.querySelector('.collection-toolbar>span')?.textContent || 'Products updated.';
      } catch (error) {
        if (error.name !== 'AbortError' && ticket === version) { status.setAttribute('data-error',''); status.textContent = 'Could not update products. Please apply your filters again.'; }
      } finally { if (ticket === version) results.removeAttribute('aria-busy'); }
    }
    document.addEventListener('change', event => {
      if (!root.isConnected) return;
      if (event.target.matches('[data-sort]')) {
        const url = new URL(location.href); url.searchParams.set('sort_by',event.target.value); url.searchParams.delete('page'); update(url);
      } else if (form.contains(event.target) && event.target.matches('input,select')) {
        clearTimeout(timer); controller?.abort(); version++;
        timer = setTimeout(()=>update(formURL()),120);
      }
    },options);
    document.addEventListener('submit', event => {
      if (event.target === form) { event.preventDefault(); update(formURL()); }
    },options);
    document.addEventListener('click', event => {
      const clear = event.target.closest('[data-filter-clear]');
      const page = event.target.closest('#collection-products a[href*="page="]');
      if (clear || page) {
        const url = new URL((clear || page).href);
        if (url.origin === location.origin && url.pathname === pathname) { event.preventDefault(); update(url); }
      }
    },options);
    window.addEventListener('popstate',()=>{if(location.pathname===pathname)update(new URL(location.href),false);},options);
    document.addEventListener('shopify:section:unload',event=>{
      if(event.target.contains(root)){listeners.abort();controller?.abort();clearTimeout(timer);}
    },options);
  }
  document.querySelectorAll('[data-collection-section]').forEach(init);
  document.addEventListener('shopify:section:load',event=>event.target.querySelectorAll('[data-collection-section]').forEach(init));
})();
