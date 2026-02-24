// app/(public)/placement-test/page.tsx

import Link from "next/link";
import CEFRResult from "@/components/placement/CEFRResult";

export const metadata = {
  title: "Placement Test – Eloquence",
  description:
    "Find your exact English level with our free 15-minute CEFR placement test.",
};

export default function PlacementTestPage() {
  return (
    <div className="bg-[#0C0C0C] text-[#E8E2D4] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">

        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#C9A84C]/20 text-[#C9A84C] text-[0.62rem] tracking-[0.18em] uppercase mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          Free · 15 Minutes
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-light leading-tight text-[#E8E2D4] max-w-3xl mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Find your{" "}
          <em className="text-[#C9A84C]" style={{ fontStyle: "italic" }}>exact</em>{" "}
          English level
        </h1>

        {/* Sub */}
        <p className="text-sm font-light text-[#7A7570] leading-relaxed max-w-md mb-14">
          30 multiple-choice questions across grammar, vocabulary, and reading.
          Auto-graded in seconds. You'll be placed on the CEFR scale from A1 to
          C1 and matched with the perfect course.
        </p>

        {/* CEFR Grid */}
        <CEFRResult />

        {/* CTA */}
        <div className="flex flex-col items-center gap-3.5">
          <Link
            href="/signup"
            className="inline-block bg-[#C9A84C] text-[#0C0C0C] text-[0.7rem] font-semibold tracking-[0.18em] uppercase px-10 py-4 transition-all hover:bg-[#E8C97A] hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(201,168,76,0.22)]"
          >
            Create Free Account &amp; Start →
          </Link>
          <p className="text-[0.78rem] text-[#7A7570]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C9A84C] border-b border-[#C9A84C]/30 pb-px hover:border-[#C9A84C] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="relative z-10 flex items-center gap-4 max-w-3xl mx-auto px-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/25" />
        <span className="text-sm text-[#8A6F35]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/25" />
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-12 py-24">
        <p className="text-center text-[0.6rem] font-semibold tracking-[0.24em] uppercase text-[#8A6F35] mb-3">
          The Process
        </p>
        <h2
          className="text-center text-4xl font-light text-[#E8E2D4] mb-16"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          How the placement test works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-[#C9A84C]/15 divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/15">
          {[
            { num: "01", icon: "✎", title: "Answer 30 Questions",   desc: "Grammar, vocabulary, and reading comprehension questions designed across all CEFR levels. Takes roughly 15 minutes at your own pace — no time pressure." },
            { num: "02", icon: "◈", title: "Get Instant Results",    desc: "Our algorithm scores your answers in real time and pinpoints your exact level on the CEFR scale — no waiting, no manual review required." },
            { num: "03", icon: "→", title: "Start the Right Course", desc: "You're matched directly with the course built for your level. No guesswork, no wasted lessons — just targeted progress from day one." },
          ].map(({ num, icon, title, desc }) => (
            <div key={num} className="relative bg-[#111110] p-10 hover:bg-[#1A1A15] transition-colors">
              <div className="text-6xl font-light text-[#C9A84C]/10 leading-none mb-5"
                   style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {num}
              </div>
              <div className="absolute top-9 right-7 w-8 h-8 border border-[#C9A84C]/15 flex items-center justify-center text-[#8A6F35] text-xs">
                {icon}
              </div>
              <h3 className="text-xl font-normal text-[#E8E2D4] mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {title}
              </h3>
              <p className="text-[0.8rem] text-[#7A7570] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-t-0 border-[#C9A84C]/15 divide-x divide-[#C9A84C]/15">
          {[
            { title: "Fully Free",     desc: "No credit card required to take the test" },
            { title: "CEFR Certified", desc: "Internationally recognised framework A1–C1" },
            { title: "Auto-Graded",    desc: "Results delivered in under 5 seconds" },
            { title: "Retake Anytime", desc: "Track your progress with each attempt" },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-[#111110] px-5 py-6 flex items-start gap-3 hover:bg-[#1A1A15] transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
              <div>
                <p className="text-[0.8rem] font-medium text-[#E8E2D4] mb-0.5">{title}</p>
                <p className="text-[0.75rem] text-[#7A7570] leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div className="relative z-10 text-center border-t border-[#C9A84C]/15 px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-light text-[#E8E2D4] mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Ready to find your <em className="italic text-[#C9A84C]">level</em>?
        </h2>
        <p className="text-sm text-[#7A7570] mb-10">
          Join thousands of learners who started in exactly the right place.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-[#C9A84C] text-[#0C0C0C] text-[0.7rem] font-semibold tracking-[0.18em] uppercase px-10 py-4 transition-all hover:bg-[#E8C97A] hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(201,168,76,0.22)]"
        >
          Create Free Account &amp; Start →
        </Link>
      </div>

    </div>
  );
}