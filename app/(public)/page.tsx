import Hero from '@/components/landing/Hero'
import MarqueeStrip from '@/components/landing/MarqueeStrip'
import HowItWorks from '@/components/landing/HowItWorks'
import PlacementTestCTA from '@/components/landing/PlacementTestCTA'
import CourseCategories from '@/components/landing/CourseCategories'
import PricingPreview from '@/components/landing/PricingPreview'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <HowItWorks />
      <PlacementTestCTA />
      <CourseCategories />
      <PricingPreview />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}