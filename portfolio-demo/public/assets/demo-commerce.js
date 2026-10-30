import {normalizeCart, cartDetails, changeCart} from './cart-model.js';

const products = JSON.parse(document.getElementById('demo-catalog').textContent);
const key = 'zipsters-portfolio-bag-v1';
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = cents => new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR',maximumFractionDigits:0}).format(cents/100);
let cart = [], storageAvailable = true;
let saved;
try { saved=localStorage.getItem(key); } catch { storageAvailable=false; }
try { cart=normalizeCart(JSON.parse(saved || '[]'),products); } catch { cart=[]; }

function save() {
  try { localStorage.setItem(key, JSON.stringify(cart)); storageAvailable=true; }
  catch { storageAvailable = false; }
  render();
}
const empty = '<div class="cart-empty"><p>Your bag is empty.</p><a class="button" href="/collections/henleys">SHOP HENLEYS <span>↗</span></a></div>';
function lines(items, editable = true) {
  return items.map(item => `<article class="cart-line"><a href="${item.product.url}?variant=${item.id}"><img src="${item.product.featured_image.src}" width="95" height="127" alt="${escape(item.product.title)}"></a><div><h3><a href="${item.product.url}?variant=${item.id}">${escape(item.product.title)}</a></h3><p>${escape(item.variant.title)}</p><p>${money(item.total)} <small>· demo</small></p>${editable ? `<div class="quantity"><button data-demo-id="${item.id}" data-quantity="${item.quantity-1}" aria-label="Decrease quantity of ${escape(item.product.title)}">−</button><span aria-label="Quantity">${item.quantity}</span><button data-demo-id="${item.id}" data-quantity="${item.quantity+1}" ${item.quantity>=item.variant.stock?'disabled':''} aria-label="Increase quantity of ${escape(item.product.title)}">+</button><button class="remove" data-demo-id="${item.id}" data-quantity="0">Remove</button></div>` : `<p>Quantity: ${item.quantity}</p>`}</div></article>`).join('');
}
function render() {
  const details = cartDetails(cart, products);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=`(${details.count})`);
  const notice = `<p class="demo-copy">Demo bag · sample prices. No real orders.${storageAvailable?'':' Browser storage is unavailable; your bag lasts for this page only.'}</p>`;
  const summary = `<div class="cart-summary"><div><span>Demo subtotal</span><strong>${money(details.total)}</strong></div><p>No payment, shipping or taxes will be charged.</p><a class="button" href="/checkout">DEMO CHECKOUT ↗</a><a class="demo-bag-link" href="/cart">VIEW BAG</a></div>`;
  document.querySelectorAll('[data-cart-content], [data-demo-cart-page]').forEach(el=>{el.innerHTML=notice+(details.count?`<div class="cart-content">${lines(details.items)}</div>${summary}`:empty);});
  const checkout = document.querySelector('[data-demo-checkout]');
  if (checkout) checkout.innerHTML = details.count ? `<div class="demo-order-lines">${lines(details.items,false)}</div><div class="cart-summary"><div><span>Demo total</span><strong>${money(details.total)}</strong></div><p>Sample delivery: complimentary. Payment: simulation only.</p><button class="button" data-place-demo-order>COMPLETE DEMO ORDER ↗</button><a class="demo-bag-link" href="/cart">EDIT BAG</a></div>` : empty;
}
window.demoCart = {render};
render();
window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  try { cart = normalizeCart(JSON.parse(event.newValue || '[]'), products); } catch { cart=[]; }
  render();
});

document.querySelectorAll('[data-product-form]').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const error = form.querySelector('[data-product-error]');
    error.textContent='';
    try {
      const data = new FormData(form);
      cart=changeCart(cart,products,Number(data.get('id')),Number(data.get('quantity') || 1),true);
      save();
      if(event.submitter?.hasAttribute('data-buy-now')) location.assign('/checkout');
      else document.querySelector('[data-open="cart-drawer"]').click();
    } catch(e) { error.textContent=e.message; }
  });
  const select = form.querySelector('[data-variant-select]');
  const sync = () => {
    const option = select?.selectedOptions[0];
    if(!option)return;
    const available=option.dataset.available==='true';
    form.querySelectorAll('[type="submit"]').forEach(button=>button.disabled=!available);
    form.querySelector('[data-add-label]').textContent=available?'ADD TO BAG':'UNAVAILABLE';
  };
  select?.addEventListener('change',()=>{
    const url=new URL(location.href);url.searchParams.set('variant',select.value);history.replaceState(null,'',url);
    form.querySelector('[data-product-error]').textContent='';sync();
  });
  sync();
});

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-demo-id]');
  if(button){
    const container=button.closest('[data-demo-cart-page], [data-cart-content]');
    const id=button.dataset.demoId;
    const label=button.getAttribute('aria-label');
    try {cart=changeCart(cart,products,Number(id),Number(button.dataset.quantity));save();
      const candidates=[...container.querySelectorAll(`[data-demo-id="${id}"]`)];
      (candidates.find(b=>b.getAttribute('aria-label')===label&&!b.disabled)||candidates.find(b=>!b.disabled)||container.querySelector('a'))?.focus();
    } catch(e){const error=document.querySelector('[data-cart-error]');error.hidden=false;error.textContent=e.message;}
  }
  if(event.target.closest('[data-place-demo-order]')){
    if(!cartDetails(cart,products).count)return;
    const reference='DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase();
    cart=[];save();
    const checkout=document.querySelector('[data-demo-checkout]');
    checkout.innerHTML=`<div class="demo-confirmation"><span class="eyebrow">${reference}</span><h2 tabindex="-1">Your demo order is complete.</h2><p>Thanks for exploring Zipsters. No payment was taken, no real order was placed, and nothing will be shipped.</p><a class="button" href="/collections/all">KEEP EXPLORING ↗</a></div>`;
    checkout.querySelector('h2').focus();
  }
});
document.querySelector('#newsletter-form')?.addEventListener('submit',event=>{
  event.preventDefault();
  document.querySelector('[data-newsletter-status]').textContent='Demo only — no subscription was created and your email was not saved or sent.';
  event.target.reset();
});
