"use client";

import { useEffect, useId, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import { Mark } from "./Brand";
import { ArrowUpRight, Close, Menu } from "./Icons";

type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: string | HTMLElement, o?: object) => void };
declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const menuId = useId();

  // Hide on scroll down, reveal on scroll up, densify after the hero.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) > 4) {
        el.dataset.hidden = String(delta > 0 && y > 160);
        lastY = y;
      }
      el.dataset.solid = String(y > window.innerHeight * 0.75);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = ["#top", ...nav.map((n) => n.href)]
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((s): s is HTMLElement => Boolean(s));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(e.target.id === "top" ? "" : `#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock scroll, make the page inert, trap Escape.
  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    if (open) {
      document.documentElement.style.overflow = "hidden";
      window.__lenis?.stop();
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      headerRef.current?.setAttribute("data-hidden", "false");
      requestAnimationFrame(() => firstLinkRef.current?.focus());
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    document.documentElement.style.overflow = "";
    window.__lenis?.start();
    main?.removeAttribute("inert");
    footer?.removeAttribute("inert");
  }, [open]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Focus moves to the target section (handled by the anchor logic in lib/motion).
  const onMobileLink = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        data-hidden="false"
        data-solid="false"
        className="group/nav fixed inset-x-0 top-0 z-50 pt-[max(0.75rem,env(safe-area-inset-top))] transition-transform duration-(--duration-3) ease-(--ease-out) data-[hidden=true]:-translate-y-[130%]"
      >
        <div className="container-x">
          <nav
            aria-label="Primary"
            className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-line-strong bg-[rgb(10_17_12/0.5)] pl-3 pr-2 shadow-(--shadow-glass) backdrop-blur-[18px] backdrop-saturate-150 transition-colors duration-(--duration-2) group-data-[solid=true]/nav:bg-[rgb(9_14_10/0.82)] lg:h-[3.75rem] lg:pl-4"
          >
            <a
              href="#top"
              className="flex min-h-11 items-center gap-2.5 rounded-xl pr-2 text-[0.95rem] font-medium tracking-[-0.01em] text-text"
              aria-label={`${site.name}, back to top`}
            >
              <Mark size={26} className="text-text" />
              <span>{site.name}</span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={active === item.href ? "true" : undefined}
                    className="group relative flex min-h-11 items-center rounded-full px-4 text-[0.9rem] text-muted transition-colors duration-(--duration-1) hover:text-text aria-[current=true]:text-text"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-[calc(50%+0.85rem)] size-1 -translate-x-1/2 scale-0 rounded-full bg-lime transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:scale-100 group-aria-[current=true]:scale-100"
                    />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 pr-2 text-[0.8rem] text-muted xl:flex">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime/70 motion-reduce:animate-none" />
                  <span className="relative size-2 rounded-full bg-lime" />
                </span>
                Available for work
              </span>
              <a
                href="#contact"
                data-magnetic
                className="hidden min-h-11 items-center gap-2 rounded-xl bg-lime px-4 text-[0.9rem] font-medium text-ink transition-shadow duration-(--duration-2) hover:shadow-(--shadow-glow) lg:inline-flex"
              >
                Let&apos;s talk <ArrowUpRight size={16} />
              </a>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((o) => !o)}
                className="grid size-11 place-items-center rounded-xl border border-line-strong text-text transition-colors hover:border-lime/60 lg:hidden"
              >
                {open ? <Close size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id={menuId}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        className="group/menu fixed inset-0 z-40 flex flex-col bg-[rgb(7_11_8/0.94)] px-[max(var(--gutter),env(safe-area-inset-left))] pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--nav-h)+2.5rem)] opacity-0 transition-opacity data-[open=true]:backdrop-blur-xl duration-(--duration-2) ease-(--ease-out) data-[open=true]:opacity-100 data-[open=false]:pointer-events-none lg:hidden"
      >
        <p className="eyebrow">Menu</p>
        <ul className="mt-6 flex flex-col">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={item.href}
                onClick={onMobileLink}
                style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
                className="flex min-h-16 translate-y-full items-center justify-between py-3 text-[clamp(2.25rem,9vw,3.5rem)] font-medium leading-none tracking-[-0.04em] text-text transition-transform duration-(--duration-3) ease-(--ease-out) group-data-[open=true]/menu:translate-y-0"
              >
                {item.label}
                <span className="serif-accent text-lg text-faint">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
        <div
          className="mt-auto flex flex-col gap-3 pt-10 opacity-0 transition-opacity delay-300 duration-(--duration-3) group-data-[open=true]/menu:opacity-100"
        >
          <a href={`mailto:${site.email}`} className="min-h-11 break-all text-lg text-text underline decoration-lime/60 underline-offset-4">
            {site.email}
          </a>
          <div className="flex gap-6 text-muted">
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center">
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
