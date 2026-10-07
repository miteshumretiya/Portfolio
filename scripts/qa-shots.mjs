// Visual + overflow QA across breakpoints.
//   node scripts/qa-shots.mjs <url> <outDir> [--widths=360,390] [--reduced] [--nojs] [--viewport-only] [--scroll-to=#id]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [url = "http://localhost:3000", outDir = "qa"] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const flag = (name) => process.argv.find((a) => a.startsWith(`--${name}`));
const widths = (flag("widths")?.split("=")[1] ?? "360,390,430,768,1024,1280,1440,1920").split(",").map(Number);
const reduced = Boolean(flag("reduced"));
const noJs = Boolean(flag("nojs"));
const viewportOnly = Boolean(flag("viewport-only"));
const scrollTo = flag("scroll-to")?.split("=")[1];
const frames = Boolean(flag("frames"));
const heights = { 360: 780, 390: 844, 430: 932, 768: 1024, 1024: 768, 1280: 800, 1440: 900, 1920: 1080 };

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const report = [];
for (const w of widths) {
  const mobile = w < 1024;
  const ctx = await browser.newContext({
    viewport: { width: w, height: heights[w] ?? 900 },
    deviceScaleFactor: 1,
    isMobile: mobile && w < 768,
    hasTouch: mobile,
    reducedMotion: reduced ? "reduce" : "no-preference",
    javaScriptEnabled: !noJs,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && errors.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  if (!viewportOnly) {
    // Walk the page so scroll-triggered reveals fire.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += 400) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(1500);
  }
  if (scrollTo) {
    await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView(), scrollTo);
    await page.waitForTimeout(1200);
  }

  const metrics = await page.evaluate(() => {
    const offenders = [];
    const vw = window.innerWidth;
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.closest("[data-hscroll-track], .marquee__track, .preloader, [aria-hidden='true'], .pin-spacer")) continue;
      if (r.right > vw + 1 || r.left < -1) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed") continue;
        offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}, ${Math.round(r.right)}]`);
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      offenders: offenders.slice(0, 8),
    };
  });

  const file = path.join(outDir, `w${w}${reduced ? "-reduced" : ""}${noJs ? "-nojs" : ""}.png`);
  if (frames) {
    // Viewport-sized frames down the page (full-page capture is unreliable with pinning).
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = heights[w] ?? 900;
    let n = 0;
    for (let y = 0; y < total; y += Math.round(vh * 0.92)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(reduced || noJs ? 150 : 900);
      await page.screenshot({ path: file.replace(".png", `-f${String(n++).padStart(2, "0")}.png`) });
    }
  }
  if (!viewportOnly) await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(viewportOnly ? 100 : 900);
  if (!frames) await page.screenshot({ path: file, fullPage: !viewportOnly });
  report.push({ w, ok: metrics.scrollWidth <= metrics.innerWidth, ...metrics, errors: errors.slice(0, 6) });
  await ctx.close();
}
await browser.close();
for (const r of report) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.w}px scrollWidth=${r.scrollWidth} innerWidth=${r.innerWidth}`);
  r.offenders.forEach((o) => console.log("   overflow:", o));
  r.errors.forEach((e) => console.log("   console:", e));
}
