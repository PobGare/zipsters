// Shared browser / Node model. Only variant IDs and quantities are persisted.
export function normalizeCart(raw, products) {
  if (!Array.isArray(raw)) return [];
  const grouped = new Map();
  for (const line of raw) {
    if (!line || !Number.isSafeInteger(line.id) || !Number.isSafeInteger(line.quantity) || line.quantity < 1) continue;
    const variant = products.flatMap(p => p.variants).find(v => v.id === line.id && v.available);
    if (!variant) continue;
    grouped.set(line.id, Math.min(variant.stock, (grouped.get(line.id) || 0) + line.quantity));
  }
  return [...grouped].map(([id, quantity]) => ({id, quantity}));
}

export function cartDetails(raw, products) {
  const items = normalizeCart(raw, products).map(line => {
    const product = products.find(p => p.variants.some(v => v.id === line.id));
    const variant = product.variants.find(v => v.id === line.id);
    return {...line, product, variant, total: variant.price * line.quantity};
  });
  return {items, count: items.reduce((n,i)=>n+i.quantity,0), total: items.reduce((n,i)=>n+i.total,0)};
}

export function changeCart(raw, products, id, quantity, add = false) {
  const cart = normalizeCart(raw, products);
  const variant = products.flatMap(p=>p.variants).find(v=>v.id===id);
  if (!variant?.available) throw new Error('This demo size is unavailable. Please choose another size.');
  if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error('Choose a valid whole-number quantity.');
  const current = cart.find(i=>i.id===id);
  const next = quantity + (add ? current?.quantity || 0 : 0);
  if (next > variant.stock) throw new Error(`Only ${variant.stock} available in this demo size.`);
  return [...cart.filter(i=>i.id!==id), ...(next ? [{id,quantity:next}] : [])];
}
