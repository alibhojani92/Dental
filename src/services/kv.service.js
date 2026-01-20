/**
 * KV SERVICE
 * Phase-2: Temporary state storage
 * Used for timers, flags, locks
 * NOT for permanent data
 */

function ensureKV(env) {
  if (!env || !env.KV) {
    throw new Error("KV namespace (env.KV) is not bound");
  }
  return env.KV;
}

/* ===============================
   BASIC OPERATIONS
================================ */

export async function kvGet(env, key) {
  const kv = ensureKV(env);
  return await kv.get(key, "json");
}

export async function kvPut(env, key, value, ttlSeconds = null) {
  const kv = ensureKV(env);

  const options = {};
  if (ttlSeconds) {
    options.expirationTtl = ttlSeconds;
  }

  await kv.put(key, JSON.stringify(value), options);
}

export async function kvDelete(env, key) {
  const kv = ensureKV(env);
  await kv.delete(key);
}

/* ===============================
   STUDY SESSION KEYS (PHASE-3)
================================ */

export function kvStudyKey(userId) {
  return `study:active:${userId}`;
}

export function kvLockKey(userId) {
  return `lock:${userId}`;
}
