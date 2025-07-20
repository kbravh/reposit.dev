import uniqid from 'uniqid'

/**
 * Generate a unique ID using uniqid (user's preference)
 * This is used for application entities like repositories, tags, lists, etc.
 */
export function generateId(): string {
  return uniqid()
}

/**
 * Generate a UUID for auth-related entities (NextAuth compatibility)
 * Using crypto.randomUUID for auth tables to maintain NextAuth compatibility
 */
export function generateAuthId(): string {
  return crypto.randomUUID()
}