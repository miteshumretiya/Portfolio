import type { CSSProperties } from "react";
import { experience } from "@/lib/content";
import SectionHeader from "../SectionHeader";

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="relative section-y">
      <div className="container-x">
        <SectionHeader
          id="experience-title"
          index="03"
          label="Experience"
          title={
            <>
              Where I&apos;ve <span className="serif-accent text-lime">worked.</span>
            </>
          }
          aside="Two internships in Gujarat: one keeping a live telecom network healthy, one shipping websites for real clients."
        />

        <ol className="mt-14 flex flex-col gap-6 lg:mt-20 lg:gap-[28vh]">
          {experience.map((job, i) => (
            <li
              key={job.company}
              data-stack-card
              className="origin-top lg:tall:sticky lg:tall:top-[calc(var(--nav-h)+2rem+var(--i)*1.5rem)]"
              style={{ "--i": i } as CSSProperties}
            >
              <article className="relative grid grid-cols-12 gap-x-6 gap-y-8 overflow-hidden rounded-(--radius-xl) border border-line-strong bg-[linear-gradient(160deg,var(--color-moss-2),var(--color-ink-2))] p-6 shadow-(--shadow-lift) sm:p-10 lg:p-12">
                <Decoration variant={i} />
                <div className="relative col-span-12 flex flex-col justify-between gap-6 lg:col-span-4">
                  <div>
                    <p className="eyebrow text-lime">{job.period}</p>
                    <p className="mt-2 text-sm text-muted">{job.place}</p>
                  </div>
                  <span className="serif-accent hidden text-[7rem] leading-none text-line-strong lg:block" aria-hidden="true">
                    0{i + 1}
                  </span>
                </div>
                <div className="relative col-span-12 min-w-0 lg:col-span-8">
                  <h3 className="text-[clamp(1.85rem,1.2rem+2.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                    {job.role}
                  </h3>
                  <p className="mt-3 text-lead">
                    <span className="serif-accent text-lime">at</span> {job.company}
                  </p>
                  <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-muted">
                    {job.points.map((pt) => (
                      <li key={pt} className="grid grid-cols-[1rem_1fr] gap-3">
                        <span className="mt-[0.6rem] size-1.5 rounded-full bg-lime" aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label="Skills used">
                    {job.tags.map((t) => (
                      <li key={t} className="rounded-full bg-text/5 px-3 py-1 text-[0.8rem] text-text">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-stack-shade className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Decoration({ variant }: { variant: number }) {
  if (variant === 0) {
    // Network: nodes and links
    const nodes: Array<[number, number]> = [
      [40, 60], [140, 30], [230, 90], [120, 140], [260, 190], [180, 230], [60, 200],
    ];
    const links = [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4], [3, 5], [5, 4], [3, 6], [6, 5]];
    return (
      <svg viewBox="0 0 300 260" className="pointer-events-none absolute -right-10 -top-6 w-[22rem] opacity-30" aria-hidden="true">
        {links.map(([a, b]) => (
          <line key={`${a}${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#c6f432" strokeWidth="1" />
        ))}
        {nodes.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="4" fill="#c6f432" />
        ))}
      </svg>
    );
  }
  // Web: stacked browser frames
  return (
    <svg viewBox="0 0 300 260" className="pointer-events-none absolute -right-8 -top-4 w-[22rem] opacity-25" aria-hidden="true">
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${30 + k * 26} ${30 + k * 30})`} fill="none" stroke="#c6f432" strokeWidth="1">
          <rect width="200" height="130" rx="12" />
          <line x1="0" y1="24" x2="200" y2="24" />
          <circle cx="14" cy="12" r="3" />
          <circle cx="26" cy="12" r="3" />
        </g>
      ))}
    </svg>
  );
}
