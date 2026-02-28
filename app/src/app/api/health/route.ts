import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'prism-ai',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    providers: {
      demo: true,
      openai: !!process.env.OPENAI_API_KEY,
      azure: !!(process.env.AZURE_AI_ENDPOINT && process.env.AZURE_AI_API_KEY),
      ollama: !!process.env.OLLAMA_API_URL,
    },
  })
}
