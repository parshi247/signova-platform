# Signova Automated Deployment Usage Guide

## 🚀 Quick Start

### One-Time Setup (5 minutes)
1. **Create GitHub Personal Access Token**:
   - Go to: https://github.com/settings/tokens
   - Generate new token with `repo`, `workflow`, `write:packages` scopes
   - Copy the token (starts with `ghp_`)

2. **Set up environment on staging server**:
   ```bash
   ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
   cd /var/www/html
   source ./setup_env.sh
   # Enter your GitHub token when prompted
   ```

### Daily Usage (30 seconds)
```bash
# SSH to staging server
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114

# Navigate to web directory
cd /var/www/html

# Edit your files (example)
nano index.html

# Deploy to production
./deploy.sh "Fix navigation buttons"
```

## 📋 Available Commands

### Deployment Commands
```bash
# Deploy with custom message
./deploy.sh "Add new feature"

# Deploy with automatic timestamp
./deploy.sh

# Check what changes are ready to deploy
git status

# View recent deployments
git log --oneline -5
```

### Environment Commands
```bash
# Set up environment (first time only)
source ./setup_env.sh

# Load saved environment
source .env

# Check current environment
echo $GITHUB_TOKEN
```

## 🔄 Deployment Flow

```
Staging Server → GitHub → Netlify → signova.ai
     (edit)      (push)    (build)    (live)
```

1. **Edit files** on staging server (157.245.93.114)
2. **Run deploy script** (`./deploy.sh "message"`)
3. **Automatic push** to GitHub repository
4. **Netlify detects** GitHub changes
5. **Automatic build** and deployment
6. **Live on signova.ai** in 1-2 minutes

## 🛠️ File Locations

### Staging Server Files
```
/var/www/html/
├── index.html                          # Main website file
├── deploy.sh                          # Deployment script
├── setup_env.sh                       # Environment setup
├── .env                               # Saved environment (after setup)
├── GITHUB_AUTOMATION_CREDENTIALS.md   # This documentation
└── .git/                              # Git repository
```

### Scripts Overview
- **`deploy.sh`**: Main deployment script
- **`setup_env.sh`**: One-time environment configuration
- **`.env`**: Persistent environment variables (created after setup)

## 🔐 Security Features

### Token Security
- ✅ Token stored in environment variables
- ✅ `.env` file has restricted permissions (600)
- ✅ Token not visible in command history
- ✅ Secure HTTPS authentication to GitHub

### Access Control
- ✅ SSH key authentication to staging server
- ✅ GitHub repository access via Personal Access Token
- ✅ Netlify automatic deployment (no manual access needed)

## 🚨 Troubleshooting

### Common Issues

#### "Permission denied" when pushing
```bash
# Check if token is set
echo $GITHUB_TOKEN

# If empty, run setup again
source ./setup_env.sh
```

#### "Repository not found"
```bash
# Check remote URL
git remote -v

# Fix if needed
git remote set-url origin https://github.com/parshi247/signova-platform.git
```

#### "No changes to deploy"
```bash
# Check what files changed
git status

# If files are modified but not staged
git add .
./deploy.sh "Manual deployment"
```

#### Netlify not building
- Check GitHub repository for new commits
- Verify Netlify is connected to correct repository
- Check Netlify build logs for errors

### Emergency Recovery
```bash
# Restore from backup
cp index.html.backup index.html

# Force push to GitHub
git add .
git commit -m "Emergency restore from backup"
git push origin main --force
```

## 📊 Monitoring

### Check Deployment Status
```bash
# View recent commits
git log --oneline -10

# Check current branch and status
git status

# View remote repository
git remote -v
```

### Verify Live Site
- **Staging**: http://157.245.93.114
- **Production**: https://signova.ai
- **GitHub**: https://github.com/parshi247/signova-platform
- **Netlify**: Check your Netlify dashboard

## 🎯 Best Practices

### Commit Messages
```bash
# Good examples
./deploy.sh "Fix navigation button functionality"
./deploy.sh "Add new pricing section"
./deploy.sh "Update contact form validation"
./deploy.sh "Improve mobile responsiveness"

# Avoid
./deploy.sh "update"
./deploy.sh "fix"
```

### Testing Workflow
1. **Edit on staging** (157.245.93.114)
2. **Test locally** (http://157.245.93.114)
3. **Deploy to production** (`./deploy.sh`)
4. **Verify live site** (https://signova.ai)

### Backup Strategy
- ✅ Automatic git history (every deployment)
- ✅ Manual backups (index.html.backup)
- ✅ GitHub repository (full history)
- ✅ Netlify deployment history

## 📞 Support

### Quick Help
```bash
# View deployment script help
./deploy.sh --help

# View environment setup help
./setup_env.sh --help

# Check git status
git status
```

### Contact Information
- **Staging Server**: root@157.245.93.114
- **GitHub Repository**: https://github.com/parshi247/signova-platform
- **Live Website**: https://signova.ai

## 🔄 Automation Benefits

### Before Automation
1. Edit files locally
2. Copy content manually
3. Paste into GitHub web interface
4. Wait for Netlify build
5. Verify deployment
**Total time**: 5-10 minutes per update

### After Automation
1. Edit files on staging
2. Run `./deploy.sh "message"`
3. Automatic deployment
**Total time**: 30 seconds per update

### Efficiency Gains
- ⚡ **95% time savings** per deployment
- 🔄 **Zero manual steps** after initial setup
- 📝 **Automatic commit history** for all changes
- 🛡️ **Reduced human error** in deployment process
- 🚀 **Instant deployment** capability

