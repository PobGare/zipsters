import fs from 'node:fs/promises';
import path from 'node:path';
import {Liquid} from 'liquidjs';
const engine=new Liquid();let count=0;const failures=[];
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(p.endsWith('.json')){JSON.parse(await fs.readFile(p,'utf8'));count++;}else if(p.endsWith('.liquid')){const text=await fs.readFile(p,'utf8');for(const match of text.matchAll(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/g)){const schema=JSON.parse(match[1]);if(schema.name.length>25)failures.push(p+': section name exceeds 25 characters');}const cleaned=text.replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g,'').replace(/{%\s*(?:end)?(?:form|paginate|section|sections)\b.*?%}/g,'');try{engine.parse(cleaned);}catch(e){failures.push(p+': '+e.message);}count++;}}}
await walk('theme');
const index=JSON.parse(await fs.readFile('theme/templates/index.json','utf8'));
for(const section of Object.values(index.sections)){for(const block of Object.values(section.blocks||{})){for(const key of ['fallback','fallback_alt']){const name=block.settings[key];if(name)for(const size of [480,960,1200])try{await fs.access('theme/assets/'+name+'-'+size+'.jpg');}catch{failures.push('Missing image '+name+'-'+size);}}}}
if(failures.length){console.error(failures.join('\n'));process.exit(1);}console.log(`Validated ${count} Liquid and JSON files and all configured imagery.`);
