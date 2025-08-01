# GitHub Automation Credentials for Signova

## GitHub Personal Access Token Setup

### Step 1: Create Personal Access Token
1. **Go to GitHub Settings**: https://github.com/settings/tokens
2. **Click "Generate new token"** → "Generate new token (classic)"
3. **Token Name**: `Signova Staging Automation`
4. **Expiration**: `No expiration` (or 1 year for security)
5. **Select Scopes**:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
   - ✅ `write:packages` (Upload packages to GitHub Package Registry)
   - ✅ `delete:packages` (Delete packages from GitHub Package Registry)

### Step 2: Store Token Securely
**IMPORTANT**: Copy the token immediately - GitHub only shows it once!

```
Token Format: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Staging Server SSH Credentials

### Current SSH Access
```bash
# SSH Key Location
/home/ubuntu/upload/signova_staging_key

# SSH Command
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114

# Server Details
IP: 157.245.93.114
User: root
Key: signova_staging_key
```

## GitHub Repository Details

### Repository Information
```
Repository: https://github.com/parshi247/signova-platform
Owner: parshi247
Repo Name: signova-platform
Branch: main
```

### GitHub Account Credentials
```
Username: parshi247
Email: parshi@trivoshop.com
Password: Giakabir247!
```

## Automated Deployment Script Configuration

### Environment Variables to Set on Staging Server
```bash
# GitHub Personal Access Token
export GITHUB_TOKEN="your_personal_access_token_here"

# GitHub Repository URL
export GITHUB_REPO="https://github.com/parshi247/signova-platform.git"

# GitHub Username
export GITHUB_USER="parshi247"

# Deployment Branch
export DEPLOY_BRANCH="main"
```

## Security Best Practices

### Token Security
- ✅ Store token in environment variables, not in code
- ✅ Use token with minimal required permissions
- ✅ Set expiration date for security
- ✅ Regenerate token if compromised

### SSH Security
- ✅ Use SSH keys instead of passwords
- ✅ Restrict SSH key permissions (chmod 600)
- ✅ Store keys securely
- ✅ Use different keys for different purposes

## Deployment Automation Commands

### Manual Deployment Command
```bash
# From staging server
cd /var/www/html
git add .
git commit -m "Update Signova website functionality"
git push origin main
```

### Automated Deployment Script
```bash
#!/bin/bash
# Location: /var/www/html/deploy.sh
# Usage: ./deploy.sh "commit message"

cd /var/www/html
git add .
git commit -m "${1:-Automated deployment from staging}"
git push https://${GITHUB_TOKEN}@github.com/parshi247/signova-platform.git main
echo "Deployment completed successfully!"
```

## Netlify Integration

### Automatic Deployment
- ✅ Netlify monitors GitHub repository
- ✅ Automatic build on push to main branch
- ✅ Live deployment to signova.ai
- ✅ No manual intervention required

## Usage Instructions

### One-Time Setup
1. Create GitHub Personal Access Token
2. Store token in staging server environment
3. Configure git remote on staging server
4. Test deployment script

### Daily Usage
```bash
# Edit files on staging server
nano /var/www/html/index.html

# Deploy to production
./deploy.sh "Fix navigation functionality"
```

## Troubleshooting

### Common Issues
- **Token expired**: Generate new token
- **Permission denied**: Check token scopes
- **Push rejected**: Check repository permissions
- **SSH issues**: Verify key permissions

### Support Contacts
- **GitHub Support**: https://support.github.com
- **Netlify Support**: https://www.netlify.com/support
- **Staging Server**: root@157.245.93.114

