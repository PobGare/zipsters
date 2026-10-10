import { mkdir, writeFile } from 'node:fs/promises';
const write=async(path,data)=>{await mkdir(path.split('/').slice(0,-1).join('/'),{recursive:true});await writeFile(path,JSON.stringify(data,null,2));};
const piece=(title,color,fallback,alt,handle)=>({type:'piece',settings:{title,color,fallback,fallback_alt:alt,link:'/products/'+handle}});
const sections={
 hero:{type:'hero',settings:{desktop_position:37,mobile_position:48,eyebrow:'THE SIGNATURE COLLECTION',heading:'The Henley.\nAlways in character.',copy:'An everyday essential. A distinctly Zipsters point of view.',label:'SHOP HENLEYS',link:'/collections/henleys'}},
 signature:{type:'featured-collection',settings:{anchor:'signature',eyebrow:'A ZIPSTERS SIGNATURE',heading:'The Henley collection.',copy:'The starting point of a good wardrobe.',limit:4,label:'EXPLORE HENLEYS',link:'/collections/henleys'},blocks:{
 black:piece('Textured Half Sleeve Henley','Black','henley-black','henley-black-alt','textured-half-sleeve-henley-black'),
 white:piece('Textured Half Sleeve Henley','White','henley-white','henley-white-alt','textured-half-sleeve-henley-white'),
 brown:piece('Textured Half Sleeve Henley','Brown','henley-brown','henley-brown-alt','textured-half-sleeve-henley-brown'),
 grey:piece('Textured Half Sleeve Henley','Dark Grey','henley-grey','henley-grey-alt','textured-half-sleeve-henley-dark-grey')},block_order:['black','white','brown','grey']},
 story:{type:'editorial-story',settings:{eyebrow:'A FAMILIAR FEELING',heading:'The everyday\nuniform.',copy:'Some pieces just feel like you. Worn with denim, paired with pleats, or taken out for a slow afternoon. This is the Henley, your way.',link:'/collections/henleys'}},
 wardrobe:{type:'featured-collection',settings:{anchor:'wardrobe',eyebrow:'BEYOND THE HENLEY',heading:'Complete the everyday.',copy:'A considered rotation. A character of its own.',limit:4,label:'SHOP THE WARDROBE',link:'/collections/all'},blocks:{
 long:piece('Textured Long Sleeve Henley','White','henley-long-white','story-garden','textured-long-sleeve-henley-white'),
 mesh:piece('Mesh Tee','Black','mesh-black','','mesh-tee-black'),
 denim:piece('Raw Denim Pants','Denim','denim','','raw-denim-pants'),
 pants:piece('Pleated Suit Pants','Black','pleated-pants','','pleated-suit-pants-black')},block_order:['long','mesh','denim','pants']},
 campaign:{type:'campaign',settings:{eyebrow:'OFF THE CLOCK',heading:'Nothing on the agenda.\nEverything in its place.',label:'EXPLORE THE COLLECTION',link:'/collections/all'}},
 lookbook:{type:'lookbook',settings:{heading:'A way of wearing it.',copy:'From the first coffee to the last light. A few ways to make it yours.'},blocks:{
 architecture:{type:'look',settings:{fallback:'henley-white-alt',caption:'The Henley & the pleats.',note:'01 / IN THE CITY',link:'/products/textured-half-sleeve-henley-white'}},
 cafe:{type:'look',settings:{fallback:'look-cafe',caption:'An afternoon, well spent.',note:'02 / AT EASE',link:'/collections/henleys'}},
 riverside:{type:'look',settings:{fallback:'look-riverside',caption:'A change of scene.',note:'03 / OUT OF OFFICE',link:'/products/textured-half-sleeve-henley-dark-grey'}}},block_order:['architecture','cafe','riverside']},
 details:{type:'details-story',settings:{heading:'It’s all in\nthe details.',copy:'The open neckline. The button placket. The texture you can see. The small things that make a Henley a Henley.',link:'/collections/henleys'}},
 social:{type:'social-editorial',settings:{heading:'Worn your way.'},blocks:{
 one:{type:'photo',settings:{fallback:'look-brown',alt:'Brown Zipsters Henley styled with light trousers',link:'https://www.instagram.com/ahtexhammm/p/DdQOmNnjPLp/'}},
 two:{type:'photo',settings:{fallback:'henley-grey-alt',alt:'Dark grey Zipsters Henley outside a café',link:'https://www.instagram.com/zipstersofficial/p/DcLZCHgjYd-/'}},
 three:{type:'photo',settings:{fallback:'look-recline',alt:'Brown Henley with blue denim, worn outdoors',link:'https://www.instagram.com/_ubaid_here_/p/DV9G6JsCOlT/'}},
 four:{type:'photo',settings:{fallback:'mesh-white',alt:'Zipsters white mesh T-shirt on the street',link:'https://www.instagram.com/zipstersofficial/p/Da-jwBJNtvF/'}},
 five:{type:'photo',settings:{fallback:'henley-black-alt',alt:'Black Zipsters Henley in a stone courtyard',link:'https://www.instagram.com/zipstersofficial/p/Ddv0fb2jTFx/'}}},block_order:['one','two','three','four','five']}
};
await write('theme/templates/index.json',{sections,order:Object.keys(sections)});
for(const name of ['product','collection','search','cart','page','404'])await write('theme/templates/'+name+'.json',{sections:{main:{type:'main-'+name,settings:{}}},order:['main']});
await write('theme/config/settings_schema.json',[
 {name:'theme_info',theme_name:'Zipsters — In Character',theme_version:'1.0.0',theme_author:'Zipsters',theme_documentation_url:'https://shopify.dev/docs/storefronts/themes',theme_support_url:'https://www.instagram.com/zipstersofficial/'},
 {name:'Brand',settings:[{type:'color',id:'background',label:'Page background',default:'#f7f6f2'},{type:'color',id:'foreground',label:'Text',default:'#23251f'},{type:'color',id:'accent',label:'Accent',default:'#424938'},{type:'url',id:'instagram_url',label:'Instagram',default:'https://www.instagram.com/zipstersofficial/'}]}
]);
await write('theme/config/settings_data.json',{current:{background:'#f7f6f2',foreground:'#23251f',accent:'#424938',instagram_url:'https://www.instagram.com/zipstersofficial/',sections:{header:{type:'header',settings:{}},footer:{type:'footer',settings:{heading:'Stay in the loop.'}}}},presets:{}});
console.log('Shopify templates and merchant settings created.');
