import { Mark } from "./Brand";

// Pure CSS: counts to 100 and lifts away in ~1.45s. It never blocks input,
// never waits on JS, and is skipped entirely for reduced-motion users.
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <Mark size={56} className="preloader__mark text-text" />
      <div className="flex w-full items-end justify-between gap-6">
        <span className="preloader__count" />
        <span className="eyebrow hidden pb-2 sm:block">Mitesh Umretiya / Portfolio 2026</span>
      </div>
      <span className="preloader__bar" />
    </div>
  );
}
