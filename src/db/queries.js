/**
 * DATABASE QUERIES
 * Phase-2: Data layer only
 * No UI / no Telegram logic
 */

import { first, all, run } from "./d1.js";

/* ===============================
   USERS
================================ */

export async function ensureUser(db, telegramId, username = null, firstName = null) {
  const sql = `
    INSERT OR IGNORE INTO users (telegram_id, username, first_name)
    VALUES (?, ?, ?)
  `;
  await run(db, sql, [telegramId, username, firstName]);
}

export async function getUserByTelegramId(db, telegramId) {
  const sql = `
    SELECT *
    FROM users
    WHERE telegram_id = ?
    LIMIT 1
  `;
  return await first(db, sql, [telegramId]);
}

/* ===============================
   STUDY SESSIONS
================================ */

export async function startStudySession(db, userId, startTs) {
  // Safety: close any running session
  const closeSql = `
    UPDATE study_sessions
    SET end_ts = ?
    WHERE user_id = ? AND end_ts IS NULL
  `;
  await run(db, closeSql, [startTs, userId]);

  // Start new session
  const startSql = `
    INSERT INTO study_sessions (user_id, start_ts)
    VALUES (?, ?)
  `;
  await run(db, startSql, [userId, startTs]);
}

export async function stopStudySession(db, userId, endTs) {
  const sql = `
    UPDATE study_sessions
    SET end_ts = ?
    WHERE user_id = ? AND end_ts IS NULL
  `;
  const result = await run(db, sql, [endTs, userId]);
  return result?.meta?.changes > 0;
}

export async function getRunningStudySession(db, userId) {
  const sql = `
    SELECT *
    FROM study_sessions
    WHERE user_id = ? AND end_ts IS NULL
    ORDER BY start_ts DESC
    LIMIT 1
  `;
  return await first(db, sql, [userId]);
}

/* ===============================
   DAILY STUDY TOTAL
================================ */

export async function getTodayStudySeconds(db, userId, dayStartTs, dayEndTs) {
  const sql = `
    SELECT start_ts, end_ts
    FROM study_sessions
    WHERE user_id = ?
      AND start_ts >= ?
      AND start_ts < ?
  `;
  const rows = await all(db, sql, [userId, dayStartTs, dayEndTs]);

  let total = 0;
  for (const r of rows.results || []) {
    const end = r.end_ts || dayEndTs;
    total += Math.max(0, end - r.start_ts);
  }
  return total;
}

/* ===============================
   TARGETS
================================ */

export async function getDailyTargetMinutes(db, userId) {
  const sql = `
    SELECT daily_target_minutes
    FROM user_targets
    WHERE user_id = ?
  `;
  const row = await first(db, sql, [userId]);
  return row ? row.daily_target_minutes : null;
}

export async function setDailyTargetMinutes(db, userId, minutes) {
  const sql = `
    INSERT INTO user_targets (user_id, daily_target_minutes)
    VALUES (?, ?)
    ON CONFLICT(user_id)
    DO UPDATE SET daily_target_minutes = excluded.daily_target_minutes
  `;
  await run(db, sql, [userId, minutes]);
}

/* ===============================
   DAILY REPORTS
================================ */

export async function saveDailyReport(db, userId, dateStr, studiedSeconds) {
  const sql = `
    INSERT INTO daily_reports (user_id, report_date, studied_seconds)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, report_date)
    DO UPDATE SET studied_seconds = excluded.studied_seconds
  `;
  await run(db, sql, [userId, dateStr, studiedSeconds]);
}

export async function getDailyReport(db, userId, dateStr) {
  const sql = `
    SELECT *
    FROM daily_reports
    WHERE user_id = ? AND report_date = ?
  `;
  return await first(db, sql, [userId, dateStr]);
    }
