import { certifications, education } from "@/lib/content";
import SectionHeader from "../SectionHeader";
import { Award, GraduationCap } from "../Icons";

// The one light section: warm Maltese limestone, for rhythm.
export default function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="relative bg-limestone text-limestone-ink section-y"
    >
      <div className="container-x">
        <SectionHeader
          id="education-title"
          index="05"
          label="Education"
          tone="light"
          title={
            <>
              Learning, <span className="serif-accent text-[#4a5a12]">on record.</span>
            </>
          }
          aside="A BSc in Malta and an engineering diploma in India, plus certifications from Deloitte, Google Cloud and Qualcomm."
        />

        <div className="mt-14 grid grid-cols-12 gap-4 lg:mt-20 lg:gap-6" data-reveal="up" data-stagger>
          {education.map((e, i) => (
            <article
              key={e.title}
              className="group col-span-12 flex flex-col justify-between gap-12 rounded-(--radius-xl) border border-[#d9cfbb] bg-[#f7f2e7] p-6 transition-[transform,box-shadow] duration-(--duration-2) ease-(--ease-out) hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(27_24_19/0.35)] sm:p-10 md:col-span-6"
            >
              <div className="flex items-start justify-between gap-6">
                <span className="grid size-12 place-items-center rounded-full bg-limestone-ink text-limestone">
                  <GraduationCap size={22} />
                </span>
                <span className="serif-accent text-right text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-none text-[#4a5a12]">
                  {i === 0 ? "2026" : "8.9"}
                </span>
              </div>
              <div>
                <p className="eyebrow text-[#5b5446]">{e.period}</p>
                <h3 className="mt-3 text-h3 font-semibold tracking-[-0.03em]">{e.title}</h3>
                <p className="mt-2 text-lead text-[#3d372d]">
                  {e.school} <span className="text-[#6b6354]">· {e.place}</span>
                </p>
                <p className="mt-5 max-w-[36rem] border-t border-[#d9cfbb] pt-5 text-[#4d473b]">{e.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-28">
          <h3 className="eyebrow col-span-12 text-[#5b5446] lg:col-span-3">Certifications</h3>
          <ol className="col-span-12 lg:col-span-9" data-reveal="up" data-stagger>
            {certifications.map((c, i) => (
              <li
                key={c.title}
                className="group relative grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-1 overflow-hidden border-t border-[#d1c6b0] py-6 last:border-b sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-limestone-ink transition-transform duration-(--duration-3) ease-(--ease-out) group-hover:scale-y-100"
                />
                <span className="serif-accent relative text-xl text-[#6b6354] transition-colors duration-(--duration-2) group-hover:text-lime">
                  0{i + 1}
                </span>
                <span className="relative text-[clamp(1.15rem,1rem+0.8vw,1.75rem)] font-medium leading-tight tracking-[-0.02em] transition-[color,transform] duration-(--duration-2) ease-(--ease-out) group-hover:translate-x-2 group-hover:text-limestone">
                  {c.title}
                </span>
                <span className="relative col-start-2 flex items-center gap-2 text-sm text-[#5b5446] transition-colors duration-(--duration-2) group-hover:text-[#cfc6b3] sm:col-start-3 sm:row-start-1">
                  <Award size={16} />
                  {c.issuer}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
