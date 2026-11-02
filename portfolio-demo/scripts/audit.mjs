import fs from 'node:fs/promises';
import path from 'node:path';
import {auditTheme} from './theme-integrity.mjs';
import {projectRoot,products} from '../server/catalog.mjs';
import {render} from '../server/render.mjs';

const routes=new Set(['/','/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/cart','/checkout','/search?q=Henley',...products.map(p=>p.url)]);
const assets=new Set(), failures=[];
for(const route of routes){
  const {status,html}=await render(new URL(route,'https://demo.example'));
  if(status!==200)failures.push(`${route}: ${status}`);
  if(html.includes('Liquid error'))failures.push(`${route}: Liquid rendering error`);
  for(const [,value] of html.matchAll(/(?:href|src|poster|data-src|data-desktop-src)="([^"]+)"/g)){
    if(value.startsWith('/assets/'))assets.add(value);
    else if(value.startsWith('/')&&!value.startsWith('//')){const target=value.split('#')[0];if(target)routes.add(target);}
  }
  for(const [,set] of html.matchAll(/srcset="([^"]+)"/g))for(const value of set.split(','))assets.add(value.trim().split(' ')[0]);
}
for(const asset of assets){try{await fs.access(path.join(projectRoot,'public',asset));}catch{failures.push(`Missing asset: ${asset}`);}}
// This optional audit is only applicable beside the original repository.
const original=path.resolve(projectRoot,'../theme');
const originalTheme=await auditTheme(original,path.join(projectRoot,'qa/original-theme-sha256.json'));
for(const kind of ['changed','missing','unexpected','errors'])for(const detail of originalTheme[kind])failures.push(`Original theme ${kind}: ${detail}`);
const result={routes:routes.size,assets:assets.size,originalTheme,failures};
await fs.mkdir(path.join(projectRoot,'qa'),{recursive:true});
await fs.writeFile(path.join(projectRoot,'qa/audit-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
