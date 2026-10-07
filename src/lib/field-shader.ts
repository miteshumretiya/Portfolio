// "Field" — wind moving through tall grass at dusk.
// Domain-warped fbm stretched along a diagonal gives blade-like streaks;
// a soft light follows the pointer. Kept cheap: 4 octaves, mediump.

export const FIELD_VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FIELD_FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.08;

  // Slow flow field: where the wind is pressing the grass flat.
  vec2 q = vec2(fbm(p * 0.9 + vec2(0.0, t * 0.6)), fbm(p * 0.9 + vec2(5.2, 1.3) - t * 0.5));
  float hills = fbm(p * 0.85 + 2.4 * q + vec2(t * 0.35, 0.0));

  // Blades: ridged noise stretched across the local wind direction.
  float ang = 0.85 + (q.x - 0.5) * 1.8;
  vec2 g1 = rot(ang) * p * vec2(48.0, 2.6);
  float r1 = 1.0 - abs(2.0 * noise(g1 + vec2(0.0, t * 3.0)) - 1.0);
  vec2 g2 = rot(ang + 0.12) * p * vec2(110.0, 5.0);
  float r2 = 1.0 - abs(2.0 * noise(g2 + vec2(11.0, t * 5.0)) - 1.0);
  float blades = pow(r1, 3.0) * 0.6 + pow(r2, 4.0) * 0.4;

  float light = smoothstep(0.22, 0.68, hills);
  float v = light * 0.8 + blades * (0.22 + 0.38 * light);

  vec3 c0 = vec3(0.02, 0.04, 0.018);
  vec3 c1 = vec3(0.08, 0.17, 0.045);
  vec3 c2 = vec3(0.25, 0.46, 0.1);
  vec3 c3 = vec3(0.66, 0.84, 0.28);

  vec3 col = mix(c0, c1, smoothstep(0.0, 0.35, v));
  col = mix(col, c2, smoothstep(0.3, 0.72, v));
  col = mix(col, c3, smoothstep(0.68, 1.05, v) * 0.75);

  // Pointer light: a patch of late sun that follows the cursor.
  vec2 pp = (uPointer - 0.5) * uRes / min(uRes.x, uRes.y);
  float d = length(p - pp);
  col += vec3(0.28, 0.34, 0.1) * smoothstep(0.8, 0.0, d) * (0.15 + 0.6 * blades);

  // Vignette, heavier toward the bottom-left where the copy sits.
  float vig = smoothstep(1.3, 0.2, length((uv - vec2(0.66, 0.66)) * vec2(1.05, 1.2)));
  col *= mix(0.42, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;
