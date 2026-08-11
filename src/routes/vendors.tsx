import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Handshake,
  Building2,
  Wallet,
  ShieldCheck,
  Rocket,
  Percent,
  Store,
  Code2,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import logoAsset from "@/assets/hotsub-logo.asset.json";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Vendors & Partners — HotSub VTU Reseller Programme" },
      {
        name: "description",
        content:
          "Become a HotSub vendor or partner. Reseller pricing, API access and payment partnerships for airtime, data, electricity and TV subscriptions in Nigeria.",
      },
      { property: "og:title", content: "Vendors & Partners — HotSub" },
      {
        property: "og:description",
        content:
          "Join HotSub as a vendor or partner: wholesale VTU rates, instant settlement and a developer-ready API.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VendorsPage,
});

const vendorBenefits = [
  { name: "Wholesale Rates", desc: "Discounted pricing on every service, scaling with volume.", icon: Percent },
  { name: "Instant Settlement", desc: "Commissions land in your wallet the moment an order completes.", icon: Wallet },
  { name: "Developer API", desc: "REST endpoints and webhooks to resell from your own platform.", icon: Code2 },
  { name: "Shop Dashboard", desc: "Track sales, staff and customers from one vendor console.", icon: Store },
  { name: "Priority Support", desc: "Dedicated account manager on WhatsApp and phone.", icon: Rocket },
  { name: "Verified & Secure", desc: "KYC-backed accounts with transaction PINs and audit logs.", icon: ShieldCheck },
];

const partnerTypes = [
  {
    name: "Payment Partners",
    desc: "Paystack and Monnify power card funding, transfers and dedicated virtual accounts.",
  },
  {
    name: "Telco & Utility Partners",
    desc: "Direct integrations with MTN, Airtel, Glo, 9mobile, DisCos and cable providers.",
  },
  {
    name: "Agent Networks",
    desc: "Cyber cafés, POS agents and campus resellers earning on every top-up they process.",
  },
  {
    name: "Technology Partners",
    desc: "Fintechs and platforms embedding HotSub VTU services through our API.",
  },
];

const steps = [
  { step: "01", title: "Apply", desc: "Send your business details and expected monthly volume." },
  { step: "02", title: "Verify", desc: "Complete quick KYC and get your vendor tier assigned." },
  { step: "03", title: "Fund & Sell", desc: "Top up your vendor wallet and start earning immediately." },
];

function VendorsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center">
            <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-soft">
              <img src={logoAsset.url} alt="HotSub" className="h-8 w-auto sm:h-10" />
            </span>
          </Link>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-6">
            <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <Link className="transition-colors hover:text-white" to="/">Home</Link>
              <Link className="transition-colors hover:text-white" to="/vendors">Vendors</Link>
            </div>
            <a
              href="#apply"
              className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Become a vendor
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-navy">
          <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-info/25 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <span className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-1 text-xs font-medium tracking-wide text-white/85">
              <Handshake className="h-3.5 w-3.5" /> Vendors &amp; Partners
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Grow your business on the{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">HotSub network</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Resell airtime, data, electricity tokens, cable TV and exam PINs at wholesale
              rates — or plug our API straight into your own platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#apply"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Apply as a vendor <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#partners"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Partnership options
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Vendor programme
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Everything you need to resell profitably
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Built for agents, cyber cafés and fintechs moving serious volume.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendorBenefits.map(({ name, desc, icon: Icon }) => (
              <div
                key={name}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-brand-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="partners" className="bg-secondary/60 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Partners
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-4xl">
                The partners behind every instant delivery
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                We work with regulated payment processors, telcos and utility providers.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {partnerTypes.map((p) => (
                <div key={p.name} className="rounded-2xl bg-card p-6 shadow-soft">
                  <Building2 className="h-6 w-6 text-info" />
                  <h3 className="mt-4 text-base font-semibold text-navy">{p.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-gradient-navy px-6 py-10 sm:grid-cols-3 lg:px-12">
            {steps.map((s) => (
              <div key={s.step}>
                <p className="bg-gradient-brand bg-clip-text text-3xl font-extrabold text-transparent">
                  {s.step}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="apply" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-12 text-center shadow-glow lg:px-16">
            <h2 className="text-2xl font-extrabold text-brand-foreground sm:text-3xl">
              Ready to become a HotSub vendor?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-foreground/85">
              Tell us about your business and we'll set up your vendor wallet, tier and API
              keys within 24 hours.
            </p>
            <a
              href="mailto:hotsubservice@gmail.com?subject=Vendor%20application"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <Handshake className="h-4 w-4" /> Apply now
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-navy py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Contact us</h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/60">
                <li>
                  <a
                    href="mailto:hotsubservice@gmail.com"
                    className="flex items-start gap-2 transition-colors hover:text-primary"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>hotsubservice@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+2348062163308"
                    className="flex items-start gap-2 transition-colors hover:text-primary"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>08062163308</span>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Address</h3>
              <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>57, Eweka, off Upper Lawani Road, New Benin, Benin City, Edo State, Nigeria</span>
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-white/50">© {new Date().getFullYear()} HotSub. All rights reserved.</p>
              <Link to="/" className="mt-2 inline-block text-xs text-white/50 transition-colors hover:text-primary">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
