import OverlapShowcase from '@/components/sandbox/OverlapShowcase'

export const metadata = {
  title: 'Collections Sandbox',
  description: 'Preview of overlapped collection layout (sandbox only)'
}

export default function CollectionsSandboxPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-8">
        <h1 className="font-serif text-[2rem] text-ink mb-6">Collections Layout Sandbox</h1>
        <p className="text-ink-2/70 mb-8">This preview is isolated from the home page. Tweak the layout here safely.</p>
      </div>
      <OverlapShowcase />
    </main>
  )
}

