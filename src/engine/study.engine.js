/**
 * STUDY ENGINE (PHASE-3 REWRITE)
 * Pure logic only
 * Phase-1/2 untouched
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
   IST DAY RANGE
================================ */
function getISTDayRange(ts) {
  const IST_OFFSET = 5.5 * 3600;
  const istTs = ts + IST_OFFSET;
  const d = new Date(istTs * 1000);
  d.setUTCHours(0, 0, 0, 0);
  const start = Math.floor(d.getTime() / 1000) - IST_OFFSET;
  const end = start + 86400;
  return { start, end };
}

/* ===============================
   START
================================ */
export async function engineStartStudy(user, env) {
  const db = getDB(env);
  const now = Math.floor(Date.now() / 1000);

  await ensureUser(db, user.id, user.username, user.first_name);

  const active = await kvGet(env, kvStudyKey(user.id));
  if (active) {
    return { status: "ALREADY_RUNNING", startTs: active.startTs };
  }

  await startStudySession(db, user.id, now);
  await kvPut(env, kvStudyKey(user.id), { startTs: now });

  return { status: "STARTED", startTs: now };
}

/* ===============================
   STOP
================================ */
export async function engineStopStudy(user, env) {
  const db = getDB(env);
  const now = Math.floor(Date.now() / 1000);

  const active = await kvGet(env, kvStudyKey(user.id));
  if (!active) return { status: "NOT_RUNNING" };

  const ok = await stopStudySession(db, user.id, now);
  if (!ok) return { status: "ERROR" };

  await kvDelete(env, kvStudyKey(user.id));

  const { start, end } = getISTDayRange(now);
  const studiedSeconds = await getTodayStudySeconds(
    db,
    user.id,
    start,
    end
  );

  const dateStr = new Date((start + 1) * 1000).toISOString().slice(0, 10);
  await saveDailyReport(db, user.id, dateStr, studiedSeconds);

  const targetMinutes = await getDailyTargetMinutes(db, user.id);

  return {
    status: "STOPPED",
    startTs: active.startTs,
    endTs: now,
    studiedSeconds,
    targetMinutes,
  };
    }
