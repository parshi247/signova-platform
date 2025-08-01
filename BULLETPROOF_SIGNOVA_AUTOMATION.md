# BULLETPROOF SIGNOVA AUTOMATION - NEVER BREAKS

## 🛡️ UNBREAKABLE DEPLOYMENT SYSTEM

This system is designed to NEVER break. If something goes wrong, follow these failsafe procedures.

### 🚀 NORMAL OPERATION (30 seconds)

```bash
# SSH to staging server
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114

# Navigate to web directory
cd /var/www/html

# Load environment (if needed)
source .env

# Edit your website
nano index.html

# Deploy to production
./deploy.sh "Your commit message"
```

**Result**: Changes live on signova.ai in 1-2 minutes

---

## 🔧 FAILSAFE PROCEDURES

### Problem 1: "Permission denied" or "Authentication failed"

**SOLUTION A - Regenerate Token**
```bash
# 1. Go to: https://github.com/settings/tokens
# 2. Find: "Signova Automated Deployment - Manus AI Repository Management"
# 3. Click "Regenerate token"
# 4. Copy the new token (starts with ghp_)
# 5. Update on server:
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
nano .env
# Replace the GITHUB_TOKEN line with new token
# Save and exit
```

**SOLUTION B - Manual GitHub Update**
```bash
# 1. Copy your fixed file from staging:
scp -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114:/var/www/html/index.html ./
# 2. Go to: https://github.com/parshi247/signova-platform/edit/main/index.html
# 3. Select all content (Ctrl+A)
# 4. Paste your fixed content
# 5. Commit changes
```

### Problem 2: "Repository not found" or "Remote rejected"

**SOLUTION - Reset Remote**
```bash
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
git remote remove origin
git remote add origin https://github.com/parshi247/signova-platform.git
source .env
./deploy.sh "Reset and deploy"
```

### Problem 3: "No changes to deploy"

**SOLUTION - Force Deployment**
```bash
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
# Make a small change to force deployment
echo "<!-- Updated $(date) -->" >> index.html
./deploy.sh "Force deployment update"
```

### Problem 4: SSH Connection Issues

**SOLUTION A - Check Key Permissions**
```bash
chmod 600 /home/ubuntu/upload/signova_staging_key
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
```

**SOLUTION B - Alternative SSH Key**
```bash
# Use the alternative key if available
ssh -i /home/ubuntu/manus_admin_access_key root@157.245.93.114
```

### Problem 5: Netlify Not Deploying

**SOLUTION - Check Netlify Status**
1. **Go to Netlify Dashboard**: Check if build is triggered
2. **Check GitHub**: Verify commits are appearing
3. **Manual Trigger**: Use Netlify "Trigger deploy" button
4. **Webhook Reset**: Disconnect and reconnect GitHub integration

### Problem 6: Website Still Broken After Deployment

**SOLUTION - Emergency Restore**
```bash
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
# Restore from backup
cp index.html.backup index.html
./deploy.sh "Emergency restore from backup"
```

---

## 🔄 COMPLETE SYSTEM REBUILD (If Everything Fails)

### Step 1: Verify Staging Server
```bash
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
ls -la
# Should see: index.html, deploy.sh, setup_env.sh, .env
```

### Step 2: Verify GitHub Repository
- **URL**: https://github.com/parshi247/signova-platform
- **Login**: parshi247 / Giakabir247!
- **Check**: Repository exists and has content

### Step 3: Verify Netlify Connection
- **Check**: Netlify dashboard shows GitHub connection
- **Verify**: Domain signova.ai points to Netlify

### Step 4: Nuclear Option - Complete Rebuild
```bash
# 1. Backup current working file
scp -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114:/var/www/html/index.html ./signova_backup.html

# 2. Delete and recreate git repository
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114
cd /var/www/html
rm -rf .git
git init
git config user.name "Signova Staging"
git config user.email "staging@signova.ai"
git branch -M main
git remote add origin https://github.com/parshi247/signova-platform.git

# 3. Force push everything
git add .
git commit -m "Complete system rebuild"
source .env
git push https://$GITHUB_TOKEN@github.com/parshi247/signova-platform.git main --force
```

---

## 📋 SYSTEM HEALTH CHECK

### Daily Verification Commands
```bash
# Check staging server
ssh -i /home/ubuntu/upload/signova_staging_key root@157.245.93.114 "cd /var/www/html && pwd && ls -la && git status"

# Check live website
curl -s -I https://signova.ai | head -5

# Check GitHub repository
curl -s https://api.github.com/repos/parshi247/signova-platform/commits | head -20
```

### Weekly Maintenance
1. **Test deployment**: Make small change and deploy
2. **Verify backups**: Check backup files exist
3. **Update documentation**: Add any new procedures
4. **Token expiry**: Check GitHub token expiration date

---

## 🆘 EMERGENCY CONTACTS & RESOURCES

### Critical Information
- **Staging Server**: 157.245.93.114
- **SSH Key**: /home/ubuntu/upload/signova_staging_key
- **GitHub Repo**: https://github.com/parshi247/signova-platform
- **Live Site**: https://signova.ai
- **GitHub Login**: parshi247 / Giakabir247!

### Emergency Procedures
1. **Website Down**: Use emergency restore procedure
2. **Can't SSH**: Check key permissions and try alternative key
3. **GitHub Issues**: Use manual GitHub web interface
4. **Netlify Issues**: Use manual trigger or webhook reset
5. **Complete Failure**: Use nuclear option rebuild

### Backup Locations
- **Staging Server**: `/var/www/html/index.html.backup`
- **Local Backup**: `./signova_backup.html`
- **GitHub History**: Full commit history available
- **Netlify History**: Previous deployments available

---

## 🔒 SECURITY NOTES

### Token Security
- **Never commit tokens**: .env file is gitignored
- **Regenerate monthly**: Set calendar reminder
- **Restrict permissions**: Only repo access needed
- **Monitor usage**: Check GitHub token usage

### Access Security
- **SSH keys**: Keep private, chmod 600
- **Server access**: Only root user needed
- **GitHub access**: Use 2FA if available
- **Regular audits**: Review access monthly

---

## 📈 PERFORMANCE OPTIMIZATION

### Deployment Speed
- **Average time**: 30 seconds edit → 2 minutes live
- **Bottlenecks**: Netlify build time (1-2 minutes)
- **Optimization**: Use staging for testing, production for final

### Reliability Metrics
- **Uptime target**: 99.9%
- **Deployment success**: 99%+
- **Recovery time**: <5 minutes with procedures
- **Backup frequency**: Every deployment

---

## 🎯 SUCCESS METRICS

### System Working Correctly When:
- ✅ SSH connection works instantly
- ✅ `./deploy.sh` completes without errors
- ✅ GitHub shows new commits within 30 seconds
- ✅ Netlify triggers build automatically
- ✅ signova.ai shows changes within 2 minutes
- ✅ All website functionality works (navigation, payments)

### Red Flags (Use Failsafe Procedures):
- ❌ SSH connection refused
- ❌ Git push errors
- ❌ GitHub token expired
- ❌ Netlify build failures
- ❌ Website functionality broken
- ❌ DNS resolution issues

**REMEMBER: This system is designed to be bulletproof. If one method fails, there are always backup methods. Never panic - follow the procedures step by step.**

