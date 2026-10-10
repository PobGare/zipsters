import fs from 'node:fs/promises';
let p='theme/assets/theme.js',s=await fs.readFile(p,'utf8');
const start=s.indexOf('  let previousFocus;'),end=s.indexOf('  const escape =');
s=s.slice(0,start)+`  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
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
`+s.slice(end);
s=s.replace("if(config.preview)return;e.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;", "e.preventDefault();if(config.preview){showDialog('purchase-preview');return;}const buttons=[...form.querySelectorAll('[type=submit]')];const buyNow=e.submitter?.hasAttribute('data-buy-now');buttons.forEach(b=>b.disabled=true);");
s=s.replace("showDialog('cart-drawer');}catch(err)","if(buyNow){location.assign(config.root+'checkout');}else{showDialog('cart-drawer');}}catch(err)");
s=s.replace('finally{button.disabled=false;}','finally{buttons.forEach(b=>b.disabled=false);syncVariant(form);}');
s=s.replace("  document.addEventListener('shopify:section:load',()=>updateHeader());",`  function syncVariant(form){const option=form.querySelector('[data-variant-select]')?.selectedOptions[0];if(!option)return;const available=option.dataset.available==='true';form.querySelectorAll('[type=submit]').forEach(b=>b.disabled=!available);const label=form.querySelector('[data-add-label]');if(label)label.textContent=available?'ADD TO BAG':'UNAVAILABLE';const price=document.querySelector('[data-product-price]');if(price)price.textContent=option.dataset.price;}
  document.querySelectorAll('[data-variant-select]').forEach(select=>select.addEventListener('change',()=>syncVariant(select.form)));
  document.addEventListener('shopify:section:load',()=>updateHeader());`);
await fs.writeFile(p,s);
p='theme/layout/theme.liquid';s=await fs.readFile(p,'utf8');s=s.replace("{{ 'theme.css' | asset_url | stylesheet_tag }}","{{ 'theme.css' | asset_url | stylesheet_tag }}\n{{ 'refinements.css' | asset_url | stylesheet_tag }}");s=s.replace('<script src="{{ \'theme.js\' | asset_url }}" defer></script>','<script src="{{ \'theme.js\' | asset_url }}" defer></script><script src="{{ \'refinements.js\' | asset_url }}" defer></script>');await fs.writeFile(p,s);
p='theme/assets/refinements.css';s=await fs.readFile(p,'utf8');s=s.replace('grid-template-columns:minmax(0,61%) minmax(0,39%)','grid-template-columns:minmax(0,1.56fr) minmax(0,1fr)');await fs.writeFile(p,s);
