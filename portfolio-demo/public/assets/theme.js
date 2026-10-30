(() => {
  const config = window.zipsters || {root:'/', preview:true, currency:'PKR',locale:'en-PK'};
  const header = document.querySelector('[data-header]');
  const isHome = document.body.classList.contains('template-index');
  const updateHeader = () => header?.classList.toggle('is-solid', !isHome || window.scrollY > 30);
  updateHeader(); window.addEventListener('scroll', updateHeader, {passive:true});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const focusOrigins = new WeakMap();
  const closeTimers = new WeakMap();
  function closeDialog(dialog, restore=true, immediate=false){
    if(!dialog?.open || closeTimers.has(dialog))return;
    const finish=()=>{dialog.close();dialog.classList.remove('is-closing');closeTimers.delete(dialog);const origin=focusOrigins.get(dialog);if(restore&&origin?.isConnected&&!origin.closest('dialog:not([open])'))origin.focus({preventScroll:true});};
    if(reduced.matches||immediate){finish();return;}
    dialog.classList.add('is-closing');
    closeTimers.set(dialog,setTimeout(finish,220));
  }
  function showDialog(id){
    const dialog=document.getElementById(id);if(!dialog)return;
    let origin=document.activeElement;
    document.querySelectorAll('dialog[open]').forEach(d=>{origin=focusOrigins.get(d)||origin;clearTimeout(closeTimers.get(d));closeTimers.delete(d);closeDialog(d,false,true);});
    focusOrigins.set(dialog,origin);dialog.classList.remove('is-closing');dialog.showModal();
      if(id==='search-dialog')dialog.querySelector('input[type="search"]')?.focus({preventScroll:true});
      else if(id==='mobile-menu')dialog.querySelector('[data-close]')?.focus({preventScroll:true});
    if(id==='cart-drawer')loadCart();
  }
  document.addEventListener('click',e=>{
    const opener=e.target.closest('[data-open]');if(opener){showDialog(opener.dataset.open);return;}
    const closer=e.target.closest('[data-close]');if(closer)closeDialog(closer.closest('dialog'));
    const link=e.target.closest('dialog a');if(link)closeDialog(link.closest('dialog'),false,true);
  });
  document.querySelectorAll('dialog').forEach(d=>{
    d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});
  });
  function loadCart(){window.demoCart?.render();}
  function syncVariant(form){const option=form.querySelector('[data-variant-select]')?.selectedOptions[0];if(!option)return;const available=option.dataset.available==='true';form.querySelectorAll('[type=submit]').forEach(b=>b.disabled=!available);const label=form.querySelector('[data-add-label]');if(label)label.textContent=available?'ADD TO BAG':'UNAVAILABLE';const price=document.querySelector('[data-product-price]');if(price)price.textContent=option.dataset.price;}
  document.querySelectorAll('[data-variant-select]').forEach(select=>select.addEventListener('change',()=>syncVariant(select.form)));
  document.addEventListener('shopify:section:load',()=>updateHeader());
})();
