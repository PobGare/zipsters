import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Only known theme text formats normalize CRLF. Binary bytes, BOMs, lone CRs,
// whitespace and final newlines remain significant.
export function themeHash(name, bytes) {
  if (/\.(?:css|js|json|liquid|txt)$/i.test(name)) {
    bytes = Buffer.from(new TextDecoder('utf-8', {fatal:true, ignoreBOM:true}).decode(bytes).replace(/\r\n/g, '\n'));
  }
  return createHash('sha256').update(bytes).digest('hex');
}

export async function auditTheme(root, baselinePath) {
  const result = {status:'checked', expected:0, matched:0, changed:[], missing:[], unexpected:[], errors:[]};
  try { await fs.access(root); }
  catch (error) {
    if (error.code === 'ENOENT') return {...result, status:'skipped', reason:'original theme absent (standalone checkout)'};
    result.errors.push(`Cannot access original theme: ${error.code}`); return result;
  }
  let baseline;
  try {
    baseline = JSON.parse((await fs.readFile(baselinePath,'utf8')).replace(/^\uFEFF/,''));
    if (baseline.schemaVersion !== 2 || baseline.normalization !== 'utf8-crlf-to-lf' || !/^[a-f0-9]{40}$/.test(baseline.revision) || !Array.isArray(baseline.files) || !baseline.files.length) throw new Error('Invalid baseline metadata');
    const paths = new Set();
    for (const entry of baseline.files) {
      if (typeof entry.path !== 'string' || entry.path.includes('\\') || entry.path.split('/').some(p=>!p || p==='.' || p==='..') || entry.path.includes(':') || !/^[a-f0-9]{64}$/.test(entry.sha256) || paths.has(entry.path)) throw new Error('Invalid or duplicate baseline entry');
      paths.add(entry.path);
    }
  } catch (error) { result.errors.push(`Cannot read valid baseline: ${error.message}`); return result; }
  result.revision = baseline.revision;
  result.expected = baseline.files.length;
  const actual = new Set();
  async function walk(dir, prefix='') {
    for (const item of await fs.readdir(dir,{withFileTypes:true})) {
      const name = prefix + item.name;
      if (item.isDirectory()) await walk(path.join(dir,item.name),name+'/');
      else { actual.add(name); if (!item.isFile()) result.errors.push(`Not a regular file: ${name}`); }
    }
  }
  try { await walk(root); } catch(error) { result.errors.push(`Cannot inventory theme: ${error.code}`); }
  for (const entry of baseline.files) {
    if (!actual.has(entry.path)) { result.missing.push(entry.path); continue; }
    actual.delete(entry.path);
    try {
      if (themeHash(entry.path,await fs.readFile(path.join(root,entry.path))) === entry.sha256) result.matched++;
      else result.changed.push(entry.path);
    } catch(error) { result.errors.push(`Cannot hash ${entry.path}: ${error.message}`); }
  }
  result.unexpected = [...actual].sort();
  return result;
}
