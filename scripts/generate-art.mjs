// Renders every raster asset on the site from code, so all artwork is original.
//   node scripts/generate-art.mjs
// Requires the pre-installed Chromium (or set CHROME_PATH) and sharp.
import { chromium } from "playwright-core";
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "images");
const CHROME =
  process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const shaderSrc = await readFile(path.join(ROOT, "src/lib/field-shader.ts"), "utf8");
const grab = (name) =>
  shaderSrc.match(new RegExp(`${name} = /\\* glsl \\*/ \`([\\s\\S]*?)\`;`))[1];
const VERT = grab("FIELD_VERTEX");
const FRAG = grab("FIELD_FRAGMENT");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&family=Instrument+Serif:ital@0;1&display=block" rel="stylesheet">`;

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%}
body{font-family:Geist,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
.serif{font-family:'Instrument Serif',serif}
.grain:after{content:'';position:absolute;inset:0;background-image:${GRAIN};opacity:.09;mix-blend-mode:overlay;pointer-events:none}
.win{position:absolute;border-radius:28px;overflow:hidden;box-shadow:0 40px 120px -20px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08)}
.bar{height:56px;display:flex;align-items:center;gap:10px;padding:0 22px}
.dot{width:13px;height:13px;border-radius:50%}
.url{margin-left:18px;flex:1;max-width:520px;height:30px;border-radius:999px;display:flex;align-items:center;padding:0 16px;font-size:15px;letter-spacing:.01em}
`;

function fieldPage(w, h, time, pointer) {
  return `<!doctype html><html><body style="margin:0;background:#000"><canvas id="c" width="${w}" height="${h}" style="display:block;width:${w}px;height:${h}px"></canvas>
<script>
const c=document.getElementById('c');const gl=c.getContext('webgl',{preserveDrawingBuffer:true});
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o}
const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,${JSON.stringify(VERT)}));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,${JSON.stringify(FRAG)}));gl.linkProgram(p);gl.useProgram(p);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const l=gl.getAttribLocation(p,'aPos');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
gl.uniform2f(gl.getUniformLocation(p,'uRes'),${w},${h});gl.uniform1f(gl.getUniformLocation(p,'uTime'),${time});gl.uniform2f(gl.getUniformLocation(p,'uPointer'),${pointer[0]},${pointer[1]});
gl.drawArrays(gl.TRIANGLES,0,3);window.done=true;
</script></body></html>`;
}

// ---------------------------------------------------------------- covers ---

const W = 1600;
const H = 1200;

function frame(bg, inner) {
  return `<!doctype html><html><head>${FONTS}<style>${BASE_CSS}</style></head>
<body><div class="grain" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;${bg}">${inner}</div></body></html>`;
}

// MediaPipe-style hand: 21 landmarks, index finger raised (draw mode).
const HAND = [
  [760, 1040], [680, 990], [618, 920], [575, 852], [540, 795],
  [700, 770], [690, 640], [684, 548], [680, 462],
  [775, 760], [792, 655], [770, 700], [752, 748],
  [848, 780], [866, 700], [846, 735], [830, 772],
  [912, 822], [940, 760], [922, 784], [906, 808],
];
const HAND_S = HAND.map(([x, y]) => [Math.round(760 + (x - 760) * 1.32), Math.round(1100 + (y - 1040) * 1.32)]);
const BONES = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];

const airCanvas = frame(
  "background:radial-gradient(120% 90% at 70% 30%,#1b2a1c 0%,#0a110b 55%,#050806 100%)",
  `
  <div style="position:absolute;inset:0;filter:blur(60px);opacity:.55">
    <div style="position:absolute;left:-120px;top:420px;width:620px;height:760px;border-radius:40%;background:#22311f"></div>
    <div style="position:absolute;right:-80px;top:-60px;width:700px;height:520px;border-radius:50%;background:#2b3a1e"></div>
    <div style="position:absolute;left:560px;top:600px;width:520px;height:620px;border-radius:45%;background:#3a2f22;opacity:.8"></div>
  </div>
  <div style="position:absolute;left:72px;right:72px;top:64px;height:112px;border-radius:24px;background:rgba(10,16,11,.66);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(12px);display:flex;align-items:center;gap:22px;padding:0 30px">
    ${["#c6f432","#ff5a36","#4fd1ff","#f2f0e6"].map((c,i)=>`<div style="width:62px;height:62px;border-radius:18px;background:${c};${i===0?"box-shadow:0 0 0 4px #0a100b,0 0 0 7px #c6f432":""}"></div>`).join("")}
    <div style="width:1px;height:56px;background:rgba(255,255,255,.14);margin:0 8px"></div>
    ${[10,18,28].map((s,i)=>`<div style="width:62px;height:62px;border-radius:18px;border:1px solid rgba(255,255,255,.16);display:grid;place-items:center;${i===1?"background:rgba(198,244,50,.14);border-color:#c6f432":""}"><div style="width:${s}px;height:${s}px;border-radius:50%;background:#eef3ea"></div></div>`).join("")}
    <div style="margin-left:auto;font:600 22px Geist;letter-spacing:.14em;color:#eef3ea;border:1px solid rgba(255,255,255,.2);padding:16px 26px;border-radius:999px">CLEAR</div>
  </div>
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0">
    <defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M 150 560 C 200 390, 340 350, 380 480 C 410 580, 290 640, 260 560 C 230 480, 360 330, 480 390 C 570 435, 560 520, 520 530 C 480 540, 480 440, 560 400 C 600 380, 630 350, 654 337"
      fill="none" stroke="#c6f432" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
    <path d="M 1010 330 C 1080 250, 1220 260, 1250 360 C 1280 470, 1150 520, 1120 440 C 1095 370, 1210 300, 1330 330 C 1420 352, 1460 430, 1420 500"
      fill="none" stroke="#ff5a36" stroke-width="12" stroke-linecap="round" filter="url(#glow)" opacity=".9"/>
    ${BONES.map(([a,b])=>`<line x1="${HAND_S[a][0]}" y1="${HAND_S[a][1]}" x2="${HAND_S[b][0]}" y2="${HAND_S[b][1]}" stroke="#c6f432" stroke-opacity=".85" stroke-width="6"/>`).join("")}
    ${HAND_S.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i===8?17:10}" fill="${i===8?"#c6f432":"#f4f7f0"}" stroke="#0b130c" stroke-width="3"/>`).join("")}
    <circle cx="654" cy="337" r="38" fill="none" stroke="#c6f432" stroke-width="3" stroke-dasharray="6 8"/>
  </svg>
  <div style="position:absolute;left:72px;bottom:64px;display:flex;gap:14px;font:500 22px Geist;color:#cfd8cd;letter-spacing:.06em">
    <span style="padding:12px 20px;border-radius:999px;background:rgba(198,244,50,.16);color:#c6f432;border:1px solid rgba(198,244,50,.4)">● MODE: DRAW</span>
    <span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)">21 LANDMARKS</span>
    <span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)">30 FPS</span>
  </div>`
);

const tile = (c1, c2, c3) => `url('data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" fill="${c1}"/><path d="M80 8 L104 56 L152 80 L104 104 L80 152 L56 104 L8 80 L56 56Z" fill="${c2}"/><circle cx="80" cy="80" r="22" fill="${c1}"/><circle cx="80" cy="80" r="10" fill="${c3}"/><path d="M0 0 L30 0 L0 30Z M160 0 L130 0 L160 30Z M0 160 L30 160 L0 130Z M160 160 L130 160 L160 130Z" fill="${c3}"/></svg>`)}')`;

const product = (bg, art, name, price) => `
  <div style="background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.06)">
    <div style="height:250px;background:${bg};position:relative;overflow:hidden">${art}</div>
    <div style="padding:20px 22px 24px">
      <div style="font:500 21px Geist;color:#1d1a16;line-height:1.25">${name}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
        <span style="font:600 22px Geist;color:#1d1a16">${price}</span>
        <span style="font:500 16px Geist;color:#fff;background:#1f4fa3;border-radius:999px;padding:9px 16px">Add to cart</span>
      </div>
    </div>
  </div>`;

const artisan = frame(
  `background:${tile("#e9dfcb", "#d8c9ad", "#1f4fa3")};background-size:160px`,
  `
  <div style="position:absolute;inset:0;background:linear-gradient(160deg,rgba(233,223,203,.2),rgba(31,79,163,.35))"></div>
  <div class="win" style="left:120px;top:110px;width:1480px;height:1180px;background:#f6f1e7">
    <div class="bar" style="background:#ece4d4;border-bottom:1px solid #ddd3bf">
      <span class="dot" style="background:#e0675a"></span><span class="dot" style="background:#e8b84a"></span><span class="dot" style="background:#5fb06a"></span>
      <div class="url" style="background:#f8f4ec;color:#6f6656">artisanbazaar.netlify.app</div>
    </div>
    <div style="display:flex;align-items:center;padding:30px 48px;border-bottom:1px solid #e6dccb">
      <div class="serif" style="font-size:44px;color:#1d1a16;font-style:italic">Artisan<span style="color:#d7332b">Bazaar</span></div>
      <div style="display:flex;gap:34px;margin-left:64px;font:500 20px Geist;color:#4b443a"><span>Shop</span><span>Artists</span><span>Workshops</span><span>About</span></div>
      <div style="margin-left:auto;position:relative;width:54px;height:54px;border-radius:50%;background:#1d1a16;display:grid;place-items:center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
        <span style="position:absolute;top:-6px;right:-6px;width:26px;height:26px;border-radius:50%;background:#d7332b;color:#fff;font:600 15px Geist;display:grid;place-items:center">2</span>
      </div>
    </div>
    <div style="padding:40px 48px 0;display:flex;align-items:flex-end;justify-content:space-between">
      <div>
        <div style="font:600 16px Geist;letter-spacing:.18em;color:#d7332b">MADE BY HAND · MADE IN MALTA</div>
        <div class="serif" style="font-size:84px;line-height:.98;color:#1d1a16;margin-top:14px">Crafts with a<br><i>Maltese</i> soul.</div>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:12px">${["All","Ceramics","Glass","Lace","Silver"].map((t,i)=>`<span style="font:500 18px Geist;padding:12px 20px;border-radius:999px;${i===0?"background:#1d1a16;color:#fff":"border:1px solid #d6cbb6;color:#4b443a"}">${t}</span>`).join("")}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:22px;padding:34px 48px">
      ${product(`${tile("#f2c230","#1f4fa3","#d7332b")};background-size:125px`, "", "Hand-painted luzzu tile", "€24")}
      ${product("linear-gradient(160deg,#9fd3c7,#1f6f8b)", `<div style="position:absolute;left:50%;bottom:28px;transform:translateX(-50%);width:110px;height:180px;border-radius:50px 50px 30px 30px;background:linear-gradient(90deg,rgba(255,255,255,.55),rgba(255,255,255,.1) 40%,rgba(255,255,255,.35));border:2px solid rgba(255,255,255,.6)"></div>`, "Blown glass vase, sea blue", "€58")}
      ${product("#2b2723", `<svg viewBox="0 0 200 250" style="position:absolute;inset:0;width:100%;height:100%"><g fill="none" stroke="#d9d4cc" stroke-width="2.4"><circle cx="100" cy="128" r="46"/><circle cx="100" cy="128" r="30"/><path d="M100 82 Q120 105 100 128 Q80 151 100 174 M54 128 Q77 108 100 128 Q123 148 146 128"/><path d="M100 30 V82"/></g></svg>`, "Silver filigree pendant", "€42")}
      ${product("#efe9de", `<svg viewBox="0 0 200 250" style="position:absolute;inset:0;width:100%;height:100%"><g fill="none" stroke="#b9ab92" stroke-width="2">${Array.from({length:6},(_,i)=>`<path d="M0 ${50+i*30} Q25 ${35+i*30} 50 ${50+i*30} T100 ${50+i*30} T150 ${50+i*30} T200 ${50+i*30}"/>`).join("")}</g></svg>`, "Bobbin lace table runner", "€36")}
    </div>
  </div>`
);

const weather = frame(
  "background:radial-gradient(110% 90% at 20% 10%,#1d4a63 0%,#0d2232 50%,#07121b 100%)",
  `
  <svg width="${W}" height="${H}" style="position:absolute;inset:0;opacity:.35">
    <g fill="none" stroke="#7fd3ff" stroke-width="1.6">
    ${Array.from({length:14},(_,i)=>{const r=60+i*62;return `<path d="M ${1180-r} 300 C ${1180-r} ${300-r*0.9}, ${1180+r*1.1} ${300-r*0.8}, ${1180+r} 320 C ${1180+r*1.05} ${320+r*0.95}, ${1180-r*0.95} ${300+r*1.05}, ${1180-r} 300 Z"/>`}).join("")}
    </g></svg>
  <div class="win" style="left:150px;top:150px;width:1300px;height:900px;background:rgba(9,22,33,.72);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.12);padding:56px 64px;color:#eaf6ff">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font:500 22px Geist;color:#9cc4d9;letter-spacing:.06em">VALLETTA, MALTA · LIVE</div>
        <div style="display:flex;align-items:flex-start;gap:8px;margin-top:6px"><span style="font:300 220px/1 Geist;letter-spacing:-.05em">24</span><span style="font:300 80px Geist;margin-top:20px">°C</span></div>
        <div style="font:500 30px Geist;margin-top:-6px">Clear skies · feels like 26°</div>
      </div>
      <svg width="220" height="220" viewBox="0 0 100 100"><circle cx="50" cy="50" r="22" fill="#ffd36b"/><g stroke="#ffd36b" stroke-width="4" stroke-linecap="round">${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<line x1="${50+Math.cos(a)*31}" y1="${50+Math.sin(a)*31}" x2="${50+Math.cos(a)*42}" y2="${50+Math.sin(a)*42}"/>`}).join("")}</g></svg>
    </div>
    <svg viewBox="0 0 1170 220" style="width:100%;height:220px;margin-top:30px">
      <defs><linearGradient id="wg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#7fd3ff" stop-opacity=".45"/><stop offset="1" stop-color="#7fd3ff" stop-opacity="0"/></linearGradient></defs>
      <path d="M0 150 C 120 140, 180 90, 290 80 S 470 40, 585 50 S 780 100, 880 120 S 1080 150, 1170 160 L1170 220 L0 220Z" fill="url(#wg)"/>
      <path d="M0 150 C 120 140, 180 90, 290 80 S 470 40, 585 50 S 780 100, 880 120 S 1080 150, 1170 160" fill="none" stroke="#7fd3ff" stroke-width="4"/>
      <circle cx="585" cy="50" r="9" fill="#fff"/>
    </svg>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;margin-top:22px">
      ${["Now","15:00","16:00","17:00","18:00","19:00","20:00"].map((h,i)=>`<div style="border-radius:20px;padding:18px 0;text-align:center;${i===0?"background:rgba(127,211,255,.18);border:1px solid rgba(127,211,255,.5)":"background:rgba(255,255,255,.05)"}"><div style="font:500 19px Geist;color:#9cc4d9">${h}</div><div style="font:500 30px Geist;margin-top:8px">${[24,25,25,24,22,21,20][i]}°</div></div>`).join("")}
    </div>
    <div style="display:flex;gap:16px;margin-top:22px;font:500 21px Geist;color:#cfe6f3">
      <span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.06)">Wind 14 km/h NW</span>
      <span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.06)">Humidity 62%</span>
      <span style="padding:12px 20px;border-radius:999px;background:rgba(255,255,255,.06)">UV 6 · High</span>
    </div>
  </div>`
);

const poster = (g, title) => `<div style="flex:0 0 220px;height:320px;border-radius:16px;background:${g};position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.75))"></div><div class="serif" style="position:absolute;left:18px;right:18px;bottom:16px;font-size:30px;line-height:1;color:#fff">${title}</div></div>`;

const stream = frame(
  "background:#0b0b0d",
  `
  <div class="win" style="left:90px;top:90px;width:1600px;height:1200px;background:#101014">
    <div style="height:640px;position:relative;background:radial-gradient(90% 120% at 75% 30%,#a3341f 0%,#4a1610 40%,#120a09 75%)">
      <svg width="1600" height="640" style="position:absolute;inset:0;opacity:.5"><g fill="none" stroke="#ff8a5b" stroke-width="1.5">${Array.from({length:18},(_,i)=>`<path d="M 700 ${640-i*8} Q 1100 ${420-i*22} 1600 ${520-i*30}"/>`).join("")}</g></svg>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,#101014 8%,transparent 60%),linear-gradient(0deg,#101014 0%,transparent 40%)"></div>
      <div style="position:absolute;left:64px;top:40px;display:flex;align-items:center;gap:44px">
        <div style="font:800 34px Geist;letter-spacing:.04em;color:#ff3b30">STREAMBOX</div>
        <div style="display:flex;gap:30px;font:500 20px Geist;color:#d9d9de"><span style="color:#fff">Home</span><span>Series</span><span>Films</span><span>My List</span></div>
      </div>
      <div style="position:absolute;left:64px;top:190px;color:#fff;max-width:640px">
        <div style="font:600 18px Geist;letter-spacing:.2em;color:#ff8a5b">ORIGINAL SERIES</div>
        <div class="serif" style="font-size:118px;line-height:.92;margin-top:12px">Saltwater<br><i>Hours</i></div>
        <div style="display:flex;gap:14px;margin-top:34px">
          <span style="font:600 22px Geist;background:#fff;color:#111;border-radius:12px;padding:16px 30px">▶ Play</span>
          <span style="font:600 22px Geist;background:rgba(255,255,255,.18);border-radius:12px;padding:16px 30px">More info</span>
        </div>
      </div>
    </div>
    <div style="padding:10px 64px 0">
      <div style="font:600 24px Geist;color:#eee;margin-bottom:18px">Trending now</div>
      <div style="display:flex;gap:18px">
        ${poster("linear-gradient(160deg,#2b5876,#4e4376)","Night Shift")}
        ${poster("linear-gradient(160deg,#c94b4b,#4b134f)","Red Harbour")}
        ${poster("linear-gradient(160deg,#134e5e,#71b280)","The Long Field")}
        ${poster("linear-gradient(160deg,#e0a458,#4c2a13)","Amber Road")}
        ${poster("linear-gradient(160deg,#1f1c2c,#928dab)","Static")}
        ${poster("linear-gradient(160deg,#355c7d,#c06c84)","Low Tide")}
      </div>
    </div>
  </div>`
);

const folder = (name, meta, color) => `<div style="border-radius:20px;background:#161c22;border:1px solid #232c35;padding:22px"><svg width="56" height="46" viewBox="0 0 56 46"><path d="M2 8a6 6 0 0 1 6-6h14l6 7h20a6 6 0 0 1 6 6v23a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6z" fill="${color}"/></svg><div style="font:500 21px Geist;color:#e7edf2;margin-top:16px">${name}</div><div style="font:400 17px Geist;color:#8796a3;margin-top:6px">${meta}</div></div>`;
const fileRow = (name, size, when, c) => `<div style="display:flex;align-items:center;gap:18px;padding:18px 4px;border-bottom:1px solid #1f2830;font:400 20px Geist;color:#c9d3db"><span style="width:38px;height:46px;border-radius:7px;background:${c};flex:none"></span><span style="flex:1;color:#e7edf2">${name}</span><span style="width:140px">${size}</span><span style="width:160px;color:#8796a3">${when}</span></div>`;

const drive = frame(
  "background:radial-gradient(100% 100% at 80% 0%,#173049 0%,#0b1724 55%,#060c13 100%)",
  `
  <div class="win" style="left:110px;top:110px;width:1500px;height:1150px;background:#0e1419;display:flex">
    <div style="width:330px;background:#0b1015;border-right:1px solid #1d252d;padding:34px 26px">
      <div style="display:flex;align-items:center;gap:14px;font:700 28px Geist;color:#e7edf2"><span style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#4f8cff,#29c4a9)"></span>Drive</div>
      <div style="margin-top:36px;font:600 20px Geist;background:#4f8cff;color:#fff;border-radius:16px;padding:18px 22px">+ New upload</div>
      <div style="margin-top:28px;display:flex;flex-direction:column;gap:6px;font:500 20px Geist;color:#a8b5c0">
        ${["My Drive","Shared with me","Recent","Starred","Trash"].map((t,i)=>`<div style="padding:14px 18px;border-radius:14px;${i===0?"background:rgba(79,140,255,.16);color:#cfe0ff":""}">${t}</div>`).join("")}
      </div>
      <div style="position:absolute;left:26px;bottom:60px;width:278px">
        <div style="font:500 18px Geist;color:#a8b5c0">Storage</div>
        <div style="height:10px;border-radius:9px;background:#1d252d;margin-top:12px"><div style="width:41%;height:100%;border-radius:9px;background:linear-gradient(90deg,#4f8cff,#29c4a9)"></div></div>
        <div style="font:400 17px Geist;color:#8796a3;margin-top:10px">6.2 GB of 15 GB used</div>
      </div>
    </div>
    <div style="flex:1;padding:34px 44px">
      <div style="height:62px;border-radius:999px;background:#161c22;border:1px solid #232c35;display:flex;align-items:center;padding:0 26px;font:400 20px Geist;color:#6f7d89">Search in Drive</div>
      <div style="font:600 30px Geist;color:#e7edf2;margin-top:36px">My Drive</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:22px">
        ${folder("Coursework","48 files","#4f8cff")}${folder("Air Canvas","12 files","#29c4a9")}${folder("Network labs","31 files","#ffb547")}${folder("Photos","210 files","#ff6b6b")}
      </div>
      <div style="margin-top:30px">
        ${fileRow("dissertation-final.pdf","2.4 MB","Today","#ff6b6b")}
        ${fileRow("vlan-topology.pkt","860 KB","Yesterday","#ffb547")}
        ${fileRow("artisanbazaar-schema.sql","42 KB","2 days ago","#4f8cff")}
        ${fileRow("weather-api-notes.md","9 KB","Last week","#29c4a9")}
      </div>
    </div>
    <div style="position:absolute;right:40px;bottom:40px;width:440px;border-radius:20px;background:#1a222a;border:1px solid #2a343e;padding:22px 24px;box-shadow:0 20px 50px rgba(0,0,0,.4)">
      <div style="font:600 20px Geist;color:#e7edf2">Uploading 3 files</div>
      <div style="height:8px;border-radius:9px;background:#28323c;margin-top:16px"><div style="width:68%;height:100%;border-radius:9px;background:#4f8cff"></div></div>
      <div style="font:400 17px Geist;color:#8796a3;margin-top:10px">68% · about 12 seconds left</div>
    </div>
  </div>`
);

const album = (g, t, a) => `<div><div style="aspect-ratio:1;border-radius:18px;background:${g};position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:radial-gradient(60% 60% at 30% 25%,rgba(255,255,255,.35),transparent 60%)"></div></div><div style="font:600 20px Geist;color:#2a1712;margin-top:14px">${t}</div><div style="font:400 17px Geist;color:#7a5a4f;margin-top:4px">${a}</div></div>`;

const music = frame(
  "background:radial-gradient(120% 100% at 10% 0%,#ffb08a 0%,#ff7a4d 35%,#c2401f 70%,#5e1a0c 100%)",
  `
  <div class="win" style="left:130px;top:120px;width:1480px;height:1140px;background:#fff6ef;color:#2a1712">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:38px 52px 0">
      <div><div style="font:600 18px Geist;letter-spacing:.18em;color:#c2401f">YOUR LIBRARY</div><div class="serif" style="font-size:76px;line-height:1;margin-top:8px">Late-night <i>rotation</i></div></div>
      <div style="display:flex;gap:12px">${["Albums","Artists","Playlists"].map((t,i)=>`<span style="font:500 19px Geist;padding:12px 22px;border-radius:999px;${i===0?"background:#2a1712;color:#fff6ef":"border:1px solid #e8cfc2"}">${t}</span>`).join("")}</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px;padding:30px 52px 26px">
      ${album("linear-gradient(135deg,#ff5a36,#7a1d0f)","Harbour Lights","Ċensu & The Tides")}
      ${album("linear-gradient(135deg,#2f6a5f,#0f2420)","Green Room","Moss Theory")}
      ${album("linear-gradient(135deg,#f2c230,#c2401f)","Sunday Ferry","Gozo Social Club")}
      ${album("linear-gradient(135deg,#3b3a7a,#11102b)","Low Orbit","Signal Path")}
      ${album("linear-gradient(135deg,#e7d6c4,#a9876d)","Limestone","Valletta Quartet")}
    </div>
    <div style="padding:0 52px">
      <div style="font:600 22px Geist;margin-bottom:8px">Recently added</div>
      ${[["01","Harbour Lights","Ċensu & The Tides","3:58"],["02","Ferry at Six","Gozo Social Club","4:12"],["03","Signal Path","Low Orbit","3:21"]].map(([n,t,a,d],i)=>`<div style="display:flex;align-items:center;gap:22px;padding:16px 18px;border-radius:16px;font:400 20px Geist;${i===0?"background:#ffe7da":""}"><span style="width:32px;color:#b08676">${n}</span><span style="flex:1;font-weight:500">${t}</span><span style="width:300px;color:#7a5a4f">${a}</span><span style="color:#7a5a4f">${d}</span></div>`).join("")}
    </div>
    <div style="position:absolute;left:52px;right:52px;bottom:48px;height:150px;border-radius:26px;background:#2a1712;display:flex;align-items:center;gap:26px;padding:0 30px;color:#fff6ef">
      <div style="width:94px;height:94px;border-radius:16px;background:linear-gradient(135deg,#ff5a36,#7a1d0f);flex:none"></div>
      <div style="width:250px;flex:none"><div style="font:600 22px Geist">Harbour Lights</div><div style="font:400 18px Geist;color:#d9b8aa;margin-top:6px">Ċensu & The Tides</div></div>
      <div style="width:64px;height:64px;border-radius:50%;background:#ff7a4d;display:grid;place-items:center;flex:none"><div style="width:0;height:0;border-left:20px solid #2a1712;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:6px"></div></div>
      <svg viewBox="0 0 640 80" style="flex:1;height:80px">${Array.from({length:80},(_,i)=>{const h=10+Math.abs(Math.sin(i*0.55)*Math.cos(i*0.17))*62;return `<rect x="${i*8}" y="${40-h/2}" width="4.5" height="${h}" rx="2.2" fill="${i<34?"#ff7a4d":"#6b4a3f"}"/>`}).join("")}</svg>
      <div style="font:500 18px Geist;color:#d9b8aa;flex:none">1:42 / 3:58</div>
    </div>
  </div>`
);

// ------------------------------------------------------------------ OG ---

const og = (fieldUrl) => `<!doctype html><html><head>${FONTS}<style>${BASE_CSS}</style></head>
<body><div class="grain" style="position:relative;width:1200px;height:630px;overflow:hidden;background:#070b08 url('${fieldUrl}') center/cover">
  <div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,11,8,.92) 0%,rgba(7,11,8,.55) 55%,rgba(7,11,8,.15) 100%)"></div>
  <div style="position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px;color:#eef3ea;font:500 22px Geist">
    ${markSvg(40)} Mitesh Umretiya
  </div>
  <div style="position:absolute;left:72px;bottom:150px;color:#eef3ea">
    <div style="font:600 112px/0.9 Geist;letter-spacing:-.045em">Mitesh</div>
    <div class="serif" style="font-size:132px;line-height:.9;font-style:italic;color:#c6f432">Umretiya</div>
  </div>
  <div style="position:absolute;left:72px;bottom:64px;font:400 26px Geist;color:#c9d3c7">Web developer &amp; network engineer · Computing graduate, IDEA College Malta</div>
</div></body></html>`;

function markSvg(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none"><g stroke="#c6f432" stroke-width="1.6" stroke-linecap="round"><path d="M16 16 L16 5 M16 16 L25.5 21.5 M16 16 L6.5 21.5"/></g><g fill="#c6f432"><circle cx="16" cy="16" r="3.2"/><circle cx="16" cy="4.5" r="2.2"/><circle cx="26" cy="22" r="2.2"/><circle cx="6" cy="22" r="2.2"/></g><g fill="#eef3ea"><circle cx="26" cy="10" r="1.5"/><circle cx="6" cy="10" r="1.5"/><circle cx="16" cy="27.5" r="1.5"/></g></svg>`;
}

// --------------------------------------------------------------- render ---

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

async function shot(html, w, h, { waitFor = "fonts" } = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle" });
  if (waitFor === "gl") await page.waitForFunction(() => window.done === true);
  else await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: "png" });
  await page.close();
  return buf;
}

await mkdir(path.join(OUT, "work"), { recursive: true });

// Hero poster: one frame of the live shader, used as LCP image + no-JS/no-WebGL fallback.
const field = await shot(fieldPage(1920, 1200, 9.0, [0.72, 0.62]), 1920, 1200, { waitFor: "gl" });
await sharp(field).webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, "field-poster.webp"));
const fieldDataUrl = `data:image/png;base64,${(await sharp(field).resize(1200).png().toBuffer()).toString("base64")}`;

const covers = { "air-canvas": airCanvas, artisanbazaar: artisan, weather, streambox: stream, drive, music };
for (const [name, html] of Object.entries(covers)) {
  const buf = await shot(html, W, H);
  await sharp(buf).webp({ quality: 80, effort: 6 }).toFile(path.join(OUT, "work", `${name}.webp`));
  console.log("cover", name);
}

const ogBuf = await shot(og(fieldDataUrl), 1200, 630);
await sharp(ogBuf).png({ compressionLevel: 9, palette: false }).toFile(path.join(ROOT, "public", "og.png"));

// Apple touch icon.
const iconHtml = `<!doctype html><html><body style="margin:0"><div style="width:180px;height:180px;background:#0b120d;display:grid;place-items:center">${markSvg(116)}</div></body></html>`;
const iconBuf = await shot(iconHtml, 180, 180);
await sharp(iconBuf).png().toFile(path.join(ROOT, "src", "app", "apple-icon.png"));

await browser.close();
console.log("done");
