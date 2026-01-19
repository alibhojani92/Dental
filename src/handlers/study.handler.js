import { sendMessage, editMessage } from "../services/message.service.js";
import { getActiveStudy, startStudy, stopStudy } from "../engine/timer.engine.js";
import { STUDY_ACTIVE_KEYBOARD } from "../bot/keyboards.js";
import { getDB } from "../db/d1.js";
import { QUERIES } from "../db/queries.js";

/**
 * IST helpers (simple, deterministic)
 */
function nowIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000);
}
function fmtTime(d) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function diffMinutes(start, end) {
  return Math.floor((end - start) / 60000);
}
function fmtHM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

const DAILY_TARGET_MIN = 8 * 60;

export async function handleStudyStart(chatId, userId, env) {
  const active = await getActiveStudy(env.KV, userId);
  const now = nowIST();

  // Already running → edit SAME message
  if (active) {
    const elapsed = diffMinutes(active.startTs, now.getTime());

    await editMessage(
      chatId,
      active.messageId,
      `⚠️ Study session already running.

Started at: ${fmtTime(new Date(active.startTs))}
Elapsed time: ${fmtHM(elapsed)}

Please stop the current session before starting a new one.`,
      env,
      STUDY_ACTIVE_KEYBOARD
    );
    return;
  }

  // First start → send NEW message
  await sendMessage(
    chatId,
    `📚 Study Started

Study timer started at: ${fmtTime(now)}
Elapsed time: 0m

Default daily target: 8 hours

Stay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env,
    STUDY_ACTIVE_KEYBOARD
  );

  // Store session (messageId = last message sent by bot)
  await startStudy(env.KV, userId, {
    startTs: now.getTime(),
    messageId: null, // resolved on stop via callback message
  });
}

export async function handleStudyStop(chatId, userId, messageId, env) {
  const data = await stopStudy(env.KV, userId);
  if (!data) return;

  const end = nowIST();
  const minutes = diffMinutes(data.startTs, end.getTime());

  // Save to DB
  const db = getDB(env);
  await db
    .prepare(QUERIES.INSERT_STUDY_LOG)
    .bind(userId, null, minutes, end.toISOString().slice(0, 10))
    .run();

  let msg;

  if (minutes >= DAILY_TARGET_MIN) {
    msg = `🎯 Daily Target Achieved!

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(minutes)}

Excellent discipline for GPSC Dental Class-2 🏆`;
  } else {
    msg = `⏹️ Study Stopped

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(minutes)}
Remaining target: ${fmtHM(DAILY_TARGET_MIN - minutes)}

Good progress — consistency leads to selection 💪`;
  }

  // Edit SAME message (remove keyboard)
  await editMessage(chatId, messageId, msg, env, null);
}
