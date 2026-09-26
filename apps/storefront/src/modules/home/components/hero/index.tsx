import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="grid min-h-[680px] small:grid-cols-[minmax(360px,42%)_1fr]">
        <div className="flex items-center px-[var(--page-gutter)] py-20 small:py-24">
          <div className="max-w-[610px]">
            <p className="editorial-kicker mb-7">Original art for meaningful spaces</p>
            <h1 className="editorial-title">Art that makes a room feel yours.</h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[var(--color-muted)] small:text-lg">
              Discover original paintings and drawings, or commission a one-of-a-kind artwork created around your story.
            </p>
            <div className="mt-9 flex flex-col gap-3 xsmall:flex-row">
              <LocalizedClientLink href="/store" className="theme-button-primary">Explore originals</LocalizedClientLink>
              <LocalizedClientLink href="/custom-artwork" className="theme-button-secondary">Commission an artwork</LocalizedClientLink>
            </div>
            <blockquote className="mt-14 border-l border-[var(--color-line)] pl-5 font-display text-lg italic text-[var(--color-muted)]">
              “Art turns houses into homes.”
            </blockquote>
          </div>
        </div>
        <div className="relative min-h-[460px] small:min-h-full">
          <Image
            src="/images/home/gallery-quiet-hero.png"
            alt="Original figurative artwork displayed in a warm, sunlit home"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 58vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
