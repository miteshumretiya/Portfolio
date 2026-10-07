import { about } from "@/lib/content";
import SectionHeader from "../SectionHeader";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      {/* Pinned statement (desktop) — words light up as you scroll */}
      <div data-pin className="container-x flex min-h-[80svh] flex-col justify-center py-(--section-y) lg:min-h-svh">
        <SectionHeader
          id="about-title"
          index="01"
          label="About"
          title={
            <>
              Software, meet <span className="serif-accent text-lime">infrastructure.</span>
            </>
          }
        />
        <div className="mt-12 grid grid-cols-12 gap-x-6 lg:mt-16">
          <p
            data-scrub
            className="col-span-12 text-[clamp(1.6rem,1rem+2.4vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.03em] lg:col-span-9 lg:col-start-4"
          >
            {about.statement}
          </p>
        </div>
      </div>

      <div className="container-x pb-(--section-y)">
        {/* Counters */}
        <dl
          data-reveal="up"
          data-stagger
          className="grid grid-cols-2 border-t border-line lg:grid-cols-4"
        >
          {about.stats.map((s, idx) => (
            <div
              key={s.label}
              className={`flex flex-col gap-3 border-b border-line py-8 pr-4 lg:border-b-0 lg:py-10 lg:pl-6 ${idx % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${idx > 0 ? "lg:border-l" : "lg:pl-0"} ${idx % 2 === 1 ? "border-l lg:border-l" : ""}`}
            >
              <dt className="order-2 max-w-[16rem] text-sm leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 flex items-baseline text-[clamp(2.75rem,1.6rem+4.6vw,6rem)] font-semibold leading-none tracking-[-0.05em]">
                <span className="tabular" data-counter={s.value} data-decimals={s.decimals}>
                  {s.value.toFixed(s.decimals)}
                </span>
                <span className="serif-accent ml-1 text-[0.55em] font-normal text-lime">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>

        {/* Route + principles */}
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-12 lg:mt-24">
          <figure className="glass col-span-12 self-start overflow-hidden rounded-(--radius-xl) lg:col-span-5" data-reveal="up">
            <RouteMap />
            <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line px-6 py-5 text-sm text-muted">
              <span>
                Gujarat, India <span className="text-lime" aria-hidden="true">→</span>
                <span className="sr-only"> to </span> Marsa, Malta
              </span>
              <span className="tabular text-text">≈ 5,700 km</span>
            </figcaption>
          </figure>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">How I work</p>
            <ol className="mt-6" data-reveal="up" data-stagger>
              {about.principles.map((p, idx) => (
                <li
                  key={p.title}
                  className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-line py-7 last:border-b"
                >
                  <span className="serif-accent pt-1 text-xl text-lime">0{idx + 1}</span>
                  <div>
                    <h3 className="text-h3 font-medium tracking-[-0.03em] transition-transform duration-(--duration-2) ease-(--ease-out) group-hover:translate-x-2">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[34rem] text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// Dot-matrix map with a packet travelling the route between the two nodes.
function RouteMap() {
  const route = "M 70 118 C 150 20, 290 40, 340 150";
  return (
    <svg viewBox="0 0 420 230" className="h-auto w-full" role="img" aria-labelledby="route-title">
      <title id="route-title">A route drawn from Gujarat, India to Marsa, Malta</title>
      <defs>
        <pattern id="route-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="1.6" fill="rgb(214 245 214 / 0.22)" />
        </pattern>
        <radialGradient id="route-fade" cx="50%" cy="55%" r="60%">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="route-mask">
          <rect width="420" height="230" fill="url(#route-fade)" />
        </mask>
      </defs>
      <rect width="420" height="230" fill="url(#route-dots)" mask="url(#route-mask)" />
      <path d={route} fill="none" stroke="rgb(198 244 50 / 0.35)" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle r="4" fill="#c6f432" className="packet" style={{ offsetPath: `path("${route}")` }} />
      <circle r="4" fill="#c6f432" className="packet" style={{ offsetPath: `path("${route}")`, ["--d" as string]: "1.8s" }} />
      {[
        { x: 70, y: 118, label: "Malta", anchor: "start" as const, dx: -6, dy: 26 },
        { x: 340, y: 150, label: "Gujarat", anchor: "end" as const, dx: 6, dy: 26 },
      ].map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="5" fill="none" stroke="#c6f432" className="pulse-ring" />
          <circle cx={n.x} cy={n.y} r="5" fill="#c6f432" />
          <text x={n.x + n.dx} y={n.y + n.dy} textAnchor={n.anchor} fill="#eef3ea" fontSize="13" fontWeight="500">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
