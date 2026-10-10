import fs from 'node:fs/promises';
const p='scripts/preview.mjs';let s=await fs.readFile(p,'utf8');
s=s.replace("engine.registerFilter('metafield_tag',s=>esc(s?.value||s))","engine.registerFilter('metafield_tag',s=>s?.html||esc(s?.value||s))");
s=s.replace("const products=pieces.map", "const editorial=JSON.parse(await originalRead('research/catalog-editorial.json'));\nconst products=pieces.map");
s=s.replace("return {index,products,settings,shop:",`for(const product of products){const copy=editorial[product.handle];if(copy){product.description=copy.description;product.metafields.custom.details={html:copy.details};for(const extra of copy.extraImages||[])product.images.push(image(extra));}product.collections=[{url:'/collections/'+({Henleys:'henleys',Pants:'pants','T-shirts':'t-shirts'}[product.type])}];}\nreturn {index,products,settings,shop:`);
s=s.replace("content=await renderSection({type:'main-product'},'main',ctx);",`ctx.recommendations={performed:true,products:[...ctx.products.filter(p=>p.id!==ctx.product.id&&p.type===ctx.product.type),...ctx.products.filter(p=>p.type!==ctx.product.type)].slice(0,4)};const productTemplate=await readJSON('templates/product.json');for(const id of productTemplate.order)content+=await renderSection(productTemplate.sections[id],id,ctx);`);
s=s.replace("ctx.collection={title:","ctx.collection={handle,title:");
await fs.writeFile(p,s);
