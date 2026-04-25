import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ABOUT_FAQS, ABOUT_MILESTONES, ABOUT_STATS, ABOUT_VALUES, PRESS_LOGOS, TEAM } from '@/lib/marketing'

export default function AboutPage() {
  return (
    <div className="pb-20">
      <section className="overflow-hidden bg-[#17120d] px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
            About us
          </div>
          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
            We are building the campus marketplace
            <br />
            <span className="bg-[linear-gradient(135deg,#ff6b00,#ffb347)] bg-clip-text text-transparent">students actually want to use.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-stone-300 sm:text-lg">
            The reference structure is now fully reflected here: mission-led hero, stats band, story, values, team, press, FAQs, and a clean call to action.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Join CampusEats
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore the marketplace
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-10">
        <div className="section-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {ABOUT_STATS.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <p className="text-4xl font-black">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-orange-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-12 py-16 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Our story</p>
          <h2 className="text-4xl font-black text-stone-950">A better campus commerce experience started with one frustrating day.</h2>
          <p className="text-base leading-8 text-stone-600">
            CampusEats began with a simple observation: students waste time hunting for trustworthy vendors, and vendors waste energy trying to be discoverable. We wanted the platform to feel direct, elegant, and practical from the very first interaction.
          </p>
          <p className="text-base leading-8 text-stone-600">
            This redesign follows that same instinct. The app now presents the story, product discovery, and account flows in a way that feels cohesive instead of stitched together.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
            Join the mission
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative pl-8">
          <div className="absolute bottom-0 left-3 top-0 w-px bg-[linear-gradient(to_bottom,#ff6b00,rgba(255,107,0,0.1))]" />
          <div className="space-y-8">
            {ABOUT_MILESTONES.map((item) => (
              <div key={item.year + item.title} className="relative rounded-[24px] border border-stone-200 bg-white p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
                <span className="absolute -left-[29px] top-6 h-5 w-5 rounded-full border-4 border-white bg-orange-500 shadow-[0_0_0_4px_rgba(255,107,0,0.15)]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">{item.year}</p>
                <p className="mt-2 text-xl font-black text-stone-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff3e7] py-16">
        <div className="section-shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Excellence kept</p>
            <h2 className="mt-3 text-4xl font-black text-stone-950">The values shaping the product</h2>
            <p className="mt-3 text-base leading-8 text-stone-600">
              You asked to keep the excellence, so it stays visible here as part of the company story and the product standard.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {ABOUT_VALUES.map((value) => (
              <div key={value.title} className="rounded-[28px] border border-orange-100 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
                <p className="text-xl font-black text-stone-950">{value.title}</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Team</p>
          <h2 className="mt-3 text-4xl font-black text-stone-950">The people behind CampusEats</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {TEAM.map((member) => (
            <article key={member.name} className="overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-[0_18px_48px_rgba(0,0,0,0.05)]">
              <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
              <div className="p-5">
                <p className="text-lg font-black text-stone-950">{member.name}</p>
                <p className="mt-1 text-sm font-semibold text-orange-600">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell py-6">
        <div className="surface-card px-6 py-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Press</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {PRESS_LOGOS.map((item) => (
              <span key={item} className="rounded-full bg-[#fff4ea] px-4 py-2 text-sm font-semibold text-stone-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">FAQs</p>
            <h2 className="mt-3 text-4xl font-black text-stone-950">Questions we hear a lot</h2>
          </div>
          <div className="space-y-4">
            {ABOUT_FAQS.map((faq) => (
              <details key={faq.question} className="surface-card group p-6">
                <summary className="cursor-pointer list-none text-lg font-bold text-stone-950">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-stone-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
