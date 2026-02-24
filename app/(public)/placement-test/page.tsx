// app/(public)/placement-test/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import CEFRResult from "@/components/placement/CEFRResult";

export const metadata = {
  title: "Placement Test – Eloquence",
  description: "Find your exact English level with our free 15-minute CEFR placement test.",
};

const steps = [
  {
    num: "01",
    icon: "✎",
    title: "Answer 30 Questions",
    desc: "Grammar, vocabulary, and reading comprehension across all CEFR levels. Roughly 15 minutes — no time pressure.",
  },
  {
    num: "02",
    icon: "◈",
    title: "Get Instant Results",
    desc: "Your answers are scored in real time. Your exact CEFR level identified in seconds — no waiting required.",
  },
  {
    num: "03",
    icon: "⟶",
    title: "Start the Right Course",
    desc: "You're matched with the course built for your level. Targeted progress from day one.",
  },
];

const features = [
  { title: "Fully Free",     desc: "No credit card needed" },
  { title: "CEFR Aligned",   desc: "International A1–C1 scale" },
  { title: "Auto-Graded",    desc: "Results in under 5 seconds" },
  { title: "Retake Anytime", desc: "Track your growth over time" },
];

const serif = "'Cormorant Garamond', serif";
const sans  = "'Raleway', sans-serif";
const gold  = "#C9A84C";
const dim   = "#6A6560";
const bg2   = "#111110";
const text  = "#EAE4D2";

export default async function PlacementTestPage() {
  // ── Auth check ──
  // If the user is already logged in, send them straight to the test
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/test");
  return (
    <div style={{ backgroundColor: "#0D0D0B", color: text, minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 65% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(201,168,76,0.07)", borderRadius: "100px",
            padding: "8px 18px", marginBottom: "32px",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: gold }} />
          <span style={{ fontFamily: sans, fontWeight: 600, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: gold }}>
            Free · 15 Minutes
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: serif, fontWeight: 300,
            fontSize: "clamp(3rem, 5.5vw, 5rem)",
            lineHeight: 1.08, color: text,
            maxWidth: "680px", marginBottom: "20px",
          }}
        >
          Find your <em style={{ fontStyle: "italic", color: gold }}>exact</em> English level
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: sans, fontWeight: 300,
            fontSize: "0.95rem", lineHeight: 1.85,
            color: "#8A8278", maxWidth: "400px", marginBottom: "44px",
          }}
        >
          30 multiple-choice questions across grammar, vocabulary, and reading.
          Auto-graded in seconds — placed on the CEFR scale from A1 to C1.
        </p>

        {/* CEFR Cards */}
        <div style={{ position: "relative", width: "100%" }}>
          <CEFRResult />
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
          <Link
            href="/signup"
            style={{
              display: "inline-block",
              backgroundColor: gold, color: "#0D0D0B",
              padding: "14px 40px", borderRadius: "2px",
              fontFamily: sans, fontWeight: 600,
              fontSize: "0.7rem", letterSpacing: "0.2em",
              textTransform: "uppercase", textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Create Free Account &amp; Start →
          </Link>
          <p style={{ fontFamily: sans, fontWeight: 300, fontSize: "0.8rem", color: "#5E5A54" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: gold, textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", maxWidth: "400px", margin: "0 auto", opacity: 0.3 }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #C9A84C)" }} />
        <span style={{ fontFamily: serif, color: gold, fontSize: "0.9rem" }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #C9A84C)" }} />
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: "1060px", margin: "0 auto", padding: "96px 40px" }}>

        <p style={{ textAlign: "center", fontFamily: sans, fontWeight: 600, fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "#8A6F35", marginBottom: "12px" }}>
          The Process
        </p>
        <h2 style={{ textAlign: "center", fontFamily: serif, fontWeight: 300, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: text, marginBottom: "56px" }}>
          How the placement test works
        </h2>

        {/* ✅ 3 columns — inline style guaranteed */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          {steps.map(({ num, icon, title, desc }) => (
            <div
              key={num}
              style={{
                backgroundColor: bg2,
                borderRadius: "16px",
                padding: "36px 28px",
                position: "relative",
              }}
            >
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: "3.5rem", lineHeight: 1, color: "rgba(201,168,76,0.55)", marginBottom: "20px", userSelect: "none" }}>
                {num}
              </div>
              <div style={{ position: "absolute", top: "28px", right: "24px", width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(201,168,76,0.7)", fontSize: "0.85rem" }}>
                {icon}
              </div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: "1.25rem", color: "#F0EBE0", marginBottom: "10px" }}>
                {title}
              </h3>
              <p style={{ fontFamily: sans, fontWeight: 300, fontSize: "0.83rem", color: "#9A9590", lineHeight: 1.78 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ 4 columns — inline style guaranteed */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: "16px",
          }}
        >
          {features.map(({ title, desc }) => (
            <div
              key={title}
              style={{
                backgroundColor: bg2,
                borderRadius: "14px",
                padding: "20px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: gold, marginTop: "5px", flexShrink: 0, opacity: 0.7 }} />
              <div>
                <p style={{ fontFamily: sans, fontWeight: 500, fontSize: "0.82rem", color: "#D8D2C0", marginBottom: "3px" }}>{title}</p>
                <p style={{ fontFamily: sans, fontWeight: 300, fontSize: "0.74rem", color: "#7A7570", lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <div style={{ textAlign: "center", padding: "80px 24px 100px" }}>
        <h2 style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.2rem)", color: text, marginBottom: "14px" }}>
          Ready to find your <em style={{ fontStyle: "italic", color: gold }}>level</em>?
        </h2>
        <p style={{ fontFamily: sans, fontWeight: 300, fontSize: "0.9rem", color: "#5E5A54", marginBottom: "36px" }}>
          Join thousands of learners who started in exactly the right place.
        </p>
        <Link
          href="/signup"
          style={{
            display: "inline-block",
            backgroundColor: gold, color: "#0D0D0B",
            padding: "14px 40px", borderRadius: "2px",
            fontFamily: sans, fontWeight: 600,
            fontSize: "0.7rem", letterSpacing: "0.2em",
            textTransform: "uppercase", textDecoration: "none",
          }}
        >
          Create Free Account &amp; Start →
        </Link>
      </div>

    </div>
  );
}