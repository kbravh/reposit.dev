# Reposit Production Deployment Guide

## Quick Setup for Coolify

This app is configured for easy deployment with Coolify using a unified build process.

### Coolify Configuration

**Build Command**: `npm run build`  
**Start Command**: `npm start`

### Environment Variables Required

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

# Monitoring
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Node
NODE_ENV=production
```

### What Happens on Build

The `npm run build` command automatically:
1. Validates environment variables
2. Installs dependencies
3. Runs quality checks (linting, tests)
4. Generates and applies database migrations
5. Builds the application

### Health Check

Monitor your app at `/api/health` - returns 200 when healthy.

### Deployment Process

1. Set up your Turso database and GitHub OAuth app
2. Configure environment variables in Coolify
3. Connect your GitHub repo to Coolify
4. Set build/start commands as shown above
5. Push to main branch - Coolify handles the rest!

### Rollback Strategy

Simple git revert and push - Coolify will automatically redeploy.

### Optional Environment Variables

- `NO_TESTS=true` - Skip tests during build
- `SKIP_CHECKS=true` - Skip all quality checks

This setup provides atomic deployments where if any step fails (including migrations), the entire deployment fails safely.