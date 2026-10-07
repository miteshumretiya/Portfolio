import { toolkit } from "@/lib/content";
import SectionHeader from "../SectionHeader";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

export default function Toolkit() {
  return (
    <section
      id="toolkit"
      aria-labelledby="toolkit-title"
      className="toolkit relative border-t border-line bg-ink-2 section-y"
    >
      <div className="container-x">
        <SectionHeader
          id="toolkit-title"
          index="04"
          label="Toolkit"
          title={
            <>
              Tools of the <span className="serif-accent text-lime">trade.</span>
            </>
          }
          aside={
            <>
              Five clusters, one network.
              <span className="hidden pointer-fine:inline"> Hover a group to light up its node.</span>
            </>
          }
        />

        <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-10 lg:mt-20">
          <div className="glass relative col-span-12 overflow-hidden rounded-(--radius-xl) p-4 sm:p-8 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:col-span-6 lg:self-start">
            <Topology />
          </div>

          <ul className="col-span-12 grid gap-3 sm:grid-cols-2 lg:col-span-6" data-reveal="up" data-stagger>
            {toolkit.map((g, i) => (
              <li
                key={g.group}
                data-group={slug(g.group)}
                className={`group glass rounded-(--radius-lg) p-6 transition-[border-color,transform] duration-(--duration-2) ease-(--ease-out) hover:-translate-y-1 hover:border-lime/50 ${i === toolkit.length - 1 ? "sm:col-span-2" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{g.group}</h3>
                  <span className="serif-accent text-faint transition-colors group-hover:text-lime">0{i + 1}</span>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-line-strong px-3 py-1.5 text-[0.85rem] text-muted transition-colors duration-(--duration-1) group-hover:text-text"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Topology() {
  const cx = 220;
  const cy = 220;
  const R = 140;
  const groups = toolkit.map((g, i) => {
    const a = (-90 + i * 72) * (Math.PI / 180);
    return { ...g, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a };
  });
  const round = (n: number) => Math.round(n * 10) / 10;

  return (
    <svg viewBox="0 0 440 440" className="mx-auto h-auto w-full max-w-[34rem]" role="img" aria-labelledby="topo-title">
      <title id="topo-title">{`Skill clusters drawn as a network around Mitesh: ${toolkit.map((g) => g.group).join(", ")}`}</title>
      {/* rings */}
      {[70, 140, 200].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="rgb(214 245 214 / 0.08)" strokeDasharray="2 6" />
      ))}
      {groups.map((g, i) => {
        const path = `M ${cx} ${cy} L ${round(g.x)} ${round(g.y)}`;
        const leaves = g.items.slice(0, 3).map((_, k) => {
          const la = g.a + (k - 1) * 0.32;
          return { x: round(cx + Math.cos(la) * 198), y: round(cy + Math.sin(la) * 198) };
        });
        return (
          <g key={g.group} data-node={slug(g.group)} className="topo-node">
            <path d={path} stroke="rgb(198 244 50 / 0.35)" strokeWidth="1.2" className="topo-link" />
            {leaves.map((l, k) => (
              <g key={k}>
                <line x1={round(g.x)} y1={round(g.y)} x2={l.x} y2={l.y} stroke="rgb(214 245 214 / 0.18)" />
                <circle cx={l.x} cy={l.y} r="3" fill="rgb(214 245 214 / 0.45)" />
              </g>
            ))}
            <circle r="3.5" fill="#c6f432" className="packet" style={{ offsetPath: `path("${path}")`, ["--d" as string]: `${i * 0.7}s` }} />
            <circle cx={round(g.x)} cy={round(g.y)} r="8" fill="none" stroke="#c6f432" className="pulse-ring" style={{ ["--d" as string]: `${i * 0.5}s` }} />
            <circle cx={round(g.x)} cy={round(g.y)} r="8" className="topo-dot" fill="#0f1a12" stroke="#c6f432" strokeWidth="2" />
            <g className="topo-label">
              <rect
                x={round(cx + Math.cos(g.a) * 100 - (g.group.length * 7 + 20) / 2)}
                y={round(cy + Math.sin(g.a) * 100 - 12)}
                width={g.group.length * 7 + 20}
                height="24"
                rx="12"
                fill="#0f1a12"
                stroke="rgb(214 245 214 / 0.2)"
              />
              <text
                x={round(cx + Math.cos(g.a) * 100)}
                y={round(cy + Math.sin(g.a) * 100 + 4.5)}
                textAnchor="middle"
                fill="#eef3ea"
                fontSize="12.5"
                fontWeight="500"
              >
                {g.group}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="34" fill="#c6f432" />
      <text x={cx} y={cy + 9} textAnchor="middle" fill="#070b08" style={{ font: "italic 26px var(--font-serif)" }}>
        MU
      </text>
    </svg>
  );
}
