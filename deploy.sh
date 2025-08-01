#!/bin/bash
# Signova Automated Deployment Script
# Usage: ./deploy.sh "commit message"

set -e  # Exit on any error

# Configuration
REPO_URL="https://github.com/parshi247/signova-platform.git"
BRANCH="main"
COMMIT_MSG="${1:-Automated deployment from staging $(date)}"

echo "🚀 Starting Signova deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git config user.name "Signova Staging"
    git config user.email "staging@signova.ai"
    git branch -M main
fi

# Add GitHub remote if not exists
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin $REPO_URL
fi

# Stage all changes
echo "📝 Staging changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to deploy"
    exit 0
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to GitHub (will prompt for token if not set)
echo "📤 Pushing to GitHub..."
if [ -n "$GITHUB_TOKEN" ]; then
    git push https://$GITHUB_TOKEN@github.com/parshi247/signova-platform.git main
else
    echo "⚠️  GITHUB_TOKEN not set. Please enter your GitHub Personal Access Token when prompted."
    git push origin main
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Changes will be live on signova.ai in 1-2 minutes via Netlify"
