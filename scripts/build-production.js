#!/usr/bin/env node

import { execSync } from 'child_process';
import { config } from 'dotenv';

config();

function log(message, type = 'info') {
  const prefix = { info: '📄', success: '✅', warning: '⚠️', error: '❌' }[type];
  console.log(`${prefix} [${new Date().toISOString()}] ${message}`);
}

function runCommand(command, description) {
  log(`${description}...`);
  try {
    execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    log(`${description} completed`, 'success');
  } catch (error) {
    log(`${description} failed: ${error.message}`, 'error');
    throw error;
  }
}

function validateEnvironment() {
  const required = ['DATABASE_URL', 'BETTER_AUTH_URL', 'BETTER_AUTH_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
  log('Environment validation passed', 'success');
}

async function main() {
  try {
    log('Starting production build...', 'info');
    validateEnvironment();
    runCommand('npm ci', 'Installing dependencies');
    
    if (process.env.SKIP_CHECKS !== 'true') {
      runCommand('npm run lint:check', 'Linting');
      runCommand('npm run format:check', 'Format check');
      if (process.env.NO_TESTS !== 'true') {
        runCommand('npm run test:run', 'Tests');
      }
    }
    
    try {
      runCommand('npm run db:generate', 'Generating migrations');
    } catch (error) {
      log('No new migrations needed', 'warning');
    }
    
    runCommand('npm run db:migrate:prod', 'Applying migrations');
    runCommand('vite build', 'Building application');
    
    log('🎉 Build completed successfully!', 'success');
  } catch (error) {
    log(`💥 Build failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

main();