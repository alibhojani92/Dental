import { editMessage, sendMessage } from "../services/message.service.js";
import { getDB } from "../db/d1.js";
import { QUERIES } from "../db/queries.js";
import { stopStudyKV, startStudyKV } from "../engine/timer.engine.js";
import {
  formatTime,
  diffMinutes,
  formatHM,
  todayISO,
  nowTs,
} from "../utils/time.util.js";
import { STUDY_ACTIVE_KEYBOARD } from "../bot/keyboards.js";

const DAILY_TARGET_MIN = 8 * 60;

export async function studyStartHandler(chatId, userId, env) {
  const res = await startStudyKV(env.KV, userId);

  if (res.already) {
    const elapsedMin = diffMinutes(res.data.startTs, nowTs());
    await sendMessage(
      chatId,
      `⚠️ Study session already running.\n\nStarted at: ${formatTime(
        res.data.startTs
      )}\nElapsed time: ${formatHM(elapsedMin)}\n\nPlease stop the current session before starting a new one.`,
      env,
      STUDY_ACTIVE_KEYBOARD
    );
    return;
  }

  await sendMessage(
    chatId,
    `📚 Study Started\n\nStudy timer started at: ${formatTime(
      res.data.startTs
    )}\nElapsed time: 0m\n\nDefault daily target: 8 hours\n\nStay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env,
    STUDY_ACTIVE_KEYBOARD
  );
}

export async function studyStopHandler(chatId, messageId, userId, env) {
  const data = await stopStudyKV(env.KV, userId);

  if (!data) {
    await editMessage(
      chatId,
      messageId,
      "⚠️ No active study session found.\n\nPlease start studying first.",
      env
    );
    return;
  }

  const endTs = nowTs();
  const minutes = diffMinutes(data.startTs, endTs);

  const db = getDB(env);
  await db
    .prepare(QUERIES.INSERT_STUDY_LOG)
    .bind(userId, null, minutes, todayISO())
    .run();

  // 🔒 PRIORITY-BASED MESSAGE SELECTION
  let msg;

  if (minutes > DAILY_TARGET_MIN) {
    // EXTRA EFFORT
    msg = `🔥 Extra Effort Noted!

Started at: ${formatTime(data.startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${formatHM(minutes)}
Extra study: ${formatHM(minutes - DAILY_TARGET_MIN)}

This level of effort builds rank and confidence 💯`;
  } else if (minutes === DAILY_TARGET_MIN) {
    // TARGET ACHIEVED (EXACT MATCH)
    msg = `🎯 Daily Target Achieved!

Started at: ${formatTime(data.startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${formatHM(minutes)}

Excellent discipline for GPSC Dental Class-2 🏆`;
  } else {
    // NORMAL STOP
    const remaining = DAILY_TARGET_MIN - minutes;
    msg = `⏹️ Study Stopped

Started at: ${formatTime(data.startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${formatHM(minutes)}
Remaining target: ${formatHM(remaining)}

Good progress — consistency leads to selection 💪`;
  }

  // ✅ EDIT SAME MESSAGE (INLINE UX)
  await editMessage(chatId, messageId, msg, env);
}
