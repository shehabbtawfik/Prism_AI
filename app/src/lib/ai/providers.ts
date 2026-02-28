/**
 * Prism AI Provider Abstraction Layer
 *
 * All AI providers implement this interface, enabling seamless swapping
 * between OpenAI, Azure, Ollama, and Demo providers without changing
 * business logic. This is the architectural spine of the entire platform.
 */

export interface Citation {
  title: string
  url: string
  snippet: string
  domain: string
}

export interface ResearchResult {
  summary: string
  keyInsights: string[]
  citations: Citation[]
  tokenCount: number
  durationMs: number
}

export interface RefineResult {
  content: string
  changes: string[]
  tokenCount: number
  durationMs: number
}

export type OutputFormat = 'markdown' | 'executive-report' | 'blog-post' | 'presentation' | 'technical-doc'

export interface RestyleResult {
  content: string
  format: OutputFormat
  wordCount: number
  tokenCount: number
  durationMs: number
}

export interface AIProvider {
  readonly name: string
  readonly id: string
  readonly isDemo: boolean

  research(topic: string, signal?: AbortSignal): AsyncGenerator<string, ResearchResult, unknown>
  refine(content: string, instructions: string, signal?: AbortSignal): AsyncGenerator<string, RefineResult, unknown>
  restyle(content: string, format: OutputFormat, signal?: AbortSignal): AsyncGenerator<string, RestyleResult, unknown>
}

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'AIProviderError'
  }
}

export type ProviderConfig = {
  openai?: { apiKey: string; model?: string }
  azure?: { endpoint: string; apiKey: string; deployment?: string }
  ollama?: { baseUrl: string; model?: string }
}
