(() => {
  const config = window.zipsters || {root:'/', preview:true, currency:'PKR',locale:'en-PK'};
  const header = document.querySelector('[data-header]');
  const isHome = document.body.classList.contains('template-index');
  const updateHeader = () => header?.classList.toggle('is-solid', !isHome || window.scrollY > 30);
  updateHeader(); window.addEventListener('scroll', updateHeader, {passive:true});
  let previousFocus;
  const megaButton = document.querySelector('[data-mega-toggle]');
  const mega = document.getElementById('shop-menu');
  const closeMega = () => {if(mega){mega.hidden = true;megaButton.setAttribute('aria-expanded','false');}};
  const toggleMega = (open) => {mega.hidden = !open;megaButton.setAttribute('aria-expanded',String(open));};
  megaButton?.addEventListener('click',()=>toggleMega(mega.hidden));
  if(window.matchMedia('(hover:hover)').matches){header?.addEventListener('mouseleave',closeMega);}
  document.addEventListener('click',e=>{if(!header?.contains(e.target))closeMega();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMega();}});
  header?.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))closeMega();});
  function showDialog(id){closeMega();previousFocus=document.activeElement;const dialog=document.getElementById(id);if(!dialog)return;document.querySelectorAll('dialog[open]').forEach(d=>d.close());dialog.showModal();if(id==='cart-drawer')loadCart();}
  document.addEventListener('click',e=>{
    const opener=e.target.closest('[data-open]');if(opener)showDialog(opener.dataset.open);
    const closer=e.target.closest('[data-close]');if(closer)closer.closest('dialog')?.close();
    const link=e.target.closest('dialog a');if(link)link.closest('dialog').close();
  });
  document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>previousFocus?.focus());});
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
  document.querySelectorAll('[data-product-form]').forEach(form=>{form.addEventListener('submit',async e=>{if(config.preview)return;e.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;const error=form.querySelector('[data-product-error]');error.textContent='';try{await cartRequest('cart/add.js',{items:[{id:Number(new FormData(form).get('id')),quantity:1}]});showDialog('cart-drawer');}catch(err){error.textContent=err.message;}finally{button.disabled=false;}});});
  document.querySelectorAll('[data-sort]').forEach(select=>select.addEventListener('change',()=>{const url=new URL(location.href);url.searchParams.set('sort_by',select.value);url.searchParams.delete('page');location.assign(url);}));
  if(config.preview){document.querySelector('#newsletter-form')?.addEventListener('submit',e=>{e.preventDefault();const status=document.querySelector('[data-newsletter-status]');status.textContent='Newsletter signup will open with the store. For now, find us at @zipstersofficial.';});}
  document.addEventListener('shopify:section:load',()=>updateHeader());
})();
