# Reposit Production Deployment Guide

## GitHub Actions + Coolify Deployment

This app uses GitHub Actions to handle the entire build pipeline and deploys to Coolify via Docker images.

### Deployment Architecture

1. **GitHub Actions** handles: Building, testing, migrations, Docker image creation
2. **Coolify** handles: Container orchestration and hosting
3. **GitHub Container Registry** stores: Docker images

### Required GitHub Secrets

Set these in your repository settings → Secrets and variables → Actions:

```bash
# Database (required for migrations in GitHub Actions)
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-database-auth-token

# Coolify Integration
COOLIFY_TOKEN=your-coolify-api-token
COOLIFY_WEBHOOK=your-coolify-webhook-url
```

### Coolify Environment Variables

Set these in your Coolify service configuration:

```bash
# Database (Turso)
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-database-auth-token

# Authentication
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=your-secure-random-secret-at-least-32-chars

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Monitoring (optional)
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Node
NODE_ENV=production
```

### Coolify Configuration

**Deployment Type**: Docker Image
**Image**: `ghcr.io/your-username/reposit.dev:latest`
**Port**: `3000`
**Platform**: ARM64 (optimized for Hetzner CAX servers)

### What Happens on Deployment

When you push to the `main` branch, GitHub Actions automatically:

1. **Validates** environment variables
2. **Installs** dependencies
3. **Runs** quality checks (linting, format checks)
4. **Executes** test suite
5. **Builds** the application
6. **Pushes** changes to production database
7. **Creates** Docker image
8. **Pushes** image to GitHub Container Registry
9. **Triggers** Coolify deployment via webhook
10. **Commits** migration files to repository

### Health Check

Monitor your app at `/api/health` - returns 200 when healthy.

### Initial Setup Process

1. **Set up external services**:
   - Create Turso database
   - Configure GitHub OAuth app
   - Set up Coolify instance

2. **Configure GitHub Secrets**:
   - Add all required secrets to repository settings
   - Generate Coolify API token and get webhook URL

3. **Configure Coolify**:
   - Create new service with Docker Image deployment
   - Set image to `ghcr.io/your-username/reposit.dev:latest`
   - Configure environment variables in Coolify
   - Set port to 3000

4. **Deploy**:
   - Push to main branch
   - GitHub Actions handles everything automatically!

### Rollback Strategy

1. **Git-based rollback**: `git revert <commit>` and push to main
2. **Image-based rollback**: Deploy previous image tag in Coolify

### Getting Coolify Integration Details

1. **API Token**:
   - Go to Coolify → Settings → API Tokens
   - Generate new token with deployment permissions

2. **Webhook URL**:
   - Go to your service in Coolify → Webhooks tab
   - Copy the webhook URL

### Monitoring

- **GitHub Actions**: Monitor builds in Actions tab
- **Coolify**: Monitor deployments and logs in Coolify dashboard
- **Health Check**: App exposes `/api/health` endpoint

### Benefits of This Setup

- ✅ **Full control** over build process
- ✅ **Atomic deployments** - if any step fails, deployment fails
- ✅ **Explicit migrations** handled in pipeline
- ✅ **Docker images** for consistent deployments
- ✅ **Multi-architecture** support (AMD64/ARM64)
- ✅ **Centralized secrets** management in GitHub
