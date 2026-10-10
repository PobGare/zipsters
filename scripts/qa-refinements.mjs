import fs from 'node:fs/promises';
const update=async(file,fn)=>{const text=await fs.readFile(file,'utf8');await fs.writeFile(file,fn(text));};
await update('theme/snippets/image.liquid',s=>s.replace("fallback == 'hero-cafe' or fallback == 'campaign-garden'","fallback == 'hero-cafe'").replace('sizes="{{ sizes }}" width=', 'sizes="{{ sizes }}" decoding="async" width='));
await update('theme/layout/theme.liquid',s=>s.replace("{{ presentation_preview | default: false | json }}",'false'));
await update('scripts/preview.mjs',s=>s.replace(".replace(\"{% section 'footer' %}\",'{{ preview_footer }}');",".replace(\"{% section 'footer' %}\",'{{ preview_footer }}').replace('preview:false','preview:true');").replace("root_url:'/',search_url", "root_url:'/',collections_url:'/collections',all_products_collection_url:'/collections/all',search_url"));
await update('theme/sections/footer.liquid',s=>s.replaceAll('href="/collections/all"','href="{{ routes.all_products_collection_url }}"').replaceAll('href="/collections/','href="{{ routes.collections_url }}/').replaceAll('href="/#','href="{{ routes.root_url }}#'));
await update('theme/sections/lookbook.liquid',s=>s.replaceAll('href="/collections/all"','href="{{ routes.all_products_collection_url }}"'));
await fs.appendFile('theme/assets/theme.css',`\n/* Final presentation refinements: preserve the campaign model and use its negative space. */
@media(min-width:768px){.campaign-image img{object-position:50% 30%}.campaign-copy{left:63%;right:4%;top:33%;max-width:440px}.campaign-copy h2{font-size:clamp(38px,3.6vw, sixty)}.campaign-shade{background:linear-gradient(270deg,#16201355,transparent 58%)}.campaign-note{left:auto;right:var(--gutter)}}
` .replace('sixty','60px'));
console.log('QA fixes applied.');
