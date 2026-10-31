import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';

// Use an existing Playwright installation without changing storefront dependencies.
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const baseURL = process.env.SHOWCASE_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}),
});
const captures = [
  {file: 'desktop-home.png', route: '/', width: 1440, height: 900, mobile: false},
  {file: 'mobile-home.png', route: '/', width: 390, height: 844, mobile: true},
  {file: 'desktop-product.png', route: '/products/textured-half-sleeve-henley-black', width: 1440, height: 1000, mobile: false},
];
const results = [];
try {
  for (const capture of captures) {
    const context = await browser.newContext({
      viewport: {width: capture.width, height: capture.height},
      deviceScaleFactor: 2, isMobile: capture.mobile, hasTouch: capture.mobile,
      reducedMotion: 'reduce', colorScheme: 'light', locale: 'en-PK',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => errors.push(`${request.failure()?.errorText} ${request.url()}`));
    const response = await page.goto(new URL(capture.route, baseURL).href, {waitUntil: 'networkidle'});
    assert.equal(response.status(), 200);
    // Decode all current images, including lazy assets below the viewport.
    // The site's own reduced-motion support holds the first hero slide steady.
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async image => {
        image.loading = 'eager';
        await image.decode();
      }));
      await Promise.all([...document.querySelectorAll('video[poster]')].map(video => {
        const poster = new Image();
        poster.src = video.poster;
        return poster.decode();
      }));
      window.scrollTo(0, 0);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const checks = await page.evaluate(() => ({
      devicePixelRatio,
      fontsReady: document.fonts.status === 'loaded',
      loadedFontFaces: [...document.fonts].filter(font => font.status === 'loaded').map(font => `${font.family} ${font.weight}`),
      images: document.images.length,
      brokenImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).length,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      scrollY,
      openDialogs: document.querySelectorAll('dialog[open]').length,
      runningAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
      activeCampaign: document.querySelector('[data-campaign-slide].is-active')?.getAttribute('aria-label') || null,
    }));
    assert.equal(checks.devicePixelRatio, 2);
    assert.equal(checks.fontsReady, true);
    assert.ok(checks.loadedFontFaces.length > 0);
    assert.equal(checks.brokenImages, 0);
    assert.equal(checks.horizontalOverflow, false);
    assert.equal(checks.scrollY, 0);
    assert.equal(checks.openDialogs, 0);
    assert.equal(checks.runningAnimations, 0);
    const output = new URL(capture.file, import.meta.url);
    await page.screenshot({path: fileURLToPath(output), fullPage: false, scale: 'device', animations: 'disabled', caret: 'hide'});
    assert.deepEqual(errors, []);
    const png = await fs.readFile(output);
    const pixels = {width: png.readUInt32BE(16), height: png.readUInt32BE(20)};
    assert.equal(pixels.width, capture.width * 2);
    assert.equal(pixels.height, capture.height * 2);
    results.push({...capture, pixels, bytes: png.length, checks, errors});
    console.log(`${capture.file}: ${pixels.width} x ${pixels.height}, all capture checks passed`);
    await context.close();
  }
  await fs.writeFile(new URL('capture-manifest.json', import.meta.url), JSON.stringify({
    browser: `Chromium ${browser.version()}`, baseURL,
    deviceScaleFactor: 2, reducedMotion: 'reduce', fullPage: false,
    captures: results,
  }, null, 2) + '\n');
} finally {
  await browser.close();
}
