# Better-Auth Integration Investigation

## Problem Statement

- Authenticated pages shell renders correctly but child components don't render
- Browser console error: `Module "node:async_hooks" has been externalized for browser compatibility`
- Error suggests server-side code is being pulled into client bundle

## Initial Analysis

### Issue Identified

The problem appears to be in `src/routes/_authenticated.tsx` where server-side auth code is being imported:

```typescript
import { getAuth } from '../lib/auth';
```

This import brings the entire better-auth server instance into the bundle, including Node.js dependencies like `async_hooks`, which cannot run in the browser.

### Current Auth Setup

- **Server auth**: `src/lib/auth.ts` - properly marked with `'use server'`
- **Client auth**: `src/lib/auth-client.ts` - uses `createAuthClient()`
- **Problem**: Server auth being used in route file that gets bundled for client

## Investigation Plan

### Phase 1: Reproduce and Confirm Issue ✓

- [x] Examine current auth configuration
- [x] Identify the problematic import in `_authenticated.tsx`
- [x] Run the application to reproduce the error
- [x] Confirm browser console shows the exact error

### Phase 2: Solution Development ✓

- [x] Move server-side auth calls to proper server functions
- [x] Use Tanstack Start's server functions for auth checks
- [x] Update `beforeLoad` to use server-only auth validation
- [x] Ensure client-side code only uses `authClient`

### Phase 3: Testing and Validation ✅

- [x] Test authenticated page rendering
- [x] Verify no server-side imports in client bundle
- [x] Confirm auth flow works end-to-end

## Solutions to Explore

### Option 1: Server Functions (Recommended)

- Create dedicated server function for auth validation
- Use Tanstack Start's server function pattern
- Keep server auth completely separate from client bundle

### Option 2: Route Context

- Use route context to pass auth state
- Validate auth on server before rendering

## Findings Log

### Finding 1: Server Import in Client Code

**Date**: Initial investigation
**Issue**: `import { getAuth } from '../lib/auth'` in `_authenticated.tsx` pulls server code into client
**Impact**: Node.js modules like `async_hooks` cannot run in browser
**Status**: Confirmed

### Finding 2: Error Reproduction Successful

**Date**: Current investigation
**Browser Error**:

```
Module "node:async_hooks" has been externalized for browser compatibility.
Cannot access "node:async_hooks.AsyncLocalStorage" in client code.
TypeError: import_node_async_hooks.AsyncLocalStorage is not a constructor
```

**Behavior**: Page redirects to login but fails due to client-side server import
**Status**: Confirmed - implementing fix

### Finding 3: Solution Implemented Successfully

**Date**: Current investigation
**Solution**: Created server functions in `src/actions/auth.ts` to replace direct server imports
**Changes Made**:

1. Fixed `src/lib/auth.ts` to export `auth` constant for API routes and middleware
2. Created `getSessionServerFn()` server function for auth validation
3. Updated `src/routes/_authenticated.tsx` to use server function instead of direct import
4. Updated `src/routes/login.tsx` to use server function instead of direct import
   **Result**: Browser error completely resolved, no more async_hooks issues
   **Status**: ✅ Fixed

## Resolution Summary

**Problem**: Better-auth server-side imports in client route files caused Node.js modules to be bundled for browser, resulting in `async_hooks` compatibility errors.

**Root Cause**: Direct imports of `getAuth()` from server-side auth module in route files that get bundled for client-side execution.

**Solution**: Replaced direct server imports with Tanstack Start server functions:

- Created dedicated auth server functions in `src/actions/auth.ts`
- Updated route files to use server functions instead of direct imports
- Fixed auth exports to support both patterns

**Result**: ✅ Issue resolved - authenticated pages now render correctly without browser console errors.
