import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {auditTheme,themeHash} from '../scripts/theme-integrity.mjs';

test('text hashes treat LF, CRLF and mixed endings equally, retaining all other bytes',()=>{
  const hash = text => themeHash('section.liquid',Buffer.from(text));
  assert.equal(hash('one\ntwo\n'),hash('one\r\ntwo\n'));
  assert.equal(hash('one\ntwo\n'),hash('one\r\ntwo\r\n'));
  for (const text of ['one\ntwo','one\ntwo \n','\uFEFFone\ntwo\n','one\rtwo\n']) assert.notEqual(hash('one\ntwo\n'),hash(text));
  assert.notEqual(themeHash('image.jpg',Buffer.from('a\r\nb')),themeHash('image.jpg',Buffer.from('a\nb')));
});

test('audit command exits nonzero and writes honest counts for a changed theme',async t=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'zipsters-audit-cli-'));
  t.after(()=>fs.rm(dir,{recursive:true,force:true}));
  const app=path.join(dir,'demo');
  for(const folder of ['scripts','server','qa'])await fs.mkdir(path.join(app,folder),{recursive:true});
  await fs.mkdir(path.join(dir,'theme'));
  for(const name of ['audit.mjs','theme-integrity.mjs'])await fs.copyFile(new URL('../scripts/'+name,import.meta.url),path.join(app,'scripts',name));
  await fs.writeFile(path.join(app,'server/catalog.mjs'),`export const projectRoot=${JSON.stringify(app)},products=[];`);
  await fs.writeFile(path.join(app,'server/render.mjs'),`export async function render(){return {status:200,html:''};}`);
  await fs.writeFile(path.join(dir,'theme/test.js'),'changed');
  await fs.writeFile(path.join(app,'qa/original-theme-sha256.json'),JSON.stringify({schemaVersion:2,revision:'a'.repeat(40),normalization:'utf8-crlf-to-lf',files:[{path:'test.js',sha256:themeHash('test.js',Buffer.from('approved'))}]}));
  const result=spawnSync(process.execPath,[path.join(app,'scripts/audit.mjs')],{encoding:'utf8'});
  assert.equal(result.status,1,result.stderr);
  const report=JSON.parse(await fs.readFile(path.join(app,'qa/audit-results.json'),'utf8'));
  assert.equal(report.originalTheme.expected,1);assert.equal(report.originalTheme.matched,0);
  assert.deepEqual(report.originalTheme.changed,['test.js']);assert.equal(report.failures.length,1);
  await fs.unlink(path.join(app,'qa/original-theme-sha256.json'));
  const missing=spawnSync(process.execPath,[path.join(app,'scripts/audit.mjs')],{encoding:'utf8'});
  assert.equal(missing.status,1,missing.stderr);
  assert.equal(JSON.parse(missing.stdout).originalTheme.status,'checked');
});

test('theme audit distinguishes absent theme, missing/corrupt baseline and changed/missing/extra files',async t=>{
  const dir=await fs.mkdtemp(path.join(os.tmpdir(),'zipsters-integrity-'));
  t.after(()=>fs.rm(dir,{recursive:true,force:true}));
  const root=path.join(dir,'theme'), baseline=path.join(dir,'baseline.json');
  assert.equal((await auditTheme(root,baseline)).status,'skipped');
  await fs.mkdir(root);
  assert.equal((await auditTheme(root,baseline)).errors.length,1);
  await fs.writeFile(baseline,'broken');
  assert.equal((await auditTheme(root,baseline)).errors.length,1);
  const files=[{path:'a.js',sha256:themeHash('a.js',Buffer.from('a\nb\n'))},{path:'b.txt',sha256:themeHash('b.txt',Buffer.from('b'))}];
  const manifest={schemaVersion:2,revision:'a'.repeat(40),normalization:'utf8-crlf-to-lf',files};
  await fs.writeFile(baseline,JSON.stringify(manifest));
  await fs.writeFile(path.join(root,'a.js'),'a\r\nb\n');
  await fs.writeFile(path.join(root,'b.txt'),'b');
  assert.equal((await auditTheme(root,baseline)).matched,2);
  await fs.writeFile(path.join(root,'a.js'),'edited');
  await fs.unlink(path.join(root,'b.txt'));
  await fs.writeFile(path.join(root,'extra.txt'),'extra');
  const result=await auditTheme(root,baseline);
  assert.equal(result.expected,2); assert.equal(result.matched,0);
  assert.deepEqual(result.changed,['a.js']); assert.deepEqual(result.missing,['b.txt']); assert.deepEqual(result.unexpected,['extra.txt']);
  for(const bad of [[...files,files[0]],[{...files[0],path:'../escape'}]]) {
    await fs.writeFile(baseline,JSON.stringify({...manifest,files:bad}));
    assert.equal((await auditTheme(root,baseline)).errors.length,1);
  }
});
