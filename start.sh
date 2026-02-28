#!/bin/bash

# Prism AI - Startup Script
# Refracting Intelligence into Clarity

set -e

echo ""
echo "  ██████╗ ██████╗ ██╗███████╗███╗   ███╗     █████╗ ██╗"
echo "  ██╔══██╗██╔══██╗██║██╔════╝████╗ ████║    ██╔══██╗██║"
echo "  ██████╔╝██████╔╝██║███████╗██╔████╔██║    ███████║██║"
echo "  ██╔═══╝ ██╔══██╗██║╚════██║██║╚██╔╝██║    ██╔══██║██║"
echo "  ██║     ██║  ██║██║███████║██║ ╚═╝ ██║    ██║  ██║██║"
echo "  ╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝     ╚═╝    ╚═╝  ╚═╝╚═╝"
echo ""
echo "  Refracting Intelligence into Clarity — v2.0.0"
echo "  ================================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "  ✗ Docker is not installed. Please install Docker first."
    echo "    Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "  ✗ Docker Compose is not installed. Please install Docker Compose first."
    echo "    Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "  ✓ Docker detected"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    if [ -f app/.env.example ]; then
        echo "  Creating .env from template..."
        cp app/.env.example .env
        echo "  ✓ Created .env file"
        echo "    Edit .env to configure AI providers (optional — demo mode works without them)"
    fi
fi

# Create config directory
mkdir -p config

echo ""
echo "  AI Provider Configuration:"
echo "  ─────────────────────────────────────────────────────────"
echo "  Demo Mode:   Always available — no API key required"
echo "  OpenAI:      Set OPENAI_API_KEY in .env"
echo "  Azure AI:    Set AZURE_AI_ENDPOINT + AZURE_AI_API_KEY in .env"
echo "  Ollama:      Run Ollama locally on port 11434"
echo "  ─────────────────────────────────────────────────────────"
echo ""

read -p "  Press Enter to start Prism AI (Ctrl+C to cancel)..."

# Check if containers are already running
if docker-compose ps 2>/dev/null | grep -q prism-ai; then
    echo ""
    echo "  Stopping existing containers..."
    docker-compose down
fi

echo ""
echo "  Building and starting Prism AI..."
docker-compose up --build -d

echo ""
echo "  Waiting for application to start..."
sleep 5

# Health check loop
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo ""
        echo "  ✓ Prism AI is ready!"
        break
    fi

    attempt=$((attempt + 1))
    printf "  Checking health... (%d/%d)\r" "$attempt" "$max_attempts"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo ""
    echo "  ⚠ Application may still be starting. Check logs if needed."
    echo "    docker-compose logs -f prism-ai"
fi

echo ""
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐  Application: http://localhost:3000"
echo "  🚀  Demo:        http://localhost:3000/demo"
echo "  ❤️   Health:      http://localhost:3000/api/health"
echo "  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Management:"
echo "    Logs:     docker-compose logs -f prism-ai"
echo "    Stop:     docker-compose down"
echo "    Restart:  docker-compose restart"
echo "    Rebuild:  docker-compose up --build -d"
echo ""

# Offer to open browser
if command -v xdg-open &> /dev/null; then
    read -p "  Open application in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open http://localhost:3000
    fi
elif command -v open &> /dev/null; then
    read -p "  Open application in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
fi

echo ""
