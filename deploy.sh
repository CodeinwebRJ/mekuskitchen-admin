#!/bin/bash
set -e  # Exit on error

# Get current repo path
REPO_DIR="$(pwd)"
DEPLOY_DIR="/var/www/admin"  # Where NGINX serves the built files

echo "📍 Working from: $REPO_DIR"

echo "🔁 Pulling latest changes..."
sudo git pull origin main

echo "📦 Installing dependencies with700MB RAM limit..."
sudo NODE_OPTIONS="--max-old-space-size=700" npm install


echo "🏗 Building project with 700MB RAM limit..."
sudo NODE_OPTIONS="--max-old-space-size=700" npm run build

echo "🧹 Cleaning old files in $DEPLOY_DIR..."
sudo rm -rf "$DEPLOY_DIR"
sudo mkdir -p "$DEPLOY_DIR"

echo "🚚 Deploying new build to $DEPLOY_DIR..."
sudo cp -r dist/* "$DEPLOY_DIR"

echo "✅ Deployment successful!"
