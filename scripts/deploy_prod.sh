#!/bin/bash
set -e

echo "================================================="
echo "🚀 NORWAY SMARTLIFE - PRODUCTION DEPLOYMENT"
echo "================================================="

# 1. Go to root directory
cd "$(dirname "$0")/.."

echo "1. Pulling latest changes from Git..."
# git pull origin main # Uncomment if deploying via Git on a VPS

echo "2. Building Docker Containers..."
docker-compose build

echo "3. Restarting Services (Zero-Downtime Recreate)..."
docker-compose up -d

echo "4. Cleaning up old Docker images..."
docker image prune -f

echo "================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "The application is now live and running in Docker."
echo "================================================="
