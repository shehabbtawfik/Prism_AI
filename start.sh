
#!/bin/bash

# Nexus Agent Startup Script
# This script helps you quickly start the Nexus Agent application

set -e

echo "🚀 Nexus Agent - AI Editing Partner"
echo "====================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating environment configuration..."
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "   You can edit .env to configure AI providers"
fi

# Create config directory
mkdir -p config

echo ""
echo "🔧 Configuration Options:"
echo "1. Edit .env file to configure AI providers (OpenAI, Azure, etc.)"
echo "2. Local AI options will be configured automatically:"
echo "   - Ollama: http://host.docker.internal:11434"
echo "   - LM Studio: http://host.docker.internal:1234"

echo ""
read -p "Press Enter to continue or Ctrl+C to exit and configure first..."

# Check if containers are already running
if docker-compose ps | grep -q nexus-agent; then
    echo "🔄 Stopping existing containers..."
    docker-compose down
fi

echo ""
echo "🏗️  Building and starting Nexus Agent..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for application to start..."
sleep 10

# Check if the application is healthy
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Nexus Agent is ready!"
        break
    fi
    
    attempt=$((attempt + 1))
    echo "   Checking health... ($attempt/$max_attempts)"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "⚠️  Application might not be fully ready yet, but you can try accessing it."
    echo "   Check logs with: docker-compose logs -f nexus-agent"
fi

echo ""
echo "🎉 Nexus Agent is running!"
echo ""
echo "🌐 Access your application at: http://localhost:3000"
echo ""
echo "📚 Quick Start:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Configure AI providers in Settings (if not done via .env)"
echo "   3. Start using the Workflow feature or individual tools"
echo ""
echo "🔧 Management Commands:"
echo "   View logs:    docker-compose logs -f nexus-agent"
echo "   Stop app:     docker-compose down"
echo "   Restart:      docker-compose restart"
echo "   Rebuild:      docker-compose up --build -d"
echo ""
echo "📖 For more information, see README.md"

# Check if browser command exists and offer to open
if command -v xdg-open &> /dev/null; then
    read -p "Open application in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open http://localhost:3000
    fi
elif command -v open &> /dev/null; then
    read -p "Open application in browser? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
fi
