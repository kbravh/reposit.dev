#!/bin/bash
# Load test environment variables and start dev server
export $(cat .env.test | grep -v '^#' | xargs)
npm run dev
