import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  Wallet,
  Signal,
  Router,
  Trophy,
  ShieldCheck,
  Clock,
  BadgePercent,
  History,
  Headphones,
  Gift,
  Users,
  Rocket,
  ChevronRight,
  Star,
  Handshake,
  Building2,
  Percent,
  Code2,
  Store,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import logoAsset from "@/assets/hotsub-logo.asset.json";
import heroImage from "@/assets/hero-fintech.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HotSub — Fast, Secure & Reliable Digital Subscriptions" },
      {
        name: "description",
        content:
          "Buy airtime, data, electricity tokens, TV subscriptions and exam PINs instantly from anywhere in Nigeria with HotSub.",
      },
      { property: "og:title", content: "HotSub — Subscriptions Made Easy" },
      {
        property: "og:description",
        content:
          "Instant airtime, data, electricity, cable TV and exam PINs. Fast, secure and reliable VTU payments in Nigeria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const services = [
  { name: "Airtime", desc: "MTN, Airtel, Glo & 9mobile", icon: Smartphone },
  { name: "Data Bundles", desc: "SME, Corporate, Gifting", icon: Wifi },
  { name: "Electricity", desc: "Prepaid & postpaid tokens", icon: Zap },
  { name: "DSTV", desc: "Renew any bouquet", icon: Tv },
  { name: "GOtv", desc: "Max, Jolli, Jinja & more", icon: Tv },
  { name: "Startimes", desc: "Nova to Super packages", icon: Tv },
  { name: "WAEC PIN", desc: "Result checker PINs", icon: GraduationCap },
  { name: "NECO PIN", desc: "Instant token delivery", icon: GraduationCap },
  { name: "JAMB PIN", desc: "UTME & Direct Entry", icon: GraduationCap },
  { name: "Betting Wallet", desc: "Fund your bookmaker", icon: Trophy },
  { name: "Smile Network", desc: "Bundles & top-ups", icon: Signal },
  { name: "Spectranet", desc: "Instant PIN vending", icon: Router },
];

const features = [
  { name: "Instant Delivery", desc: "Orders complete in seconds, not minutes.", icon: Rocket },
  { name: "Affordable Prices", desc: "Some of the lowest VTU rates in Nigeria.", icon: BadgePercent },
  { name: "24/7 Availability", desc: "Top up any time, any day of the year.", icon: Clock },
  { name: "Secure Payments", desc: "Bank-grade encryption on every naira.", icon: ShieldCheck },
  { name: "Transaction History", desc: "Every receipt saved and downloadable.", icon: History },
  { name: "Fast Support", desc: "Real humans replying within minutes.", icon: Headphones },
  { name: "Cashback Rewards", desc: "Earn back on every single purchase.", icon: Gift },
  { name: "Referral Earnings", desc: "Get paid when your friends transact.", icon: Users },
];

const stats = [
  { value: "20,000+", label: "Happy users" },
  { value: "300,000+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const testimonials = [
  {
    quote:
      "I fund my wallet once a week and buy data for the whole family. Delivery is always instant, never had a failed order.",
    name: "Adaeze O.",
    role: "Small business owner, Enugu",
  },
  {
    quote:
      "The electricity token comes in before I even close the app. HotSub replaced three other apps on my phone.",
    name: "Ibrahim K.",
    role: "Landlord, Kaduna",
  },
  {
    quote:
      "Referral earnings alone cover my monthly airtime. Support answered me at 1am on a Sunday — that says everything.",
    name: "Tunde A.",
    role: "Student, Lagos",
  },
];

const faqs = [
  {
    q: "How fast are transactions delivered?",
    a: "Airtime, data and exam PINs are delivered in under 10 seconds. Electricity tokens and cable TV renewals typically complete within 30 seconds.",
  },
  {
    q: "How do I fund my HotSub wallet?",
    a: "You can fund instantly with a card via Paystack or Monnify, or send a bank transfer to your dedicated virtual account number.",
  },
  {
    q: "What happens if a transaction fails?",
    a: "Failed orders are automatically reversed to your wallet. If a reversal is delayed, our support team resolves it manually within minutes.",
  },
  {
    q: "How does the referral programme work?",
    a: "Share your unique referral link. You earn a commission on every transaction your referrals make, withdrawable to your bank account.",
  },
  {
    q: "Is my data and payment information safe?",
    a: "Yes. We use encrypted connections, hashed credentials, a transaction PIN on every purchase and full audit logging.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex min-w-0 items-center">
            <span className="inline-flex items-center rounded-xl bg-white px-2.5 py-1.5 shadow-soft">
              <img
                src={logoAsset.url}
                alt="HotSub — subscriptions made easy"
                className="h-8 w-auto sm:h-10"
              />
            </span>
          </a>
          <nav className="flex shrink-0 items-center gap-2 sm:gap-6">
            <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <a className="transition-colors hover:text-white" href="#services">Services</a>
              <a className="transition-colors hover:text-white" href="#why">Why HotSub</a>
              <Link className="transition-colors hover:text-white" to="/vendors">Vendors</Link>
              <a className="transition-colors hover:text-white" href="#faq">FAQ</a>
            </div>
            <Link
              to="/vendors"
              className="rounded-full border border-white/20 px-3 py-2 text-xs font-medium text-white/85 transition-colors hover:text-white md:hidden"
            >
              Vendors
            </Link>
            <Link
              to="/auth"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white sm:inline-flex"
            >
              Login
            </Link>

            <Link
              to="/auth"
              className="rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-navy">
          <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-info/25 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full glass-card px-3 py-1 text-xs font-medium tracking-wide text-white/85">
                <span className="h-2 w-2 rounded-full bg-success" />
                Fast • Secure • Reliable
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Fast, Secure &amp; Reliable{" "}
                <span className="bg-gradient-brand bg-clip-text text-transparent">
                  Digital Subscriptions
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Buy Airtime, Data, Electricity Tokens, TV Subscriptions, and Exam PINs
                instantly from anywhere in Nigeria.
              </p>
              <div id="get-started" className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
                >
                  Create Free Account <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Login
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/55">
                <span>Paystack &amp; Monnify funding</span>
                <span>Dedicated virtual account</span>
                <span>Instant reversals</span>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl glass-card p-2 shadow-soft">
                <img
                  src={heroImage}
                  alt="Floating digital service cards around a smartphone"
                  width={1200}
                  height={1200}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
              <div className="absolute -bottom-5 left-4 rounded-2xl bg-background/95 px-4 py-3 shadow-soft sm:left-8">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Wallet balance
                </p>
                <p className="text-lg font-bold text-navy">₦48,250.00</p>
              </div>
              <div className="absolute -top-4 right-2 flex items-center gap-2 rounded-2xl bg-background/95 px-4 py-3 shadow-soft">
                <Zap className="h-4 w-4 text-success" />
                <p className="text-xs font-semibold text-navy">Token delivered</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionHeading
            eyebrow="Our services"
            title="Everything you top up, in one place"
            subtitle="Twelve services, one wallet, one login. No queues, no recharge cards."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ name, desc, icon: Icon }) => (
              <Link
                key={name}
                to="/services"
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gradient-brand group-hover:text-brand-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-navy">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Why */}
        <section id="why" className="bg-secondary/60 py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Why choose HotSub"
              title="Built for people who can't afford downtime"
              subtitle="Premium fintech reliability, priced for everyday Nigerians."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ name, desc, icon: Icon }) => (
                <div key={name} className="rounded-2xl bg-card p-5 shadow-soft">
                  <Icon className="h-6 w-6 text-info" />
                  <h3 className="mt-4 text-sm font-semibold text-navy">{name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 rounded-3xl bg-gradient-navy px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="bg-gradient-brand bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-white/65">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by thousands every day"
            subtitle="Real feedback from people who top up on HotSub daily."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-navy">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>




        {/* Vendors & Partners */}
        <section id="vendors" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <SectionHeading
            eyebrow="Vendors & Partners"
            title="Grow your business on the HotSub network"
            subtitle="Join hundreds of resellers, agents and fintech partners earning on every top-up."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Vendors</p>
              <h3 className="mt-2 text-2xl font-bold text-navy">Become a HotSub vendor</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Resell airtime, data, cable TV, electricity and exam PINs at wholesale rates. Get an
                agent dashboard, instant wallet funding and developer APIs to power your own store.
              </p>
              <Link
                to="/vendors"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-glow"
              >
                Explore vendor program <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-border bg-secondary/60 p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Partners</p>
              <h3 className="mt-2 text-2xl font-bold text-navy">Built on trusted networks</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We connect directly to Nigeria's major telcos, disco billers and cable providers,
                with secure payments handled by licensed processors — so every transaction settles fast.
              </p>
              <Link
                to="/vendors"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-card px-5 py-2.5 text-sm font-semibold text-navy"
              >
                Meet our partners <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Wholesale Rates", desc: "Discounted pricing on every service, scaling with volume.", icon: Percent },
              { name: "Instant Settlement", desc: "Commissions land in your wallet the moment an order completes.", icon: Wallet },
              { name: "Developer API", desc: "REST endpoints and webhooks to resell from your own platform.", icon: Code2 },
              { name: "Shop Dashboard", desc: "Track sales, staff and customers from one vendor console.", icon: Store },
              { name: "Priority Support", desc: "Dedicated account manager on WhatsApp and phone.", icon: Rocket },
              { name: "Verified & Secure", desc: "KYC-backed accounts with transaction PINs and audit logs.", icon: ShieldCheck },
            ].map(({ name, desc, icon: Icon }) => (
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

          <div className="mt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Partners</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-4xl">
              The partners behind every instant delivery
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              We work with regulated payment processors, telcos and utility providers.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Payment Partners", desc: "Paystack and Monnify power card funding, transfers and virtual accounts." },
                { name: "Telco & Utility Partners", desc: "Direct integrations with MTN, Airtel, Glo, 9mobile, DisCos and cable providers." },
                { name: "Agent Networks", desc: "Cyber cafés, POS agents and campus resellers earning on every top-up." },
                { name: "Technology Partners", desc: "Fintechs and platforms embedding HotSub VTU services through our API." },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl bg-secondary/60 p-6">
                  <Building2 className="h-6 w-6 text-info" />
                  <h4 className="mt-4 text-sm font-semibold text-navy">{p.name}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href="mailto:hotsubservice@gmail.com?subject=Vendor%20application"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Handshake className="h-4 w-4" /> Apply to become a vendor
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-secondary/60 py-16 lg:py-24">

          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
              subtitle="Everything you need to know before your first top-up."
            />
            <div className="mt-10 space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-border bg-card p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-navy">
                    {f.q}
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-6 py-12 text-center shadow-glow lg:px-16">
            <h2 className="text-2xl font-extrabold text-brand-foreground sm:text-3xl">
              Your next top-up takes 10 seconds
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-brand-foreground/85">
              Create a free HotSub account, fund your wallet and start earning cashback on
              every transaction.
            </p>
            <a
              href="#get-started"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <Wallet className="h-4 w-4" /> Create Free Account
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-navy pt-14">
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
            <div>
              <img src={logoAsset.url} alt="HotSub" className="h-10 w-auto rounded-md" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                HotSub is a fast, reliable and secure VTU platform that makes every
                subscription simple, affordable and available 24/7.
              </p>
            </div>
            <FooterCol title="Company" links={["About", "Blog", "Contact"]} />
            <FooterCol title="Legal" links={["Privacy Policy", "Terms of Service", "Refund Policy"]} />
            <div>
              <h3 className="text-sm font-semibold text-white">Contact us</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
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
                <li>
                  <span className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>57, Eweka, off Upper Lawani Road, New Benin, Benin City, Edo State, Nigeria</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} HotSub. All rights reserved.</p>
            <p>Subscriptions made easy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-white/60">
        {links.map((l) => (
          <li key={l}>
            <a href="#top" className="transition-colors hover:text-primary">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
