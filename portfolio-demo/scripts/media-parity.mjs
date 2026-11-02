// Read-only by default. --export restores only manifest-listed media/licenses
// from the verified original revision to the demo. Never copies scripts/templates.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {themeHash} from './theme-integrity.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
if(process.argv.slice(2).some(arg=>arg!=='--export'))throw new Error('Usage: node scripts/media-parity.mjs [--export]');
const baseline=JSON.parse(await fs.readFile(path.join(root,'qa/original-theme-sha256.json'),'utf8'));
if(baseline.schemaVersion!==2)throw new Error('Expected revision-backed baseline');
const entries=baseline.files.filter(e=>/^assets\/[^/]+\.(?:jpg|png|svg|mp4|webm|woff2|txt)$/.test(e.path));
const failures=[];
// Verify every source before any export writes. An absent original is valid for
// standalone verification, but cannot be used to export.
const original=path.join(root,'../theme');
const available=await fs.access(original).then(()=>true,error=>{if(error.code==='ENOENT')return false;throw error;});
const exporting=process.argv.includes('--export');
if(exporting&&!available)throw new Error('Original theme is required for export');
if(available)for(const entry of entries){
  if(themeHash(entry.path,await fs.readFile(path.join(original,entry.path)))!==entry.sha256)throw new Error(`Unverified source: ${entry.path}`);
}
for(const entry of entries){
  const target=path.join(root,'public',entry.path);
  if(exporting)await fs.copyFile(path.join(original,entry.path),target);
  try{if(themeHash(entry.path,await fs.readFile(target))!==entry.sha256)failures.push(`Changed media: ${entry.path}`);}
  catch(error){failures.push(`${entry.path}: ${error.code}`);}
}
if(available){
  const source=await fs.readFile(path.join(root,'../research/image-provenance.json'),'utf8');
  const target=await fs.readFile(path.join(root,'data/image-provenance.json'),'utf8');
  if(source.replace(/\r\n/g,'\n')!==target.replace(/\r\n/g,'\n'))failures.push('Demo provenance snapshot differs from research source; review manually');
}
console.log(JSON.stringify({revision:baseline.revision,media:entries.length,originalAvailable:available,exported:exporting,failures},null,2));
if(failures.length)process.exitCode=1;
