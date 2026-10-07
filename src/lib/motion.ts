import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

// One easing family and one duration scale, mirrored in globals.css.
// expo.out ≈ cubic-bezier(0.16, 1, 0.3, 1); power4.inOut ≈ cubic-bezier(0.76, 0, 0.24, 1)
const EASE = "expo.out";
const EASE_IN_OUT = "power4.inOut";
const DUR = { xs: 0.2, sm: 0.45, md: 0.8, lg: 1.2 } as const;

// Pinned horizontal scroll needs enough height for a full card; shorter screens keep the native scroller.
const DESKTOP = "(min-width: 1024px) and (min-height: 44rem) and (prefers-reduced-motion: no-preference)";
const DESKTOP_STACK = DESKTOP;
const MOTION = "(prefers-reduced-motion: no-preference)";

const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T & Element>(sel)) as T[];

// Hand the main thread back between setup steps so no single task runs long.
const yieldToMain = () =>
  new Promise<void>((resolve) => {
    const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    if (s?.yield) s.yield().then(resolve);
    else setTimeout(resolve, 0);
  });

export async function initMotion() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const disposers: Array<() => void> = [];
  let disposed = false;
  const dispose = () => {
    disposed = true;
    disposers.slice().reverse().forEach((d) => d());
  };

  // ── Smooth scroll (mouse/trackpad only; touch keeps native momentum) ──────
  let lenis: Lenis | undefined;
  if (!reduce && fine) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis!.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    disposers.push(() => {
      gsap.ticker.remove(tick);
      lenis!.destroy();
      window.__lenis = undefined;
    });
  }

  // ── In-page anchors (works with or without Lenis) ───────────────────────
  const navOffset = () =>
    (document.querySelector("header nav")?.getBoundingClientRect().height ?? 60) + 24;
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute("href")!;
    if (hash.length < 2) return;
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(hash === "#top" ? 0 : target, {
        offset: hash === "#top" ? 0 : -navOffset(),
        duration: 1.4,
        force: true,
      });
    } else {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    history.pushState(null, "", hash);
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  document.addEventListener("click", onClick);
  disposers.push(() => document.removeEventListener("click", onClick));

  if (reduce) {
    // Content is already fully visible; nothing else to do.
    return dispose;
  }

  ScrollTrigger.config({ ignoreMobileResize: true });
  const ctx = gsap.context(() => {});
  disposers.push(() => ctx.revert());
  // Each step runs in its own task.
  const step = async (fn: () => void) => {
    if (disposed) return;
    ctx.add(fn);
    await yieldToMain();
  };

  await step(() => {
    // ── Split-text line reveals ────────────────────────────────────────────
    $$("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: DUR.lg,
            ease: EASE,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
      });
    });
  });

  await step(() => {
    // ── Fade-up groups ─────────────────────────────────────────────────────
    $$("[data-reveal='up']").forEach((el) => {
      const targets = el.hasAttribute("data-stagger") ? Array.from(el.children) : [el];
      gsap.from(targets, {
        y: 48,
        opacity: 0,
        duration: DUR.md,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // ── Masked image reveals ───────────────────────────────────────────────
    $$("[data-reveal='clip']").forEach((el) => {
      const img = el.querySelector("img");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.lg, ease: EASE_IN_OUT },
      );
      if (img) tl.from(img, { scale: 1.3, duration: DUR.lg * 1.4, ease: EASE }, 0);
    });

    // ── Scroll parallax ────────────────────────────────────────────────────
    $$("[data-parallax]").forEach((el) => {
      const speed = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  await step(() => {
    // ── Number counters ────────────────────────────────────────────────────
    $$("[data-counter]").forEach((el) => {
      const value = Number(el.dataset.counter);
      const decimals = Number(el.dataset.decimals ?? 0);
      const state = { v: 0 };
      el.textContent = (0).toFixed(decimals);
      gsap.to(state, {
        v: value,
        duration: DUR.lg * 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = state.v.toFixed(decimals);
        },
      });
    });

    // ── Marquee: scroll velocity bends and speeds the ticker (with Lenis) ──
    if (lenis) $$("[data-velocity]").forEach((el) => {
      const track = el.querySelector<HTMLElement>(".marquee__track");
      const anim = track?.getAnimations()[0];
      const skew = gsap.quickTo(el, "skewX", { duration: DUR.md, ease: "power3.out" });
      let rate = 1;
      const onScroll = ({ velocity }: { velocity: number }) => {
        skew(gsap.utils.clamp(-7, 7, velocity * -0.25));
        const target = 1 + Math.min(Math.abs(velocity) / 8, 5);
        rate += (target * Math.sign(velocity || 1) - rate) * 0.2;
        if (anim) anim.playbackRate = rate;
      };
      const relax = () => {
        rate += (1 - rate) * 0.05;
        if (anim) anim.playbackRate = rate;
      };
      lenis!.on("scroll", onScroll);
      gsap.ticker.add(relax);
      disposers.push(() => {
        lenis?.off("scroll", onScroll);
        gsap.ticker.remove(relax);
      });
    });

  });

  const mm = gsap.matchMedia();
  disposers.push(() => mm.revert());

  await step(() => {
    // ── Pinned statement with scrubbed word highlight ──────────────────────
    // Words start at 0.42 opacity so even the unlit state keeps 3:1 contrast.
    mm.add(MOTION, () => {
      $$("[data-scrub]").forEach((el) => {
        const split = SplitText.create(el, { type: "words", aria: "none" });
        const pin = el.closest<HTMLElement>("[data-pin]");
        const pinIt = pin && window.matchMedia("(min-width: 1024px) and (min-height: 680px)").matches;
        gsap.fromTo(
          split.words,
          { opacity: 0.42 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: pinIt
              ? { trigger: pin, start: "top top", end: "+=110%", pin: true, scrub: 0.6 }
              : { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        return () => split.revert();
      });
    });
  });

  await step(() => {
    // ── Horizontal scroll (desktop) ────────────────────────────────────────
    mm.add(DESKTOP, () => {
      $$("[data-hscroll]").forEach((section) => {
        const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
        const bar = section.querySelector<HTMLElement>("[data-hscroll-progress]");
        if (!track) return;
        section.classList.add("is-enhanced");
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (st) => bar && gsap.set(bar, { scaleX: st.progress }),
          },
        });
        // Images drift inside their frames as cards travel.
        $$("[data-hscroll-img]", track).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
        return () => section.classList.remove("is-enhanced");
      });
    });
  });

  await step(() => {
    // ── Stacking experience cards (only where they are sticky: lg + tall) ──
    mm.add(DESKTOP_STACK, () => {
      const cards = $$("[data-stack-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const shade = card.querySelector<HTMLElement>("[data-stack-shade]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 25%", scrub: true },
        });
        tl.to(card, { scale: 0.94, ease: "none" }, 0);
        if (shade) tl.to(shade, { opacity: 0.55, ease: "none" }, 0);
      });
    });

    // ── Line drawing ───────────────────────────────────────────────────────
    $$<SVGPathElement>("[data-draw]").forEach((path) => {
      const len = path.getTotalLength();
      gsap.fromTo(
        path,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: path.closest("section") ?? path,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    });
  });

  if (disposed) return dispose;

  // Triggers were created in batches, not page order: sort so pins above are
  // measured before the reveals below them, then measure once.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  // ── Pointer: magnetic buttons, tilt cards, custom cursor ─────────────────
  if (fine) disposers.push(initPointer());

  // Re-measure once fonts and late images settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const onLoad = () => ScrollTrigger.refresh();
  window.addEventListener("load", onLoad);
  disposers.push(() => window.removeEventListener("load", onLoad));

  return dispose;
}

function initPointer() {
  const cleanups: Array<() => void> = [];

  // Magnetic
  $$("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    const xTo = gsap.quickTo(el, "x", { duration: DUR.md, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: DUR.md, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "transform" });
    });
  });

  // Tilt + inner parallax
  $$("[data-tilt]").forEach((el) => {
    const inner = el.querySelector<HTMLElement>("[data-tilt-inner]");
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: DUR.md, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: DUR.md, ease: "power3.out" });
    const ix = inner && gsap.quickTo(inner, "x", { duration: DUR.md, ease: "power3.out" });
    const iy = inner && gsap.quickTo(inner, "y", { duration: DUR.md, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(py * -6);
      ry(px * 6);
      ix?.(px * -18);
      iy?.(py * -18);
    };
    const leave = () => {
      rx(0);
      ry(0);
      ix?.(0);
      iy?.(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });

  // Cursor: dot follows exactly, ring lags behind with a lerp.
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  const label = document.createElement("span");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  label.className = "cursor-label";
  label.textContent = "View";
  ring.appendChild(label);
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...mouse };
  const setDot = { x: gsap.quickSetter(dot, "x", "px"), y: gsap.quickSetter(dot, "y", "px") };
  const setRing = { x: gsap.quickSetter(ring, "x", "px"), y: gsap.quickSetter(ring, "y", "px") };
  let seen = false;

  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!seen) {
      // Only hide the native cursor once ours is actually tracking.
      seen = true;
      ringPos.x = mouse.x;
      ringPos.y = mouse.y;
      document.documentElement.classList.add("has-cursor");
      document.documentElement.dataset.cursor = "on";
    }
    setDot.x(mouse.x);
    setDot.y(mouse.y);
  };
  const tick = () => {
    const k = 1 - Math.pow(1 - 0.18, gsap.ticker.deltaRatio());
    ringPos.x += (mouse.x - ringPos.x) * k;
    ringPos.y += (mouse.y - ringPos.y) * k;
    setRing.x(ringPos.x);
    setRing.y(ringPos.y);
  };
  const over = (e: PointerEvent) => {
    const t = e.target as Element;
    const view = t.closest?.("[data-cursor='view']");
    const link = t.closest?.("a, button, [role='button'], label, summary");
    ring.dataset.state = view ? "view" : link ? "link" : "";
    dot.dataset.state = view || link ? "hide" : "";
  };
  const leaveWin = () => (document.documentElement.dataset.cursor = "off");
  const enterWin = () => seen && (document.documentElement.dataset.cursor = "on");
  const down = () => (ring.dataset.press = "true");
  const up = () => (ring.dataset.press = "false");

  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerover", over, { passive: true });
  document.documentElement.addEventListener("pointerleave", leaveWin);
  document.documentElement.addEventListener("pointerenter", enterWin);
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  gsap.ticker.add(tick);

  cleanups.push(() => {
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", over);
    document.documentElement.removeEventListener("pointerleave", leaveWin);
    document.documentElement.removeEventListener("pointerenter", enterWin);
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    gsap.ticker.remove(tick);
    dot.remove();
    ring.remove();
    document.documentElement.classList.remove("has-cursor");
    delete document.documentElement.dataset.cursor;
  });

  return () => cleanups.forEach((c) => c());
}
