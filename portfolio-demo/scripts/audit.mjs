import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {projectRoot,products} from '../server/catalog.mjs';
import {render} from '../server/render.mjs';

const routes=new Set(['/','/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/cart','/checkout','/search?q=Henley',...products.map(p=>p.url)]);
const assets=new Set(), failures=[];
for(const route of routes){
  const {status,html}=await render(new URL(route,'https://demo.example'));
  if(status!==200)failures.push(`${route}: ${status}`);
  for(const [,value] of html.matchAll(/(?:href|src|poster|data-src|data-desktop-src)="([^"]+)"/g)){
    if(value.startsWith('/assets/'))assets.add(value);
    else if(value.startsWith('/')&&!value.startsWith('//')){const target=value.split('#')[0];if(target)routes.add(target);}
  }
  for(const [,set] of html.matchAll(/srcset="([^"]+)"/g))for(const value of set.split(','))assets.add(value.trim().split(' ')[0]);
}
for(const asset of assets){try{await fs.access(path.join(projectRoot,'public',asset));}catch{failures.push(`Missing asset: ${asset}`);}}
// This optional audit is only applicable beside the original repository.
const original=path.resolve(projectRoot,'../theme');
let originalTheme='not present (standalone checkout)';
try{
  await fs.access(original);
  const baseline=JSON.parse((await fs.readFile(path.join(projectRoot,'qa/original-theme-sha256.json'),'utf8')).replace(/^\uFEFF/,''));
  for(const entry of baseline){const hash=createHash('sha256').update(await fs.readFile(path.join(original,...entry.path.split(/[\\/]/)))).digest('hex');if(hash.toLowerCase()!==entry.sha256.toLowerCase())failures.push(`Original theme changed: ${entry.path}`);}
  originalTheme=`${baseline.length} files match original SHA-256 hashes`;
}catch(error){if(error.code!=='ENOENT')throw error;}
const result={routes:routes.size,assets:assets.size,originalTheme,failures};
await fs.mkdir(path.join(projectRoot,'qa'),{recursive:true});
await fs.writeFile(path.join(projectRoot,'qa/audit-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
