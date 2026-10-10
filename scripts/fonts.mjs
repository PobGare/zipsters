import fs from 'node:fs/promises';
const url='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800&family=DM+Sans:wght@400;450;500;550;600&family=Libre+Caslon+Display&display=swap';
const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
if(!response.ok)throw new Error('Font stylesheet unavailable');
const css=await response.text();
const blocks=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].map(m=>m[1]);
if(!blocks.length)throw new Error('No Latin font declarations found');
const saved=new Map();let output='';
for(const block of blocks){const remote=block.match(/url\(([^)]+)\)/)[1];if(!saved.has(remote)){const name='font-'+saved.size+'.woff2';const r=await fetch(remote);if(!r.ok)throw new Error('Font download failed');await fs.writeFile('theme/assets/'+name,Buffer.from(await r.arrayBuffer()));saved.set(remote,name);}output+=block.replace(remote,saved.get(remote))+'\n';}
await fs.writeFile('theme/assets/fonts.css',output);
const theme=await fs.readFile('theme/assets/theme.css','utf8');await fs.writeFile('theme/assets/theme.css',theme.replace(/^@import[^\n]+\n/,''));
let layout=await fs.readFile('theme/layout/theme.liquid','utf8');layout=layout.replace("{{ 'theme.css' | asset_url | stylesheet_tag }}","{{ 'fonts.css' | asset_url | stylesheet_tag }}\n{{ 'theme.css' | asset_url | stylesheet_tag }}");await fs.writeFile('theme/layout/theme.liquid',layout);
console.log('Locally hosted '+saved.size+' Latin WOFF2 fonts; removed remote stylesheet dependency.');
