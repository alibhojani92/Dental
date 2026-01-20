/**
 * STUDY ENGINE
 * Phase-3: Core study logic
 * No Telegram / No UI code here
 */

import { getDB } from "../db/d1.js";
import {
  ensureUser,
  startStudySession,
  stopStudySession,
  getRunningStudySession,
  getTodayStudySeconds,
  getDailyTargetMinutes,
  saveDailyReport,
} from "../db/queries.js";
import {
  kvGet,
  kvPut,
  kvDelete,
  kvStudyKey,
} from "../services/kv.service.js";

/* ===============================
   HELPERS
================================ */

/**
 * Get IST day boundaries (in seconds)
 */
function getISTDayRange(ts) {
  // IST = UTC + 5:30
  const IST_OFFSET = 5.5 * 3600;

  const istTs = ts + IST_OFFSET;
  const date = new Date(istTs * 1000);

  date.setUTCHours(0, 0, 0, 0);
  const start = Math.floor(date.getTime() / 1000) - IST_OFFSET;
  const end = start + 86400;

  return { start, end };
}

/* ===============================
   START STUDY
================================ */

export async function startStudy(user, env) {
  const db = getDB(env);
  const now = Math.floor(Date.now() / 1000);

  // Ensure user exists
  await ensureUser(db, user.id, user.username, user.first_name);

  // Check KV (already studying?)
  const active = await kvGet(env, kvStudyKey(user.id));
  if (active) {
    return {
      status: "ALREADY_RUNNING",
      startTs: active.startTs,
    };
  }

  // Start in DB
  await startStudySession(db, user.id, now);

  // Save active session in KV
  await kvPut(env, kvStudyKey(user.id), {
    startTs: now,
  });

  return {
    status: "STARTED",
    startTs: now,
  };
}

/* ===============================
   STOP STUDY
================================ */

export async function stopStudy(user, env) {
  const db = getDB(env);
  const now = Math.floor(Date.now() / 1000);

  // Read KV
  const active = await kvGet(env, kvStudyKey(user.id));
  if (!active) {
    return {
      status: "NOT_RUNNING",
    };
  }

  const startTs = active.startTs;

  // Stop in DB
  const stopped = await stopStudySession(db, user.id, now);
  if (!stopped) {
    return {
      status: "ERROR",
    };
  }

  // Clear KV
  await kvDelete(env, kvStudyKey(user.id));

  // Calculate today total
  const { start, end } = getISTDayRange(now);
  const studiedSeconds = await getTodayStudySeconds(
    db,
    user.id,
    start,
    end
  );

  // Save daily snapshot
  const dateStr = new Date((start + 1) * 1000)
    .toISOString()
    .slice(0, 10);

  await saveDailyReport(db, user.id, dateStr, studiedSeconds);

  // Target (optional)
  const targetMinutes = await getDailyTargetMinutes(db, user.id);

  return {
    status: "STOPPED",
    startTs,
    endTs: now,
    studiedSeconds,
    targetMinutes,
  };
    }
