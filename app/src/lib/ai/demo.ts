/**
 * Prism AI Demo Provider
 *
 * Implements the AIProvider interface with pre-scripted, realistic responses
 * that stream character-by-character at ~30ms/token — indistinguishable from
 * a live LLM. This enables zero-credential demos while sharing 100% of the
 * production code path. This is an explicit architectural pattern: the
 * DemoProvider is dependency-injected at the provider selection layer,
 * not scattered through business logic.
 */

import { sleep } from '../utils'
import type { AIProvider, ResearchResult, RefineResult, RestyleResult, OutputFormat } from './providers'

const DEMO_RESEARCH_CONTENT = `## AI in Modern Software Architecture: Research Brief

### Executive Summary
Artificial intelligence has evolved from an experimental feature into a foundational infrastructure layer in enterprise software. The shift is architectural in nature — AI is no longer a bolt-on capability but a first-class system component that shapes how we design, deploy, and scale applications.

### Key Insights

**1. AI as Infrastructure, Not Feature**
Leading technology organizations are treating AI capabilities the same way they treat databases and message queues: as infrastructure to be abstracted, composed, and swapped. The emergence of LLM provider abstraction layers (as seen in LangChain, Semantic Kernel, and custom implementations) signals that teams have learned from API dependency lock-in and are designing for provider portability from day one.

**2. Streaming is the New Request/Response**
Server-sent events and streaming APIs have become the dominant pattern for AI-powered interfaces. The reason is both technical (matching LLM token generation) and psychological (perceived performance). Users tolerate slower total completion times when they see incremental progress — a critical UX insight for AI architects.

**3. Multi-Provider Architecture Reduces Catastrophic Dependency Risk**
Teams that hardcode a single AI provider face significant business risk: pricing changes, rate limits, model deprecations, and service outages. The emerging best practice is a provider abstraction layer with automatic failover — architecture that treats LLMs as a commodity pool rather than a vendor relationship.

**4. Prompt Engineering is Software Engineering**
Prompt management has moved from ad-hoc string interpolation to structured, versioned, testable artifacts. Production teams maintain prompt libraries with the same rigor as code — with A/B testing, regression detection, and deployment pipelines.

**5. Observability is Non-Negotiable**
Token usage, latency percentiles, provider error rates, and cost-per-request have become core platform metrics. AI architects are instrumenting their platforms with the same rigor as distributed systems — because that is what they are.`

const DEMO_REFINE_CONTENT = `## AI Infrastructure: Executive Brief for Technology Leaders

### The Core Shift
AI has crossed the threshold from experimental feature to infrastructure layer. For technology leaders, this demands an architectural response — not a product decision.

### Three Strategic Imperatives

**Architect for Provider Portability**
Hardcoding an AI vendor is the same mistake as hardcoding a database vendor in 2005. Build a provider abstraction layer now. The teams that do this will weather pricing changes, model deprecations, and service disruptions without incident. Those that don't will face costly re-architecture under pressure.

**Invest in Streaming-First Design**
Real-time streaming APIs are not a UX preference — they are a technical necessity for AI-powered products. Users' perception of AI quality correlates more with time-to-first-token than with total response quality. Design your API layer accordingly.

**Treat Prompts as Versioned Software Artifacts**
Prompt engineering is engineering. Establish a prompt management discipline with version control, regression testing, and deployment gates. Prompt drift is a silent quality degradation risk that has caused significant production incidents at scale.

### The Competitive Advantage
Organizations that internalize AI as infrastructure — not feature — will build platforms that compound in value. The architectural decisions made in the next 18 months will determine which teams can adapt rapidly as models improve and which teams are constrained by technical debt.`

const DEMO_RESTYLE_CONTENT = `# AI Infrastructure Strategy
## Executive Report — Q1 2025

---

### Overview

This report examines the strategic implications of treating artificial intelligence as infrastructure rather than a product feature. The findings are drawn from analysis of leading technology organizations and represent a synthesis of emerging architectural best practices.

---

### Strategic Context

The AI landscape has undergone a fundamental transition. What began as experimental capabilities has become core infrastructure — as foundational to modern software as databases, message queues, and content delivery networks.

**Key Metrics**
- 73% of enterprise AI projects fail due to provider lock-in and architectural inflexibility
- Teams with provider abstraction layers ship AI features 2.4× faster
- Streaming-first APIs reduce perceived latency by 60% with no change to backend performance

---

### Recommendations

| Priority | Action | Timeline |
|----------|--------|----------|
| High | Implement AI provider abstraction layer | Q1 2025 |
| High | Migrate to streaming-first API design | Q1 2025 |
| Medium | Establish prompt versioning practice | Q2 2025 |
| Medium | Deploy AI observability dashboard | Q2 2025 |
| Low | Evaluate multi-region AI deployment | Q3 2025 |

---

### Architecture Blueprint

\`\`\`
Client Layer          API Layer              Provider Layer
─────────────    ─────────────────────    ──────────────────
 Browser UI  →   Next.js API Routes   →   Provider Interface
                  (streaming SSE)          ├── OpenAI
                  Rate Limiting            ├── Azure AI
                  Auth Middleware          ├── Ollama (local)
                  Request Validation       └── Demo Provider
\`\`\`

---

### Conclusion

The organizations that will lead in AI-powered software are those that architect AI as infrastructure today. Provider portability, streaming-first design, and prompt engineering discipline are not optimizations — they are table stakes for production AI systems.

---

*Prism AI Platform — Refracting Intelligence into Clarity*`

async function* streamText(text: string, chunkSize = 3): AsyncGenerator<string> {
  for (let i = 0; i < text.length; i += chunkSize) {
    yield text.slice(i, i + chunkSize)
    await sleep(25 + Math.random() * 15)
  }
}

export class DemoProvider implements AIProvider {
  readonly name = 'Demo Mode'
  readonly id = 'demo'
  readonly isDemo = true

  async *research(topic: string): AsyncGenerator<string, ResearchResult, unknown> {
    const start = Date.now()
    let fullContent = ''

    for await (const chunk of streamText(DEMO_RESEARCH_CONTENT)) {
      fullContent += chunk
      yield chunk
    }

    return {
      summary: fullContent,
      keyInsights: [
        'AI as Infrastructure, Not Feature',
        'Streaming is the New Request/Response',
        'Multi-Provider Architecture Reduces Risk',
        'Prompt Engineering is Software Engineering',
        'Observability is Non-Negotiable',
      ],
      citations: [
        {
          title: 'AI Infrastructure Patterns at Scale',
          url: 'https://example.com/ai-infrastructure',
          snippet: 'Leading organizations are treating AI capabilities as infrastructure...',
          domain: 'techreview.example.com',
        },
        {
          title: 'The Economics of LLM Provider Portability',
          url: 'https://example.com/provider-portability',
          snippet: 'Provider abstraction has become a critical architectural pattern...',
          domain: 'engineering.example.com',
        },
        {
          title: 'Streaming APIs and Perceived Performance',
          url: 'https://example.com/streaming-ux',
          snippet: 'Users tolerate slower total completion times when they see incremental progress...',
          domain: 'ux.example.com',
        },
      ],
      tokenCount: 847,
      durationMs: Date.now() - start,
    }
  }

  async *refine(content: string, instructions: string): AsyncGenerator<string, RefineResult, unknown> {
    const start = Date.now()
    let fullContent = ''

    for await (const chunk of streamText(DEMO_REFINE_CONTENT)) {
      fullContent += chunk
      yield chunk
    }

    return {
      content: fullContent,
      changes: [
        'Reduced length by 40% for executive audience',
        'Replaced technical jargon with strategic framing',
        'Added action-oriented section headers',
        'Converted paragraph lists to scannable bullet points',
        'Strengthened call-to-action language',
      ],
      tokenCount: 612,
      durationMs: Date.now() - start,
    }
  }

  async *restyle(content: string, format: OutputFormat): AsyncGenerator<string, RestyleResult, unknown> {
    const start = Date.now()
    let fullContent = ''

    for await (const chunk of streamText(DEMO_RESTYLE_CONTENT)) {
      fullContent += chunk
      yield chunk
    }

    return {
      content: fullContent,
      format,
      wordCount: fullContent.split(' ').length,
      tokenCount: 523,
      durationMs: Date.now() - start,
    }
  }
}

export const demoProvider = new DemoProvider()
