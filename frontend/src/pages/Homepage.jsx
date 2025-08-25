import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X, Sparkles, ShieldCheck, Zap, LayoutDashboard, Rocket, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white flex flex-col items-center justify-center">
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        TrenPH 🚉
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-center max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Smart railway insights, real-time predictions, news updates, and crowdsourced reports — all in one dashboard.
      </motion.p>

      <Link to="/dashboard">
        <Button className="bg-yellow-400 text-black hover:bg-yellow-300 text-lg px-6 py-3 rounded-xl flex items-center gap-2">
          Go to Dashboard <ArrowRight size={20} />
        </Button>
      </Link>
    </div>
  );
}

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "#cta", label: "Get Started" },
];

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Polished UI Kit",
    desc: "Composable components with Tailwind, accessible by default.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Secure by Design",
    desc: "Modern auth-ready patterns and safe API hooks.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    desc: "Vite, code-splitting, and image optimization baked in.",
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Dashboard Ready",
    desc: "Cards, tables, and charts organized for real data.",
  },
];

export default function Homepage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white selection:bg-white/20 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-cyan-400 shadow-lg" />
            <span className="text-lg font-semibold tracking-wide">TrenPH</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-slate-200 transition hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#cta"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20"
            >
              Launch App
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <button
            className="md:hidden rounded-xl border border-white/10 p-2"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/60 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="#cta"
                  className="rounded-xl bg-white/10 px-3 py-2 text-center font-medium hover:bg-white/20"
                  onClick={() => setOpen(false)}
                >
                  Launch App
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* decorative glow */}
          <div className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/30 via-sky-500/20 to-cyan-400/10 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-6 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <Rocket className="h-3.5 w-3.5" />
              <span>Next-gen platform UI</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Build, launch, and scale with
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent"> TrenPH</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              A clean, performant frontend inspired by Rush-PH — redesigned with Tailwind and Framer Motion. Bring your data and APIs; we’ll make them shine.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl transition hover:brightness-110"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="mx-auto h-72 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur md:h-96 md:max-w-lg">
              <div className="h-full w-full rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-black p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="h-[85%] rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="mb-3 h-6 w-1/2 rounded bg-white/10" />
                  <div className="mb-2 h-3 w-2/3 rounded bg-white/10" />
                  <div className="mb-2 h-3 w-1/3 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Features that matter</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Production-quality building blocks tailored to your TrenPH flows.
              </p>
            </div>
            <a href="#cta" className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10 md:inline-block">
              Try it now
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur transition hover:bg-white/10"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3">
                  {f.icon}
                </div>
                <h3 className="mb-1 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-300">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">About TrenPH</h2>
              <p className="text-slate-300">
                TrenPH is a modern web experience crafted with performance and clarity in mind. This redesign merges a clean template foundation with Rush-inspired polish — keeping your flows familiar while raising the visual bar.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-slate-300">
                <li>React + Vite + Tailwind core</li>
                <li>Framer Motion for tasteful micro-interactions</li>
                <li>Extensible component library ready for real data</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="relative"
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl">
                <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-cyan-400/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ready to ship your next release?</h2>
          <p className="mt-3 text-slate-300">
            Clean code, fast loads, and a design language your users will love.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl transition hover:brightness-110"
            >
              Deploy Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"
            >
              View Docs
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 via-sky-500 to-cyan-400" />
              <span className="text-base font-semibold">TrenPH</span>
            </div>
            <p className="text-sm text-slate-300">
              © {new Date().getFullYear()} TrenPH. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white/90">Product</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#cta" className="hover:text-white">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white/90">Company</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Legal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white/90">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +63 900 000 0000</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@tren.ph</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Manila, PH</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
