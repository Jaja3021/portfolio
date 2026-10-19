import Image from "next/image";
import Link from "next/link";
import { ACCREDITED_DEVELOPERS } from "@/config/developers";
import { SITE_CONFIG } from "@/config/site";

/** Short "About Arnold" block plus one static row of accredited developer logos. */
export function AboutStrip() {
  return (
    <section id="about-arnold" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[16rem_1fr]">
          {/* TODO: real photo of Arnold at site — replace this placeholder with next/image. */}
          <div className="flex aspect-[4/5] w-full max-w-[16rem] items-center justify-center rounded-xl border border-dashed border-border bg-background-secondary p-4 text-center text-sm text-muted">
            [TODO: real photo of Arnold at site]
          </div>

          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
              About Arnold
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              [TODO: 2–3 sentence bio from Arnold, written in first person — who he helps, where he works, and
              why buyers work with him.]
            </p>
            <p className="mt-4 text-sm text-foreground">
              Arnold B. Fadriquila, RES · {SITE_CONFIG.prcLicense}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              More about Arnold →
            </Link>
          </div>
        </div>

        {/* Only include developers Arnold is officially accredited with (src/config/developers.ts). */}
        <div className="mt-14 border-t border-border pt-10">
          <h3 className="text-sm font-medium text-muted">Accredited developer partners</h3>
          <ul className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
            {ACCREDITED_DEVELOPERS.map((d) => (
              <li key={d.name}>
                <Image
                  src={d.logo}
                  alt={d.name}
                  sizes="160px"
                  className="h-10 w-auto max-w-[160px] object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
