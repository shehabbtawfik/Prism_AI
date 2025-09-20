
# Nexus Agent - AI Editing Partner

A powerful AI editing assistant that provides research, content refinement, and styling capabilities through both individual tools and a seamless workflow experience.

## Features

### 🔄 Complete AI Workflow
Follow a seamless process: **Research → Refine → Restyle**
- Each step builds on the previous one
- Content flows automatically between stages
- Cohesive content creation experience

### 🔍 Research Anything
- Comprehensive web search with intelligent summarization
- Accurate citations and source tracking
- Deep topic exploration with key insights

### ✨ Refine Everything
- AI-powered editing suggestions
- Grammar corrections and style improvements
- Content enhancement that matches your voice

### 🎨 Restyle Instantly
- Intelligent formatting and design suggestions
- Visual enhancements and layout optimization
- Multiple output formats (reports, blogs, presentations)

### ⚙️ Flexible AI Backend
- Support for multiple AI providers:
  - OpenAI GPT models
  - Azure OpenAI
  - Ollama (local models)
  - LM Studio
  - Custom API endpoints
- Easy configuration through settings panel

## Quick Start

### Using Docker (Recommended)

1. **Clone or extract the application**
   ```bash
   cd nexus_agent
   ```

2. **Configure AI providers (optional)**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit with your API keys
   nano .env
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Open http://localhost:3000 in your browser
   - Configure AI providers in Settings if not done via environment

### Local Development

1. **Install dependencies**
   ```bash
   cd app
   yarn install
   ```

2. **Start development server**
   ```bash
   yarn dev
   ```

3. **Access at http://localhost:3000**

## Configuration

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Azure OpenAI Configuration
AZURE_AI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_AI_API_KEY=your-azure-api-key

# Local AI Services
OLLAMA_API_URL=http://localhost:11434
LM_STUDIO_API_URL=http://localhost:1234

# Application Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### AI Provider Setup

#### Ollama (Local AI)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (e.g., Llama 2)
ollama pull llama2

# Start Ollama (runs on port 11434)
ollama serve
```

#### LM Studio
1. Download and install [LM Studio](https://lmstudio.ai/)
2. Load a model in the application
3. Start the local server (usually on port 1234)

#### OpenAI / Azure OpenAI
- Obtain API keys from respective providers
- Configure in Settings or environment variables

## Usage

### Starting a Workflow

1. **Navigate to the homepage**
2. **Click "Start Workflow"** or use the prominent workflow button
3. **Research Phase**: Enter your topic or question
4. **Refine Phase**: Review research results and add refinement instructions
5. **Restyle Phase**: Apply formatting and styling preferences
6. **Export or copy your final content**

### Using Individual Tools

- **Research**: Direct access to research capabilities
- **Refine**: Standalone content improvement
- **Restyle**: Independent formatting and styling

## Docker Details

### Building the Image
```bash
docker build -t nexus-agent .
```

### Running with Docker
```bash
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your-key \
  -e OLLAMA_API_URL=http://host.docker.internal:11434 \
  nexus-agent
```

### Docker Compose Features
- Health checks for application monitoring
- Volume mounts for configuration persistence
- Network isolation for security
- Optional Ollama service inclusion
- Automatic restart policies

### Including Ollama in Docker
Uncomment the Ollama service in `docker-compose.yml` to run a local AI service alongside the application.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/research` - Research functionality
- `POST /api/refine` - Content refinement
- `POST /api/restyle` - Content styling
- `GET/POST /api/settings/providers` - AI provider configuration

## Development

### Project Structure
```
nexus_agent/
├── app/                    # Next.js application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utility libraries
│   └── public/           # Static assets
├── Dockerfile            # Container definition
├── docker-compose.yml    # Multi-service setup
└── README.md            # This file
```

### Key Technologies
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Change port in docker-compose.yml or kill existing process
   lsof -ti:3000 | xargs kill
   ```

2. **AI provider connection issues**
   - Verify API keys and endpoints in Settings
   - Check network connectivity to AI services
   - Review browser console for detailed error messages

3. **Docker build issues**
   - Ensure Docker daemon is running
   - Clear Docker build cache: `docker system prune -f`
   - Check available disk space

### Logs

View application logs:
```bash
# Docker Compose logs
docker-compose logs -f nexus-agent

# Container logs
docker logs nexus-agent
```

## License

This project is intended for internal use. All rights reserved.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Examine Docker/application logs
4. Verify AI provider configurations
