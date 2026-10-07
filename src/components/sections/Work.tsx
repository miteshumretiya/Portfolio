import Image from "next/image";
import { projects, site } from "@/lib/content";
import { ArrowUpRight, Github } from "../Icons";

export default function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-hscroll
      className="relative overflow-clip border-t border-line bg-ink-2"
    >
      <div className="flex flex-col py-(--section-y) lg:min-h-svh lg:justify-center lg:pb-8 lg:pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="hscroll-viewport" role="region" tabIndex={0} aria-label="Selected work">
          <div
            data-hscroll-track
            className="container-x flex flex-col gap-14 lg:w-max lg:max-w-none lg:flex-row lg:items-start lg:gap-8 lg:px-(--edge)"
          >
            {/* Title panel: first stop of the track on desktop, a normal header on mobile */}
            <header className="flex flex-col gap-6 lg:w-[clamp(20rem,26vw,28rem)] lg:shrink-0 lg:self-stretch lg:justify-between lg:pr-6">
              <div>
                <p className="eyebrow flex items-center gap-3">
                  <span className="text-lime">(02)</span> Selected work
                </p>
                <h2 id="work-title" data-split className="mt-6 text-h2 font-semibold tracking-[-0.045em]">
                  Things I&apos;ve <span className="serif-accent text-lime">built.</span>
                </h2>
              </div>
              <p className="max-w-sm text-[0.98rem] leading-relaxed text-muted">
                Six projects, from computer vision to commerce.
                <span className="hidden lg:inline"> Keep scrolling and the row travels sideways.</span>
              </p>
            </header>

            <ol className="flex flex-col gap-14 lg:flex-row lg:gap-8">
              {projects.map((p, i) => (
                <li key={p.slug} className="lg:w-[clamp(22rem,min(40vw,calc((100svh_-_30rem)*1.6)),44rem)] lg:shrink-0">
                  <ProjectCard project={p} index={i} />
                </li>
              ))}
              <li className="lg:w-[clamp(18rem,22vw,24rem)] lg:shrink-0 lg:self-stretch">
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic="0.15"
                  className="group glass flex h-full min-h-64 flex-col justify-between gap-10 rounded-(--radius-xl) p-8 transition-colors duration-(--duration-2) hover:border-lime/50"
                >
                  <Github size={32} className="text-lime" />
                  <span>
                    <span className="block text-h3 font-medium tracking-[-0.03em]">
                      More experiments on <span className="serif-accent text-lime">GitHub</span>
                    </span>
                    <span className="mt-4 inline-flex items-center gap-2 text-muted transition-colors group-hover:text-text">
                      github.com/miteshumretiya
                      <ArrowUpRight size={16} className="transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45" />
                    </span>
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ol>
          </div>
        </div>

        <div className="container-x mt-6 hidden lg:block" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div data-hscroll-progress className="h-px origin-left scale-x-0 bg-lime" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p, index }: { project: (typeof projects)[number]; index: number }) {
  const Media = (
    <div data-tilt className="relative">
      <div
        data-reveal="clip"
        className="relative aspect-[4/3] overflow-hidden rounded-(--radius-xl) border border-line-strong bg-moss lg:aspect-[16/10]"
      >
        <div data-tilt-inner className="absolute -inset-4">
          <div data-hscroll-img className="absolute inset-y-0 -inset-x-[10%]">
            <Image
              src={p.image}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 44rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <span
          className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[0.75rem] font-medium tracking-[0.02em] text-text backdrop-blur"
        >
          {p.kind}
        </span>
      </div>
    </div>
  );

  return (
    <article className="flex h-full flex-col" aria-labelledby={`p-${p.slug}`}>
      {p.href ? (
        <a
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="view"
          tabIndex={-1}
          aria-hidden="true"
          className="block"
        >
          {Media}
        </a>
      ) : (
        Media
      )}
      <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 lg:mt-5">
        <span className="serif-accent pt-1 text-2xl text-faint">{String(index + 1).padStart(2, "0")}</span>
        <div className="min-w-0">
          <h3 id={`p-${p.slug}`} className="text-h3 font-semibold tracking-[-0.035em]">
            {p.title}
          </h3>
          <p className="mt-3 max-w-[38rem] text-muted lg:mt-2 lg:text-[0.95rem] lg:leading-normal">{p.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-2 lg:mt-4" aria-label="Stack">
            {p.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-line-strong px-3 py-1 text-[0.8rem] text-muted transition-colors duration-(--duration-1) hover:border-lime/50 hover:text-text"
              >
                {s}
              </li>
            ))}
          </ul>
          {p.href ? (
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex min-h-11 items-center gap-2 font-medium text-text"
            >
              <span className="bg-[linear-gradient(var(--color-lime),var(--color-lime))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-(--duration-2) ease-(--ease-out) group-hover:bg-[length:100%_1px]">
                {p.linkLabel}
              </span>
              <ArrowUpRight size={16} className="text-lime transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:rotate-45" />
              <span className="sr-only">: {p.title} (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
