import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {projectRoot} from './catalog.mjs';
import handler from '../api/storefront.js';

const assetRoot=path.join(projectRoot,'public');
const mime={'.jpg':'image/jpeg','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm','.txt':'text/plain'};
const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/favicon.ico'){res.writeHead(302,{Location:'/assets/favicon.svg'});return res.end();}
  if(!url.pathname.startsWith('/assets/'))return handler(req,res);
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
  try{
    const file=path.resolve(assetRoot,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(assetRoot+path.sep)){res.writeHead(403);return res.end();}
    const data=await fs.readFile(file);
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    res.setHeader('Accept-Ranges','bytes');
    res.setHeader('Cache-Control','no-cache');
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1);
      if(start>=data.length||end<start){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});return res.end();}
      res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});
      return res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));}
    res.setHeader('Content-Length',data.length);res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404);res.end('Asset not found');}
});
const port=Number(process.env.PORT)||4174;
server.listen(port,'127.0.0.1',()=>console.log(`ZIPSTERS portfolio demo: http://localhost:${port}`));
