import type { Metadata } from "next";
import Button from "@/components/Button";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="container-x grid min-h-svh place-content-center gap-8 py-32 text-center">
      <p className="eyebrow text-lime">404 · Packet lost</p>
      <h1 className="text-h2 font-semibold tracking-[-0.045em]">
        This route <span className="serif-accent text-lime">doesn&apos;t resolve.</span>
      </h1>
      <p className="mx-auto max-w-md text-muted">
        The page you asked for isn&apos;t on this network. Head back and pick another path.
      </p>
      <div className="flex justify-center">
        <Button href="/" icon={<ArrowRight size={16} />}>
          Back to the homepage
        </Button>
      </div>
    </main>
  );
}
