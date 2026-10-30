// Invoked in a fresh process with cwd equal to the extracted function root.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const [entry,packageRoot]=process.argv.slice(2);
const reads=new Set();
const readFile=fs.readFile.bind(fs);
fs.readFile=async (file,...args)=>{
  const absolute=file instanceof URL?fileURLToPath(file):path.resolve(String(file));
  assert.ok(absolute.startsWith(packageRoot+path.sep),`Runtime read escaped the package: ${absolute}`);
  reads.add(path.relative(packageRoot,absolute).replaceAll('\\','/'));
  return readFile(file,...args);
};
// Importing the entry point is itself part of the test: the reported failure was a cold-start crash.
const {default:handler}=await import(entry);
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v;},end(body){this.body=body;}});
let routes=0;
async function request(url,status=200,method='GET') {
  const res=response();
  await handler({method,url,headers:{host:'zipsters-demo.example','x-forwarded-proto':'https'}},res);
  assert.equal(res.statusCode,status,`${method} ${url}: ${String(res.body).slice(0,150)}`);
  if(status===200&&method==='GET')assert.doesNotMatch(res.body,/Liquid error|FUNCTION_INVOCATION_FAILED/);
  routes++;return res;
}
const home=await request('/');
const catalog=JSON.parse(home.body.match(/id="demo-catalog">(.*?)<\/script>/s)[1]);
assert.equal(catalog.length,8);
assert.equal((home.body.match(/data-slide-select="/g)||[]).length,3);
assert.doesNotMatch(home.body,/data-slider-pause|class="demo-banner"/);
assert.match(home.body,/data-reel-pause/);
for(const product of catalog)await request(product.url);
for(const route of ['/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/search?q=Henley','/cart','/checkout'])await request(route);
const filtered=await request('/collections/all?filter.p.m.custom.color=Brown&section_id=main');
assert.match(filtered.body,/1 piece/);
const search=await request('/search/suggest?q=mesh');assert.match(search.body,/Mesh Tee/);
await request('/missing-page',404);await request('/products/missing',404);await request('/collections/missing',404);
await request('/',200,'HEAD');await request('/cart',405,'POST');
process.stdout.write(JSON.stringify({routes,runtimeReads:[...reads].sort()}));
