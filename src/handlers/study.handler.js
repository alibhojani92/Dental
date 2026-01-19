import { sendMessage } from "../services/message.service.js";
import { getDB } from "../db/d1.js";
import { QUERIES } from "../db/queries.js";
import {
  startStudyKV,
  getActiveStudyKV,
  stopStudyKV,
} from "../engine/timer.engine.js";
import {
  formatTime,
  diffMinutes,
  formatHM,
  todayISO,
  nowTs,
} from "../utils/time.util.js";

// Locked default target (Phase-3)
const DAILY_TARGET_MIN = 8 * 60;

export async function studyStartHandler(chatId, userId, env) {
  const res = await startStudyKV(env.KV, userId);

  if (res.already) {
    const { startTs } = res.data;
    const elapsedMin = diffMinutes(startTs, nowTs());
    await sendMessage(
      chatId,
      `⚠️ Study session already running.\n\nStarted at: ${formatTime(
        startTs
      )}\nElapsed time: ${formatHM(elapsedMin)}\n\nPlease stop the current session before starting a new one.`,
      env
    );
    return;
  }

  await sendMessage(
    chatId,
    `📚 Study Started\n\nStudy timer started at: ${formatTime(
      res.data.startTs
    )} ⏱️\nElapsed time: 0m\n\nDefault daily target: 8 hours\n\nStay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env
  );
}

export async function studyStopHandler(chatId, userId, env) {
  const data = await stopStudyKV(env.KV, userId);
  if (!data) {
    await sendMessage(
      chatId,
      "⚠️ No active study session found.\n\nPlease start studying first.",
      env
    );
    return;
  }

  const endTs = nowTs();
  const minutes = diffMinutes(data.startTs, endTs);

  // persist final minutes (D1)
  const db = getDB(env);
  await db
    .prepare(QUERIES.INSERT_STUDY_LOG)
    .bind(userId, null, minutes, todayISO())
    .run();

  const remaining = Math.max(0, DAILY_TARGET_MIN - minutes);

  let msg = `⏹️ Study Stopped\n\nStarted at: ${formatTime(
    data.startTs
  )}\nStopped at: ${formatTime(endTs)}\n\nTotal studied today: ${formatHM(
    minutes
  )}\nRemaining target: ${formatHM(remaining)}\n\nGood progress — consistency leads to selection 💪`;

  if (minutes >= DAILY_TARGET_MIN) {
    msg = `🎯 Daily Target Achieved!\n\nStarted at: ${formatTime(
      data.startTs
    )}\nStopped at: ${formatTime(endTs)}\n\nTotal studied today: ${formatHM(
      minutes
    )}\n\nExcellent discipline for GPSC Dental Class-2 🏆`;
  }

  if (minutes > DAILY_TARGET_MIN) {
    msg = `🔥 Extra Effort Noted!\n\nStarted at: ${formatTime(
      data.startTs
    )}\nStopped at: ${formatTime(endTs)}\n\nTotal studied today: ${formatHM(
      minutes
    )}\nExtra study: ${formatHM(
      minutes - DAILY_TARGET_MIN
    )}\n\nThis level of effort builds rank and confidence 💯`;
  }

  await sendMessage(chatId, msg, env);
    }
