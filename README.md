
# Prism AI — Refracting Intelligence into Clarity

> **An AI systems architecture showcase.** Prism AI is a production-grade, multi-provider
> AI content pipeline built on Next.js 14, TypeScript, and a provider abstraction layer
> that treats LLMs as swappable infrastructure — not vendor dependencies.

[![Demo Mode](https://img.shields.io/badge/Demo-No%20API%20Key%20Required-7c3aed)](http://localhost:3000/demo)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## What This Project Demonstrates

This project was designed as an AI architect portfolio piece. The architectural decisions
documented below are as important as the features themselves.

| Capability | What It Shows |
|---|---|
| **Provider abstraction layer** | Interface-driven design; AI backends are infrastructure, not vendor lock-in |
| **Streaming-first API design** | SSE streaming matches LLM token generation; time-to-first-token matters |
| **Demo as a first-class provider** | DemoProvider implements the same interface as OpenAI — zero code divergence |
| **Multi-stage content pipeline** | Research → Refine → Restyle; composable, interruptible, stateful |
| **Runtime input validation** | Zod schemas at all API boundaries — LLM platforms receive untrusted input |
| **Docker production deployment** | Standalone Next.js, health checks, non-root user, minimal image size |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│   Next.js 14 App Router  ·  Streaming SSE  ·  React UI     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    API Route Layer                          │
│   /api/research   /api/refine   /api/restyle                │
│   Input validation (Zod)  ·  Rate limiting  ·  Auth        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Provider Abstraction Layer                     │
│                  AIProvider Interface                       │
│     research()  ·  refine()  ·  restyle()                  │
└────┬──────────┬──────────┬──────────┬───────────────────────┘
     │          │          │          │
   OpenAI    Azure AI    Ollama     Demo
  (cloud)   (enterprise) (local)  (zero-cred)
```

**Why this matters:** The business logic layer never changes when you swap providers.
A team can develop against the DemoProvider locally, test against Ollama, and deploy
to OpenAI — using the same code path throughout.

### Content Pipeline

```
User Input → Research Stage → Refine Stage → Restyle Stage → Export
              (synthesis)    (editing)      (formatting)   (md/html)
```

Each stage produces output that flows into the next. The pipeline is interruptible
at any stage — users can export research output directly without refining.

---

## Features

### Research Engine
- Multi-source synthesis with intelligent summarization
- Citation tracking and source credibility indicators
- Configurable research depth
- Streaming output from first token

### Refinement Pipeline
- Audience-aware content editing
- Tone, length, and structural adjustments
- Style consistency across the document
- Change summary after each refinement

### Restyle System
- **Executive Report** — structured sections, pull quotes, recommendation tables
- **Blog Post** — conversational tone, headers, engagement hooks
- **Technical Documentation** — code blocks, structured references, precision language
- **Plain Markdown** — clean output for any downstream tool

### Multi-Provider Support
| Provider | Type | Use Case |
|---|---|---|
| OpenAI GPT-4o | Cloud | Production, highest quality |
| Azure OpenAI | Enterprise Cloud | Compliance, enterprise SLA |
| Ollama | Local | Privacy, air-gapped environments |
| Demo | Built-in | Development, showcasing |

---

## Quick Start

### Docker (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd Nexus-Agent

# Start with Docker Compose
./start.sh
# or directly:
docker-compose up -d

# Access at http://localhost:3000
```

**No API key required** — the application launches in Demo Mode automatically.

### Local Development

```bash
cd app

# Install dependencies
yarn install

# Configure environment (optional — demo works without it)
cp .env.example .env

# Start development server
yarn dev
# Access at http://localhost:3000
```

---

## Configuration

### Environment Variables

```bash
# === AI Providers ===

# OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini          # optional, default: gpt-4o-mini

# Azure OpenAI
AZURE_AI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_AI_API_KEY=your-api-key
AZURE_AI_DEPLOYMENT=your-deployment-name

# Ollama (local models)
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# LM Studio
LM_STUDIO_API_URL=http://localhost:1234

# === Application ===
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Demo mode (true = no API key needed, pre-scripted responses)
NEXT_PUBLIC_DEMO_MODE=true
```

### Setting Up Local AI with Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (llama3 recommended)
ollama pull llama3

# Ollama runs on port 11434 by default
# Set in .env: OLLAMA_API_URL=http://localhost:11434
```

---

## API Reference

All API routes accept `POST` requests with JSON bodies and respond with
Server-Sent Events for streaming.

### `POST /api/research`
```json
{ "topic": "string" }
```
Streams research output. Each `data:` event contains `{ "chunk": "string" }`.

### `POST /api/refine`
```json
{
  "content": "string",
  "instructions": "string"
}
```
Streams refined content with the same SSE format.

### `POST /api/restyle`
```json
{
  "content": "string",
  "format": "executive-report | blog-post | technical-doc | markdown"
}
```
Streams restyled content in the requested format.

### `GET /api/health`
Returns service health and configured provider status.
```json
{
  "status": "healthy",
  "service": "prism-ai",
  "version": "2.0.0",
  "providers": {
    "demo": true,
    "openai": false,
    "azure": false,
    "ollama": false
  }
}
```

### `GET /api/settings/providers`
Returns available AI providers and their configuration status.

---

## Project Structure

```
Nexus-Agent/
├── app/                          # Next.js 14 application
│   ├── src/
│   │   ├── app/                  # App Router pages & API routes
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── demo/page.tsx     # Interactive demo
│   │   │   └── api/              # API routes (research, refine, restyle, health)
│   │   ├── components/           # React components
│   │   │   └── Navigation.tsx    # App navigation
│   │   └── lib/
│   │       ├── ai/
│   │       │   ├── providers.ts  # AIProvider interface (architectural spine)
│   │       │   └── demo.ts       # DemoProvider implementation
│   │       └── utils.ts          # Utility functions
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── Dockerfile                    # Multi-stage production build
├── docker-compose.yml            # Multi-service orchestration
├── start.sh                      # One-command startup script
└── README.md
```

---

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **Provider abstraction interface** | Swappable backends without business logic changes. Dependency injection at the provider selection layer, not scattered through business logic. |
| **Streaming over request/response** | Perceived performance matches LLM token generation model. Users tolerate slower total completion times when they see incremental progress. |
| **Demo as a first-class provider** | DemoProvider implements AIProvider identically to OpenAI/Ollama. Zero code divergence between demo and production paths — this is dependency inversion in practice. |
| **App Router API routes** | Edge-compatible streaming, co-located with route handlers, better DX than pages/api pattern. |
| **Standalone Next.js output** | No node_modules in production image, minimal size, container-orchestration ready. |
| **Health check endpoint** | Required for container orchestration (Docker, Kubernetes). Signals production-awareness. |
| **TypeScript strict mode** | Type-safe provider interfaces prevent runtime errors at system boundaries — critical for AI platform reliability. |

---

## Docker Details

### Building

```bash
docker build -t prism-ai .
```

### Running

```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your-key \
  prism-ai
```

### Docker Compose Features

- Multi-stage build for minimal image size
- Health monitoring with automatic restarts
- Volume mount for configuration persistence
- Network isolation
- Non-root user for security
- Optional Ollama service (uncomment in `docker-compose.yml`)

---

## Troubleshooting

**Port 3000 already in use**
```bash
lsof -ti:3000 | xargs kill
```

**Docker build fails**
```bash
docker system prune -f
docker-compose up --build -d
```

**View logs**
```bash
docker-compose logs -f prism-ai
```

---

## License

MIT License — Copyright 2025 shehabbtawfik

---

*Prism AI — Refracting Intelligence into Clarity*
