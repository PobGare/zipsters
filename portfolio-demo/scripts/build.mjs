import fs from 'node:fs/promises';
import path from 'node:path';
import {projectRoot,products} from '../server/catalog.mjs';
import {render} from '../server/render.mjs';

// Vercel serves dist assets from its CDN; the Node function renders Liquid routes.
await fs.mkdir(path.join(projectRoot,'dist'),{recursive:true});
await fs.cp(path.join(projectRoot,'public'),path.join(projectRoot,'dist'),{recursive:true});
const routes=['/','/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/search?q=henley','/cart','/checkout',...products.map(p=>p.url)];
for(const route of routes){
  const result=await render(new URL(route,'https://zipsters-demo.example'));
  if(result.status!==200||result.html.includes('Liquid error'))throw new Error(`Build render failed: ${route}`);
}
console.log(`Build ready: ${routes.length} routes rendered; self-contained assets copied to dist/. No deployment performed.`);
