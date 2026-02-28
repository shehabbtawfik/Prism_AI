'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

type Stage = 'research' | 'refine' | 'restyle'
type StageStatus = 'idle' | 'running' | 'done'

type OutputFormat = 'executive-report' | 'blog-post' | 'technical-doc' | 'markdown'

interface StageState {
  status: StageStatus
  content: string
  tokenCount: number
  durationMs: number
}

const INITIAL_STAGE: StageState = {
  status: 'idle',
  content: '',
  tokenCount: 0,
  durationMs: 0,
}

export default function DemoPage() {
  const [activeStage, setActiveStage] = useState<Stage>('research')
  const [topic, setTopic] = useState('The future of AI in software architecture')
  const [refineInstructions, setRefineInstructions] = useState(
    'Make this suitable for a CTO-level audience. Focus on strategic implications, trim technical jargon, and keep it under 400 words.'
  )
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('executive-report')

  const [research, setResearch] = useState<StageState>(INITIAL_STAGE)
  const [refine, setRefine] = useState<StageState>(INITIAL_STAGE)
  const [restyle, setRestyle] = useState<StageState>(INITIAL_STAGE)
  const [copied, setCopied] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const streamFromAPI = useCallback(
    async (
      endpoint: string,
      body: Record<string, string>,
      setter: React.Dispatch<React.SetStateAction<StageState>>
    ) => {
      const controller = new AbortController()
      abortRef.current = controller
      const start = Date.now()

      setter({ status: 'running', content: '', tokenCount: 0, durationMs: 0 })

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        if (!res.body) throw new Error('No response body')

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let fullContent = ''
        let tokens = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') break
            try {
              const parsed = JSON.parse(raw)
              if (parsed.chunk) {
                fullContent += parsed.chunk
                tokens += Math.ceil(parsed.chunk.length / 4)
                setter({
                  status: 'running',
                  content: fullContent,
                  tokenCount: tokens,
                  durationMs: Date.now() - start,
                })
              }
            } catch {
              // skip malformed
            }
          }
        }

        setter({
          status: 'done',
          content: fullContent,
          tokenCount: tokens,
          durationMs: Date.now() - start,
        })
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setter((prev) => ({ ...prev, status: 'idle' }))
        } else {
          setter((prev) => ({ ...prev, status: 'idle' }))
        }
      }
    },
    []
  )

  const runResearch = useCallback(async () => {
    await streamFromAPI('/api/research', { topic }, setResearch)
  }, [topic, streamFromAPI])

  const runRefine = useCallback(async () => {
    await streamFromAPI(
      '/api/refine',
      { content: research.content, instructions: refineInstructions },
      setRefine
    )
  }, [research.content, refineInstructions, streamFromAPI])

  const runRestyle = useCallback(async () => {
    await streamFromAPI(
      '/api/restyle',
      { content: refine.content, format: outputFormat },
      setRestyle
    )
  }, [refine.content, outputFormat, streamFromAPI])

  const handleCopy = useCallback(async () => {
    const content = restyle.content || refine.content || research.content
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [restyle.content, refine.content, research.content])

  const handleDownload = useCallback(() => {
    const content = restyle.content || refine.content || research.content
    if (!content) return
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prism-ai-output-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [restyle.content, refine.content, research.content])

  const resetAll = useCallback(() => {
    abortRef.current?.abort()
    setResearch(INITIAL_STAGE)
    setRefine(INITIAL_STAGE)
    setRestyle(INITIAL_STAGE)
    setActiveStage('research')
  }, [])

  const stateForStage = { research, refine, restyle }
  const currentState = stateForStage[activeStage]
  const isAnyRunning = research.status === 'running' || refine.status === 'running' || restyle.status === 'running'

  const formatOutput = outputFormat.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="min-h-screen bg-[#0a0514]">
      <Navigation />

      <div className="pt-16 min-h-screen flex flex-col">
        {/* Header bar */}
        <div className="border-b border-white/5 px-6 py-3 flex items-center justify-between glass-dark">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              ← Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-sm text-white/60">Interactive Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              DEMO MODE
            </span>
            <span className="text-xs text-white/30 hidden sm:block">No API key required</span>
            {(research.status === 'done' || refine.status === 'done' || restyle.status === 'done') && (
              <button
                onClick={resetAll}
                className="text-xs px-3 py-1.5 rounded-lg glass border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left: Controls */}
          <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col">
            {/* Stage stepper */}
            <div className="p-5 border-b border-white/5">
              <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Pipeline Stages</div>
              <div className="space-y-2">
                <StageTab
                  id="research"
                  label="Research"
                  number={1}
                  active={activeStage === 'research'}
                  status={research.status}
                  tokenCount={research.tokenCount}
                  durationMs={research.durationMs}
                  onClick={() => setActiveStage('research')}
                  color="sky"
                />
                <StageTab
                  id="refine"
                  label="Refine"
                  number={2}
                  active={activeStage === 'refine'}
                  status={refine.status}
                  tokenCount={refine.tokenCount}
                  durationMs={refine.durationMs}
                  onClick={() => research.status === 'done' && setActiveStage('refine')}
                  disabled={research.status !== 'done'}
                  color="violet"
                />
                <StageTab
                  id="restyle"
                  label="Restyle"
                  number={3}
                  active={activeStage === 'restyle'}
                  status={restyle.status}
                  tokenCount={restyle.tokenCount}
                  durationMs={restyle.durationMs}
                  onClick={() => refine.status === 'done' && setActiveStage('restyle')}
                  disabled={refine.status !== 'done'}
                  color="emerald"
                />
              </div>
            </div>

            {/* Stage controls */}
            <div className="flex-1 p-5 overflow-auto">
              {activeStage === 'research' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
                      Research Topic
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      rows={3}
                      className="w-full prism-input rounded-lg px-3 py-2.5 text-sm resize-none"
                      placeholder="Enter a topic to research..."
                    />
                  </div>
                  <button
                    onClick={runResearch}
                    disabled={isAnyRunning || !topic.trim()}
                    className="w-full py-3 rounded-xl btn-primary font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>
                      {research.status === 'running' ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingDots /> Researching...
                        </span>
                      ) : research.status === 'done' ? (
                        '✓ Research Complete — Run Again?'
                      ) : (
                        'Run Research →'
                      )}
                    </span>
                  </button>
                  {research.status === 'done' && (
                    <button
                      onClick={() => setActiveStage('refine')}
                      className="w-full py-2.5 rounded-xl glass border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-500/10 transition-all"
                    >
                      Continue to Refine →
                    </button>
                  )}
                </div>
              )}

              {activeStage === 'refine' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
                      Refinement Instructions
                    </label>
                    <textarea
                      value={refineInstructions}
                      onChange={(e) => setRefineInstructions(e.target.value)}
                      rows={5}
                      className="w-full prism-input rounded-lg px-3 py-2.5 text-sm resize-none"
                      placeholder="How should the content be refined? (audience, tone, length...)"
                    />
                  </div>
                  <button
                    onClick={runRefine}
                    disabled={isAnyRunning || research.status !== 'done'}
                    className="w-full py-3 rounded-xl btn-primary font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>
                      {refine.status === 'running' ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingDots /> Refining...
                        </span>
                      ) : refine.status === 'done' ? (
                        '✓ Refinement Complete — Run Again?'
                      ) : (
                        'Run Refinement →'
                      )}
                    </span>
                  </button>
                  {refine.status === 'done' && (
                    <button
                      onClick={() => setActiveStage('restyle')}
                      className="w-full py-2.5 rounded-xl glass border border-emerald-500/30 text-emerald-300 text-sm font-medium hover:bg-emerald-500/10 transition-all"
                    >
                      Continue to Restyle →
                    </button>
                  )}
                </div>
              )}

              {activeStage === 'restyle' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-2 uppercase tracking-wider">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                      className="w-full prism-input rounded-lg px-3 py-2.5 text-sm"
                    >
                      <option value="executive-report">Executive Report</option>
                      <option value="blog-post">Blog Post</option>
                      <option value="technical-doc">Technical Documentation</option>
                      <option value="markdown">Plain Markdown</option>
                    </select>
                    <p className="text-xs text-white/30 mt-1.5">
                      Selected: <span className="text-white/50">{formatOutput}</span>
                    </p>
                  </div>
                  <button
                    onClick={runRestyle}
                    disabled={isAnyRunning || refine.status !== 'done'}
                    className="w-full py-3 rounded-xl btn-primary font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span>
                      {restyle.status === 'running' ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingDots /> Restyling...
                        </span>
                      ) : restyle.status === 'done' ? (
                        '✓ Restyle Complete — Run Again?'
                      ) : (
                        'Run Restyle →'
                      )}
                    </span>
                  </button>

                  {restyle.status === 'done' && (
                    <div className="space-y-2">
                      <button
                        onClick={handleCopy}
                        className="w-full py-2.5 rounded-xl glass border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 transition-all"
                      >
                        {copied ? '✓ Copied!' : 'Copy Output'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="w-full py-2.5 rounded-xl glass border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 transition-all"
                      >
                        Download .md
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Provider info */}
            <div className="p-4 border-t border-white/5">
              <div className="glass rounded-lg p-3 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse-slow" />
                  <span className="text-xs font-medium text-violet-300">Demo Provider Active</span>
                </div>
                <p className="text-xs text-white/30 leading-relaxed">
                  Using pre-scripted responses that stream at ~30ms/token — same interface as production AI providers.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Output */}
          <div className="flex-1 flex flex-col min-h-[60vh] lg:min-h-0">
            {/* Output header */}
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <StageIndicator stage={activeStage} status={currentState.status} />
                <span className="text-sm text-white/50">
                  {activeStage.charAt(0).toUpperCase() + activeStage.slice(1)} Output
                </span>
              </div>
              {currentState.status !== 'idle' && (
                <div className="flex items-center gap-3 text-xs text-white/30">
                  {currentState.tokenCount > 0 && (
                    <span className="font-mono">
                      ~{currentState.tokenCount.toLocaleString()} tokens
                    </span>
                  )}
                  {currentState.durationMs > 0 && (
                    <span className="font-mono">
                      {(currentState.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto p-6">
              {currentState.status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-40">
                  <div className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-2xl">
                    {activeStage === 'research' ? '🔍' : activeStage === 'refine' ? '✨' : '🎨'}
                  </div>
                  <div>
                    <div className="text-white/60 font-medium mb-1">
                      {activeStage === 'research'
                        ? 'Ready to Research'
                        : activeStage === 'refine'
                        ? 'Ready to Refine'
                        : 'Ready to Restyle'}
                    </div>
                    <div className="text-white/30 text-sm">
                      {activeStage === 'research'
                        ? 'Enter a topic and click Run Research'
                        : activeStage === 'refine'
                        ? 'Add instructions and click Run Refinement'
                        : 'Choose a format and click Run Restyle'}
                    </div>
                  </div>
                </div>
              )}

              {currentState.status !== 'idle' && (
                <div className="max-w-3xl">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-white/80 leading-relaxed">
                    {currentState.content}
                    {currentState.status === 'running' && (
                      <span className="inline-block w-0.5 h-4 bg-prism-400 ml-0.5 animate-pulse" />
                    )}
                  </pre>
                  {currentState.status === 'done' && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                          <path d="M12.28 2.28L5.989 8.575 3.695 6.28A1 1 0 002.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0012.28 2.28z" />
                        </svg>
                        Stage complete · {(currentState.durationMs / 1000).toFixed(1)}s ·{' '}
                        ~{currentState.tokenCount.toLocaleString()} tokens
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo explainer strip */}
        {restyle.status === 'done' && (
          <div className="border-t border-white/5 px-6 py-4 bg-prism-950/50">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-white/50">
                <span className="text-white/80 font-medium">Demo complete.</span> You just watched
                a full Research → Refine → Restyle pipeline. The DemoProvider implements the same{' '}
                <span className="font-mono text-violet-400">AIProvider</span> interface as OpenAI
                and Ollama — no code changes when switching to a real provider.
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-lg glass border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/20 transition-all"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button
                  onClick={resetAll}
                  className="px-4 py-2 rounded-lg btn-primary text-sm font-medium"
                >
                  <span>Run Again</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StageTab({
  label,
  number,
  active,
  status,
  tokenCount,
  durationMs,
  onClick,
  disabled,
  color,
}: {
  id: Stage
  label: string
  number: number
  active: boolean
  status: StageStatus
  tokenCount: number
  durationMs: number
  onClick: () => void
  disabled?: boolean
  color: 'sky' | 'violet' | 'emerald'
}) {
  const colorMap = {
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/40' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/40' },
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/40' },
  }
  const c = colorMap[color]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
        active
          ? `${c.bg} ${c.border} ${c.text}`
          : disabled
          ? 'border-white/5 text-white/20 cursor-not-allowed'
          : 'border-white/10 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/3'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          status === 'done'
            ? 'bg-emerald-500/30 text-emerald-400'
            : status === 'running'
            ? `${c.bg} ${c.text}`
            : active
            ? `${c.bg} ${c.text}`
            : 'bg-white/5 text-white/30'
        }`}
      >
        {status === 'done' ? '✓' : status === 'running' ? '…' : number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{label}</div>
        {(status === 'done' || status === 'running') && (
          <div className="text-xs opacity-60 font-mono mt-0.5">
            {status === 'running' && 'streaming...'}
            {status === 'done' && `${(durationMs / 1000).toFixed(1)}s · ~${tokenCount} tokens`}
          </div>
        )}
      </div>
    </button>
  )
}

function StageIndicator({ stage, status }: { stage: Stage; status: StageStatus }) {
  const colorMap: Record<Stage, string> = {
    research: 'bg-sky-400',
    refine: 'bg-violet-400',
    restyle: 'bg-emerald-400',
  }

  return (
    <div
      className={`w-2 h-2 rounded-full ${colorMap[stage]} ${
        status === 'running' ? 'animate-pulse' : ''
      }`}
    />
  )
}

function LoadingDots() {
  return (
    <span className="loading-dots">
      <span />
      <span />
      <span />
    </span>
  )
}
