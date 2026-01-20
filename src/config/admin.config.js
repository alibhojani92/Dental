/**
 * ADMIN CONFIG
 * Phase-1: Stub only
 * Used to check admin access safely
 */

// Add Telegram numeric IDs of admins here
export const ADMIN_IDS = [
  // Example:
  // 123456789,
];

/**
 * Check if a user is admin
 */
export function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}
