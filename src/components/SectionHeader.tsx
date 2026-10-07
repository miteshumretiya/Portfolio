import type { ReactNode } from "react";

type Props = {
  index: string;
  label: string;
  title: ReactNode;
  id: string;
  aside?: ReactNode;
  tone?: "dark" | "light";
};

export default function SectionHeader({ index, label, title, id, aside, tone = "dark" }: Props) {
  const muted = tone === "dark" ? "text-muted" : "text-[#5b5446]";
  return (
    <div className="grid grid-cols-12 items-end gap-x-6 gap-y-6">
      <p className={`eyebrow col-span-12 flex items-center gap-3 lg:col-span-3 lg:self-start lg:pt-3 ${muted}`}>
        <span className={tone === "dark" ? "text-lime" : "text-[#4a5a12]"}>({index})</span>
        {label}
      </p>
      <h2
        id={id}
        data-split
        className="col-span-12 text-h2 font-semibold tracking-[-0.045em] lg:col-span-6"
      >
        {title}
      </h2>
      {aside ? (
        <div className={`col-span-12 max-w-md text-[0.98rem] leading-relaxed lg:col-span-3 ${muted}`}>{aside}</div>
      ) : null}
    </div>
  );
}
