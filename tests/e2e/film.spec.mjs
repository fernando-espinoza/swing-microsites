import {test,expect} from '@playwright/test';
test('film waits for intent, even with reduced motion',async({page})=>{
 const movies=[];page.on('request',r=>{if(r.url().endsWith('.mp4'))movies.push(r.url());});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/campaign/johnmontgomery/');
 const video=page.locator('video');await video.scrollIntoViewIfNeeded();await expect(video).toHaveAttribute('preload','none');
 expect(await video.evaluate(v=>v.paused&&!v.autoplay&&v.muted)).toBe(true);expect(movies).toEqual([]);
});
test('supplied H264 film plays and pagehide pauses it',async({page})=>{
 await page.goto('/campaign/johnmontgomery/');const video=page.locator('video');await video.scrollIntoViewIfNeeded();
 await video.evaluate(v=>v.play());await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(.1);
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));expect(await video.evaluate(v=>v.paused)).toBe(true);
});
test('failed movie request leaves a visible still and readable content',async({page})=>{
 await page.route('**/*.mp4',r=>r.abort());await page.goto('/campaign/johnmontgomery/');
 const video=page.locator('video');await video.scrollIntoViewIfNeeded();await video.evaluate(v=>v.play().catch(()=>{}));
 await expect(page.locator('[data-film-fallback]')).toBeVisible();await expect(page.locator('[data-film] [role="status"]')).toHaveText('Film unavailable');
 await expect(page.locator('#products')).toBeAttached();
});
test('native film is playable without page scripts',async({browser,browserName})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4173/campaign/johnmontgomery/');const v=page.locator('video');await v.scrollIntoViewIfNeeded();
 expect(await v.evaluate(v=>v.controls)).toBe(true);if(browserName==='firefox'){const height=await v.evaluate(v=>v.getBoundingClientRect().height);await v.click({position:{x:24,y:height-20}});}else{await v.evaluate(v=>v.play());}await expect.poll(()=>v.evaluate(v=>v.currentTime)).toBeGreaterThan(.1);await context.close();
});
