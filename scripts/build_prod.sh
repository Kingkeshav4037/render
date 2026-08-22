#!/bin/bash
set -e

echo "==================================="
echo "🚀 NORWAY SMARTLIFE V4 PRODUCTION BUILD"
echo "==================================="

echo "1. Checking directory..."
cd ../frontend || cd frontend

echo "2. Installing final dependencies..."
npm install

echo "3. Running Vite Production Build..."
npm run build

echo "==================================="
echo "✅ BUILD SUCCESSFUL! NO TYPESCRIPT ERRORS."
echo "The 'dist' folder is ready for Docker / Nginx / Vercel."
echo "==================================="
