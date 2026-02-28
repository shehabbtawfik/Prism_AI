'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─── Chapter definitions ────────────────────────────────────────────────────

type ChapterId = 'intro' | 'research' | 'refine' | 'restyle' | 'outro'

interface Chapter {
  id: ChapterId
  label: string
  duration: number   // approx seconds at normal speed
  color: string
  icon: string
  accent: string
}

const CHAPTERS: Chapter[] = [
  { id: 'intro',    label: 'Introduction',  duration: 4,  color: 'text-white',         icon: '✦',  accent: '#7c3aed' },
  { id: 'research', label: 'Research',      duration: 22, color: 'text-sky-400',        icon: '🔍', accent: '#38bdf8' },
  { id: 'refine',   label: 'Refine',        duration: 18, color: 'text-violet-400',     icon: '✨', accent: '#a78bfa' },
  { id: 'restyle',  label: 'Restyle',       duration: 18, color: 'text-emerald-400',    icon: '🎨', accent: '#34d399' },
  { id: 'outro',    label: 'Summary',       duration: 5,  color: 'text-white',          icon: '⬟',  accent: '#7c3aed' },
]

const TOTAL_DURATION = CHAPTERS.reduce((s, c) => s + c.duration, 0)

// ─── Pre-scripted content ───────────────────────────────────────────────────

const RESEARCH_TEXT = `## AI in Modern Software Architecture: Research Brief

### Executive Summary
Artificial intelligence has evolved from an experimental feature into a foundational infrastructure layer in enterprise software. The shift is architectural in nature — AI is no longer a bolt-on capability but a first-class system component that shapes how we design, deploy, and scale applications.

### Key Insights

**1. AI as Infrastructure, Not Feature**
Leading technology organizations are treating AI capabilities the same way they treat databases and message queues: as infrastructure to be abstracted, composed, and swapped. The emergence of LLM provider abstraction layers signals that teams have learned from API dependency lock-in and are designing for provider portability from day one.

**2. Streaming is the New Request/Response**
Server-sent events and streaming APIs have become the dominant pattern for AI-powered interfaces. Users tolerate slower total completion times when they see incremental progress — a critical UX insight for AI architects.

**3. Multi-Provider Architecture Reduces Risk**
Teams that hardcode a single AI provider face significant business risk: pricing changes, rate limits, model deprecations. The emerging best practice is a provider abstraction layer with automatic failover — treating LLMs as a commodity pool, not a vendor relationship.

**4. Prompt Engineering is Software Engineering**
Prompt management has moved from ad-hoc string interpolation to structured, versioned, testable artifacts. Production teams maintain prompt libraries with the same rigor as code — with A/B testing, regression detection, and deployment pipelines.`

const REFINE_TEXT = `## AI Infrastructure: Executive Brief

### The Core Shift
AI has crossed the threshold from experimental feature to infrastructure layer. For technology leaders, this demands an architectural response — not a product decision.

### Three Strategic Imperatives

**Architect for Provider Portability**
Hardcoding an AI vendor is the same mistake as hardcoding a database vendor in 2005. Build a provider abstraction layer now. The teams that do this will weather pricing changes and model deprecations without incident.

**Invest in Streaming-First Design**
Real-time streaming APIs are not a UX preference — they are a technical necessity. Users' perception of AI quality correlates more with time-to-first-token than total response quality. Design your API layer accordingly.

**Treat Prompts as Versioned Software Artifacts**
Prompt engineering is engineering. Establish a prompt management discipline with version control, regression testing, and deployment gates. Prompt drift is a silent quality degradation risk.

### The Competitive Advantage
Organizations that internalize AI as infrastructure will build platforms that compound in value. The architectural decisions made today will determine which teams can adapt rapidly as models improve.`

const RESTYLE_TEXT = `# AI Infrastructure Strategy
## Executive Report — Q1 2025

---

### Overview

This report examines the strategic implications of treating artificial intelligence as infrastructure rather than a product feature.

---

### Key Metrics

| Metric | Finding |
|--------|---------|
| AI projects failing due to lock-in | 73% |
| Speed increase with abstraction layer | 2.4× faster |
| Perceived latency reduction (streaming) | 60% |

---

### Recommendations

| Priority | Action | Timeline |
|----------|--------|----------|
| High | Implement AI provider abstraction layer | Q1 2025 |
| High | Migrate to streaming-first API design | Q1 2025 |
| Medium | Establish prompt versioning practice | Q2 2025 |

---

### Architecture Blueprint

\`\`\`
Client → API Routes → Provider Interface
                       ├── OpenAI
                       ├── Azure AI
                       ├── Ollama (local)
                       └── Demo Provider
\`\`\`

---

*Prism AI Platform — Refracting Intelligence into Clarity*`

// ─── Typewriter hook ────────────────────────────────────────────────────────

function useTypewriter(
  text: string,
  active: boolean,
  charsPerTick = 4,
  tickMs = 20
) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const posRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!active) {
      setDisplayed('')
      setDone(false)
      posRef.current = 0
      return
    }

    timerRef.current = setInterval(() => {
      posRef.current = Math.min(posRef.current + charsPerTick, text.length)
      setDisplayed(text.slice(0, posRef.current))
      if (posRef.current >= text.length) {
        clearInterval(timerRef.current!)
        setDone(true)
      }
    }, tickMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [active, text, charsPerTick, tickMs])

  return { displayed, done }
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function ShowcasePage() {
  const [chapter, setChapter] = useState<ChapterId>('intro')
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [started, setStarted] = useState(false)
  const [ended, setEnded] = useState(false)
  const pausedRef = useRef(false)
  const elapsedRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep refs in sync
  useEffect(() => { pausedRef.current = paused }, [paused])

  // Typewriters — only active during their chapter
  const researchTW = useTypewriter(RESEARCH_TEXT, chapter === 'research' && !paused, 3, 22)
  const refineTW   = useTypewriter(REFINE_TEXT,   chapter === 'refine'   && !paused, 3, 22)
  const restyleTW  = useTypewriter(RESTYLE_TEXT,  chapter === 'restyle'  && !paused, 3, 22)

  // Derived chapter boundary offsets
  const chapterOffsets = CHAPTERS.reduce<Record<ChapterId, number>>((acc, c, i) => {
    acc[c.id] = CHAPTERS.slice(0, i).reduce((s, x) => s + x.duration, 0)
    return acc
  }, {} as Record<ChapterId, number>)

  const getChapterAt = useCallback((t: number): ChapterId => {
    let cumulative = 0
    for (const c of CHAPTERS) {
      cumulative += c.duration
      if (t < cumulative) return c.id
    }
    return 'outro'
  }, [])

  // Global timer
  useEffect(() => {
    if (!started || ended) return

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return
      elapsedRef.current += 0.1
      const t = elapsedRef.current
      setElapsed(t)

      const nextChapter = getChapterAt(t)
      setChapter(nextChapter)

      if (t >= TOTAL_DURATION) {
        clearInterval(timerRef.current!)
        setEnded(true)
        setChapter('outro')
      }
    }, 100)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [started, ended, getChapterAt])

  const handleStart = () => {
    setStarted(true)
    setEnded(false)
    setElapsed(0)
    elapsedRef.current = 0
    setChapter('intro')
    setPaused(false)
  }

  const handleRestart = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setStarted(false)
    setEnded(false)
    setElapsed(0)
    elapsedRef.current = 0
    setChapter('intro')
    setPaused(false)
    // defer so state clears
    setTimeout(() => setStarted(true), 50)
  }

  const handleChapterClick = (c: Chapter) => {
    if (!started) { setStarted(true); setPaused(true) }
    const offset = chapterOffsets[c.id]
    elapsedRef.current = offset + 0.01
    setElapsed(offset + 0.01)
    setChapter(c.id)
    setPaused(false)
    setEnded(false)
  }

  const progress = Math.min(elapsed / TOTAL_DURATION, 1)
  const currentChapterObj = CHAPTERS.find(c => c.id === chapter)!
  const chapterProgress = (() => {
    const offset = chapterOffsets[chapter]
    const dur = currentChapterObj.duration
    return Math.min((elapsed - offset) / dur, 1)
  })()

  return (
    <div className="min-h-screen bg-[#060310] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 glass-dark flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
            <defs>
              <linearGradient id="sc-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <polygon points="18,3 33,30 3,30" fill="url(#sc-grad)" opacity="0.9" />
            <polygon points="18,9 28,28 8,28" fill="rgba(6,3,16,0.7)" />
          </svg>
          <span className="font-bold text-white text-sm">Prism AI</span>
          <span className="text-white/30 text-sm ml-1">/ Showcase</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono hidden sm:block">
            INTERACTIVE DEMO
          </span>
          <Link href="/demo" className="text-xs px-3 py-1.5 rounded-lg glass border border-white/10 text-white/50 hover:text-white transition-all">
            Try Live →
          </Link>
        </div>
      </div>

      {/* Stage area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 transition-all duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${currentChapterObj.accent}15 0%, transparent 70%)`,
          }}
        />

        {/* Content panel */}
        <div className="relative w-full max-w-4xl">
          {/* Chapter badge */}
          {started && !ended && (
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                chapter === 'research' ? 'bg-sky-500/20 border-sky-500/30 text-sky-400' :
                chapter === 'refine'   ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' :
                chapter === 'restyle'  ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                                        'bg-white/5 border-white/10 text-white/50'
              }`}>
                {currentChapterObj.icon} {currentChapterObj.label.toUpperCase()}
              </span>
              {/* Chapter progress bar */}
              <div className="flex-1 h-px bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${chapterProgress * 100}%`,
                    background: currentChapterObj.accent,
                  }}
                />
              </div>
            </div>
          )}

          {/* Display panel */}
          <div
            className="glass rounded-2xl border border-white/5 overflow-hidden"
            style={{ minHeight: '420px', maxHeight: '520px' }}
          >
            {/* Intro */}
            {(chapter === 'intro' || !started) && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center" style={{ minHeight: '420px' }}>
                <div className="mb-6 animate-float">
                  <svg viewBox="0 0 80 100" fill="none" className="w-20 h-24 mx-auto">
                    <defs>
                      <linearGradient id="intro-g" x1="0" y1="0" x2="80" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <polygon points="40,5 75,85 5,85" fill="url(#intro-g)" opacity="0.4" />
                    <polygon points="40,5 75,85 5,85" fill="none" stroke="url(#intro-g)" strokeWidth="1.5" />
                    <line x1="40" y1="85" x2="78" y2="98" stroke="#06b6d4" strokeWidth="1.5" opacity="0.8" />
                    <line x1="40" y1="85" x2="63" y2="98" stroke="#6366f1" strokeWidth="1.5" opacity="0.8" />
                    <line x1="40" y1="85" x2="47" y2="100" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
                    <line x1="40" y1="85" x2="30" y2="100" stroke="#7c3aed" strokeWidth="1.5" opacity="0.6" />
                    <line x1="40" y1="85" x2="14" y2="97" stroke="#5b21b6" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                  Prism <span className="text-gradient">AI</span>
                </h1>
                <p className="text-white/50 text-lg mb-1">Refracting Intelligence into Clarity</p>
                <p className="text-white/30 text-sm max-w-md">
                  Watch the full Research → Refine → Restyle pipeline run live
                </p>

                {!started && (
                  <button
                    onClick={handleStart}
                    className="mt-8 px-8 py-4 rounded-xl btn-primary font-semibold text-base flex items-center gap-3 shadow-prism"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                      <path d="M4 3.5v11L15 9z" />
                    </svg>
                    <span>Play Demo</span>
                  </button>
                )}

                {started && chapter === 'intro' && (
                  <div className="mt-8 flex items-center gap-2 text-white/40 text-sm">
                    <span className="loading-dots"><span /><span /><span /></span>
                    Starting pipeline...
                  </div>
                )}
              </div>
            )}

            {/* Research chapter */}
            {chapter === 'research' && (
              <div className="flex flex-col h-full" style={{ minHeight: '420px' }}>
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 bg-sky-500/5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-sm text-sky-400 font-medium">Research Engine</span>
                  <span className="text-xs text-white/30 ml-auto font-mono">
                    Topic: "AI in Software Architecture"
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-5">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-white/75 leading-relaxed">
                    {researchTW.displayed}
                    {!researchTW.done && (
                      <span className="inline-block w-0.5 h-3.5 bg-sky-400 ml-0.5 animate-pulse" />
                    )}
                  </pre>
                </div>
                {researchTW.done && (
                  <div className="px-5 py-2.5 border-t border-white/5 bg-emerald-500/5 flex items-center gap-2 flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="#34d399">
                      <path d="M11.28 2.28L4.989 8.575 2.695 6.28A1 1 0 001.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0011.28 2.28z" />
                    </svg>
                    <span className="text-xs text-emerald-400">Research complete · ~847 tokens · 8.2s</span>
                    <span className="text-xs text-white/30 ml-2">Advancing to Refine...</span>
                  </div>
                )}
              </div>
            )}

            {/* Refine chapter */}
            {chapter === 'refine' && (
              <div className="flex flex-col h-full" style={{ minHeight: '420px' }}>
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 bg-violet-500/5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-sm text-violet-400 font-medium">Refinement Engine</span>
                  <span className="text-xs text-white/30 ml-auto font-mono">
                    Instructions: "CTO audience, 400 words max"
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-5">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-white/75 leading-relaxed">
                    {refineTW.displayed}
                    {!refineTW.done && (
                      <span className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 animate-pulse" />
                    )}
                  </pre>
                </div>
                {refineTW.done && (
                  <div className="px-5 py-2.5 border-t border-white/5 bg-emerald-500/5 flex items-center gap-2 flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="#34d399">
                      <path d="M11.28 2.28L4.989 8.575 2.695 6.28A1 1 0 001.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0011.28 2.28z" />
                    </svg>
                    <span className="text-xs text-emerald-400">Refinement complete · ~612 tokens · 6.8s</span>
                    <span className="text-xs text-white/30 ml-2">Advancing to Restyle...</span>
                  </div>
                )}
              </div>
            )}

            {/* Restyle chapter */}
            {chapter === 'restyle' && (
              <div className="flex flex-col h-full" style={{ minHeight: '420px' }}>
                <div className="px-5 py-3 border-b border-white/5 flex items-center gap-3 bg-emerald-500/5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400 font-medium">Restyle Engine</span>
                  <span className="text-xs text-white/30 ml-auto font-mono">
                    Format: Executive Report
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-5">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-white/75 leading-relaxed">
                    {restyleTW.displayed}
                    {!restyleTW.done && (
                      <span className="inline-block w-0.5 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
                    )}
                  </pre>
                </div>
                {restyleTW.done && (
                  <div className="px-5 py-2.5 border-t border-white/5 bg-emerald-500/5 flex items-center gap-2 flex-shrink-0">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="#34d399">
                      <path d="M11.28 2.28L4.989 8.575 2.695 6.28A1 1 0 001.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0011.28 2.28z" />
                    </svg>
                    <span className="text-xs text-emerald-400">Restyle complete · ~523 tokens · 5.9s</span>
                  </div>
                )}
              </div>
            )}

            {/* Outro */}
            {chapter === 'outro' && ended && (
              <div className="flex flex-col items-center justify-center p-10 text-center" style={{ minHeight: '420px' }}>
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-3">Pipeline Complete</h2>
                <div className="spectrum-line w-24 mx-auto mb-5" />
                <p className="text-white/50 text-sm max-w-lg mb-2">
                  You just watched a full <span className="text-white/80">Research → Refine → Restyle</span> pipeline
                  run on Prism AI — powered by the DemoProvider, which implements the same
                  <span className="font-mono text-violet-400"> AIProvider</span> interface as OpenAI and Ollama.
                </p>
                <p className="text-white/30 text-xs mb-8 max-w-md">
                  No API key required. Switching to a live AI provider requires only a config change — zero business logic changes.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRestart}
                    className="px-5 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M7 2a5 5 0 100 10A5 5 0 007 2zM1 7a6 6 0 1112 0A6 6 0 011 7z" />
                      <path d="M7 4v3.414l2.293 2.293-.707.707L6 7.828V4h1z" />
                    </svg>
                    Watch Again
                  </button>
                  <Link
                    href="/demo"
                    className="px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold flex items-center gap-2"
                  >
                    <span>Try it Yourself</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <path d="M9.293 2.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 8H2a1 1 0 110-2h9.586L9.293 3.707a1 1 0 010-1.414z" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player controls */}
      <div className="border-t border-white/5 glass-dark px-6 py-4 flex-shrink-0">
        {/* Timeline */}
        <div className="mb-3">
          {/* Chapter markers */}
          <div className="flex mb-1.5">
            {CHAPTERS.map((c) => {
              const pct = (c.duration / TOTAL_DURATION) * 100
              const isActive = c.id === chapter
              const isPast = elapsed > chapterOffsets[c.id] + c.duration
              return (
                <button
                  key={c.id}
                  onClick={() => handleChapterClick(c)}
                  className="group flex flex-col items-start transition-all"
                  style={{ width: `${pct}%` }}
                  title={`Jump to ${c.label}`}
                >
                  <span
                    className={`text-xs mb-1 truncate max-w-full transition-colors ${
                      isActive ? c.color : isPast ? 'text-white/40' : 'text-white/20'
                    } group-hover:text-white/70`}
                  >
                    {c.icon} {c.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
            {/* Chapter segments */}
            {CHAPTERS.map((c) => {
              const left = (chapterOffsets[c.id] / TOTAL_DURATION) * 100
              const width = (c.duration / TOTAL_DURATION) * 100
              const segProgress = Math.max(0, Math.min(1, (elapsed - chapterOffsets[c.id]) / c.duration))
              return (
                <div
                  key={c.id}
                  className="absolute top-0 h-full transition-all duration-100"
                  style={{
                    left: `${left}%`,
                    width: `${width * segProgress}%`,
                    background: c.accent,
                    opacity: 0.8,
                  }}
                />
              )
            })}
            {/* Playhead */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg transition-all duration-100"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-4">
          {/* Play/Pause */}
          {started && !ended ? (
            <button
              onClick={() => setPaused((p) => !p)}
              className="w-9 h-9 rounded-full glass border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 2.5v9L12 7z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="3" y="2" width="3" height="10" rx="1" />
                  <rect x="8" y="2" width="3" height="10" rx="1" />
                </svg>
              )}
            </button>
          ) : (
            <button
              onClick={started ? handleRestart : handleStart}
              className="w-9 h-9 rounded-full glass border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
              {ended ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 1a6 6 0 110 12A6 6 0 017 1zm0 1a5 5 0 100 10A5 5 0 007 2zm.5 2v4.75l3.25 1.75-.5.87L6.5 9.25V4h1z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M3 2.5v9L12 7z" />
                </svg>
              )}
            </button>
          )}

          {/* Time */}
          <span className="font-mono text-xs text-white/30 tabular-nums w-20">
            {Math.floor(elapsed / 60)}:{String(Math.floor(elapsed % 60)).padStart(2, '0')} / {Math.floor(TOTAL_DURATION / 60)}:{String(TOTAL_DURATION % 60).padStart(2, '0')}
          </span>

          {/* Chapter pills */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            {CHAPTERS.filter(c => c.id !== 'intro' && c.id !== 'outro').map((c) => (
              <button
                key={c.id}
                onClick={() => handleChapterClick(c)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  c.id === chapter
                    ? `${
                        c.id === 'research' ? 'bg-sky-500/20 border-sky-500/40 text-sky-400' :
                        c.id === 'refine'   ? 'bg-violet-500/20 border-violet-500/40 text-violet-400' :
                                             'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      }`
                    : 'border-white/10 text-white/30 hover:text-white/60 hover:border-white/20'
                }`}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="ml-auto flex items-center gap-2">
            {paused && (
              <span className="text-xs text-white/30 font-mono animate-pulse">PAUSED</span>
            )}
            <Link
              href="/demo"
              className="text-xs px-3 py-1.5 rounded-lg glass border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              Try Live →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
