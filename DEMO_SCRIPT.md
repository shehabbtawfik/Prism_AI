# Prism AI — Video Demo Script

> **Total runtime:** ~3–4 minutes
> **Recommended tools:** Loom, OBS, or Quicktime (Mac)
> **Resolution:** 1920×1080 recommended
> **Tip:** Use the `/demo/showcase` page for a hands-free auto-playing version

---

## Pre-recording checklist

- [ ] Browser at 1280px+ width, dark system theme
- [ ] Dev server running (`cd app && yarn dev`)
- [ ] Microphone tested
- [ ] Browser zoom at 100%
- [ ] Close notifications/Slack
- [ ] `/demo/showcase` page open in a second tab for reference

---

## Script

---

### [0:00–0:20] Hook — Open on `/demo/showcase`

**Action:** Open browser at `http://localhost:3000/demo/showcase`.
Let the intro screen sit for 2 seconds, then click **Play Demo**.

**Say:**
> "This is Prism AI — a production-grade AI content pipeline I built to demonstrate
> how modern AI platforms should be architected: with provider abstraction, streaming-first
> design, and zero vendor lock-in. Let me show you the full pipeline in about 3 minutes."

---

### [0:20–1:00] Research Stage

**Action:** The showcase auto-plays. While Research is streaming, point to the output.

**Say:**
> "The first stage is the Research Engine. It synthesizes a topic into a structured brief —
> not just search results, but key insights, frameworks, and citations.
>
> Notice the streaming output — text appears token-by-token, just like a live LLM.
> That's not a fake animation: it uses Server-Sent Events, the same production pattern
> used by ChatGPT and Claude."

*(pause, let streaming continue for ~10 seconds)*

> "Under the hood, all three stages go through the same `AIProvider` interface.
> Swap the DemoProvider for OpenAI with a single environment variable — no code changes."

---

### [1:00–1:45] Refine Stage

**Action:** Click the **Refine** chapter pill, or let it auto-advance.

**Say:**
> "Stage two is refinement. The same raw research gets rewritten for a specific audience —
> in this demo, a CTO audience, under 400 words, strategic framing.
>
> This is where the architecture shines: the Refine stage doesn't know or care which
> AI provider is running. It calls `provider.refine()` — the same signature whether
> you're using GPT-4o, Azure, or a local Llama model through Ollama."

*(let streaming run 10–15 seconds)*

---

### [1:45–2:30] Restyle Stage

**Action:** Click the **Restyle** chapter pill.

**Say:**
> "Stage three: Restyle. The refined content is transformed into a publication-ready format.
> Here it's an Executive Report — complete with summary tables, architecture diagrams in
> markdown, and a consistent visual structure.
>
> Other supported formats: blog post, technical documentation, and plain markdown —
> the same pipeline, different output target."

---

### [2:30–2:50] Architecture flyover — Switch to `/#architecture` section

**Action:** Open `http://localhost:3000/#architecture` in the same tab (or a new one).

**Say:**
> "Here's the architectural picture. The client layer sends requests to Next.js API routes,
> which call through a typed `AIProvider` interface.
>
> Four providers implement this interface: OpenAI, Azure, Ollama, and the DemoProvider.
> The DemoProvider is not a mock — it's a real implementation of the interface that streams
> pre-scripted content at 30 milliseconds per token. That's dependency inversion in practice:
> the demo is indistinguishable from a live provider at the API boundary."

---

### [2:50–3:20] Live interactive demo — Switch to `/demo`

**Action:** Navigate to `http://localhost:3000/demo`.

**Say:**
> "Now let me show you the interactive version — where you control each stage."

**Action:** Change the research topic to something live (e.g., "Retrieval-Augmented Generation in enterprise software"), then click **Run Research**.

*(Let it stream for 10 seconds)*

> "I can modify the topic, change the refinement instructions, or pick a different output format —
> and the pipeline adapts. Each stage feeds into the next."

---

### [3:20–3:50] Closing — Return to `/`

**Action:** Navigate to `http://localhost:3000`.

**Say:**
> "Prism AI is built on Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.
> The entire stack is containerized — `./start.sh` launches the full application in Docker
> with a health-monitored setup.
>
> What I want this project to show isn't just that I can build an AI app — it's that I
> understand *how to architect one*: provider portability, streaming-first APIs, interface-driven
> design, and zero code divergence between demo and production paths.
>
> The code is on GitHub. Thank you."

---

## Timestamps (for video description)

```
0:00 — Introduction & Overview
0:20 — Research Stage (streaming AI output)
1:00 — Refinement Stage (audience-aware editing)
1:45 — Restyle Stage (Executive Report format)
2:30 — Architecture overview
2:50 — Interactive demo walkthrough
3:20 — Tech stack & closing
```

---

## Loom / LinkedIn post caption (copy-paste)

> Just shipped **Prism AI** — a production-grade AI content pipeline built as an architecture
> showcase.
>
> The core design decision: AI providers are *infrastructure*, not vendor dependencies. A
> typed `AIProvider` interface means you swap OpenAI for Ollama with one config change — no
> business logic changes.
>
> Other patterns I implemented:
> - Streaming-first API (SSE matches LLM token generation)
> - DemoProvider that implements the same interface as production providers (zero code divergence)
> - Multi-stage content pipeline: Research → Refine → Restyle
>
> Stack: Next.js 14 · TypeScript · Tailwind · Docker
>
> Demo (no API key needed): [link]
> GitHub: [link]
>
> #AIArchitecture #NextJS #TypeScript #AIEngineering #SoftwareArchitecture

---

## Auto-play showcase URL

Share this URL for a hands-free demo (no recording needed):
```
http://localhost:3000/demo/showcase
```

Press **Play Demo** → watch all 3 pipeline stages run automatically.
