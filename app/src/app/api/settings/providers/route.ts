import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    active: 'demo',
    providers: [
      {
        id: 'demo',
        name: 'Demo Mode',
        description: 'Pre-scripted responses — no API key required',
        available: true,
        configured: true,
      },
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT-4o, GPT-4o-mini, and more',
        available: !!process.env.OPENAI_API_KEY,
        configured: !!process.env.OPENAI_API_KEY,
      },
      {
        id: 'azure',
        name: 'Azure OpenAI',
        description: 'Enterprise-grade OpenAI via Microsoft Azure',
        available: !!(process.env.AZURE_AI_ENDPOINT && process.env.AZURE_AI_API_KEY),
        configured: !!(process.env.AZURE_AI_ENDPOINT && process.env.AZURE_AI_API_KEY),
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        description: 'Run models locally — full privacy',
        available: !!process.env.OLLAMA_API_URL,
        configured: !!process.env.OLLAMA_API_URL,
      },
    ],
  })
}

export async function POST(req: NextRequest) {
  const { providerId } = await req.json()
  // In production, this would validate credentials and persist the selection
  return NextResponse.json({ success: true, active: providerId })
}
