import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = process.env.VERCEL ? process.cwd() : fileURLToPath(new URL('../', import.meta.url));
const read = name => fs.readFile(path.join(projectRoot, 'data', name), 'utf8').then(JSON.parse);
const [pieces, editorial] = await Promise.all([read('preview-catalog.json'), read('catalog-editorial.json')]);
const prices = [329000, 329000, 329000, 329000, 399000, 279000, 549000, 499000];
const image = base => ({src: `/assets/${base}-960.jpg`});

// All commercial values below are fictional portfolio fixtures, never live merchant data.
export const products = pieces.map(({settings: s}, i) => {
  const handle = s.link.split('/').pop();
  const type = s.title.includes('Henley') ? 'Henleys' : s.title.includes('Pants') ? 'Pants' : 'T-shirts';
  const copy = editorial[handle] || {};
  const sizes = type === 'Pants' ? ['28', '30', '32', '34', '36'] : ['S', 'M', 'L', 'XL'];
  const variants = sizes.map((size, j) => ({
    id: (i + 1) * 100 + j + 1, title: `${size} / ${s.color}`, size,
    price: prices[i], available: !(i === 0 && size === 'XL'),
    stock: i === 0 && size === 'XL' ? 0 : 5,
  }));
  return {
    id: i + 1, title: s.title, handle, url: s.link, type,
    price: prices[i], available: true, object_type: 'product', demo: true,
    featured_image: image(s.fallback),
    images: [image(s.fallback), ...(s.fallback_alt ? [image(s.fallback_alt)] : []), ...(copy.extraImages || []).map(image)],
    description: `${copy.description || s.title}<p class="demo-copy">Demo product data: prices, sizes and availability are illustrative.</p>`,
    metafields: {custom: {
      color: {value: s.color},
      fit: {html: '<p>Demo fit information: choose your usual size for a relaxed silhouette. The sample size guide is illustrative, not a verified garment measurement.</p>'},
      care: {html: '<p>Demo care information: follow the label supplied with the actual garment.</p>'},
    }},
    variants, selected_or_first_available_variant: variants[0], has_only_default_variant: false,
    collections: [{url: `/collections/${{'Henleys':'henleys', 'Pants':'pants', 'T-shirts':'t-shirts'}[type]}`}],
  };
});

export function searchProducts(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter(p => words.every(word => `${p.title} ${p.type} ${p.metafields.custom.color.value}`.toLowerCase().includes(word)));
}

export function collectionFor(url) {
  const handle = url.pathname.split('/').pop();
  const types = {all: null, henleys: 'Henleys', 't-shirts': 'T-shirts', pants: 'Pants'};
  if (!(handle in types)) return null;
  const base = products.filter(p => !types[handle] || p.type === types[handle]);
  const params = url.searchParams;
  const colors = params.getAll('filter.p.m.custom.color');
  const categories = params.getAll('filter.p.product_type');
  const sizes = params.getAll('filter.v.option.size');
  const minimum = params.get('filter.v.price.gte');
  const maximum = params.get('filter.v.price.lte');
  let filtered = base.filter(p => (!colors.length || colors.includes(p.metafields.custom.color.value)) &&
    (!categories.length || categories.includes(p.type)) &&
    (!sizes.length || p.variants.some(v => v.available && sizes.includes(v.size))) &&
    (!minimum || p.price >= Number(minimum) * 100) && (!maximum || p.price <= Number(maximum) * 100));
  const sort = params.get('sort_by') || 'manual';
  const compare = {
    'title-ascending': (a,b) => a.title.localeCompare(b.title),
    'title-descending': (a,b) => b.title.localeCompare(a.title),
    'price-ascending': (a,b) => a.price-b.price,
    'price-descending': (a,b) => b.price-a.price,
    'best-selling': (a,b) => [4,1,2,3,5,6,7,8].indexOf(a.id)-[4,1,2,3,5,6,7,8].indexOf(b.id),
  }[sort];
  if (compare) filtered.sort(compare);
  const list = (label, param, values, matches) => ({label, type:'list', values:values.map(value => ({
    param_name:param, value, label:value, active:params.getAll(param).includes(value), count:base.filter(p => matches(p,value)).length,
  }))});
  const filters = [list('Color', 'filter.p.m.custom.color', [...new Set(base.map(p => p.metafields.custom.color.value))], (p,v) => p.metafields.custom.color.value===v)];
  if (handle === 'all') filters.push(list('Category','filter.p.product_type',['Henleys','T-shirts','Pants'],(p,v)=>p.type===v));
  filters.push(list('Size · demo availability','filter.v.option.size',[...new Set(base.flatMap(p=>p.variants.map(v=>v.size)))],(p,v)=>p.variants.some(o=>o.size===v&&o.available)));
  filters.push({label:'Price · demo PKR',type:'price_range', min_value:{param_name:'filter.v.price.gte',value:minimum ? Number(minimum)*100 : ''},max_value:{param_name:'filter.v.price.lte',value:maximum ? Number(maximum)*100 : ''}});
  return {handle, title:{all:'The wardrobe.',henleys:'The Henleys.','t-shirts':'T-shirts & mesh.',pants:'Pants & denim.'}[handle],
    url:url.pathname, products:filtered, products_count:filtered.length, sort_by:sort, filters,
    sort_options:[{name:'Featured',value:'manual'},{name:'Best selling · demo',value:'best-selling'},{name:'Price, low to high',value:'price-ascending'},{name:'Price, high to low',value:'price-descending'},{name:'Name, A–Z',value:'title-ascending'},{name:'Name, Z–A',value:'title-descending'}]};
}
