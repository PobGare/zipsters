import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {products,searchProducts,collectionFor,projectRoot} from '../server/catalog.mjs';
import {render} from '../server/render.mjs';
import {normalizeCart,cartDetails,changeCart} from '../public/assets/cart-model.js';
import handler from '../api/storefront.js';

const url = route => new URL(route,'https://demo.example');
test('catalog has eight real-image products and explicitly fictional commercial data',()=>{
  assert.equal(products.length,8);assert.ok(products.every(p=>p.demo&&p.price>0&&p.variants.length>=4));
});
test('search matches words, colors and categories, case insensitively',()=>{
  assert.equal(searchProducts('BLACK henley').length,1);assert.equal(searchProducts('pants').length,2);assert.equal(searchProducts('not-a-product').length,0);
});
test('collection filters combine color, category, price and available size',()=>{
  const c=collectionFor(url('/collections/all?filter.p.m.custom.color=Black&filter.p.product_type=Henleys&filter.v.price.lte=3500&filter.v.option.size=M'));
  assert.equal(c.products.length,1);
  assert.equal(collectionFor(url('/collections/henleys?filter.p.m.custom.color=Black&filter.v.option.size=XL')).products.length,0);
});
test('price bounds are inclusive and categories cannot escape collection',()=>{
  assert.equal(collectionFor(url('/collections/henleys?filter.v.price.gte=3290&filter.v.price.lte=3290')).products.length,4);
  assert.equal(collectionFor(url('/collections/pants?filter.p.product_type=Henleys')).products.length,0);
});
test('sort orders, repeated filter values and invalid collection',()=>{
  const ascending=collectionFor(url('/collections/all?sort_by=price-ascending')).products.map(p=>p.price);
  assert.deepEqual(ascending,[...ascending].sort((a,b)=>a-b));
  assert.deepEqual(collectionFor(url('/collections/all?sort_by=price-descending')).products.map(p=>p.price),[...ascending].reverse());
  assert.equal(collectionFor(url('/collections/henleys?filter.p.m.custom.color=Black&filter.p.m.custom.color=Brown')).products.length,2);
  assert.equal(collectionFor(url('/collections/missing')),null);
});
test('cart merges quantities, separates variants and recalculates money from catalog',()=>{
  let cart=changeCart([],products,101,1,true);cart=changeCart(cart,products,101,2,true);cart=changeCart(cart,products,102,1,true);
  const details=cartDetails(cart,products);assert.equal(details.count,4);assert.equal(details.items.length,2);assert.equal(details.total,1316000);
});
test('cart removes lines and rejects sold-out, unknown and invalid quantities',()=>{
  assert.deepEqual(changeCart([{id:101,quantity:1}],products,101,0),[]);
  for(const [id,q] of [[104,1],[9999,1],[101,-1],[101,1.5],[101,6],[101,NaN]])assert.throws(()=>changeCart([],products,id,q));
  assert.throws(()=>changeCart([{id:101,quantity:5}],products,101,1,true));
});
test('tampered storage cannot inject price, unavailable items, excessive or fractional quantities',()=>{
  assert.deepEqual(normalizeCart([null,{id:9999,quantity:1},{id:104,quantity:2},{id:101,quantity:99,price:1},{id:102,quantity:1.5}],products),[{id:101,quantity:5}]);
  assert.deepEqual(normalizeCart({},products),[]);assert.equal(cartDetails([{id:101,quantity:1,price:1}],products).total,329000);
});
for(const route of ['/','/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/cart','/checkout',...products.map(p=>p.url)]){
  test(`renders ${route} without Liquid or missing local asset errors`,async()=>{
    const result=await render(url(route));assert.equal(result.status,200);assert.doesNotMatch(result.html,/class="demo-banner"|data-slider-pause/);assert.match(result.html,/id="demo-info"/);assert.doesNotMatch(result.html,/Liquid error|http:\/\/localhost/);
    const assets=new Set([...result.html.matchAll(/(?:src|href|data-src|data-desktop-src|poster)="(\/assets\/[^"\s]+)"/g)].map(m=>m[1]));
    for(const match of result.html.matchAll(/srcset="([^"]+)"/g))for(const item of match[1].split(','))assets.add(item.trim().split(' ')[0]);
    for(const asset of assets)await fs.access(path.join(projectRoot,'public',asset));
    const catalog=JSON.parse(result.html.match(/id="demo-catalog">(.*?)<\/script>/s)[1]);assert.equal(catalog.length,8);
  });
}
test('full search and predictive fragments return matching products and escape user input',async()=>{
  const result=await render(url('/search?q=%3Cscript%3Ealert(1)%3C/script%3E'));
  assert.doesNotMatch(result.html,/<script>alert\(1\)<\/script>/);assert.match(result.html,/No pieces found/);
  const predict=await render(url('/search/suggest?q=mesh'));
  assert.match(predict.html,/data-predictive-results/);assert.equal((predict.html.match(/data-search-result role/g)||[]).length,1);
});
test('filtered section response contains filtered products and active controls',async()=>{
  const result=await render(url('/collections/all?filter.p.m.custom.color=Brown&section_id=main'));
  assert.match(result.html,/1 piece/);assert.match(result.html,/value="Brown" checked/);assert.doesNotMatch(result.html,/<!doctype/);
});
test('variant deep links preserve sold-out selection and disabled purchase actions',async()=>{
  const result=await render(url('/products/textured-half-sleeve-henley-black?variant=104'));
  assert.match(result.html,/value="104"[^>]*selected/);assert.match(result.html,/data-add-to-bag disabled/);
});
test('unknown product, collection and page return actual 404 status',async()=>{
  for(const route of ['/products/missing','/collections/missing','/unknown'])assert.equal((await render(url(route))).status,404);
});
test('handler keeps deep-link query strings and refuses transaction endpoints',async()=>{
  const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},end(body){this.body=body;}});
  const get=response();await handler({method:'GET',url:'/collections/all?filter.p.m.custom.color=Brown',headers:{host:'demo.example','x-forwarded-proto':'https'}},get);
  assert.equal(get.statusCode,200);assert.match(get.body,/1 piece/);
  const post=response();await handler({method:'POST',url:'/cart',headers:{}},post);assert.equal(post.statusCode,405);
});
