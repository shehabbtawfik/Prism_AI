import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0514]">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-prism-gradient opacity-60" />
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Radial glow spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-prism-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-spectrum-cyan/10 rounded-full blur-3xl" />

        {/* Prism illustration */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
          <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
            <defs>
              <linearGradient id="hero-prism-grad" x1="0" y1="0" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <polygon points="150,20 280,350 20,350" fill="url(#hero-prism-grad)" opacity="0.3" />
            <polygon points="150,20 280,350 20,350" fill="none" stroke="url(#hero-prism-grad)" strokeWidth="2" />
            {/* Spectrum beams */}
            <line x1="150" y1="350" x2="290" y2="390" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />
            <line x1="150" y1="350" x2="255" y2="395" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
            <line x1="150" y1="350" x2="215" y2="398" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
            <line x1="150" y1="350" x2="172" y2="400" stroke="#a78bfa" strokeWidth="2" opacity="0.8" />
            <line x1="150" y1="350" x2="130" y2="400" stroke="#c4b5fd" strokeWidth="2" opacity="0.6" />
            <line x1="150" y1="350" x2="85" y2="397" stroke="#7c3aed" strokeWidth="2" opacity="0.6" />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-prism-600/20 border border-prism-500/30 text-prism-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-prism-400 animate-pulse-slow" />
            AI Platform Architecture Showcase
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-white">Refracting</span>
            <br />
            <span className="text-gradient">Intelligence</span>
            <br />
            <span className="text-white">into Clarity</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Prism AI is a next-generation, multi-provider AI platform that transforms raw
            ideas into polished content through a{' '}
            <span className="text-white/90">Research → Refine → Restyle</span> pipeline —
            built on a provider abstraction layer that treats LLMs as swappable infrastructure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Link
              href="/demo/showcase"
              className="px-8 py-4 rounded-xl btn-primary text-base font-semibold flex items-center gap-2 shadow-prism"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                <path d="M2.5 2v10L12 7z" />
              </svg>
              <span>Watch Demo</span>
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 rounded-xl glass border border-white/10 text-white/80 hover:text-white hover:border-white/20 transition-all text-base font-medium"
            >
              Try It Live
            </Link>
            <a
              href="#architecture"
              className="px-8 py-4 rounded-xl glass border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-base font-medium"
            >
              Architecture
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in">
            {[
              { value: '4', label: 'AI Providers' },
              { value: '3', label: 'Pipeline Stages' },
              { value: '∞', label: 'Possibilities' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-white/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float opacity-40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Three Stages. One <span className="text-gradient">Unified Pipeline.</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Each stage builds on the last. Content flows seamlessly from discovery
              through refinement to publication-ready output.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              step="01"
              icon="🔍"
              title="Research"
              color="from-sky-500/20 to-sky-600/5"
              borderColor="border-sky-500/20"
              accentColor="text-sky-400"
              description="Deep synthesis with intelligent source tracking. Prism doesn't just search — it synthesizes, extracts key insights, and maintains citation accuracy across complex topics."
              capabilities={[
                'Multi-source synthesis',
                'Citation tracking',
                'Key insight extraction',
                'Configurable depth',
              ]}
            />
            <FeatureCard
              step="02"
              icon="✨"
              title="Refine"
              color="from-violet-500/20 to-violet-600/5"
              borderColor="border-violet-500/20"
              accentColor="text-violet-400"
              description="AI-powered editing that understands context and audience. Grammar, tone, structure, and voice — refined to match your exact requirements."
              capabilities={[
                'Audience-aware editing',
                'Tone adjustment',
                'Structural improvement',
                'Style consistency',
              ]}
            />
            <FeatureCard
              step="03"
              icon="🎨"
              title="Restyle"
              color="from-emerald-500/20 to-emerald-600/5"
              borderColor="border-emerald-500/20"
              accentColor="text-emerald-400"
              description="Transform content into any format. Executive reports, blog posts, technical documentation, presentations — one click, infinite formats."
              capabilities={[
                'Executive reports',
                'Blog posts',
                'Technical docs',
                'Presentations',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-prism-950/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="text-gradient">Provider Abstraction</span> Architecture
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              AI providers are swappable infrastructure. The abstraction layer below ensures
              business logic never changes when you switch between OpenAI, Azure, or local models.
            </p>
          </div>

          {/* Architecture diagram */}
          <div className="glass rounded-2xl border border-white/5 p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Client */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Client Layer</div>
                <div className="space-y-2">
                  {['Browser UI', 'Next.js App Router', 'Streaming SSE'].map((item) => (
                    <div key={item} className="text-sm text-white/70 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex flex-col items-center gap-2">
                <div className="w-full h-px bg-gradient-to-r from-sky-500/50 via-violet-500/50 to-emerald-500/50" />
                <div className="text-xs text-white/30 text-center">Provider Abstraction</div>
                <div className="glass rounded-lg px-3 py-2 border border-violet-500/20 text-xs text-violet-300 text-center">
                  AIProvider Interface
                </div>
                <div className="w-full h-px bg-gradient-to-r from-sky-500/50 via-violet-500/50 to-emerald-500/50" />
              </div>

              {/* Providers */}
              <div className="glass rounded-xl p-5 border border-white/10">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">AI Providers</div>
                <div className="space-y-2">
                  {[
                    { name: 'OpenAI GPT-4o', color: 'bg-green-400' },
                    { name: 'Azure OpenAI', color: 'bg-blue-400' },
                    { name: 'Ollama (Local)', color: 'bg-orange-400' },
                    { name: 'Demo Provider', color: 'bg-violet-400' },
                  ].map((provider) => (
                    <div key={provider.name} className="text-sm text-white/70 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${provider.color}`} />
                      {provider.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pipeline stages */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-4 text-center">
                Content Pipeline
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { stage: 'Research', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
                  { stage: '→', color: 'text-white/20' },
                  { stage: 'Refine', color: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
                  { stage: '→', color: 'text-white/20' },
                  { stage: 'Restyle', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                  { stage: '→', color: 'text-white/20' },
                  { stage: 'Export', color: 'bg-white/5 text-white/60 border-white/10' },
                ].map((item, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${item.color}`}
                  >
                    {item.stage}
                  </span>
                ))}
              </div>
            </div>

            {/* Key design decisions */}
            <div className="mt-6 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Interface-Driven Design',
                  desc: 'All providers implement AIProvider — swap OpenAI for Ollama with a single config change, no business logic changes.',
                },
                {
                  title: 'Streaming-First API',
                  desc: 'Server-sent events match LLM token generation. Time-to-first-token matters more than total latency for UX.',
                },
                {
                  title: 'Demo as a First-Class Provider',
                  desc: 'DemoProvider uses the same interface as production providers — zero code divergence between demo and live paths.',
                },
                {
                  title: 'Zod Input Validation',
                  desc: 'All API boundaries are validated at runtime. LLM platforms receive untrusted user input — schema validation is non-negotiable.',
                },
              ].map((decision) => (
                <div key={decision.title} className="glass rounded-lg p-4 border border-white/5">
                  <div className="text-sm font-medium text-white/80 mb-1">{decision.title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{decision.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-3">Built with Purpose</h2>
            <p className="text-white/40 text-sm">Each technology chosen for specific architectural reasons</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Next.js 14',
                reason: 'App Router for edge-compatible streaming API routes and optimal DX',
                color: 'text-white',
              },
              {
                name: 'TypeScript',
                reason: 'Type-safe provider interfaces prevent runtime errors at system boundaries',
                color: 'text-blue-400',
              },
              {
                name: 'Tailwind CSS',
                reason: 'Utility-first styling enables rapid UI iteration without CSS sprawl',
                color: 'text-cyan-400',
              },
              {
                name: 'Framer Motion',
                reason: 'Streaming animations require declarative animation primitives',
                color: 'text-violet-400',
              },
            ].map((tech) => (
              <div key={tech.name} className="glass rounded-xl p-5 border border-white/5 feature-card">
                <div className={`font-bold text-base mb-2 ${tech.color}`}>{tech.name}</div>
                <div className="text-xs text-white/40 leading-relaxed">{tech.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-prism-900/50 via-prism-800/30 to-prism-900/50" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See it in action.{' '}
            <span className="text-gradient">No API key required.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10">
            The demo runs on a pre-scripted DemoProvider that implements the same interface
            as production AI backends — so what you see is exactly how the real system behaves.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl btn-primary text-lg font-semibold shadow-glow"
          >
            <span>Launch the Demo</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-white/25">
            Streaming responses · Provider abstraction · Full pipeline in ~90 seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footer-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <polygon points="18,3 33,30 3,30" fill="url(#footer-grad)" opacity="0.8" />
              </svg>
            </div>
            <span className="text-white/40 text-sm">
              Prism AI — Refracting Intelligence into Clarity
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span>Built with Next.js 14</span>
            <span>·</span>
            <span>MIT License</span>
            <span>·</span>
            <span>v2.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  step,
  icon,
  title,
  color,
  borderColor,
  accentColor,
  description,
  capabilities,
}: {
  step: string
  icon: string
  title: string
  color: string
  borderColor: string
  accentColor: string
  description: string
  capabilities: string[]
}) {
  return (
    <div className={`glass rounded-2xl p-7 border ${borderColor} bg-gradient-to-br ${color} feature-card`}>
      <div className="flex items-start justify-between mb-5">
        <div className="text-3xl">{icon}</div>
        <div className={`text-xs font-mono ${accentColor} opacity-50`}>{step}</div>
      </div>
      <h3 className={`text-xl font-bold mb-3 ${accentColor}`}>{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed mb-5">{description}</p>
      <div className="space-y-2">
        {capabilities.map((cap) => (
          <div key={cap} className="flex items-center gap-2 text-xs text-white/60">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className={accentColor}>
              <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
            </svg>
            {cap}
          </div>
        ))}
      </div>
    </div>
  )
}
