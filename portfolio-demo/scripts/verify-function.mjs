// Run Vercel's real Node builder without a Vercel account, CLI link, or deployment.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pipeline} from 'node:stream/promises';
import assert from 'node:assert/strict';
import builder from '@vercel/node';
import {glob,FileBlob} from '@vercel/build-utils';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(await fs.readFile(path.join(root,'vercel.json'),'utf8'));
const functionConfig = config.functions['api/storefront.js'];
await fs.mkdir(path.join(root,'.vercel'),{recursive:true});
const staging = await fs.mkdtemp(path.join(root,'.vercel','function-check-'));
const repo = path.join(staging,'input');
const app = path.join(repo,'portfolio-demo');
await fs.mkdir(app,{recursive:true});
for (const name of ['api','server','data','theme','package.json','package-lock.json']) {
  await fs.cp(path.join(root,name),path.join(app,name),{recursive:true});
}
// Only production dependencies belong in this fixture. The builder itself stays outside it.
for (const name of ['liquidjs','commander']) {
  await fs.cp(path.join(root,'node_modules',name),path.join(app,'node_modules',name),{recursive:true});
}
const included = Object.keys(await glob(functionConfig.includeFiles,app)).sort();
const expected = Object.keys(await glob('{data/**/*.json,theme/**/*.json,theme/**/*.liquid}',app)).sort();
assert.deepEqual(included,expected,'includeFiles must cover every catalog, Liquid template and theme JSON');
const results=[];
// Snapshot inputs: passing FileFsRefs back to their own download destination would truncate them.
const sourceFiles={};
for(const [name,file] of Object.entries(await glob('{api,server,data,theme}/**/*',root))) {
  sourceFiles[name]=new FileBlob({data:await fs.readFile(file.fsPath)});
}

for (const layout of ['standalone','nested']) {
  const built = await builder.build({
    files:sourceFiles,
    entrypoint:'api/storefront.js', workPath:app,
    repoRootPath:layout==='nested'?repo:app,
    config:{...functionConfig,zeroConfig:true,
      functions:{'api/storefront.js':{installCommand:''}}},
    meta:{},
  });
  const lambda = built.output;
  assert.ok(lambda.files && lambda.handler,'Expected a Node serverless function');
  const packageRoot=path.join(staging,`${layout}.func`);
  const prefix=layout==='nested'?'portfolio-demo/':'';
  const fileNames=Object.keys(lambda.files).map(name=>name.replaceAll('\\','/')).sort();
  for(const name of included) assert.ok(fileNames.includes(prefix+name.replaceAll('\\','/')),`Missing bundled file: ${name}`);
  assert.ok(fileNames.some(name=>name.endsWith('node_modules/liquidjs/dist/liquid.node.js')),'Liquid runtime must be packaged');
  assert.ok(!fileNames.some(name=>name.includes('/public/')||name.startsWith('public/')),'Media belongs in the static CDN output');
  for(const [name,file] of Object.entries(lambda.files)) {
    const target=path.resolve(packageRoot,name);
    assert.ok(target.startsWith(packageRoot+path.sep),'Builder emitted an unsafe path');
    await fs.mkdir(path.dirname(target),{recursive:true});
    const {createWriteStream}=await import('node:fs');
    await pipeline(file.toStream(),createWriteStream(target));
  }
  const {stdout}=await exec(process.execPath,[path.join(root,'scripts/smoke-function.mjs'),
    pathToFileURL(path.join(packageRoot,lambda.handler)).href,packageRoot],{
    cwd:packageRoot,env:{...process.env,VERCEL:'1'},timeout:60000,maxBuffer:1024*1024,
  });
  const smoke=JSON.parse(stdout);
  const result={layout,runtime:lambda.runtime,handler:lambda.handler.replaceAll('\\','/'),
    includedFiles:included.length,bundleFiles:fileNames.length,...smoke,files:fileNames};
  results.push(result);
  console.log(`${layout}: ${included.length} data/template files packaged; ${smoke.routes} route checks passed.`);
}
await fs.writeFile(path.join(root,'qa/function-package.json'),JSON.stringify({
  builder:'@vercel/node 29.0.0',includeFiles:functionConfig.includeFiles,results,
},null,2)+'\n');
console.log('Verified actual Node function artifacts locally. Nothing uploaded or deployed.');
