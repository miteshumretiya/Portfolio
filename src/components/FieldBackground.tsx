"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FIELD_FRAGMENT, FIELD_VERTEX } from "@/lib/field-shader";
import poster from "../../public/images/field-poster.webp";

// The static poster (a frame of the same shader) is the preloaded hero image and
// the fallback for no-JS, no-WebGL and reduced motion. The live shader boots on
// the first interaction, renders at reduced resolution and pauses off-screen.
export default function FieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let raf = 0;
    let cleanup = () => {};

    const boot = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        preserveDrawingBuffer: false,
      });
      if (!gl) return;

      const prog = gl.createProgram()!;
      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(vs, FIELD_VERTEX);
      gl.shaderSource(fs, FIELD_FRAGMENT);
      gl.compileShader(vs);
      gl.compileShader(fs);
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);

      // Poll for completion instead of blocking the main thread on the GPU.
      const parallel = gl.getExtension("KHR_parallel_shader_compile");
      const whenReady = (cb: () => void) => {
        if (!parallel) return cb();
        const poll = () => {
          if (disposed) return;
          if (gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) cb();
          else window.setTimeout(poll, 50);
        };
        poll();
      };
      whenReady(() => start(gl, prog));
    };

    const start = (gl: WebGLRenderingContext, prog: WebGLProgram) => {
      if (disposed || !gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      const uRes = gl.getUniformLocation(prog, "uRes");
      const uTime = gl.getUniformLocation(prog, "uTime");
      const uPointer = gl.getUniformLocation(prog, "uPointer");

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (coarse ? 0.45 : 0.6);
      const resize = () => {
        const w = Math.max(1, Math.round(canvas.clientWidth * scale));
        const h = Math.max(1, Math.round(canvas.clientHeight * scale));
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(uRes, w, h);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // Pointer light eases toward the cursor (in 0..1, y up).
      const target = { x: 0.72, y: 0.62 };
      const pos = { ...target };
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        target.x = (e.clientX - r.left) / r.width;
        target.y = 1 - (e.clientY - r.top) / r.height;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(canvas);

      // Match the poster frame so the cross-fade is seamless.
      const t0 = performance.now() - 9000;
      const frameBudget = coarse ? 1000 / 30 : 0;
      let last = 0;
      let first = true;
      function frame(now: number) {
        raf = 0;
        if (!visible || document.hidden || disposed) return;
        raf = requestAnimationFrame(frame);
        if (frameBudget && now - last < frameBudget) return;
        last = now;
        pos.x += (target.x - pos.x) * 0.05;
        pos.y += (target.y - pos.y) * 0.05;
        gl!.uniform1f(uTime, (now - t0) / 1000);
        gl!.uniform2f(uPointer, pos.x, pos.y);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
        if (first) {
          first = false;
          setLive(true);
        }
      }
      const onVis = () => {
        if (!document.hidden && !raf) raf = requestAnimationFrame(frame);
      };
      document.addEventListener("visibilitychange", onVis);
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    // Boot on the first sign of a real visitor (pointer, touch, scroll, key).
    // The poster is a frame of the same shader, so the hand-over is invisible,
    // and the GPU compile never competes with first paint or hydration.
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
    let idleId = 0;
    const onFirst = () => {
      events.forEach((e) => window.removeEventListener(e, onFirst));
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120));
      idleId = ric(boot, { timeout: 800 }) as unknown as number;
    };
    events.forEach((e) => window.addEventListener(e, onFirst, { passive: true, once: true }));

    return () => {
      disposed = true;
      events.forEach((e) => window.removeEventListener(e, onFirst));
      window.cancelIdleCallback?.(idleId);
      cleanup();
    };
  }, []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-ink">
      <Image
        src={poster}
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-(--duration-4) ease-(--ease-out) data-[live=true]:opacity-100"
        data-live={live}
      />
    </div>
  );
}
