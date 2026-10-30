import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath} from 'node:url';

const exec=promisify(execFile);
const entry=new URL('../api/storefront.js',import.meta.url).href;
const unrelatedCwd=fileURLToPath(new URL('../scripts/',import.meta.url));

for(const vercel of [false,true]) {
  test(`cold-start catalog and Liquid reads ignore cwd (${vercel?'Vercel':'local'})`,async()=>{
    const env={...process.env};
    if(vercel)env.VERCEL='1';else delete env.VERCEL;
    const code=`
      import assert from 'node:assert/strict';
      const {default:handler}=await import(${JSON.stringify(entry)});
      for(const url of ['/','/products/mesh-tee-black','/collections/all','/search?q=henley','/cart','/checkout']) {
        const res={setHeader(){},end(body){this.body=body;}};
        await handler({method:'GET',url,headers:{host:'demo.example'}},res);
        assert.equal(res.statusCode,200,url);
        assert.match(res.body,/id="main-content"/);
      }
      console.log('6 routes passed');
    `;
    const {stdout}=await exec(process.execPath,['--input-type=module','-e',code],{
      cwd:unrelatedCwd,env,timeout:30000,
    });
    assert.match(stdout,/6 routes passed/);
  });
}
