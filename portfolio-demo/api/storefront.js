import {render} from '../server/render.mjs';

export default async function handler(req, res) {
  if (!['GET','HEAD'].includes(req.method)) {
    res.setHeader('Allow','GET, HEAD');res.statusCode=405;
    return res.end('Portfolio demo: transactions are browser-local only.');
  }
  try {
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost:4174').split(',')[0].trim();
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const url = new URL(req.url, `${protocol}://${host}`);
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    const {status,html} = await render(url);
    res.statusCode=status;
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Robots-Tag','noindex, nofollow');
    res.end(req.method==='HEAD' ? undefined : html);
  } catch(error) {
    console.error('Storefront render failed:',error.message);
    res.statusCode=500;res.end('The demo could not load. Please try again.');
  }
}
