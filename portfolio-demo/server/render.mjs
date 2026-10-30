import {products, searchProducts, collectionFor, projectRoot} from './catalog.mjs';
import path from 'node:path';
import fs from 'node:fs/promises';
import {Liquid} from 'liquidjs';
const root=path.join(projectRoot,'theme');
const originalRead=async file=>fs.readFile(file,'utf8');
const transform=source=>source.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g,'').replace(/{%\s*paginate\s+.*?%}/g,'').replace(/{%\s*endpaginate\s*%}/g,'').replace(/{%\s*form\s+'customer'.*?%}/g,'<form id="newsletter-form" class="newsletter-form" method="post" action="/contact">').replace(/{%\s*form\s+'product'.*?%}/g,'<form class="product-form" data-product-form action="/cart/add" method="post">').replace(/{%\s*endform\s*%}/g,'</form>');
const engine=new Liquid({root:[path.join(root,'snippets'),path.join(root,'sections')],extname:'.liquid',jsTruthy:false,fs:{exists:async p=>{try{await fs.access(p);return true;}catch{return false;}},existsSync:()=>true,readFile:async p=>transform(await originalRead(p)),resolve:(r,f,e)=>path.resolve(r,f.endsWith(e)?f:f+e),dirname:p=>path.dirname(p),sep:path.sep}});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
engine.registerFilter('asset_url',s=>'/assets/'+s);
engine.registerFilter('stylesheet_tag',s=>`<link rel="stylesheet" href="${s}">`);
engine.registerFilter('json',s=>JSON.stringify(s));
engine.registerFilter('money',s=>s==null?'':new Intl.NumberFormat('en-PK',{style:'currency',currency:'PKR'}).format(s/100));
engine.registerFilter('image_url',(image)=>typeof image==='string'?image:image?.src);
engine.registerFilter('image_tag',(src,...args)=>{const a=Object.fromEntries(args.filter(Array.isArray));const base=src?.replace(/-960\.jpg$/,'');return `<img src="${esc(src)}" ${base?`srcset="${base}-480.jpg 480w, ${base}-960.jpg 960w, ${base}-1200.jpg 1200w"`:''} sizes="${esc(a.sizes||'100vw')}" width="1200" height="1600" alt="${esc(a.alt||'Zipsters menswear')}" loading="${a.loading||'lazy'}" class="${esc(a.class||'')}">`;});
engine.registerFilter('default_errors',()=> '');engine.registerFilter('metafield_tag',s=>s?.html||esc(s?.value||s));engine.registerFilter('t',s=>({'products.choose_variant':'Choose your size / color','products.unavailable':'Unavailable','products.add_to_bag':'ADD TO BAG'}[s]||s));
const readJSON=async name=>JSON.parse(await originalRead(path.join(root,name)));
const image=base=>({src:'/assets/'+base+'-960.jpg'});
async function context(){
const index=await readJSON('templates/index.json');const settings=(await readJSON('config/settings_data.json')).current;
return {index,products,settings,shop:{name:'ZIPSTERS',customer_accounts_enabled:false,policies:[],shipping_policy:{body:'<p>Demo only: no shipping, payment or real orders. Prices, sizes and stock are sample data.</p>'}},cart:{item_count:0,currency:{iso_code:'PKR'}},routes:{root_url:'/',collections_url:'/collections',all_products_collection_url:'/collections/all',search_url:'/search',cart_url:'/cart',account_url:'/account'},request:{locale:{iso_code:'en'}},presentation_preview:false,localization:{},form:{},template:{name:'index'},page_title:'ZIPSTERS — Everyday. In character.'};
}
const sectionObject=(section,id)=>({...section,id,blocks:(section.block_order||Object.keys(section.blocks||{})).map(key=>({...section.blocks[key],id:key}))});
async function renderSection(section,id,ctx){return engine.parseAndRender(transform(await originalRead(path.join(root,'sections',section.type+'.liquid'))),{...ctx,section:sectionObject(section,id)});}
export async function render(url){const ctx=await context();let content='';let status=200;
if(url.pathname==='/'){for(const id of ctx.index.order)content+=await renderSection(ctx.index.sections[id],id,ctx);}
else if(url.pathname.startsWith('/products/')){ctx.template.name='product';ctx.product=ctx.products.find(p=>p.url===url.pathname);if(!ctx.product){status=404;}else{ctx.page_title=ctx.product.title+' — '+ctx.product.metafields.custom.color.value;const variant=ctx.product.variants.find(v=>String(v.id)===url.searchParams.get('variant'));if(variant)ctx.product={...ctx.product,selected_or_first_available_variant:variant};ctx.recommendations={performed:true,products:[...ctx.products.filter(p=>p.id!==ctx.product.id&&p.type===ctx.product.type),...ctx.products.filter(p=>p.type!==ctx.product.type)].slice(0,4)};const productTemplate=await readJSON('templates/product.json');for(const id of productTemplate.order){const section=structuredClone(productTemplate.sections[id]);if(section.type==='main-product')section.settings={...section.settings,size_guide:{content:'<p>Sample size guide · not verified garment measurements.</p><table class="demo-size-table"><caption>Illustrative chest measurements (inches)</caption><thead><tr><th>Size</th><th>Chest</th></tr></thead><tbody><tr><td>S</td><td>36–38</td></tr><tr><td>M</td><td>38–40</td></tr><tr><td>L</td><td>40–42</td></tr><tr><td>XL</td><td>42–44</td></tr></tbody></table><p>For pants, the sample size labels represent waist sizes in inches.</p>'}};content+=await renderSection(section,id,ctx);}}}
else if(url.pathname.startsWith('/collections/')){ctx.template.name='collection';ctx.collection=collectionFor(url);if(!ctx.collection){status=404;}else{ctx.page_title=ctx.collection.title;content=await renderSection({type:'main-collection'},'main',ctx);}}
else if(url.pathname==='/search/suggest'){const q=(url.searchParams.get('q')||'').toLowerCase();ctx.predictive_search={performed:true,resources:{products:searchProducts(q).slice(0,6)}};return {status:200,html:await renderSection({type:'predictive-search'},'predictive-search',ctx)};}
else if(url.pathname==='/search'){ctx.template.name='search';const q=url.searchParams.get('q')||'';ctx.search={terms:q,results:searchProducts(q)};ctx.page_title='Search';content=await renderSection({type:'main-search'},'main',ctx);}
else if(url.pathname==='/cart'){ctx.template.name='cart';content=await renderSection({type:'main-cart'},'main',ctx);}else if(url.pathname==='/checkout'){ctx.template.name='checkout';ctx.page_title='Demo checkout';content=await renderSection({type:'demo-checkout'},'main',ctx);}else{status=404;}
if(status===404){ctx.template.name='404';ctx.page_title='Page not found';content=await renderSection({type:'main-404'},'main',ctx);}
if(url.searchParams.has('section_id')&&ctx.template.name==='collection')return {status,html:content};
const header=await renderSection({type:'header',settings:{}},'header',ctx);const footer=await renderSection({type:'footer',settings:{heading:'Stay in the loop.'}},'footer',ctx);
const layout=(await originalRead(path.join(root,'layout/theme.liquid'))).replace("{% section 'header' %}",'{{ preview_header }}').replace("{% section 'footer' %}",'{{ preview_footer }}');
return {status,html:await engine.parseAndRender(layout,{...ctx,preview_header:header,preview_footer:footer,content_for_layout:content,content_for_header:'<meta name="robots" content="noindex,nofollow"><script type="application/json" id="demo-catalog">'+JSON.stringify(products).replace(/</g,'\\u003c')+'</script>',canonical_url:url.origin+url.pathname})};
}
