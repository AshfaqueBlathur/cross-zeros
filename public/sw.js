if(!self.define){
    const e=e=>{"require"!==e&&(e+=".js");
    let r=Promise.resolve();
    return i[e]||(r=new Promise((async r=>{
        if("document"in self){
            const i=document.createElement("script");
            i.src=e,document.head.appendChild(i),i.onload=r
        }else importScripts(e),r()}))),r.then((()=>{
            if(!i[e])throw new Error(`Module ${e} didn’t register its module`);
            return i[e]}))},r=(r,i)=>{
                Promise.all(r.map(e))
                .then((e=>i(1===e.length?e[0]:e)))
            },i={require:Promise.resolve(r)};
            self.define=(r,c,n)=>{i[r]||(i[r]=Promise.resolve()
                .then((()=>{let i={};const s={uri:location.origin+r.slice(1)};
                return Promise.all(c.map((r=>{switch(r){case"exports":return i;
                case"module":return s;default:return e(r)}})))
                .then((e=>{const r=n(...e);
                    return i.default||(i.default=r),i}))})))}}define("./sw.js",["./workbox-cd35b8a9"],(function(e){"use strict";
                    self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"app.js",revision:"0f798e0135349e3924b25dd56acadbcc"},{url:"ARCADECLASSIC.TTF",revision:"964111990ca3937960147b80e8d07e61"},{url:"favicon.ico",revision:"faed6c5b884ff93071b96c8a29456639"},{url:"img/android-chrome-192x192.png",revision:"fc6415ce275ae7576fa2d21ddbc92f01"},{url:"img/android-chrome-512x512.png",revision:"4d599ebc868796caf422be6b310a4097"},{url:"img/apple-touch-icon.png",revision:"5baf64161062e68d87bdc26582008dcf"},{url:"img/favicon-16x16.png",revision:"1453fa7e16211667b37b8d90d64aab1f"},{url:"img/favicon-32x32.png",revision:"cbd375fc329a5bbb9485e05d9f6d5966"},{url:"index.html",revision:"b36184f9a0cbd801e624df5c62d37692"},{url:"main.css",revision:"c1888e49fb11fa6f5906c73f0bfeddc3"},{url:"qrcode.min.js",revision:"517b55d3688ce9ef1085a3d9632bcb97"},{url:"site.webmanifest",revision:"d7806454de77cfcffa5e688d11851e16"}],{})}));
//# sourceMappingURL=sw.js.map



import * as navigationPreload from 'workbox-navigation-preload';
import {registerRoute, NavigationRoute} from 'workbox-routing';
import {NetworkOnly} from 'workbox-strategies';

const CACHE_NAME = 'offline-html';
// This assumes /offline.html is a URL for your self-contained
// (no external images or styles) offline page.
const FALLBACK_HTML_URL = '/offline.html';
// Populate the cache with the offline HTML page when the
// service worker is installed.
self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(FALLBACK_HTML_URL))
  );
});

navigationPreload.enable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
  try {
    // Attempt a network request.
    return await networkOnly.handle(params);
  } catch (error) {
    // If it fails, return the cached HTML.
    return caches.match(FALLBACK_HTML_URL, {
      cacheName: CACHE_NAME,
    });
  }
};

// Register this strategy to handle all navigations.
registerRoute(
  new NavigationRoute(navigationHandler)
);
