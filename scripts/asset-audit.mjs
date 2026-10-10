import fs from 'node:fs/promises';
await fs.mkdir('assets/unused-renditions',{recursive:true});
for(const name of await fs.readdir('theme/assets')){if(/-1600\.jpg$/.test(name)||(/-2400\.jpg$/.test(name)&&name!=='hero-cafe-2400.jpg')||/^(tee-black|look-studio)-/.test(name))await fs.rename('theme/assets/'+name,'assets/unused-renditions/'+name);}
await fs.mkdir('research/font-licenses',{recursive:true});
for(const family of ['barlowcondensed','librecaslondisplay','dmsans']){const r=await fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/'+family+'/OFL.txt');if(!r.ok)throw new Error(family+':'+r.status);await fs.writeFile('research/font-licenses/'+family+'-OFL.txt',await r.text());}
