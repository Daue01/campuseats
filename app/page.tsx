import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Quote, ShieldCheck, Sparkles, Store, Users } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/ui/ProductCard'
import VendorCard from '@/components/ui/VendorCard'
import { FAQS } from '@/lib/constants'
import { CATEGORY_SPOTLIGHTS, EXPERIENCE_PILLARS, HERO_STATS, TESTIMONIALS } from '@/lib/marketing'
import { getSafeMarketplaceData } from '@/lib/server/runtime'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { vendors, products, error } = await getSafeMarketplaceData()

  const featuredVendors = vendors.slice(0, 3)
  const featuredProducts = products.slice(0, 3)
  const spotlightVendor = featuredVendors[0]

  return (
    <div className="pb-20">
      <section className="section-shell grid gap-12 py-12 lg:grid-cols-[1.05fr,0.95fr] lg:items-center lg:py-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
            <Sparkles className="h-4 w-4" />
            Redesigned to match the attached campus-food structure
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-stone-950 sm:text-6xl">
              Campus food,
              <br />
              <span className="bg-[linear-gradient(135deg,#ff6b00,#ff8c33)] bg-clip-text text-transparent">delivered with clarity.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              CampusEats brings vendors, student buyers, and discovery into one warm, polished experience. Browse real storefronts, create an account, and grow the marketplace without demo clutter.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(255,107,0,0.25)] transition hover:bg-orange-600"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-950"
            >
              Explore campus food
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="surface-card px-5 py-4">
                <p className="text-2xl font-black text-stone-950">{stat.value}</p>
                <p className="mt-1 text-sm text-stone-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card overflow-hidden p-4 sm:p-6">
          <div className="rounded-[28px] bg-[#17120d] p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Live now</p>
                <h2 className="mt-2 text-2xl font-black">Marketplace spotlight</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-stone-200">
                <Clock3 className="h-3.5 w-3.5" />
                Real-time ready
              </span>
            </div>

            {spotlightVendor ? (
              <div className="mt-6 space-y-4">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/8">
                  <img src={spotlightVendor.logo} alt={spotlightVendor.businessName} className="h-56 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xl font-bold">{spotlightVendor.businessName}</p>
                        <p className="text-sm text-stone-300">{spotlightVendor.category}</p>
                      </div>
                      <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-200">
                        {spotlightVendor.productCount} products
                      </span>
                    </div>
                    <p className="text-sm leading-7 text-stone-300">{spotlightVendor.description}</p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {featuredProducts.length > 0 ? (
                    featuredProducts.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 rounded-[22px] bg-white/8 p-3">
                        <img src={product.image} alt={product.title} className="h-14 w-14 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{product.title}</p>
                          <p className="text-xs text-stone-300">{product.vendorName}</p>
                        </div>
                        <span className="text-sm font-bold text-orange-300">
                          {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(product.price)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 px-5 py-6 text-sm text-stone-300">
                      No live products yet. The marketplace is now ready for fresh vendor onboarding.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center">
                <p className="text-lg font-bold">No vendors yet</p>
                <p className="mt-2 text-sm leading-7 text-stone-300">
                  Demo content has been removed, so this home panel will fill with real vendors and products as accounts go live.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-shell py-4">
        <div className="surface-card px-5 py-5 sm:px-6">
          {error ? (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
              Marketplace data is temporarily unavailable. Check your Supabase environment variables and Vercel function logs.
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {CATEGORY_SPOTLIGHTS.map((item) => (
                <span key={item.label} className="inline-flex items-center gap-2 rounded-full bg-[#fff4ea] px-4 py-2 text-sm font-semibold text-stone-700">
                  <span>{item.emoji}</span>
                  {item.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section-shell py-16">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Excellence</p>
          <h2 className="text-3xl font-black text-stone-950">The excellence standard stays front and center</h2>
          <p className="text-base leading-7 text-stone-600">
            You asked to keep the excellence, so the redesign preserves it as a visible product principle instead of burying it in small copy.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {EXPERIENCE_PILLARS.map((pillar, index) => (
            <div key={pillar.title} className={`surface-card p-6 ${index === 0 ? 'bg-[linear-gradient(180deg,#fff7ef,white)]' : ''}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                {index === 0 ? <ShieldCheck className="h-5 w-5" /> : index === 1 ? <Users className="h-5 w-5" /> : <Store className="h-5 w-5" />}
              </div>
              <p className="mt-5 text-xl font-bold text-stone-950">{pillar.title}</p>
              <p className="mt-3 text-sm leading-7 text-stone-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell space-y-8 py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Featured vendors</p>
            <h2 className="mt-3 text-3xl font-black text-stone-950">Campus storefronts students can trust</h2>
          </div>
          <Link href="/vendors" className="hidden text-sm font-semibold text-stone-700 transition hover:text-orange-600 md:inline-flex">
            Browse all vendors
          </Link>
        </div>

        {featuredVendors.length === 0 ? (
          <EmptyState
            title="No vendors live yet"
            description="The storefront directory is now empty by default so you can onboard and test with real accounts."
            actionLabel="Create vendor account"
            actionHref="/signup"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </section>

      <section className="section-shell space-y-8 py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">Fresh picks</p>
          <h2 className="mt-3 text-3xl font-black text-stone-950">Products ready for discovery</h2>
        </div>

        {featuredProducts.length === 0 ? (
          <EmptyState
            title="No products published yet"
            description="As soon as vendors add items from their dashboard, they will appear here automatically."
            actionLabel="Explore onboarding"
            actionHref="/about"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section-shell py-16">
        <div className="surface-card overflow-hidden px-6 py-8 sm:px-8">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">What people love</p>
            <h2 className="mt-3 text-3xl font-black text-stone-950">A warmer interface with sharper marketplace flow</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <div key={item.name} className="rounded-[24px] border border-stone-200 bg-[#fffaf5] p-6">
                <Quote className="h-8 w-8 text-orange-400" />
                <p className="mt-4 text-sm leading-7 text-stone-600">{item.quote}</p>
                <div className="mt-6">
                  <p className="font-bold text-stone-950">{item.name}</p>
                  <p className="text-sm text-stone-500">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-8 py-12 lg:grid-cols-[0.9fr,1.1fr]" id="faqs">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">FAQs</p>
          <h2 className="text-3xl font-black text-stone-950">Answers for operators, buyers, and campus teams</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.id} className="surface-card p-6">
              <p className="text-lg font-bold text-stone-950">{faq.question}</p>
              <p className="mt-2 text-sm leading-7 text-stone-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-8" id="contact">
        <div className="surface-card flex flex-col gap-6 overflow-hidden bg-[#17120d] px-6 py-10 text-white lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Contact us</p>
            <h2 className="text-3xl font-black">Ready to launch the real marketplace?</h2>
            <p className="max-w-2xl text-sm leading-7 text-stone-300">
              The app now starts clean. Create fresh student and vendor accounts, publish real products, and test the full flow from signup to storefront.
            </p>
          </div>
          <a
            href="mailto:hello@campuseats.app"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-stone-950 transition hover:bg-orange-50"
          >
            hello@campuseats.app
          </a>
        </div>
      </section>
    </div>
  )
}
