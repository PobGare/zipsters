(() => {
  const config = window.zipsters || {root:'/', preview:true, currency:'PKR',locale:'en-PK'};
  const header = document.querySelector('[data-header]');
  const isHome = document.body.classList.contains('template-index');
  const updateHeader = () => header?.classList.toggle('is-solid', !isHome || window.scrollY > 30);
  updateHeader(); window.addEventListener('scroll', updateHeader, {passive:true});
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const focusOrigins = new WeakMap();
  const closeTimers = new WeakMap();
  const megaButton = document.querySelector('[data-mega-toggle]');
  const mega = document.getElementById('shop-menu');
  let menuAnimation;
  let menuDesired = false;
  function toggleMega(open) {
    if(!mega) return;
    menuDesired = open;
    menuAnimation?.cancel();
    megaButton.setAttribute('aria-expanded', String(open));
    if(open) mega.hidden = false;
    if(reduced.matches){mega.hidden = !open;return;}
    menuAnimation = mega.animate(open ? [{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}] : [{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-6px)'}], {duration:240,easing:'cubic-bezier(.22,.61,.36,1)'});
    menuAnimation.finished.then(()=>{if(!menuDesired)mega.hidden=true;}).catch(()=>{});
  }
  const closeMega = () => {if(menuDesired)toggleMega(false);};
  megaButton?.addEventListener('click',()=>toggleMega(!menuDesired));
  if(window.matchMedia('(hover:hover)').matches)header?.addEventListener('mouseleave',closeMega);
  document.addEventListener('click',e=>{if(!header?.contains(e.target))closeMega();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(mega?.contains(document.activeElement))megaButton.focus();closeMega();}});
  header?.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))closeMega();});
  function closeDialog(dialog, restore=true, immediate=false){
    if(!dialog?.open || closeTimers.has(dialog))return;
    const finish=()=>{dialog.close();dialog.classList.remove('is-closing');closeTimers.delete(dialog);const origin=focusOrigins.get(dialog);if(restore&&origin?.isConnected&&!origin.closest('dialog:not([open])'))origin.focus({preventScroll:true});};
    if(reduced.matches||immediate){finish();return;}
    dialog.classList.add('is-closing');
    closeTimers.set(dialog,setTimeout(finish,220));
  }
  function showDialog(id){
    closeMega();const dialog=document.getElementById(id);if(!dialog)return;
    let origin=document.activeElement;
    document.querySelectorAll('dialog[open]').forEach(d=>{origin=focusOrigins.get(d)||origin;clearTimeout(closeTimers.get(d));closeTimers.delete(d);closeDialog(d,false,true);});
    focusOrigins.set(dialog,origin);dialog.classList.remove('is-closing');dialog.showModal();
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
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = cents => new Intl.NumberFormat(config.locale,{style:'currency',currency:config.currency}).format(cents/100);
  async function cartRequest(path,body){const r=await fetch(config.root+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw new Error(data.description||'We couldn’t update your bag. Please try again.');return data;}
  function cartError(error){const el=document.querySelector('[data-cart-error]');el.textContent=error.message;el.hidden=false;}
  function renderCart(cart){
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=`(${cart.item_count})`);
    const content=document.querySelector('[data-cart-content]');
    if(!cart.item_count){content.innerHTML=`<div class="cart-empty"><span class="eyebrow">A GOOD PLACE TO START</span><p>Your everyday<br>is waiting.</p><a class="button" href="${config.root}collections/henleys">EXPLORE HENLEYS <span>↗</span></a></div>`;return;}
    content.innerHTML=`<div class="cart-content">${cart.items.map(item=>`<article class="cart-line"><a href="${escape(item.url)}">${item.image?`<img src="${escape(item.image)}" width="95" height="127" alt="${escape(item.product_title)}">`:''}</a><div><h3><a href="${escape(item.url)}">${escape(item.product_title)}</a></h3>${item.variant_title?`<p>${escape(item.variant_title)}</p>`:''}<p>${money(item.final_line_price)}</p><div class="quantity"><button data-cart-key="${escape(item.key)}" data-quantity="${item.quantity-1}" aria-label="Decrease quantity of ${escape(item.product_title)}">−</button><span>${item.quantity}</span><button data-cart-key="${escape(item.key)}" data-quantity="${item.quantity+1}" aria-label="Increase quantity of ${escape(item.product_title)}">+</button><button class="remove" data-cart-key="${escape(item.key)}" data-quantity="0">Remove</button></div></div></article>`).join('')}</div><div class="cart-summary"><div><span>Subtotal</span><span>${money(cart.total_price)}</span></div><p>Shipping and taxes calculated at checkout.</p><form action="${config.root}cart" method="post"><button class="button" name="checkout" type="submit">CHECKOUT ↗</button></form></div>`;
  }
  async function loadCart(){if(config.preview)return;try{renderCart(await cartRequest('cart.js'));}catch(e){cartError(e);}}
  document.addEventListener('click',async e=>{const btn=e.target.closest('[data-cart-key]');if(!btn)return;const container=document.querySelector('[data-cart-content]');container.querySelectorAll('button').forEach(b=>b.disabled=true);document.querySelector('[data-cart-error]').hidden=true;try{renderCart(await cartRequest('cart/change.js',{id:btn.dataset.cartKey,quantity:Number(btn.dataset.quantity)}));}catch(err){cartError(err);}finally{container.querySelectorAll('button').forEach(b=>b.disabled=false);}});
  document.querySelectorAll('[data-product-form]').forEach(form=>{form.addEventListener('submit',async e=>{e.preventDefault();if(config.preview){showDialog('purchase-preview');return;}const buttons=[...form.querySelectorAll('[type=submit]')];const buyNow=e.submitter?.hasAttribute('data-buy-now');buttons.forEach(b=>b.disabled=true);const error=form.querySelector('[data-product-error]');error.textContent='';try{await cartRequest('cart/add.js',{items:[{id:Number(new FormData(form).get('id')),quantity:1}]});if(buyNow){location.assign(config.root+'checkout');}else{showDialog('cart-drawer');}}catch(err){error.textContent=err.message;}finally{buttons.forEach(b=>b.disabled=false);syncVariant(form);}});});
  document.querySelectorAll('[data-sort]').forEach(select=>select.addEventListener('change',()=>{const url=new URL(location.href);url.searchParams.set('sort_by',select.value);url.searchParams.delete('page');location.assign(url);}));
  if(config.preview){document.querySelector('#newsletter-form')?.addEventListener('submit',e=>{e.preventDefault();const status=document.querySelector('[data-newsletter-status]');status.textContent='Newsletter signup will open with the store. For now, find us at @zipstersofficial.';});}
  function syncVariant(form){const option=form.querySelector('[data-variant-select]')?.selectedOptions[0];if(!option)return;const available=option.dataset.available==='true';form.querySelectorAll('[type=submit]').forEach(b=>b.disabled=!available);const label=form.querySelector('[data-add-label]');if(label)label.textContent=available?'ADD TO BAG':'UNAVAILABLE';const price=document.querySelector('[data-product-price]');if(price)price.textContent=option.dataset.price;}
  document.querySelectorAll('[data-variant-select]').forEach(select=>select.addEventListener('change',()=>syncVariant(select.form)));
  document.addEventListener('shopify:section:load',()=>updateHeader());
})();
