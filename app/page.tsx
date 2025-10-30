import { HeroSection } from '@/components/hero/HeroSection' 
import { BrandStoryTeaser } from '@/components/BrandStoryTeaser'
import { CraftsmanshipSection } from '@/components/home-v2/CraftsmanshipSection'
import CategoriesV2GSAP from '@/components/home-v2/CategoriesV2GSAP'
import OverlapShowcase from '@/components/sandbox/OverlapShowcase'
import { NewArrivals } from '@/components/home-v2/NewArrivals'
import Testimonials from '@/components/Testimonials'
import InstagramGallery from '@/components/InstagramGallery'
import Newsletter from '@/components/Newsletter'
import Footer from '@/components/Footer'

import fs from 'node:fs/promises'
import path from 'node:path'

async function getContent() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'assets', 'data', 'content.json')
    const json = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(json)
    return data
  } catch (error) {
    console.error('Failed to load content:', error)
    return {
      hero: {
        tagline: 'ANNA PARIS EXPERIENCE',
        headline: 'Express your unique self<br>through the jewelry you choose',
        videoUrl: '/assets/videos/hero-jewelry.mp4'
      },
      brandStoryTeaser: {
        heading: 'The Art of Timeless Elegance',
        description: 'For over 20 years, Anna Paris has been crafting pearl jewelry that whispers sophistication. Each piece embodies our philosophy of Quiet Luxury—where understated beauty meets exceptional craftsmanship. We believe true elegance needs no announcement.'
      },
      featuredCollections: {
        heading: 'Featured Collections',
        description: 'Explore our curated pearl jewelry collections, each designed to complement your unique style.',
        videoUrl: '/assets/videos/hero-jewelry.mp4',
        collections: []
      }
    }
  }
}

export default async function Home() {
  const content = await getContent()

  return (
    <main>
      <HeroSection
        tagline={content.hero.tagline}
        headline={content.hero.headline}
        videoUrl={content.hero.videoUrl}
      />
      <BrandStoryTeaser
        heading={content.brandStoryTeaser.heading}
        description={content.brandStoryTeaser.description}
      />
      <CraftsmanshipSection />
      <CategoriesV2GSAP />
      <div className="-mb-8 md:-mb-12">
        <OverlapShowcase />
      </div>
      <NewArrivals />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
      <Footer />
    </main>
  )
}
