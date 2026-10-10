import fs from 'node:fs/promises';
const edit=async(p,fn)=>fs.writeFile(p,fn(await fs.readFile(p,'utf8')));
await edit('theme/sections/hero.liquid',s=>s.replace('01 / THE HENLEY','ZIPSTERS / SIGNATURE HENLEY'));
await edit('theme/sections/footer.liquid',s=>s.replace('<div class="footer-wordmark" aria-label="Zipsters">ZIPSTERS</div>','').replace('<div class="footer-about">','<div class="footer-about"><span class="footer-brand">ZIPSTERS</span>').replace('<h3>EXPLORE</h3>','<h3>ABOUT</h3>').replace('<h3>LET’S TALK</h3>','<h3>SOCIAL & HELP</h3>'));
await edit('theme/sections/social-editorial.liquid',s=>s.replace('<span>↗</span></a>{% endfor %}','<span class="social-post-cue">{% render \'icon\', name: \'instagram\' %}<span>VIEW POST ↗</span></span></a>{% endfor %}'));
await edit('theme/snippets/icon.liquid',s=>s.replace("{% when 'arrow' %}","{% when 'instagram' %}<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"4\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\".8\" fill=\"currentColor\" stroke=\"none\"/>\n{% when 'arrow' %}"));
await edit('theme/sections/lookbook.liquid',s=>s.replace('0{{ forloop.index }}</span>','LOOK 0{{ forloop.index }}</span>').replace('FIND YOUR EVERYDAY','FIND YOUR LOOK').replace('ONE WARDROBE. YOUR WAY.','THREE WAYS TO WEAR IT.').replace('Good clothes.<br>Great company.<br><em>Every day.</em>','One signature.<br><em>Your way.</em>'));
await edit('theme/sections/details-story.liquid',s=>s.replace(/<div class="detail-index">[\s\S]*?<\/div>/,'').replace("fallback: 'henley-white'","fallback: 'henley-macro'"));
await edit('theme/sections/campaign.liquid',s=>s.replace('<div class="campaign-image">{% render \'image\', image: section.settings.image, fallback: \'campaign-garden\', alt: \'Zipsters white Henley worn outdoors among palms\', sizes: \'100vw\' %}</div>',`<div class="campaign-image"><picture class="campaign-desktop">{% render 'image', image: section.settings.image, fallback: 'campaign-cafe', alt: 'A black Zipsters Henley worn at a café', sizes: '100vw' %}</picture><div class="campaign-mobile">{% render 'image', image: section.settings.mobile_image, fallback: 'campaign-garden', alt: 'White Zipsters Henley, worn outdoors among palms', sizes: '(max-width: 767px) 58vw, 1px' %}</div></div>`).replace('"label":"Photograph"','"label":"Desktop photograph"},{"type":"image_picker","id":"mobile_image","label":"Mobile photograph"'));
await edit('theme/snippets/image.liquid',s=>s.replace("{% if fallback == 'hero-cafe' %}","{% if fallback == 'hero-cafe' or fallback == 'campaign-cafe' %}"));
await edit('theme/sections/main-collection.liquid',s=>s.replace(/^<section class="page-main">[\s\S]*?<div class="collection-products">/,`{% liquid
 assign hero_photo = collection.image | default: section.settings.image
 assign hero_fallback = 'henley-brown-alt'
 case collection.handle
 when 'henleys'
 assign hero_fallback = 'henley-black-alt'
 when 't-shirts'
 assign hero_fallback = 'mesh-black-alt'
 when 'pants'
 assign hero_fallback = 'denim'
 endcase
%}
<section class="page-main"><div class="collection-hero collection-hero--{{ collection.handle }}"><div class="collection-intro"><span class="eyebrow">THE ZIPSTERS WARDROBE</span><h1>{{ collection.title }}</h1>{{ collection.description }}<a class="text-link" href="#collection-products">EXPLORE THE PIECES <span>↓</span></a></div><div class="collection-hero-image">{% render 'image', image: hero_photo, fallback: hero_fallback, alt: collection.title, sizes: '(max-width: 767px) 100vw, 53vw', loading: 'eager' %}<span class="collection-hero-note">ZIPSTERS / IN CHARACTER</span></div></div><div class="collection-products" id="collection-products">`).replace('"settings":[]','"settings":[{"type":"image_picker","id":"image","label":"Collection campaign fallback"}]'));
const p='theme/templates/index.json',j=JSON.parse(await fs.readFile(p,'utf8'));
j.sections.signature.blocks.brown.settings.fallback_alt='look-brown';
j.sections.wardrobe.settings.eyebrow='THE REST OF THE WARDROBE';j.sections.wardrobe.settings.heading='Beyond the Henley.';
j.sections.wardrobe.blocks.mesh.settings.fallback_alt='mesh-black-alt';j.sections.wardrobe.blocks.denim.settings.fallback_alt='denim-styled';j.sections.wardrobe.blocks.pants.settings.fallback_alt='pleated-pants-alt';
j.sections.lookbook.settings.copy='Three looks. One point of view. The Henley, from the city to a change of scene.';
j.sections.lookbook.blocks.architecture.settings.note='CITY / HENLEY + PLEATS';j.sections.lookbook.blocks.cafe.settings.note='CAFÉ / AFTER HOURS';j.sections.lookbook.blocks.riverside.settings.note='AWAY / OFF DUTY';
j.sections.details.settings.heading='Character,\nup close.';j.sections.details.settings.copy='The button placket. The open neckline. The texture in the light. A closer look at the Zipsters Henley.';
await fs.writeFile(p,JSON.stringify(j,null,2)+'\n');
const productTemplate={sections:{main:{type:'main-product',settings:{}},related:{type:'product-recommendations',settings:{heading:'Continue the wardrobe.'}}},order:['main','related']};await fs.writeFile('theme/templates/product.json',JSON.stringify(productTemplate,null,2)+'\n');
