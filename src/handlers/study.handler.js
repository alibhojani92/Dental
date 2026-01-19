import { sendMessage, editMessage } from "../services/message.service.js";
import {
  getActiveStudyKV,
  startStudyKV,
  stopStudyKV,
} from "../engine/timer.engine.js";
import {
  formatTime,
  diffMinutes,
  formatHM,
  todayISO,
  nowTs,
} from "../utils/time.util.js";
import { STUDY_ACTIVE_KEYBOARD } from "../bot/keyboards.js";
import { getDB } from "../db/d1.js";
import { QUERIES } from "../db/queries.js";

const DAILY_TARGET_MIN = 8 * 60;

export async function studyStartHandler(chatId, userId, env) {
  const active = await getActiveStudyKV(env.KV, userId);

  if (active) {
    const elapsed = diffMinutes(active.startTs, nowTs());

    await editMessage(
      chatId,
      active.messageId,
      `⚠️ Study session already running.

Started at: ${formatTime(active.startTs)}
Elapsed time: ${formatHM(elapsed)}

Please stop the current session before starting a new one.`,
      env,
      STUDY_ACTIVE_KEYBOARD
    );
    return;
  }

  // ✅ THIS WILL NOW RETURN message_id
  const msg = await sendMessage(
    chatId,
    `📚 Study Started

Study timer started at: ${formatTime(nowTs())}
Elapsed time: 0m

Default daily target: 8 hours

Stay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env,
    STUDY_ACTIVE_KEYBOARD,
    true
  );

  await startStudyKV(env.KV, userId, {
    startTs: nowTs(),
    messageId: msg.message_id,
  });
}

export async function studyStopHandler(chatId, userId, env) {
  const data = await stopStudyKV(env.KV, userId);
  if (!data) return;

  const endTs = nowTs();
  const minutes = diffMinutes(data.startTs, endTs);

  const db = getDB(env);
  await db
    .prepare(QUERIES.INSERT_STUDY_LOG)
    .bind(userId, null, minutes, todayISO())
    .run();

  let msg;

  if (minutes >= DAILY_TARGET_MIN) {
    msg = `🎯 Daily Target Achieved!

Started at: ${formatTime(data.startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${formatHM(minutes)}

Excellent discipline for GPSC Dental Class-2 🏆`;
  } else {
    msg = `⏹️ Study Stopped

Started at: ${formatTime(data.startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${formatHM(minutes)}
Remaining target: ${formatHM(DAILY_TARGET_MIN - minutes)}

Good progress — consistency leads to selection 💪`;
  }

  // ✅ SAME message edited, keyboard removed
  await editMessage(chatId, data.messageId, msg, env, null);
}
