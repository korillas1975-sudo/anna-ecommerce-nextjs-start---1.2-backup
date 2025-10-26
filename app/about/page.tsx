import Image from 'next/image'

export const metadata = {
  title: 'About Us | ANNA PARIS',
  description: 'Learn about our story, craftsmanship, and commitment to excellence',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&fit=crop&q=85"
          alt="About ANNA PARIS"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10 pb-16 md:pb-20">
            <h1 className="font-serif text-[3rem] md:text-[4rem] lg:text-[5rem] font-medium text-white leading-[1.1] -tracking-[0.02em]">
              Our Story
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="space-y-8 font-serif text-[1.05rem] leading-[1.85] text-ink-2/85">
          <p>
            For over 20 years, <strong>Anna Paris</strong> has been synonymous with timeless elegance and exceptional craftsmanship in the world of luxury jewelry.
          </p>
          <p>
            Our journey began with a simple yet profound philosophy: <em>true luxury whispers, it never shouts</em>. This principle of Quiet Luxury continues to guide every piece we create.
          </p>
          <h2 className="font-serif text-[2rem] font-medium text-ink mt-12 mb-6">Our Craftsmanship</h2>
          <p>
            Each piece of Anna Paris jewelry is meticulously handcrafted by master artisans who have honed their skills over decades. We honor time-tested techniques passed down through generations while embracing modern precision.
          </p>
          <p>
            From the selection of the finest pearls and diamonds to the final polish, every detail receives our unwavering attention.
          </p>
          <h2 className="font-serif text-[2rem] font-medium text-ink mt-12 mb-6">Our Commitment</h2>
          <p>
            We believe in creating jewelry that transcends trends—pieces that become cherished heirlooms, carrying stories through generations.
          </p>
          <p>
            Sustainability and ethical sourcing are at the heart of our practice. We work only with certified suppliers who share our values of transparency and responsibility.
          </p>
        </div>
      </div>
    </main>
  )
}
