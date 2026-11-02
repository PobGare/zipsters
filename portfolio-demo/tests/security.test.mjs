import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {securityHeaders} from '../server/security.mjs';
import {render} from '../server/render.mjs';
import {products} from '../server/catalog.mjs';
import handler from '../api/storefront.js';

test('hosting and local/function security policies agree',async()=>{
  const config=JSON.parse(await fs.readFile(new URL('../vercel.json',import.meta.url),'utf8'));
  const headers=Object.fromEntries(config.headers[0].headers.map(h=>[h.key,h.value]));
  for(const [name,value] of Object.entries(securityHeaders))assert.equal(headers[name],value);
  for(const method of ['GET','HEAD','POST']){
    const res={headers:{},setHeader(k,v){this.headers[k]=v;},end(){}};
    await handler({method,url:'/missing',headers:{}},res);
    for(const [name,value] of Object.entries(securityHeaders))assert.equal(res.headers[name],value);
  }
});

test('CSP allows current bootstrap on every page without allowing arbitrary inline scripts',async()=>{
  const policy=securityHeaders['Content-Security-Policy'];
  assert.doesNotMatch(policy.split(';').find(d=>d.startsWith(' script-src')),/unsafe-inline|unsafe-eval/);
  for(const route of ['/','/collections/all','/collections/henleys','/collections/t-shirts','/collections/pants','/cart','/checkout','/search?q=%3Cscript%3E','/missing',...products.map(p=>p.url)]){
    const {html}=await render(new URL(route,'http://localhost'));
    assert.doesNotMatch(html,/\son[a-z]+\s*=|javascript:/i);
    for(const [,attrs,code] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
      if(attrs.includes('src=')||attrs.includes('application/json'))continue;
      const hash=createHash('sha256').update(code).digest('base64');
      assert.ok(policy.includes(`'sha256-${hash}'`),`${route}: bootstrap hash absent from CSP`);
    }
  }
});
