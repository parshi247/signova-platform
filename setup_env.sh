#!/bin/bash
# Environment Setup for Signova Deployment
# Usage: source ./setup_env.sh

echo "🔧 Setting up Signova deployment environment..."

# Prompt for GitHub Personal Access Token if not set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "📝 Please enter your GitHub Personal Access Token:"
    echo "   (Create one at: https://github.com/settings/tokens)"
    echo "   Required scopes: repo, workflow, write:packages"
    read -s GITHUB_TOKEN
    export GITHUB_TOKEN
    echo "✅ GitHub token set for this session"
fi

# Set other environment variables
export GITHUB_USER="parshi247"
export GITHUB_REPO="https://github.com/parshi247/signova-platform.git"
export DEPLOY_BRANCH="main"

echo "🌐 Environment configured for Signova deployment"
echo "📋 Available commands:"
echo "   ./deploy.sh \"commit message\"  - Deploy changes to production"
echo "   git status                     - Check current changes"
echo "   git log --oneline -5           - View recent commits"

# Save token to .env file for persistence (optional)
if [ -n "$GITHUB_TOKEN" ]; then
    echo "💾 Save token to .env file for future sessions? (y/n)"
    read -n 1 save_token
    echo
    if [ "$save_token" = "y" ] || [ "$save_token" = "Y" ]; then
        echo "export GITHUB_TOKEN=\"$GITHUB_TOKEN\"" > .env
        echo "export GITHUB_USER=\"parshi247\"" >> .env
        echo "export GITHUB_REPO=\"https://github.com/parshi247/signova-platform.git\"" >> .env
        echo "export DEPLOY_BRANCH=\"main\"" >> .env
        chmod 600 .env
        echo "✅ Environment saved to .env file"
        echo "💡 Run source .env to load in future sessions"
    fi
fi
