(() => {
  const cache = new Map();
  function init(root) {
    if (root.dataset.searchReady) return;
    root.dataset.searchReady = 'true';
    const input = root.querySelector('input[type="search"]');
    const results = root.querySelector('[data-search-results]');
    const status = root.querySelector('[data-search-status]');
    let timer, controller, version = 0, active = -1;
    const links = () => [...results.querySelectorAll('[data-search-result]')];
    function select(index) {
      const items = links();
      active = items.length ? (index + items.length) % items.length : -1;
      items.forEach((item, i) => item.setAttribute('aria-selected', String(i === active)));
      if (active >= 0) {
        input.setAttribute('aria-activedescendant', items[active].id);
        items[active].scrollIntoView({block:'nearest'});
      } else input.removeAttribute('aria-activedescendant');
    }
    function display(html) {
      results.innerHTML = html;
      links().forEach((item,i) => item.id = results.id + '-' + i);
      results.hidden = !links().length;
      input.setAttribute('aria-expanded', String(!results.hidden));
      status.textContent = links().length ? links().length + ' products' : 'No products found.';
      active = -1; input.removeAttribute('aria-activedescendant');
      links().forEach(item => item.setAttribute('aria-selected','false'));
    }
    async function search(query, ticket) {
      if (cache.has(query)) { display(cache.get(query)); return; }
      controller = new AbortController();
      status.textContent = 'Searching…';
      results.setAttribute('aria-busy','true');
      try {
        const url = new URL((window.zipsters?.root || '/') + 'search/suggest', location.origin);
        url.search = new URLSearchParams({q:query,'resources[type]':'product','resources[limit]':'6',section_id:'predictive-search'});
        const response = await fetch(url, {signal:controller.signal});
        if (!response.ok) throw new Error('Search request failed');
        const doc = new DOMParser().parseFromString(await response.text(),'text/html');
        const fragment = doc.querySelector('[data-predictive-results]');
        if (!fragment) throw new Error('Missing search results');
        if (ticket !== version) return;
        cache.set(query,fragment.innerHTML);
        if (cache.size > 30) cache.delete(cache.keys().next().value);
        display(fragment.innerHTML);
      } catch (error) {
        if (error.name !== 'AbortError' && ticket === version) status.textContent = 'Search is unavailable. Press Enter to see results.';
      } finally { if (ticket === version) results.removeAttribute('aria-busy'); }
    }
    input.addEventListener('input', () => {
      clearTimeout(timer); controller?.abort(); const ticket = ++version;
      const query = input.value.trim(); active = -1;
      input.removeAttribute('aria-activedescendant');
      results.hidden = true; input.setAttribute('aria-expanded','false');
      if (!query) { results.innerHTML=''; status.textContent=''; return; }
      timer = setTimeout(() => search(query,ticket),200);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!results.hidden && links().length) { event.preventDefault(); select(active + (event.key === 'ArrowDown' ? 1 : -1)); }
      } else if (event.key === 'Enter' && active >= 0 && !results.hidden) {
        event.preventDefault(); links()[active].click();
      }
    });
    root.closest('dialog')?.addEventListener('close', () => {
      clearTimeout(timer); controller?.abort(); version++;
      results.removeAttribute('aria-busy');
      if (status.textContent === 'Searching…') status.textContent='';
    });
  }
  document.querySelectorAll('[data-predictive-search]').forEach(init);
  document.addEventListener('shopify:section:load',event=>event.target.querySelectorAll('[data-predictive-search]').forEach(init));
})();
