import { Button, Heading } from "@modules/common/components/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
const Hero = () => {
  return (
    <section className="min-h-[70vh] w-full border-b border-stone-200 relative overflow-hidden bg-[#f2eadf]">
      <div className="absolute -right-24 -top-20 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-rose-200/50 blur-3xl" />
      <div className="content-container relative z-10 flex min-h-[70vh] flex-col justify-center py-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-amber-900">Original art · Made in India</p>
          <Heading
            level="h1"
            className="text-4xl leading-tight text-stone-950 font-normal small:text-6xl"
          >
            Art that makes a space feel like yours.
          </Heading>
          <p className="mt-6 max-w-xl text-base leading-7 text-stone-700 small:text-lg">Collect original paintings and drawings from our studio, or commission a personal artwork created around your story.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedClientLink href="/store"><Button size="large">Shop original art</Button></LocalizedClientLink>
            <LocalizedClientLink href="/custom-artwork"><Button size="large" variant="secondary">Request custom artwork</Button></LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
