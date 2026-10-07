import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Toolkit from "@/components/sections/Toolkit";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import ClientEffects from "@/components/ClientEffects";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Toolkit />
        <Education />
      </main>
      <Contact />
      {/* Last in the tree: its effect runs once every section above has hydrated. */}
      <ClientEffects />
    </>
  );
}
