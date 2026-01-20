/**
 * D1 DATABASE WRAPPER
 * Phase-2: Data layer only
 * No business logic here
 */

export function getDB(env) {
  if (!env || !env.DB) {
    throw new Error("D1 database (env.DB) is not bound");
  }
  return env.DB;
}

/**
 * Helper to run SELECT returning single row
 */
export async function first(db, sql, params = []) {
  const stmt = db.prepare(sql).bind(...params);
  return await stmt.first();
}

/**
 * Helper to run SELECT returning multiple rows
 */
export async function all(db, sql, params = []) {
  const stmt = db.prepare(sql).bind(...params);
  return await stmt.all();
}

/**
 * Helper to run INSERT / UPDATE / DELETE
 */
export async function run(db, sql, params = []) {
  const stmt = db.prepare(sql).bind(...params);
  return await stmt.run();
}
