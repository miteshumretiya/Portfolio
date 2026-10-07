import Image from "next/image";
import type { CSSProperties } from "react";
import { hero, site } from "@/lib/content";
import FieldBackground from "../FieldBackground";
import MaltaClock from "../MaltaClock";
import Button from "../Button";
import { Bloom } from "../Brand";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin } from "../Icons";
import featured from "../../../public/images/work/artisanbazaar.webp";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-clip">
      <FieldBackground />
      {/* Legibility: darken toward the copy and fade into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_0%_100%,rgb(7_11_8/0.92)_10%,rgb(7_11_8/0.35)_60%,transparent_100%),linear-gradient(to_bottom,rgb(7_11_8/0.25),transparent_30%,transparent_70%,var(--color-ink))]"
      />

      <div className="container-x grid min-h-svh grid-cols-12 items-end gap-x-6 gap-y-12 pb-10 pt-[calc(var(--nav-h)+3.5rem)] lg:gap-y-0 lg:pb-14">
        {/* Copy */}
        <div className="col-span-12 [container-type:inline-size] lg:col-span-7 lg:pb-2">
          <p className="eyebrow fade-up flex items-center gap-3" style={i(0)}>
            <span className="hidden h-px w-8 bg-lime xs:block" aria-hidden="true" />
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(3.5rem,25cqi,13rem)] font-semibold leading-[0.86] tracking-[-0.055em]"
          >
            <span className="reveal-line">
              <span className="reveal-word" style={i(0)}>
                Mitesh
              </span>
            </span>
            <span className="reveal-line">
              <span className="reveal-word serif-accent text-[1.08em] tracking-[-0.03em] text-lime" style={i(1)}>
                Umretiya
              </span>
            </span>
          </h1>

          <p
            className="fade-up mt-8 max-w-[34rem] text-lead text-muted"
            style={i(1)}
          >
            <span className="text-text">{site.role}.</span> {hero.intro}
          </p>

          <div className="fade-up mt-9 flex flex-wrap items-center gap-3" style={i(2)}>
            <Button href="#work" icon={<ArrowDown size={16} />}>
              See selected work
            </Button>
            <Button href="#contact" variant="ghost" icon={<ArrowUpRight size={16} />}>
              Get in touch
            </Button>
          </div>
        </div>

        {/* Bento */}
        <div className="col-span-12 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5 lg:pb-2">
          {/* Profile */}
          <article
            className="glass fade-up col-span-2 rounded-(--radius-lg) p-5 sm:p-6"
            style={i(3)}
            aria-label="Profile"
          >
            <div className="flex items-start gap-4">
              <Bloom size={72} className="bloom-hover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold leading-tight tracking-[-0.02em]">{site.name}</p>
                <p className="mt-1 text-sm text-muted">{site.shortRole}</p>
                <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-[0.75rem] leading-snug text-lime">
                  <span className="size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
                  {hero.status}
                </p>
              </div>
            </div>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{hero.bio}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <ul className="flex gap-2" aria-label="Social links">
                {[
                  { href: site.github, label: "GitHub", Icon: Github, ext: true },
                  { href: site.linkedin, label: "LinkedIn", Icon: Linkedin, ext: true },
                  { href: `mailto:${site.email}`, label: "Email", Icon: Mail, ext: false },
                ].map(({ href, label, Icon, ext }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={ext ? `${label} (opens in a new tab)` : label}
                      {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      data-magnetic
                      className="grid size-11 place-items-center rounded-full border border-line-strong text-text transition-[background-color,color,border-color] duration-(--duration-2) hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} className="text-lime" />
                {site.location}
                <span aria-hidden="true">·</span>
                <MaltaClock className="text-text" />
              </p>
            </div>
          </article>

          {/* Link cards */}
          <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1 sm:grid-cols-1 sm:gap-4">
            <LinkCard
              href={site.github}
              title="Code, coursework & experiments"
              domain="github.com/miteshumretiya"
              icon={<Github size={20} />}
              iconClass="bg-text text-ink"
              style={i(4)}
            />
            <LinkCard
              href={site.linkedin}
              title="Air Canvas demo & updates"
              domain="linkedin.com/in/miteshumretiya"
              icon={<Linkedin size={20} />}
              iconClass="bg-[#0a66c2] text-white"
              style={i(5)}
            />
          </div>

          {/* Featured */}
          <a
            href="https://artisanbazaar.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            className="fade-up group relative col-span-2 block aspect-[16/10] overflow-hidden rounded-(--radius-lg) border border-line-strong sm:col-span-1 sm:aspect-auto sm:min-h-64"
            style={i(6)}
          >
            <Image
              src={featured}
              alt="ArtisanBazaar storefront, a marketplace for Maltese makers"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover object-left-top transition-transform duration-(--duration-4) ease-(--ease-out) group-hover:scale-[1.06]"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(7_11_8/0.85),transparent_55%)]" aria-hidden="true" />
            <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/70 text-text backdrop-blur transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
            <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <span className="rounded-full bg-limestone px-3 py-1.5 text-[0.78rem] font-medium text-limestone-ink">
                Live project
              </span>
              <span className="truncate text-sm font-medium text-text">ArtisanBazaar</span>
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function LinkCard({
  href,
  title,
  domain,
  icon,
  iconClass,
  style,
}: {
  href: string;
  title: string;
  domain: string;
  icon: React.ReactNode;
  iconClass: string;
  style: CSSProperties;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass fade-up group flex min-h-36 flex-col justify-between gap-6 rounded-(--radius-lg) p-4 transition-[border-color,transform] duration-(--duration-2) ease-(--ease-out) hover:-translate-y-1 hover:border-lime/40 sm:p-5"
      style={style}
    >
      <span className="flex items-start justify-between">
        <span className={`grid size-10 place-items-center rounded-xl ${iconClass}`}>{icon}</span>
        <ArrowUpRight
          size={18}
          className="text-faint transition-[transform,color] duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45 group-hover:text-lime"
        />
      </span>
      <span>
        <span className="block text-[0.95rem] font-medium leading-snug">{title}</span>
        <span className="mt-1.5 block truncate text-[0.78rem] text-faint">{domain}</span>
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
