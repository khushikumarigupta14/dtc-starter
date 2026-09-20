import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Section = { title: string; body: React.ReactNode }

export default function EditorialPage({ eyebrow, title, intro, sections, cta }: { eyebrow: string; title: string; intro: string; sections: Section[]; cta?: { label: string; href: string } }) {
  return (
    <main className="overflow-hidden">
      <header className="relative border-b border-stone-300 bg-[#efe4d3] py-20 small:py-28">
        <div aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-amber-600/15 blur-3xl" />
        <div className="content-container relative max-w-5xl">
          <p className="editorial-kicker">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl text-5xl leading-[1.02] tracking-[-0.035em] text-stone-950 small:text-7xl">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-700">{intro}</p>
        </div>
      </header>
      <div className="content-container max-w-5xl py-16 small:py-24">
        <div className="grid gap-px overflow-hidden border border-stone-300 bg-stone-300 small:grid-cols-2">
          {sections.map((section, index) => <section key={section.title} className="bg-[#fffdf8] p-7 small:p-10"><span className="text-xs tracking-[0.2em] text-amber-800">0{index + 1}</span><h2 className="mt-4 text-2xl text-stone-950">{section.title}</h2><div className="mt-4 text-sm leading-7 text-stone-600">{section.body}</div></section>)}
        </div>
        {cta && <LocalizedClientLink href={cta.href} className="mt-10 inline-flex rounded-full bg-stone-900 px-6 py-3 text-sm text-white transition hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2">{cta.label}</LocalizedClientLink>}
      </div>
    </main>
  )
}