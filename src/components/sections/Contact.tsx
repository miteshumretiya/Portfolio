import { nav, site } from "@/lib/content";
import Button from "../Button";
import CopyEmail from "../CopyEmail";
import MaltaClock from "../MaltaClock";
import { Mark } from "../Brand";
import { ArrowUp, ArrowUpRight, Mail } from "../Icons";

export default function Contact() {
  return (
    <footer id="site-footer" className="relative overflow-clip bg-ink">
      <section id="contact" aria-labelledby="contact-title" className="container-x section-y">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-lime">(06)</span> Contact
        </p>
        <h2
          id="contact-title"
          data-reveal="up"
          className="mt-8 max-w-[15ch] text-[clamp(2.75rem,1.2rem+7vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.05em]"
        >
          Let&apos;s build something{" "}
          <span className="relative inline-block">
            <span className="serif-accent text-lime">reliable.</span>
            <svg
              viewBox="0 0 400 24"
              preserveAspectRatio="none"
              className="absolute -bottom-[0.08em] left-0 h-[0.14em] w-full"
              aria-hidden="true"
            >
              <path
                data-draw
                d="M2 16 C 80 4, 160 22, 240 10 S 360 6, 398 14"
                fill="none"
                stroke="var(--color-lime)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-10 lg:mt-20">
          <div className="col-span-12 lg:col-span-7">
            <p className="max-w-[34rem] text-lead text-muted">
              I&apos;m looking for graduate roles in web development, networking or IT support, in Malta, across the EU or remote.
              If you&apos;re hiring, or just want to talk shop, my inbox is open.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${site.email}?subject=Hello%20Mitesh`} icon={<Mail size={16} />}>
                Email me
              </Button>
              <CopyEmail email={site.email} />
            </div>
          </div>

          <dl className="col-span-12 grid gap-6 self-end sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 xl:grid-cols-2">
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">Email</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="break-all text-text underline decoration-lime/50 underline-offset-4 transition-colors hover:text-lime"
                >
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">Local time</dt>
              <dd className="mt-2 text-text">
                {site.location} · <MaltaClock />
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">Elsewhere</dt>
              <dd className="mt-1 flex flex-wrap gap-x-6">
                {[
                  { label: "GitHub", href: site.github },
                  { label: "LinkedIn", href: site.linkedin },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center gap-1.5 text-text transition-colors hover:text-lime"
                  >
                    {l.label}
                    <ArrowUpRight size={14} className="transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="eyebrow">Status</dt>
              <dd className="mt-2 flex items-center gap-2 text-text">
                <span className="size-2 rounded-full bg-lime" aria-hidden="true" /> Available now
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Giant wordmark: decorative SVG text, scales exactly to the container */}
      <div className="container-x" aria-hidden="true">
        <svg data-parallax="0.12" viewBox="0 0 1000 158" className="block h-auto w-full select-none" focusable="false">
          <text
            x="500"
            y="128"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            fill="#1a2a1f"
            style={{ font: "600 150px var(--font-sans)", letterSpacing: "-0.06em" }}
          >
            Mitesh{" "}
            <tspan style={{ font: "italic 400 160px var(--font-serif)", letterSpacing: "-0.03em" }}>Umretiya</tspan>
          </text>
        </svg>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-6 border-t border-line py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-sm text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Mark size={22} className="text-text" />
            <span>© 2026 {site.name}. Built with Next.js, GSAP and a field of grass.</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="flex min-h-11 items-center transition-colors hover:text-text">
                {n.label}
              </a>
            ))}
            <a
              href="#top"
              data-magnetic
              className="group ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-text transition-colors hover:border-lime md:ml-2"
            >
              Back to top
              <ArrowUp size={14} className="transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:-translate-y-0.5" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
