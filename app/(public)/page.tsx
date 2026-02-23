// 📁 app/(public)/page.tsx

import Hero             from '@/components/landing/Hero'
import MarqueeStrip     from '@/components/landing/MarqueeStrip'
import Features         from '@/components/landing/Features'
import HowItWorks       from '@/components/landing/HowItWorks'
import PlacementTestCTA from '@/components/landing/PlacementTestCTA'
import CourseCategories from '@/components/landing/CourseCategories'
import PricingPreview   from '@/components/landing/PricingPreview'
import Testimonials     from '@/components/landing/Testimonials'
import FAQ              from '@/components/landing/FAQ'
import FinalCTA         from '@/components/landing/FinalCTA'

export default function LandingPage() {
  return (
    <>
      {/* 1. Hero — headline, CTAs, floating CEFR card */}
      <Hero />

      {/* 2. Marquee — animated scrolling topic strip */}
      <MarqueeStrip />

      {/* 3. Features — 6-card platform value proposition */}
      <Features />

      {/* 4. How It Works — 4-step process */}
      <HowItWorks />

      {/* 5. Placement Test CTA — CEFR grid + feature list */}
      <PlacementTestCTA />

      {/* 6. Course Categories — tabbed course grid */}
      <CourseCategories />

      {/* 7. Pricing — Standard vs Premium plan cards */}
      <PricingPreview />

      {/* 8. Testimonials — student success stories */}
      <Testimonials />

      {/* 9. FAQ — accordion of common questions */}
      <FAQ />

      {/* 10. Final CTA — closing conversion section */}
      <FinalCTA />
    </>
  )
}
