import { marquee } from "@/lib/content";

// Decorative ticker; the same skills are listed properly in the Toolkit section.
export default function Marquee() {
  const row = (
    <ul className="flex shrink-0 items-center">
      {marquee.map((word, i) => (
        <li key={word} className="flex items-center">
          <span
            className={
              i % 2
                ? "serif-accent px-6 text-lime sm:px-10"
                : "px-6 font-semibold tracking-[-0.04em] text-text sm:px-10"
            }
          >
            {word}
          </span>
          <span className="size-[0.22em] shrink-0 rotate-45 bg-lime/70" />
        </li>
      ))}
    </ul>
  );

  return (
    <div aria-hidden="true" className="relative overflow-clip border-y border-line bg-ink py-6 sm:py-10">
      <div data-velocity className="will-change-transform">
        <div className="marquee__track text-[clamp(2.25rem,1.2rem+4.5vw,5.5rem)] leading-[1.1]">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}
