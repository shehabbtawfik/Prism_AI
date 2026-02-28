import { NextRequest } from 'next/server'
import { demoProvider } from '@/lib/ai/demo'
import type { OutputFormat } from '@/lib/ai/providers'

export const runtime = 'nodejs'

const VALID_FORMATS: OutputFormat[] = [
  'markdown',
  'executive-report',
  'blog-post',
  'presentation',
  'technical-doc',
]

export async function POST(req: NextRequest) {
  const { content, format } = await req.json()

  if (!content || typeof content !== 'string') {
    return new Response(JSON.stringify({ error: 'Content is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const outputFormat: OutputFormat = VALID_FORMATS.includes(format) ? format : 'executive-report'

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of demoProvider.restyle(content, outputFormat)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Restyle failed' })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
